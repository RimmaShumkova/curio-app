<template>
  <Page actionBarHidden="true">
    <GridLayout class="page">
      <Image src="res://logo1" class="logo" stretch="aspectFit" />
    </GridLayout>
  </Page>
</template>

<script>
// Акторы к этому моменту уже запущены (startActors в main.ts)
// и находятся в стабильном состоянии (always-переходы resolved синхронно)
import { authActor, childActor } from '../../../shared/machines/actors';

import Welcome from '../../welcome-page/ui/Welcome.vue';
import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';
import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  mounted() {
    setTimeout(() => {
      this._navigate();
    }, 2000);
  },

  methods: {
    _navigate() {
      const authState  = authActor.getSnapshot();
      const childState = childActor.getSnapshot();

      const isAuthed   = authState.matches('authenticated');
      const hasProfile = childState.matches('hasProfile');

      if (isAuthed && hasProfile) {
        // Пользователь уже всё настроил — сразу на главную
        this.$navigateTo(HomePage, { clearHistory: true });
      } else if (isAuthed && !hasProfile) {
        // Авторизован, но профиль ребёнка не создан
        this.$navigateTo(ChildProfile, { clearHistory: true });
      } else {
        // Не авторизован — на экран приветствия
        this.$navigateTo(Welcome, { clearHistory: true });
      }
    }
  }
};
</script>

<style scoped src="./Splash.css" />