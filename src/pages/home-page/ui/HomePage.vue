<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout columns="*, auto">
      <ScrollView col="0">
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

<style scoped src="./HomePage.css" />