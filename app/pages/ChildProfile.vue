<template>
  <Page actionBarHidden="true" class="page">
    <ScrollView>
      <StackLayout class="mainContent">
        <Label text="Имя ребенка" class="titleLabel" />
        
        <TextField v-model="childName" hint="Имя" class="nameInput" />
        
        <Label text="Пол" class="titleLabel" />
        
        <GridLayout columns="auto, auto" class="genderRow" horizontalAlignment="center">
          <StackLayout col="0" @tap="selectGender('boy')" class="genderItem">
            <Image :src="selectedGender === 'boy' ? 'res://boy_selected' : 'res://boy'" 
                   width="90" height="90" stretch="aspectFit" />
          </StackLayout>
          <StackLayout col="1" @tap="selectGender('girl')" class="genderItem">
            <Image :src="selectedGender === 'girl' ? 'res://girl_selected' : 'res://girl'" 
                   width="90" height="90" stretch="aspectFit" />
          </StackLayout>
        </GridLayout>
        
        <!-- Кнопка "Продолжить" -->
        <StackLayout class="buttonWrapper" @tap="continuePressed">
          <StackLayout class="buttonMain">
            <Label text="Продолжить" class="buttonText" />
          </StackLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
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
    }
  }
};
</script>

<style scoped>
.page {
  background-color: #FFFCE1;
}

.mainContent {
  padding: 20;
  margin-top: 60;
  margin-bottom: 40;
}

.titleLabel {
  font-size: 32;
  font-weight: bold;
  color: #3D0000;
  text-align: center;
  margin-bottom: 20;
  margin-top: 20;
}

.nameInput {
  background-color: white;
  border-radius: 85;
  border-width: 2;
  border-color: #F68B3C;
  padding: 20;
  font-size: 20;
  margin-left: 20;
  margin-right: 20;
}

.genderRow {
  margin-top: 40;
  margin-bottom: 60;
}

.genderItem {
  margin-left: 20;
  margin-right: 20;
}

.buttonWrapper {
  align-items: center;
  margin-top: 20;
  margin-bottom: 40;
}

.buttonMain {
  width: 240;
  height: 50;
  background-color: #F68B3C;
  border-radius: 85;
  align-items: center;
  justify-content: center;
  elevation: 4;
}

.buttonText {
  font-size: 18;
  font-weight: bold;
  color: white;
  text-align: center;
}
</style>