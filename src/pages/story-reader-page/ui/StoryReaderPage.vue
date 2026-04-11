<template>
  <Page actionBarHidden="true">
    <GridLayout columns="auto, *" rows="*, auto">
      
      <StackLayout col="0" row="0" class="sideButtons">
        <Image src="res://home_button" class="homeButton" @tap="goBack" />
      </StackLayout>
      
      <Image row="0" rowSpan="2" col="0" colSpan="2" 
             :src="currentEpisode?.imageUrl || 'res://forest'" 
             stretch="aspectFill" />
      
      <StackLayout row="1" col="0" colSpan="2" class="textPanel" v-if="story">
        <ScrollView>
          <Label :text="currentEpisode?.text || ''" class="storyText" textWrap="true" />
        </ScrollView>
        
        <GridLayout columns="auto, *, auto" class="navControls">
          <StackLayout col="0" class="navArrow" @tap="prevEpisode">
            <Label text="←" class="arrowIcon" />
          </StackLayout>
          
          <Label col="1" class="episodeCounter" 
                 :text="`${currentEpisodeIndex + 1} / ${totalEpisodes}`" />
          
          <StackLayout col="2" class="navArrow" @tap="nextEpisode">
            <Label text="→" class="arrowIcon" />
          </StackLayout>
        </GridLayout>
        
        <StackLayout v-if="isLastEpisode" class="finishButton" @tap="finishReading">
          <Label text="Закончить историю" class="finishText" />
        </StackLayout>
      </StackLayout>
      
    </GridLayout>
  </Page>
</template>

<script>
import { storyModel } from '../../../entities/story/model/story';
import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  props: {
    storyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      story: null,
      currentEpisodeIndex: 0
    };
  },
  computed: {
    totalEpisodes() {
      return this.story?.episodes.length || 0;
    },
    currentEpisode() {
      if (!this.story) return null;
      return this.story.episodes[this.currentEpisodeIndex];
    },
    isLastEpisode() {
      return this.currentEpisodeIndex === this.totalEpisodes - 1;
    }
  },
  mounted() {
    this.story = storyModel.getById(this.storyId);
    if (!this.story) {
      alert('История не найдена');
      this.goBack();
    }
  },
  methods: {
    nextEpisode() {
      if (this.currentEpisodeIndex < this.totalEpisodes - 1) {
        this.currentEpisodeIndex++;
      }
    },
    prevEpisode() {
      if (this.currentEpisodeIndex > 0) {
        this.currentEpisodeIndex--;
      }
    },
    finishReading() {
      alert('Поздравляем! Вы прочитали историю!');
      this.goBack();
    },
    goBack() {
      this.$navigateTo(HomePage, {
        transition: { name: "slide", duration: 300 }
      });
    }
  }
};
</script>

<style scoped>
.sideButtons {
  width: auto;
  padding-top: 8%;
  padding-left: 15px;
  padding-right: 10px;
  align-items: center;
  justify-content: flex-start;
  z-index: 10;
}

.homeButton {
  width: 50;
  height: 50;
  margin-bottom: 25;
}

.textPanel {
  background-color: white;
  border-top-left-radius: 30;
  border-top-right-radius: 30;
  padding: 20;
  margin: 10;
  z-index: 5;
}

.storyText {
  font-size: 24;
  color: #3D0000;
  text-align: center;
  padding: 15;
}

.navControls {
  margin-top: 20;
  margin-bottom: 10;
  padding-left: 20;
  padding-right: 20;
}

.navArrow {
  width: 50;
  height: 50;
  background-color: #F68B3C;
  border-radius: 25;
  align-items: center;
  justify-content: center;
}

.arrowIcon {
  font-size: 28;
  color: white;
}

.episodeCounter {
  font-size: 16;
  color: #3D0000;
  text-align: center;
  vertical-align: center;
}

.finishButton {
  background-color: #4CAF50;
  border-radius: 25;
  padding: 12;
  margin-top: 15;
  margin-bottom: 10;
  margin-left: 40;
  margin-right: 40;
  align-items: center;
}

.finishText {
  font-size: 18;
  font-weight: bold;
  color: white;
}
</style>