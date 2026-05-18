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
              <Label
                text="Войти через Google"
                class="googleBtnText"
              />
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

import { userModel } from '../../../entities/user/model/user';
import { db } from '../../../shared/lib/database';

import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';

export default {
  methods: {
    async onGoogleLogin() {
      try {
        await GoogleSignin.configure({});
        const result = await GoogleSignin.signIn();

        // Сохраняем пользователя локально (бэкенд пока не подключён).
        // Когда бэкенд будет готов — заменить на:
        // this.send({ type: 'LOGIN_GOOGLE', token: result.idToken });
        const googleUser = result.user ?? result;
        const user = {
          id: googleUser.id || `google_${Date.now()}`,
          name: googleUser.name || 'Пользователь',
          email: googleUser.email || '',
          socialProvider: 'google',
        };
        userModel.save(user);
        db.saveUser(user);

        this.$navigateTo(ChildProfile, { clearHistory: true });

      } catch (error) {
        console.error('Ошибка Google Sign-In:', error);
        alert('Не удалось войти через Google. Попробуйте ещё раз.');
      }
    },

    onGuestLogin() {
      const guestUser = {
        id: `guest_${Date.now()}`,
        name: 'Гость',
        email: '',
        socialProvider: null,
      };
      userModel.save(guestUser);
      db.saveUser(guestUser);

      this.$navigateTo(ChildProfile, { clearHistory: true });
    },
  },
};
</script>

<style scoped src="./Welcome.css" />