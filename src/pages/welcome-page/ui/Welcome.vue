<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout rows="*, auto" columns="*">
      
      <Image row="0" rowSpan="2" col="0" 
             src="res://forest" 
             stretch="aspectFill" />
      
      <StackLayout row="0" rowSpan="2" col="0" 
                   backgroundColor="rgba(0,0,0,0.35)" />
      
      <StackLayout row="0" col="0" class="topText">
        <Label text="Читаем с Кьюрио" class="title" />
      </StackLayout>
      
      <StackLayout row="1" col="0" class="bottomArea">
        <GridLayout class="googleBtn" columns="auto, *" @tap="googleLogin">
          <Image src="res://icgoogle" class="googleIcon" />
          <Label text="Войти через Google" class="googleBtnText" col="1" />
        </GridLayout>
      </StackLayout>
      
    </GridLayout>
  </Page>
</template>

<script>
import ChildProfile from '../../child-profile-page/ui/ChildProfile.vue';

export default {
  methods: {
    googleLogin() {
      console.log("Нажата кнопка Google, переходим на ChildProfile");
      this.$navigateTo(ChildProfile);
    }
  }
};
</script>

<style scoped src="./Welcome.css" />