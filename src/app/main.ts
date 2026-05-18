// src/app/main.ts
import { createApp } from 'nativescript-vue';
import App from './App.vue';

import { GoogleSignin } from '@nativescript/google-signin';
import { startActors } from '../shared/machines/actors';

// GoogleSignin.configure({
//   clientId: "286722580928-be92mmdc2afql0efj8f2jcqvt3hm2fg3.apps.googleusercontent.com",
//   serverClientId: "286722580928-be92mmdc2afql0efj8f2jcqvt3hm2fg3.apps.googleusercontent.com"
// });

// Запускаем XState акторы ДО создания приложения.
// authActor и childActor синхронно проверяют хранилище и переходят
// в нужное состояние (authenticated/unauthenticated, hasProfile/noProfile).
startActors();

createApp(App).start();