<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout columns="auto, *">
      
      <!-- Левая панель с кнопками -->
      <StackLayout col="0" class="sideButtons">
        <Image src="res://settings_button" class="settingsButton" @tap="goToSettings" />
        <Image src="res://exit_button" class="exitButton" @tap="logout" />
      </StackLayout>

      <!-- Основной контент -->
      <ScrollView col="1">
        <StackLayout class="mainContent">
          
          <!-- Приветствие -->
          <Label class="welcomeLabel" textWrap="true">
            <FormattedString>
              <Span text="Привет, " />
              <Span :text="childName" class="nameSpan" />
              <Span text="! Давай читать!" />
            </FormattedString>
          </Label>
          
          <!-- Сетка историй -->
          <GridLayout columns="*, *, *" class="storiesGrid" horizontalAlignment="center">
            <StackLayout 
              v-for="story in stories" 
              :key="story.id"
              :col="(parseInt(story.id) - 1) % 3"
              class="storyItem"
              @tap="openStory(story)"
            >
              <Image :src="story.coverImage" class="storyImage" stretch="aspectFit" />
              <Label :text="story.title" class="storyLabel" textWrap="true" />
            </StackLayout>
          </GridLayout>
          
          <StackLayout class="bottom-padding" />
          
        </StackLayout>
      </ScrollView>
      
    </GridLayout>
  </Page>
</template>

<script>
import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';
import Welcome from '../../welcome-page/ui/Welcome.vue';
import StoryReaderPage from '../../story-reader-page/ui/StoryReaderPage.vue';
import { childModel } from '../../../entities/child/model/child';
import { storyModel } from '../../../entities/story/model/story';

export default {
  data() {
    return {
      childName: 'Кьюрио',
      stories: []
    };
  },
  mounted() {
    const profile = childModel.load();
    if (profile.name) {
      this.childName = profile.name;
    }
    this.stories = storyModel.getAll();
  },
  methods: {
    goToSettings() {
      this.$navigateTo(ChildProfile);
    },
    logout() {
      childModel.clear();
      this.$navigateTo(Welcome, {
        clearHistory: true,
        transition: { name: "fade", duration: 300 }
      });
    },
    openStory(story) {
      if (story.isLocked) {
        alert('Эта история пока недоступна');
        return;
      }
      // Временно показываем alert вместо перехода
      alert(`Вы выбрали: ${story.title}`);
      
      // Потом раскомментируете:
      // this.$navigateTo(StoryReaderPage, {
      //   props: { storyId: story.id },
      //   transition: { name: "slide", duration: 300 }
      // });
    }
  }
};
</script>

<style scoped src="./HomePage.css" />