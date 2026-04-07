<!-- WelcomePage.vue -->
<template>
  <Page actionBarHidden="true" class="page">
    <ScrollView>
      <StackLayout class="mainContent">
        
        <Label :text="'Привет, ' + childName + '! Давай читать!'" class="welcomeLabel" />
        
        <!-- ИСТОРИИ В РЯД (3 КОЛОНКИ) -->
        <GridLayout columns="*, *, *" class="storiesGrid" horizontalAlignment="center">
          
          <!-- ИСТОРИЯ 1 -->
          <StackLayout col="0" class="storyItem">
            <Image src="res://berries_kids" class="storyImage" stretch="aspectFit" />
            <Label text="Друзья собирают ягоды" class="storyLabel" textWrap="true" />
          </StackLayout>
          
          <!-- ИСТОРИЯ 2 -->
          <StackLayout col="1" class="storyItem">
            <Image src="res://curio_garden" class="storyImage" stretch="aspectFit" />
            <Label text="Кьюрио в саду" class="storyLabel" textWrap="true" />
          </StackLayout>
          
          <!-- ИСТОРИЯ 3 -->
          <StackLayout col="2" class="storyItem">
            <Image src="res://curio_garden_locked" class="storyImage" stretch="aspectFit" />
            <Label text="Кьюрио в саду" class="storyLabel" textWrap="true" />
          </StackLayout>
          
        </GridLayout>
        
        <!-- КНОПКА ДАЛЕЕ -->
        <StackLayout class="buttonWrapper">
          <GridLayout class="buttonContainer" @tap="goToNext">
            <StackLayout class="buttonShadow" />
            <StackLayout class="buttonMain">
              <Label text="Далее" class="buttonText" />
            </StackLayout>
          </GridLayout>
        </StackLayout>
        
        <StackLayout class="bottomPadding" />
        
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      childName: 'Кьюрио'
    };
  },
  mounted() {
    // Получаем имя из context (правильный способ для NativeScript)
    if (this.$context && this.$context.childName) {
      this.childName = this.$context.childName;
    }
    
    // Альтернативный способ через $route
    if (this.$route && this.$route.params && this.$route.params.childName) {
      this.childName = this.$route.params.childName;
    }
    
    console.log('Получено имя:', this.childName);
  },
  methods: {
    goToNext() {
      console.log('Переход дальше, имя:', this.childName);
      // Переход на следующий экран (например, на чтение)
      // this.$navigateTo(ReadingPage);
    }
  }
};
</script>

<style scoped>
.page {
  background-color: #FFFCE1;
}

.mainContent {
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 8%;
  padding-bottom: 15%;
}

.welcomeLabel {
  font-size: 2rem;
  font-weight: bold;
  color: #3D0000;
  text-align: center;
  margin-bottom: 2rem;
}

/* СЕТКА ДЛЯ ИСТОРИЙ (3 В РЯД) */
.storiesGrid {
  margin-bottom: 2rem;
}

.storyItem {
  margin-left: 4px;
  margin-right: 4px;
  padding: 5px;
}

/* КАРТИНКИ - АДАПТИВНЫЙ РАЗМЕР */
.storyImage {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 15;
  margin-bottom: 8px;
}

/* ТЕКСТ ПОД КАРТИНКОЙ - ЯРКИЙ */
.storyLabel {
  font-size: 3vw;
  font-weight: 600;
  color: #F68B3C;
  text-align: center;
  margin-bottom: 0;
  padding: 4px;
}

/* ===== АДАПТИВНАЯ КНОПКА ===== */
.buttonWrapper {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  horizontal-align: center;
}

.buttonContainer {
  width: 50%;
  min-width: 180px;
  max-width: 280px;
  height: auto;
  horizontal-align: center;
}

.buttonShadow {
  width: 100%;
  height: 100%;
  background-color: #B85C1A;
  border-radius: 50%;
  margin-top: 8%;
}

.buttonMain {
  width: 100%;
  height: 100%;
  background-color: #F68B3C;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1rem;
}

.buttonText {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  text-align: center;
}

.bottomPadding {
  height: 3rem;
}

/* Адаптация под экраны */
@media (min-width: 800px) {
  .welcomeLabel {
    font-size: 2.5rem;
  }
  
  .storyLabel {
    font-size: 1.2rem;
  }
  
  .storyImage {
    border-radius: 20;
  }
  
  .buttonContainer {
    width: 40%;
    max-width: 320px;
  }
  
  .buttonText {
    font-size: 1.8rem;
  }
  
  .bottomPadding {
    height: 4rem;
  }
}

@media (max-width: 480px) {
  .welcomeLabel {
    font-size: 1.5rem;
  }
  
  .storyLabel {
    font-size: 3.5vw;
  }
  
  .storyImage {
    border-radius: 10;
  }
  
  .buttonContainer {
    width: 60%;
    min-width: 160px;
    max-width: 220px;
  }
  
  .buttonText {
    font-size: 1rem;
  }
  
  .bottomPadding {
    height: 2rem;
  }
}
</style>