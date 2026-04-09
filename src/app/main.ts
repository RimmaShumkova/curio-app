import { createApp } from 'nativescript-vue';
import App from './App.vue';

import { GoogleSignin } from '@nativescript/google-signin';

GoogleSignin.configure({
  clientId: "875785150570-g3u33eos249akrubsmo88jf7th72agvu.apps.googleusercontent.com"
});

createApp(App).start()
