import { createApp } from 'nativescript-vue';
import App from './App.vue';

import { GoogleSignin } from '@nativescript/google-signin';

GoogleSignin.configure({
  clientId: "875785150570-dkf15r6vdnp1n2tef5qbmio1pdsn7dun.apps.googleusercontent.com"
});

createApp(App).start()
