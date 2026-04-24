<template>
  <Page actionBarHidden="true" class="page">

    <AbsoluteLayout class="root">

      <Image
        src="res://forest"
        stretch="aspectFill"
        class="background"
      />

      <GridLayout rows="*, auto" columns="*" class="content">

        <StackLayout row="0" class="topText">
          <Label text="Читаем с Кьюрио" class="title" />
        </StackLayout>

        <StackLayout row="1" class="bottomArea">

          <GridLayout class="googleBtn" columns="*, auto, *" @tap="onGoogleLogin">

            <StackLayout col="0"></StackLayout>

            <StackLayout col="1" orientation="horizontal" verticalAlignment="middle">
              <Image src="res://icgoogle" class="googleIcon" />
              <Label text="Войти через Google" class="googleBtnText" />
            </StackLayout>

            <StackLayout col="2"></StackLayout>

          </GridLayout>

          <GridLayout class="btn-orange guestBtn" columns="*" @tap="onGuestLogin">
            <Label text="Войти как гость" class="btn-orange-text" />
          </GridLayout>

        </StackLayout>

      </GridLayout>

    </AbsoluteLayout>

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

        const response = await fetch("http://10.0.2.2:3000/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: user.idToken
          })
        });

        const data = await response.json();
        console.log("User from backend:", data);

        this.$navigateTo(ChildProfile);

      } catch (error) {
        console.error("Ошибка входа:", error);
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