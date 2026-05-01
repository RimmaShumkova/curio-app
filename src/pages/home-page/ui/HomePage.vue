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
              :class="{ 'completed-story': story.isCompleted, 'locked-story': story.isLocked }"
              @tap="openStory(story)"
            >
              <Image :src="story.coverImage" class="story-image" stretch="aspectFit" />
              <Label :text="story.title" class="story-label" textWrap="true" />
              <Label v-if="story.isCompleted" text="✓" class="completed-badge" />
              <Label v-if="story.isLocked" text="🔒" class="locked-badge" />
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
import { userModel } from '../../../entities/user/model/user'; // Добавьте импорт userModel

export default {
  components: {
    ActivityIndicator
  },
  data() {
    return {
      childName: 'Кьюрио',
      stories: [],
      isLoading: true,
      completedStories: [] // Добавляем массив для хранения ID прочитанных историй
    };
  },
  async mounted() {
    const profile = childModel.load();
    if (profile.name) {
      this.childName = profile.name;
    }
    
    // Загружаем данные пользователя (прочитанные истории)
    const user = userModel.load();
    this.completedStories = user?.completedStories || [];
    
    this.isLoading = true;
    
    try {
      // Загружаем истории с сервера
      const allStories = await storyModel.getAll();
      
      // Добавляем флаги isLocked и isCompleted
      this.stories = allStories.map(story => ({
        ...story,
        isCompleted: this.completedStories.includes(story.id),
        isLocked: false // Здесь можно добавить логику блокировки, например:
        // isLocked: story.id > 1 && !this.completedStories.includes(story.id - 1) // блокировка до прочтения предыдущей
      }));
    } catch (error) {
      console.error('Ошибка загрузки историй:', error);
      alert('Не удалось загрузить истории. Проверьте подключение к интернету.');
    } finally {
      this.isLoading = false;
    }
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
    async openStory(story) {
      if (story.isLocked) {
        alert('Эта история пока недоступна. Сначала прочитайте предыдущие истории.');
        return;
      }
      
      // Передаем ID истории и флаг, что это новая попытка прочтения
      this.$navigateTo(StoryReaderPage, {
        props: { 
          storyId: story.id,
          isNewReading: true // Можно передать флаг для отслеживания прочтения
        },
        ...TRANSITIONS.slide
      });
    }
  }
};
</script>

<style scoped src="./HomePage.css" />

<style scoped>
.completed-story {
  opacity: 0.8;
  position: relative;
}

.completed-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24;
  color: #4CAF50;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15;
  padding: 2 8;
}

.locked-story {
  opacity: 0.5;
  position: relative;
}

.locked-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24;
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15;
  padding: 2 8;
}
</style>