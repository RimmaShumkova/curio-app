<template>
  <StackLayout v-if="busy" class="indicator-container">
    <ActivityIndicator :busy="true" class="indicator" />
  </StackLayout>
</template>

<script>
export default {
  props: {
    busy: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.indicator-container {
  padding: 20;
  align-items: center;
  justify-content: center;
}

.indicator {
  width: 40;
  height: 40;
  color: #F68B3C;
}
</style>