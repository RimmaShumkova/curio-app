<template>
  <Frame>
    <Page actionBarHidden="true">
      <GridLayout class="page">
        <Image src="res://logo" width="50%" height="30%" stretch="aspectFit" />
      </GridLayout>
    </Page>
  </Frame>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$navigateTo(require("./Welcome.vue").default);
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

.logo {
  width: 200;
}
</style>