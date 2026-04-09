<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout rows="*, auto" columns="*">
      
      <Image row="0" rowSpan="2" col="0" 
             src="res://forest" 
             stretch="aspectFill" />
      
      <StackLayout row="0" rowSpan="2" col="0" 
                   backgroundColor="rgba(0,0,0,0.35)" />
      
      <StackLayout row="0" col="0" class="topText">
        <Label text="Читаем с Кьюрио" class="title" />
      </StackLayout>
      
      <StackLayout row="1" col="0" class="bottomArea">
        <GridLayout class="googleBtn" columns="auto, *" @tap="onGoogleLogin">
          <Image src="res://icgoogle" class="googleIcon" />
          <Label text="Войти через Google" class="googleBtnText" col="1" />
        </GridLayout>
      </StackLayout>
      
    </GridLayout>
  </Page>
</template>

<script>
import { GoogleSignin } from '@nativescript/google-signin';
import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';

export default {
  name: "Welcome",
  
  async mounted() {
    console.log("=== Welcome страница загружена ===");
    
    try {
      // Проверяем, есть ли уже авторизованный пользователь
      const isSignedIn = await GoogleSignin.isSignedIn();
      console.log("Уже авторизован:", isSignedIn);
      
      if (isSignedIn) {
        const user = await GoogleSignin.getCurrentUser();
        console.log("Текущий пользователь:", user);
        // Можно сразу перейти на следующий экран
        // this.$navigateTo(ChildProfile);
      }
    } catch (err) {
      console.error("Ошибка при инициализации:", err);
    }
  },
  
  methods: {
    async onGoogleLogin() {
      console.log("=== Нажата кнопка Google ===");
      
      try {
        // Запускаем процесс входа
        console.log("Вызываем GoogleSignin.signIn()...");
        const user = await GoogleSignin.signIn();
        
        console.log("=== Вход успешен! ===");
        console.log("Имя:", user.displayName || user.user?.displayName);
        console.log("Email:", user.email || user.user?.email);
        
        // Переходим на страницу профиля ребенка
        console.log("Переходим на ChildProfile");
        await this.$navigateTo(ChildProfile);
        
      } catch (error) {
        console.error("=== Ошибка входа ===");
        console.error("Код ошибки:", error.code);
        console.error("Сообщение:", error.message);
        
        // Показываем понятное сообщение пользователю
        let message = "Не удалось войти через Google. ";
        if (error.message === "DEVELOPER_ERROR") {
          message += "Проверьте настройки Google Cloud Console (SHA-1 отпечаток).";
        } else if (error.message === "SIGN_IN_REQUIRED") {
          message += "Добавьте Google аккаунт в настройках эмулятора.";
        } else {
          message += error.message;
        }
        
        alert(message);
      }
    }
  }
};
</script>

<style scoped src="./Welcome.css" />
