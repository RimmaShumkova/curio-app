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

import { authActor } from '../../../shared/machines/actors';
import { loginWithGoogleApi } from '../../../shared/api/client';
import { userModel } from '../../../entities/user/model/user';
import { db } from '../../../shared/lib/database';

import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';

export default {
  setup() {
    // Подписываемся на authActor — следим за состоянием входа
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
      // Как только authMachine перешёл в authenticated — идём дальше
      if (newSnapshot.matches('authenticated')) {
        this.$navigateTo(ChildProfile, { clearHistory: true });
      }
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
        console.log('1. configure готов');

        await GoogleSignin.signIn();
        console.log('2. signIn готов');

        const tokens = await GoogleSignin.getTokens();
        console.log('3. tokens получены, idToken:', !!tokens.idToken);
        console.log('4. первые символы токена:', tokens.idToken?.substring(0, 20));

        if (!tokens.idToken) {
          alert('Не удалось получить токен. Попробуйте ещё раз.');
          this.isLoggingIn = false;
          return;
        }

        const response = await loginWithGoogleApi(tokens.idToken);
        console.log('4. ответ сервера:', JSON.stringify(response));
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

      } catch (error) {
        console.error('Ошибка Google Sign-In:', error);
        authActor.send({ type: 'LOGIN_ERROR', error: error.message || 'Ошибка входа' });
        alert('Не удалось войти через Google. Попробуйте ещё раз.');
      } finally {
        this.isLoggingIn = false;
      }
    },

    onGuestLogin() {
      // Гость не идёт через сервер — только локальное хранение
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