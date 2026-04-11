import { createApp } from 'nativescript-vue';
import App from './App.vue';

import { GoogleSignin } from '@nativescript/google-signin';

// Настройка Google Sign-In с Web Client ID
GoogleSignin.configure({
  clientId: "178781864041-4ahca5mb40jukerq7296mvb916b7jst7.apps.googleusercontent.com",
  serverClientId: "178781864041-4ahca5mb40jukerq7296mvb916b7jst7.apps.googleusercontent.com"
});

createApp(App).start();