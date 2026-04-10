<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout rows="*, auto" columns="*">
      <Image row="0" rowSpan="2" col="0" src="res://forest" stretch="aspectFill" />
      
      <StackLayout row="0" col="0" class="topText">
        <Label text="Читаем с Кьюрио" class="title" />
      </StackLayout>
      
      <StackLayout row="1" col="0" class="bottomArea">
        <GridLayout class="googleBtn" columns="auto, *" @tap="onGoogleLogin">
          <Image src="res://icgoogle" class="googleIcon" />
          <Label text="Войти через Google" class="googleBtnText" col="1" />
        </GridLayout>
        
        <GridLayout class="btn-orange" columns="*, auto" @tap="onGuestLogin" style="margin-top: 16">
          <Label text="Войти как гость" class="btn-orange-text" col="0" />
        </GridLayout>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { GoogleSignin } from '@nativescript/google-signin';
import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';

export default {
  methods: {
    async onGoogleLogin() {
      try {
        const user = await GoogleSignin.signIn();
        console.log('Успешный вход:', user);
        this.$navigateTo(ChildProfile);
      } catch (error) {
        console.error('Ошибка входа:', error);
        let message = 'Не удалось войти через Google. ';
        if (error.message === 'DEVELOPER_ERROR') {
          message += 'Проверьте настройки Google Cloud Console.';
        } else if (error.message === 'SIGN_IN_REQUIRED') {
          message += 'Добавьте Google аккаунт в настройках эмулятора.';
        } else {
          message += error.message;
        }
        alert(message);
      }
    },
    onGuestLogin() {
      console.log('Вход как гость');
      this.$navigateTo(ChildProfile);
    }
  }
};
</script>

<style scoped src="./Welcome.css" />