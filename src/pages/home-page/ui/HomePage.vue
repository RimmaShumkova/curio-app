<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout columns="auto, *">
      <StackLayout col="0" class="side-buttons">
        <Image src="res://settings_button" class="side-button" @tap="goToSettings" />
        <Image src="res://exit_button" class="side-button" @tap="logout" />
      </StackLayout>

      <ScrollView col="1">
        <StackLayout class="mainContent">
          <Label class="welcomeLabel" textWrap="true">
            <FormattedString>
              <Span text="Привет, " />
              <Span :text="childName" class="nameSpan" />
              <Span text="! Давай читать!" />
            </FormattedString>
          </Label>
          
          <ActivityIndicator v-if="isLoading" :busy="true" class="loader" />
          
          <GridLayout v-else columns="*, *, *" class="stories-grid" horizontalAlignment="center">
            <StackLayout 
              v-for="story in stories" 
              :key="story.id"
              :col="(parseInt(story.id) - 1) % 3"
              class="story-item"
              @tap="openStory(story)"
            >
              <Image :src="story.coverImage" class="story-image" stretch="aspectFit" />
              <Label :text="story.title" class="story-label" textWrap="true" />
            </StackLayout>
          </GridLayout>
          
          <StackLayout class="bottom-padding" />
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script>
import { useSelector } from '@xstate/vue';

import { childActor, storiesActor, authActor } from '../../../shared/machines/actors';
import { TRANSITIONS } from '../../../shared/lib/constants';
import ActivityIndicator from '../../../shared/ui/ActivityIndicator.vue';

import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';
import Welcome from '../../welcome-page/ui/Welcome.vue';
import StoryReaderPage from '../../story-reader-page/ui/StoryReaderPage.vue';

export default {
  components: {
    ActivityIndicator,
  },

  setup() {
    const childSnapshot   = useSelector(childActor,   (s) => s);
    const storiesSnapshot = useSelector(storiesActor, (s) => s);
    const childSend   = (event) => childActor.send(event);
    const storiesSend = (event) => storiesActor.send(event);
    return { childSnapshot, childSend, storiesSnapshot, storiesSend };
  },

  computed: {
    /** Имя ребёнка из childActor */
    childName() {
      return this.childSnapshot.context.profile?.name || 'Кьюрио';
    },

    /** Список историй из storiesActor */
    stories() {
      return this.storiesSnapshot.context.stories;
    },

    /** Показывать лоадер пока истории грузятся */
    isLoading() {
      return this.storiesSnapshot.matches('loading') || this.storiesSnapshot.matches('idle');
    },
  },

  mounted() {
    // Запускаем загрузку историй (idle → loading → loaded)
    this.storiesSend({ type: 'LOAD' });
  },

  methods: {
    goToSettings() {
      // Открываем ChildProfile в режиме настроек
      this.$navigateTo(ChildProfile, {
        props: { isSettingsMode: true },
        ...TRANSITIONS.slide,
      });
    },

    logout() {
      // Сбрасываем профиль ребёнка и авторизацию
      this.childSend({ type: 'CLEAR' });
      authActor.send({ type: 'LOGOUT' });

      this.$navigateTo(Welcome, {
        clearHistory: true,
        ...TRANSITIONS.fade,
      });
    },

    openStory(story) {
      if (story.isLocked) {
        alert('Эта история пока недоступна');
        return;
      }
      this.$navigateTo(StoryReaderPage, {
        props: { storyId: story.id },
        ...TRANSITIONS.slide,
      });
    },
  },
};
</script>

<style scoped src="./HomePage.css" />