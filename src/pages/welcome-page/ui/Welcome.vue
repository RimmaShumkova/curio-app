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
                :text="isLoggingIn ? 'Загрузка...' : 'Войти через Google'"
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
import { useSelector } from '@xstate/vue';
import { GoogleSignin } from '@nativescript/google-signin';

import { authActor, childActor } from '../../../shared/machines/actors';
import { loginWithGoogleApi, fetchChildApi } from '../../../shared/api/client';
import { userModel } from '../../../entities/user/model/user';
import { db } from '../../../shared/lib/database';

import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';
import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  setup() {
    const snapshot = useSelector(authActor, (s) => s);
    return { snapshot };
  },

  data() {
    return {
      isLoggingIn: false,
    };
  },

  watch: {
    snapshot(newSnapshot) {
      if (newSnapshot.matches('error')) {
        alert('Ошибка входа. Попробуйте ещё раз.');
      }
    },
  },

  methods: {
    async onGoogleLogin() {
      if (this.isLoggingIn) return;
      this.isLoggingIn = true;

      try {
        await GoogleSignin.configure({
          serverClientId: '178781864041-4ahca5mb40jukerq7296mvb916b7jst7.apps.googleusercontent.com',
        });

        await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();

        if (!tokens.idToken) {
          alert('Не удалось получить токен. Попробуйте ещё раз.');
          this.isLoggingIn = false;
          return;
        }

        // 1. Авторизуемся на сервере
        const response = await loginWithGoogleApi(tokens.idToken);
        const serverUser = response.user;

        const user = {
          id: serverUser.googleId,
          name: serverUser.name,
          email: serverUser.email,
          socialProvider: 'google',
        };

        userModel.save(user);
        db.saveUser(user);
        authActor.send({ type: 'LOGIN_SUCCESS', user });

        // 2. Пробуем загрузить профиль ребёнка с сервера
        try {
          const childResponse = await fetchChildApi(user.id);
          const serverChild = childResponse.child;

          // Профиль найден на сервере — сохраняем локально и идём на главную
          const profile = { name: serverChild.name, gender: serverChild.gender };
          db.saveChild(profile);
          childActor.send({ type: 'SAVE', profile });

          this.$navigateTo(HomePage, { clearHistory: true });

        } catch (e) {
          // Профиля нет на сервере — первый вход, идём заполнять
          this.$navigateTo(ChildProfile, { clearHistory: true });
        }

      } catch (error) {
        console.error('Ошибка Google Sign-In:', error);
        authActor.send({ type: 'LOGIN_ERROR', error: error.message || 'Ошибка входа' });
        alert('Не удалось войти через Google. Попробуйте ещё раз.');
      } finally {
        this.isLoggingIn = false;
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