<template>
  <Page actionBarHidden="true">
    <GridLayout class="page">
      <Label text="Страница чтения истории" class="title" />
      <Button text="Назад" @tap="goBack" class="button" />
    </GridLayout>
  </Page>
</template>

<script>
// Импортируем HomePage вместо StoriesPage
import HomePage from '../../home-page/ui/HomePage.vue';

export default {
  props: {
    storyId: {
      type: String,
      required: true
    }
  },
  mounted() {
    console.log('Открыта история с ID:', this.storyId);
  },
  methods: {
    goBack() {
      this.$navigateTo(HomePage, {
        transition: { name: "slide", duration: 300 }
      });
    }
  }
};
</script>

<style scoped>
.page {
  background-color: #FFFCE1;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 24;
  font-weight: bold;
  color: #3D0000;
  margin-bottom: 20;
}
.button {
  background-color: #F68B3C;
  color: white;
  padding: 10 20;
  border-radius: 25;
}
</style>