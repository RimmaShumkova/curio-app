<template>
  <Page actionBarHidden="true" class="page">
    <ScrollView>
      <StackLayout class="mainContent">
        <Label text="Имя ребенка" class="titleLabel" />
        
        <TextField v-model="childName" hint="Кьюрио" class="nameInput" />
        
        <Label text="Пол" class="titleLabel" />
        
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
        
        <StackLayout class="buttonWrapper">
          <GridLayout class="buttonContainer" @tap="continuePressed">
            <StackLayout class="buttonShadow" />
            <StackLayout class="buttonMain">
              <Label text="Продолжить" class="buttonText" />
            </StackLayout>
          </GridLayout>
        </StackLayout>

        <StackLayout class="bottomPadding" />
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

<style scoped>
.page {
  background-color: #FFFCE1;
}

.mainContent {
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 15%;
  padding-bottom: 15%;
}

.titleLabel {
  font-size: 2rem;
  font-weight: bold;
  color: #3D0000;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.titleLabel:first-child {
  margin-top: 0;
}

.nameInput {
  background-color: white;
  border-radius: 85;
  border-width: 2;
  border-color: #F68B3C;
  padding: 0.8rem;
  font-size: 1.2rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 2rem;
}

.genderRow {
  margin-top: 0.5rem;
  margin-bottom: 2.5rem;
}

.genderItem {
  margin-left: 1rem;
  margin-right: 1rem;
}

.genderImage {
  width: 6rem;
  height: 6rem;
}

.buttonWrapper {
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  horizontal-align: center;
}

.buttonContainer {
  width: 50%;
  min-width: 180px;
  max-width: 280px;
  height: auto;
  horizontal-align: center;
}

.buttonShadow {
  width: 100%;
  height: 100%;
  background-color: #B85C1A;
  border-radius: 50%;
  margin-top: 8%;
}

.buttonMain {
  width: 100%;
  height: 100%;
  background-color: #F68B3C;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1rem;
}

.buttonText {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  text-align: center;
}

.bottomPadding {
  height: 3rem;
}

@media (min-width: 800px) {
  .titleLabel {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    margin-top: 2rem;
  }
  
  .nameInput {
    font-size: 1.5rem;
    padding: 1rem;
    margin-bottom: 3rem;
  }
  
  .genderRow {
    margin-bottom: 3.5rem;
  }
  
  .genderImage {
    width: 8rem;
    height: 8rem;
  }
  
  .buttonContainer {
    width: 40%;
    max-width: 320px;
  }
  
  .buttonText {
    font-size: 1.8rem;
  }
  
  .buttonShadow {
    margin-top: 6%;
  }
  
  .bottomPadding {
    height: 4rem;
  }
}

@media (max-width: 480px) {
  .titleLabel {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
    margin-top: 1rem;
  }
  
  .nameInput {
    font-size: 1rem;
    padding: 0.6rem;
    margin-bottom: 1.5rem;
  }
  
  .genderRow {
    margin-bottom: 2rem;
  }
  
  .genderImage {
    width: 4.5rem;
    height: 4.5rem;
  }
  
  .buttonContainer {
    width: 60%;
    min-width: 160px;
    max-width: 220px;
  }
  
  .buttonText {
    font-size: 1rem;
  }
  
  .buttonShadow {
    margin-top: 10%;
  }
  
  .bottomPadding {
    height: 2rem;
  }
}
</style>