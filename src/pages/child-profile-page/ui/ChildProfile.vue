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
import { userModel } from '../../../entities/user/model/user';

export default {
  data() {
    return {
      childName: '',
      selectedGender: ''
    };
  },
  async mounted() {
    // Загружаем сохраненные данные пользователя
    const user = userModel.load();
    if (user && user.childName) {
      this.childName = user.childName;
      this.selectedGender = user.childGender;
    }
  },
  methods: {
    selectGender(gender) {
      this.selectedGender = gender;
    },
    async continuePressed() {
      if (!this.childName.trim()) {
        alert('Пожалуйста, введите имя ребенка');
        return;
      }
      
      // Сохраняем в childModel
      childModel.save({
        name: this.childName,
        gender: this.selectedGender
      });
      
      // Сохраняем в userModel и на сервер
      await userModel.updateChildProfile(this.childName, this.selectedGender);
      
      this.$navigateTo(HomePage, TRANSITIONS.slide);
    }
  }
};
</script>