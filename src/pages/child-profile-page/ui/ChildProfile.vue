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
import { db } from '../../../shared/lib/database';
import { saveChildApi } from '../../../shared/api/client';
import { TRANSITIONS } from '../../../shared/lib/constants';

import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  props: {
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
    const profile = this.snapshot.context.profile;
    if (profile) {
      this.childName      = profile.name   || '';
      this.selectedGender = profile.gender || '';
    }
  },

  watch: {
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

    async continuePressed() {
      if (!this.childName.trim()) {
        alert('Пожалуйста, введите имя ребенка');
        return;
      }

      const profile = {
        name:   this.childName.trim(),
        gender: this.selectedGender,
      };

      // 1. Сохраняем локально через машину (быстро, не ждём сервер)
      this.send({ type: 'SAVE', profile });

      // 2. Синхронизируем с сервером в фоне (только для Google-пользователей)
      this._syncChildWithServer(profile);

      if (this.isSettingsMode) {
        this.$navigateTo(HomePage, TRANSITIONS.slide);
      }
      // Иначе watch обработает переход noProfile → hasProfile
    },

    async _syncChildWithServer(profile) {
      const user = db.getUser();
      // Гости и пользователи без googleId не синхронизируются
      if (!user?.id || user.id.startsWith('guest_')) return;

      try {
        await saveChildApi(user.id, profile);
      } catch (e) {
        // Не блокируем UI при ошибке сервера — данные уже сохранены локально
        console.warn('Не удалось синхронизировать профиль с сервером:', e.message);
      }
    },
  },
};
</script>

<style scoped src="./ChildProfile.css" />