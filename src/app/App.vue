<template>
  <Frame>
    <Splash />
  </Frame>
</template>

<script setup>
import Splash from '../pages/splash-page/ui/Splash.vue';
import { db } from '../shared/lib/database';
import { userModel } from '../entities/user/model/user';

// ВРЕМЕННО — очищаем storage чтобы сбросить гостевой аккаунт.
// db.clearAll();
// userModel.clear();
</script>