<!-- WelcomePage.vue -->
<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout columns="*, auto">

      <!-- ОСНОВНОЙ КОНТЕНТ -->
      <ScrollView col="0">
        <StackLayout class="mainContent">
          
          <!-- ПРИВЕТСТВИЕ -->
          <Label class="welcomeLabel" textWrap="true">
            <FormattedString>
              <Span text="Привет, " />
              <Span :text="childName" class="nameSpan" />
              <Span text="! Давай читать!" />
            </FormattedString>
          </Label>
          
          <!-- ИСТОРИИ -->
          <GridLayout columns="*, *, *" class="storiesGrid" horizontalAlignment="center">
            
            <StackLayout col="0" class="storyItem">
              <Image src="res://berries_kids" class="storyImage" stretch="aspectFit" />
              <Label text="Друзья собирают ягоды" class="storyLabel" textWrap="true" />
            </StackLayout>
            
            <StackLayout col="1" class="storyItem">
              <Image src="res://curio_garden" class="storyImage" stretch="aspectFit" />
              <Label text="Кьюрио в саду" class="storyLabel" textWrap="true" />
            </StackLayout>
            
            <StackLayout col="2" class="storyItem">
              <Image src="res://curio_garden_locked" class="storyImage" stretch="aspectFit" />
              <Label text="Кьюрио в саду" class="storyLabel" textWrap="true" />
            </StackLayout>
            
          </GridLayout>
          
          <StackLayout class="bottomPadding" />
          
        </StackLayout>
      </ScrollView>

      <!-- ПРАВАЯ ПАНЕЛЬ -->
      <StackLayout col="1" class="sideButtons">
        
        <StackLayout class="settingsButton" @tap="openSettings">
          <Label text="⚙" class="settingsIcon" />
        </StackLayout>
        
        <Label text="Выход" class="exitButton" @tap="exitApp" />
        
      </StackLayout>

    </GridLayout>
  </Page>
</template>

<script>
import * as appSettings from "@nativescript/core/application-settings";

export default {
  data() {
    return {
      childName: 'Кьюрио'
    };
  },
  mounted() {
    const savedName = appSettings.getString("childName");
    
    if (savedName) {
      this.childName = savedName;
    }
  },
  methods: {
    openSettings() {
      console.log('Открыть настройки');
    },
    exitApp() {
      console.log('Выход');
    }
  }
};
</script>

<style scoped>
.page {
  background-color: #FFFCE1;
}

.mainContent {
  padding-left: 5%;
  padding-right: 3%;
  padding-top: 8%;
  padding-bottom: 15%;
}

.welcomeLabel {
  font-size: 2rem;
  font-weight: bold;
  color: #3D0000;
  text-align: center;
  margin-bottom: 2rem;
}

.nameSpan {
  color: #F68B3C;
}

.storiesGrid {
  margin-bottom: 2rem;
}

.storyItem {
  margin-left: 4px;
  margin-right: 4px;
  padding: 5px;
}

.storyImage {
  width: 85%;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 15;
  margin-bottom: 8px;
  horizontal-align: center;
}

.storyLabel {
  font-size: 1rem;
  font-weight: bold;
  color: #3D0000;
  text-align: center;
}

.sideButtons {
  width: 70;
  padding-top: 20%;
  padding-right: 5;
  align-items: center;
}

.settingsButton {
  width: 50;
  height: 50;
  background-color: #4CAF50;
  border-radius: 15;
  align-items: center;
  justify-content: center;
  margin-bottom: 20;
}

.settingsIcon {
  color: white;
  font-size: 20;
}

.exitButton {
  color: #F68B3C;
  font-size: 1rem;
  font-weight: bold;
}

.bottomPadding {
  height: 3rem;
}
</style>
