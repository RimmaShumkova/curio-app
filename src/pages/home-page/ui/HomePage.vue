<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout columns="auto, *">
      <StackLayout col="0" class="sideButtons">
        <Image src="res://settings_button" class="settingsButton" @tap="goToSettings" />
        <Image src="res://exit_button" class="exitButton" @tap="logout" />
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
import * as appSettings from "@nativescript/core/application-settings";
import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';
import Welcome from '../../welcome-page/ui/Welcome.vue';
import StoryReaderPage from '../../story-reader-page/ui/StoryReaderPage.vue';
import { storyModel } from '../../../entities/story/model/story';

export default {
  data() {
    return {
      childName: 'Кьюрио',
      stories: []
    };
  },
  mounted() {
    const savedName = appSettings.getString("childName");
    if (savedName) {
      this.childName = savedName;
    }
    this.stories = storyModel.getAll();
  },
  methods: {
    goToSettings() {
      this.$navigateTo(ChildProfile);
    },
    logout() {
      appSettings.remove("childName");
      appSettings.remove("childGender");
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
      this.$navigateTo(StoryReaderPage, {
        props: { storyId: story.id },
        transition: { name: "slide", duration: 300 }
      });
    }
  }
};
</script>

<style scoped src="./HomePage.css" />