<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout columns="auto, *">
      
      <!-- Левая панель с кнопками -->
      <StackLayout col="0" class="sideButtons">
        
        <!-- Кнопка настроек (картинка на всю кнопку) -->
        <Image src="res://settings_button" class="settingsButton" @tap="goToSettings" />
        
        <!-- Кнопка выхода (картинка на всю кнопку) -->
        <Image src="res://exit_button" class="exitButton" @tap="logout" />
        
      </StackLayout>

      <!-- Основной контент -->
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
    }
  }
};
</script>

<style scoped src="./HomePage.css" />