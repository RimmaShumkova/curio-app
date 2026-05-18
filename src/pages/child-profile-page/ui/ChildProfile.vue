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
import { useSelector } from '@xstate/vue';

import { childActor } from '../../../shared/machines/actors';
import { TRANSITIONS } from '../../../shared/lib/constants';

import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  props: {
    /**
     * true  — открыт из HomePage как экран настроек (кнопка шестерёнки)
     * false — первичная настройка профиля после входа
     */
    isSettingsMode: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const snapshot = useSelector(childActor, (s) => s);
    const send = (event) => childActor.send(event);
    return { snapshot, send };
  },

  data() {
    return {
      childName: '',
      selectedGender: '',
    };
  },

  mounted() {
    // Если профиль уже есть — предзаполняем поля
    const profile = this.snapshot.context.profile;
    if (profile) {
      this.childName     = profile.name   || '';
      this.selectedGender = profile.gender || '';
    }
  },

  watch: {
    /**
     * Следим за переходом noProfile → hasProfile.
     * Срабатывает только при первоначальной настройке (isSettingsMode = false),
     * потому что при isSettingsMode пользователь уже в hasProfile
     * и SAVE не меняет состояние (только context).
     */
    snapshot(newSnapshot) {
      if (!this.isSettingsMode && newSnapshot.matches('hasProfile')) {
        this.$navigateTo(HomePage, TRANSITIONS.slide);
      }
    },
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

      // Сохраняем через машину (childMachine сохраняет и в childModel, и в db)
      this.send({
        type: 'SAVE',
        profile: {
          name:   this.childName.trim(),
          gender: this.selectedGender,
        },
      });

      if (this.isSettingsMode) {
        // В режиме настроек — возвращаемся на главную вручную
        // (watch не сработает, т.к. состояние не меняется)
        this.$navigateTo(HomePage, TRANSITIONS.slide);
      }
      // Иначе watch обработает переход noProfile → hasProfile
    },
  },
};
</script>

<style scoped src="./ChildProfile.css" />