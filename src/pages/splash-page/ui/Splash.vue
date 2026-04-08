<template>
  <Page actionBarHidden="true">
    <GridLayout class="page">
      <Image src="res://logo1" class="logo" stretch="aspectFit" />
    </GridLayout>
  </Page>
</template>

<script>
import Welcome from '../../welcome-page/ui/Welcome.vue';

export default {
  mounted() {
    setTimeout(() => {
      this.$navigateTo(Welcome);
    }, 2000);
  }
};
</script>

<style scoped src="./Splash.css" />