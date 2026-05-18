<template>
  <Page actionBarHidden="true">
    <!--
      GridLayout: 2 строки
        row 0 (*) — изображение + оверлей верхних контролов
        row 1 (auto) — нижняя зона: стрелки + карточка с текстом
    -->
    <GridLayout rows="*, auto">

      <!-- ── Фоновое изображение (перекрывает обе строки) ─────────────── -->
      <Image
        row="0" rowSpan="2" col="0"
        :src="currentEpisode ? currentEpisode.imageUrl : 'res://forest'"
        class="storyBackground"
        stretch="aspectFill"
      />

      <!-- ── Верхний оверлей: кнопка домой + счётчик эпизодов ─────────── -->
      <StackLayout row="0" col="0" class="topControls">
        <Image
          src="res://home_button"
          class="homeBtn"
          @tap="goBack"
        />
        <Label
          v-if="isReading"
          :text="`${currentEpisodeIndex + 1}/${totalEpisodes}`"
          class="episodePill"
        />
      </StackLayout>

      <!-- ── Нижняя зона: стрелки + карточка ─────────────────────────── -->
      <GridLayout
        v-if="isReading"
        row="1" col="0"
        columns="auto, *, auto"
        class="bottomRow"
      >

        <!-- Стрелка НАЗАД -->
        <StackLayout col="0" class="navArrowWrap" @tap="prevEpisode">
          <StackLayout :class="canGoPrev ? 'navArrow' : 'navArrowDisabled'">
            <Label text="‹" :class="canGoPrev ? 'arrowIcon' : 'arrowIconDisabled'" />
          </StackLayout>
        </StackLayout>

        <!-- Карточка с текстом -->
        <StackLayout col="1" class="textCard">
          <ScrollView>
            <Label
              :text="currentEpisode ? currentEpisode.text : ''"
              class="storyText"
              textWrap="true"
            />
          </ScrollView>

          <!-- Кнопка завершения — только на последнем эпизоде -->
          <StackLayout v-if="isLastEpisode" class="finishBtn" @tap="finishReading">
            <Label text="Закончить историю" class="finishBtnText" />
          </StackLayout>
        </StackLayout>

        <!-- Стрелка ВПЕРЁД -->
        <StackLayout col="2" class="navArrowWrap" @tap="nextEpisode">
          <StackLayout :class="!isLastEpisode ? 'navArrow' : 'navArrowDisabled'">
            <Label text="›" :class="!isLastEpisode ? 'arrowIcon' : 'arrowIconDisabled'" />
          </StackLayout>
        </StackLayout>

      </GridLayout>

    </GridLayout>
  </Page>
</template>

<script>
import { useMachine } from '@xstate/vue';
import { readingMachine, selectCurrentEpisode, selectTotalEpisodes, selectIsLastEpisode, selectCanGoPrev } from '../../../shared/machines/readingMachine';
import { db } from '../../../shared/lib/database';
import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  props: {
    storyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    // Подключаем readingMachine через @xstate/vue
    const { snapshot, send } = useMachine(readingMachine);
    return { snapshot, send };
  },

  computed: {
    /** Текущее состояние машины */
    machineState() {
      return this.snapshot;
    },

    /** Машина находится в состоянии чтения */
    isReading() {
      return this.machineState.matches('reading');
    },

    /** Машина находится в состоянии "завершено" */
    isFinished() {
      return this.machineState.matches('finished');
    },

    /** Контекст машины */
    ctx() {
      return this.machineState.context;
    },

    currentEpisodeIndex() {
      return this.ctx.currentEpisodeIndex;
    },

    currentEpisode() {
      return selectCurrentEpisode(this.ctx);
    },

    totalEpisodes() {
      return selectTotalEpisodes(this.ctx);
    },

    isLastEpisode() {
      return selectIsLastEpisode(this.ctx);
    },

    canGoPrev() {
      return selectCanGoPrev(this.ctx);
    },
  },

  mounted() {
    // Получаем историю из БД и запускаем машину
    const story = db.getStoryById(this.storyId);

    if (!story) {
      alert('История не найдена');
      this.goBack();
      return;
    }

    this.send({ type: 'START', story });
  },

  methods: {
    nextEpisode() {
      this.send({ type: 'NEXT' });
    },

    prevEpisode() {
      this.send({ type: 'PREV' });
    },

    finishReading() {
      // Сохраняем в БД, что история прочитана
      db.markAsRead(this.storyId);
      this.send({ type: 'FINISH' });

      alert('Поздравляем! Вы прочитали историю! 🎉');
      this.goBack();
    },

    goBack() {
      // Сбрасываем машину перед уходом
      this.send({ type: 'RESET' });

      this.$navigateTo(HomePage, {
        transition: { name: 'slide', duration: 300 },
      });
    },
  },
};
</script>

<style scoped src="./StoryReaderPage.css" />