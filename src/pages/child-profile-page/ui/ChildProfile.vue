<template>
  <Page actionBarHidden="true" class="page">
    <ScrollView>
      <StackLayout class="mainContent">
        <Label text="Имя ребенка" class="title-primary" />
        
        <TextField v-model="childName" hint="Кьюрио" class="nameInput" />
        
        <Label text="Пол" class="title-primary" />
        
        <GridLayout columns="auto, auto" class="genderRow" horizontalAlignment="center">
          <StackLayout col="0" @tap="selectGender('boy')" class="genderItem">
            <Image :src="selectedGender === 'boy' ? 'res://boy_selected' : 'res://boy'" 
                   class="genderImage" stretch="aspectFit" />
          </StackLayout>

          <StackLayout col="1" @tap="selectGender('girl')" class="genderItem">
            <Image :src="selectedGender === 'girl' ? 'res://girl_selected' : 'res://girl'" 
                   class="genderImage" stretch="aspectFit" />
          </StackLayout>
        </GridLayout>
        
        <StackLayout class="button-wrapper">
          <GridLayout class="button-container" @tap="continuePressed">
            <StackLayout class="button-shadow" />
            <StackLayout class="button-main">
              <Label text="Продолжить" class="button-text" />
            </StackLayout>
          </GridLayout>
        </StackLayout>

        <StackLayout class="bottom-padding" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as appSettings from "@nativescript/core/application-settings";
import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  data() {
    return {
      childName: '',
      selectedGender: ''
    };
  },
  methods: {
    selectGender(gender) {
      this.selectedGender = gender;
    },
    continuePressed() {
      console.log('Имя:', this.childName);
      console.log('Пол:', this.selectedGender);
      
      if (!this.childName.trim()) {
        alert('Пожалуйста, введите имя ребенка');
        return;
      }
      
      appSettings.setString("childName", this.childName);
      appSettings.setString("childGender", this.selectedGender);
      
      this.$navigateTo(HomePage, {
        transition: {
          name: "slide",
          duration: 300,
          curve: "ease"
        }
      });
    }
  }
};
</script>

<style scoped src="./ChildProfile.css" />