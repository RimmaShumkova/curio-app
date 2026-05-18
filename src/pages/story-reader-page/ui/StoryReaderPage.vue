<template>
  <Page actionBarHidden="true">
    <GridLayout rows="*, auto">

      <Image
        row="0" rowSpan="2" col="0"
        :src="currentEpisode ? currentEpisode.imageUrl : 'res://forest'"
        class="storyBackground"
        stretch="aspectFill"
      />

      <StackLayout row="0" col="0" class="topControls">
        <Image src="res://home_button" class="homeBtn" @tap="goBack" />
        <Label
          v-if="isReading"
          :text="`${currentEpisodeIndex + 1}/${totalEpisodes}`"
          class="episodePill"
        />
      </StackLayout>

      <GridLayout
        v-if="isReading"
        row="1" col="0"
        columns="auto, *, auto"
        class="bottomRow"
      >
        <StackLayout col="0" class="navArrowWrap" @tap="prevEpisode">
          <StackLayout :class="canGoPrev ? 'navArrow' : 'navArrowDisabled'">
            <Label text="‹" :class="canGoPrev ? 'arrowIcon' : 'arrowIconDisabled'" />
          </StackLayout>
        </StackLayout>

        <StackLayout col="1" class="textCard">
          <ScrollView>
            <Label
              :text="currentEpisode ? currentEpisode.text : ''"
              class="storyText"
              textWrap="true"
            />
          </ScrollView>
          <StackLayout v-if="isLastEpisode" class="finishBtn" @tap="finishReading">
            <Label text="Закончить историю" class="finishBtnText" />
          </StackLayout>
        </StackLayout>

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

import {
  readingMachine,
  selectCurrentEpisode,
  selectTotalEpisodes,
  selectIsLastEpisode,
  selectCanGoPrev,
} from '../../../shared/machines/readingMachine';

import { db } from '../../../shared/lib/database';
import { fetchStoryProgressApi, saveProgressApi } from '../../../shared/api/client';

import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  props: {
    storyId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const { snapshot, send } = useMachine(readingMachine);
    return { snapshot, send };
  },

  computed: {
    isReading()          { return this.snapshot.matches('reading'); },
    isFinished()         { return this.snapshot.matches('finished'); },
    ctx()                { return this.snapshot.context; },
    currentEpisodeIndex(){ return this.ctx.currentEpisodeIndex; },
    currentEpisode()     { return selectCurrentEpisode(this.ctx); },
    totalEpisodes()      { return selectTotalEpisodes(this.ctx); },
    isLastEpisode()      { return selectIsLastEpisode(this.ctx); },
    canGoPrev()          { return selectCanGoPrev(this.ctx); },
  },

  async mounted() {
    const story = db.getStoryById(this.storyId);
    if (!story) {
      alert('История не найдена');
      this._navigateHome();
      return;
    }

    // Загружаем сохранённый прогресс с сервера
    // Если пользователь гость или сервер недоступен — начинаем с 0
    const savedEpisodeIndex = await this._loadProgressFromServer();

    this.send({ type: 'START', story, savedEpisodeIndex });
  },

  methods: {
    nextEpisode() {
      this.send({ type: 'NEXT' });
    },

    prevEpisode() {
      this.send({ type: 'PREV' });
    },

    async finishReading() {
      // Помечаем как прочитанную локально
      db.markAsRead(this.storyId);

      // Сохраняем на сервер: последний эпизод + isCompleted = true
      await this._saveProgressToServer(true);

      this.send({ type: 'FINISH' });

      alert('Поздравляем! Вы прочитали историю! 🎉');
      this._navigateHome();
    },

    async goBack() {
      // Сохраняем текущий прогресс перед уходом
      await this._saveProgressToServer(false);

      this.send({ type: 'RESET' });
      this._navigateHome();
    },

    _navigateHome() {
      this.$navigateTo(HomePage, {
        transition: { name: 'slide', duration: 300 },
      });
    },

    // ── Серверные методы ────────────────────────────────────────────────────

    /**
     * Загружает прогресс с сервера.
     * Возвращает сохранённый episodeIndex или 0 если нет данных / гость.
     */
    async _loadProgressFromServer() {
      const user = db.getUser();
      console.log('USER из db:', JSON.stringify(user));
      if (!user?.id || user.id.startsWith('guest_')) {
        console.log('Пропускаем — гость или нет юзера');  // ← добавь
        return 0;
      }

      try {
        const response = await fetchStoryProgressApi(user.id, this.storyId);
        return response.progress?.episodeIndex ?? 0;
      } catch (e) {
        console.warn('Не удалось загрузить прогресс:', e.message);
        return 0;
      }
    },

    /**
     * Сохраняет текущий прогресс на сервер.
     * Не блокирует UI — ошибки логируются молча.
     */
    async _saveProgressToServer(isCompleted) {
      const user = db.getUser();
      if (!user?.id || user.id.startsWith('guest_')) return;

      try {
        await saveProgressApi(user.id, this.storyId, {
          episodeIndex: this.currentEpisodeIndex,
          isCompleted,
        });
      } catch (e) {
        console.warn('Не удалось сохранить прогресс:', e.message);
      }
    },
  },
};
</script>

<style scoped src="./StoryReaderPage.css" />