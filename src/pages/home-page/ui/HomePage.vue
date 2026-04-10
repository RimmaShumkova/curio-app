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
import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';
import Welcome from '../../welcome-page/ui/Welcome.vue';
import StoryReaderPage from '../../story-reader-page/ui/StoryReaderPage.vue';
import { storyModel } from '../../../entities/story/model/story';
import { TRANSITIONS } from '../../../shared/lib/constants';
import ActivityIndicator from '../../../shared/ui/ActivityIndicator.vue';
import { childModel } from '../../../entities/child/model/child';

export default {
  components: {
    ActivityIndicator
  },
  data() {
    return {
      childName: 'Кьюрио',
      stories: [],
      isLoading: true
    };
  },
  mounted() {
    const profile = childModel.load();
    if (profile.name) {
      this.childName = profile.name;
    }
    
    this.isLoading = true;
    setTimeout(() => {
      this.stories = storyModel.getAll();
      this.isLoading = false;
    }, 500);
  },
  methods: {
    goToSettings() {
      this.$navigateTo(ChildProfile, TRANSITIONS.slide);
    },
    logout() {
      childModel.clear();
      this.$navigateTo(Welcome, {
        clearHistory: true,
        ...TRANSITIONS.fade
      });
    },
    openStory(story) {
      if (story.isLocked) {
        alert('Эта история пока недоступна');
        return;
      }
      this.$navigateTo(StoryReaderPage, {
        props: { storyId: story.id },
        ...TRANSITIONS.slide
      });
    }
  }
};
</script>

<style scoped src="./HomePage.css" />