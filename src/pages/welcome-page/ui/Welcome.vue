<template>
  <Page actionBarHidden="true" class="page">
    <AbsoluteLayout class="root">
      <Image src="res://forest" stretch="aspectFill" class="background" />
      
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
import { userModel } from '../../../entities/user/model/user';

const API_URL = "http://10.0.2.2:3000/api"; // для эмулятора Android

export default {
  methods: {
    async onGoogleLogin() {
      try {
        await GoogleSignin.configure({
          clientId: "286722580928-be92mmdc2afql0efj8f2jcqvt3hm2fg3.apps.googleusercontent.com"
        });
        
        const user = await GoogleSignin.signIn();
        
        // Отправляем на бэкенд
        const response = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: user.idToken,
            clientId: "286722580928-be92mmdc2afql0efj8f2jcqvt3hm2fg3.apps.googleusercontent.com"
          })
        });
        
        const userData = await response.json();
        
        // Сохраняем в локальное хранилище
        userModel.save({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          childName: userData.childName,
          childGender: userData.childGender,
          socialProvider: 'google'
        });
        
        // Если уже есть профиль ребенка - сразу на главную, иначе на заполнение
        if (userData.childName) {
          this.$navigateTo(HomePage);
        } else {
          this.$navigateTo(ChildProfile);
        }
        
      } catch (error) {
        console.error("Ошибка входа:", error);
        alert("Не удалось войти через Google");
      }
    },

    onGuestLogin() {
      userModel.saveGuest();
      this.$navigateTo(ChildProfile);
    }
  }
};
</script>