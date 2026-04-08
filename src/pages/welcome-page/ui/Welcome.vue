<template>
  <Page actionBarHidden="true" class="page">
    <GridLayout rows="auto, *, auto" columns="*">
      <Image row="0" rowSpan="3" col="0" src="res://forest" stretch="aspectFit" 
             horizontalAlignment="center" verticalAlignment="center" />
      
      <StackLayout row="0" col="0" class="topText">
        <Label text="Читаем с Кьюрио" class="title" />
      </StackLayout>
      
      <StackLayout row="2" col="0" class="bottomArea">
        <GridLayout class="googleBtn" columns="auto, *" @tap="googleLogin">
          <Image src="res://icgoogle" class="googleIcon" />
          <Label text="Войти через Google" class="googleBtnText" col="1" />
        </GridLayout>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
export default {
  methods: {
    googleLogin() {
      console.log("Нажата кнопка Google, переходим на ChildProfile");
      this.$navigateTo(require('../../child-profile-page/ui/ChildProfile.vue').default);
    }
  }
};
</script>

<style scoped>
.page {
  background-color: #ffffff;
}

.topText {
  horizontal-align: center;
  margin-top: 80;
}

.title {
  font-size: 48;
  font-weight: bold;
  color: white;
  text-align: center;
  text-shadow: 2 2 6 rgba(0,0,0,0.6);
}

.bottomArea {
  horizontal-align: center;
  margin-bottom: 60;
}

.googleBtn {
  background-color: white;
  border-radius: 20;
  padding: 12 20;
  width: 340;
  elevation: 2;
  text-align: center;
  vertical-align: center;
}

.googleIcon {
  width: 24;
  height: 24;
  margin-right: 12;
}

.googleBtnText {
  color: #444;
  font-size: 18;
  font-weight: normal;
  text-align: center;
}

@media (max-width: 480) {
  .title {
    font-size: 36;
    margin-top: 50;
  }
  .googleBtn {
    width: 240;
    padding: 10 16;
  }
  .googleIcon {
    width: 20;
    height: 20;
    margin-right: 8;
  }
  .googleBtnText {
    font-size: 16;
  }
}
</style>