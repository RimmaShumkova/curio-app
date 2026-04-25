import { createApp } from 'nativescript-vue';
import App from './App.vue';

import { GoogleSignin } from '@nativescript/google-signin';

// Настройка Google Sign-In с Client ID
// GoogleSignin.configure({
//   clientId: "286722580928-be92mmdc2afql0efj8f2jcqvt3hm2fg3.apps.googleusercontent.com",
//   serverClientId: "286722580928-be92mmdc2afql0efj8f2jcqvt3hm2fg3.apps.googleusercontent.com"
// });

createApp(App).start();