<template>
  <Page actionBarHidden="true" class="page">
    <ScrollView>
      <StackLayout class="mainContent">
        <Label text="Имя ребенка" class="title-primary" />
        <TextField v-model="childName" hint="Кьюрио" class="input-primary" />
        
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
        
        <GridLayout class="btn-orange continueBtn" columns="*, auto" @tap="continuePressed">
          <Label text="Продолжить" class="btn-orange-text" col="0" />
        </GridLayout>
        
        <StackLayout class="bottom-padding" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import HomePage from '../../home-page/ui/HomePage.vue';
import { TRANSITIONS } from '../../../shared/lib/constants';
import { childModel } from '../../../entities/child/model/child';

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
      if (!this.childName.trim()) {
        alert('Пожалуйста, введите имя ребенка');
        return;
      }
      childModel.save({
        name: this.childName,
        gender: this.selectedGender
      });
      this.$navigateTo(HomePage, TRANSITIONS.slide);
    }
  }
};
</script>

<style scoped src="./ChildProfile.css" />