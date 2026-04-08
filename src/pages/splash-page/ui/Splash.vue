<template>
  <Page actionBarHidden="true">
    <GridLayout class="page">
      <Image src="res://logo1" width="50%" height="30%" stretch="aspectFit" />
    </GridLayout>
  </Page>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$navigateTo(require('../../welcome-page/ui/Welcome.vue').default);
    }, 2000);
  }
};
</script>

<style scoped>
.page {
  background-color: #F68B3C;
  justify-content: center;
  align-items: center;
}
</style>