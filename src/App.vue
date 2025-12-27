

<!-- theme.defaultAlgorithm、暗色算法 theme.darkAlgorithm 和紧凑算法 theme.compactAlgorithm -->
<template>
  <a-config-provider :theme="{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm}">
    <!-- <header> -->
      <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

      <!-- <div class="wrapper"> -->
        <!-- <HelloWorld msg="You did it!" /> -->

        <!-- <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav> -->
      <!-- </div> -->
    <!-- </header> -->

    <RouterView />
  </a-config-provider>
</template>

<script>
  import { RouterLink, RouterView } from 'vue-router'
  import HelloWorld from './components/HelloWorld.vue'
  import { theme } from 'ant-design-vue';
  // var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  // console.log('isDarkMode', isDarkMode)
  
  export default {
      name: 'App',
    
      components: {
        // HelloWorld
      },
      data() {
        // const value1 = ref<string>('a');
        return {
          isDarkMode:false,
          theme: theme
        };
      },
      mounted () {
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            console.log('深色模式状态变化，当前' + (event.matches ? '进入' : '退出') + '深色模式');
            this.isDarkMode = event.matches
            window.onChangeDarkMode(this.isDarkMode)
        });
        //默认是跟随系统的，当收到切换时，本地看看
        window.onChangeDarkMode = (isDarkMode)=>{
          console.log('window.onChangeDarkMode', isDarkMode)
          this.isDarkMode = isDarkMode
          window.isDarkMode = isDarkMode
          if(isDarkMode){
              document.documentElement.classList.add('darkmode--activated');
          }else{
              document.documentElement.classList.remove('darkmode--activated');
          }
        }
        window.onChangeDarkMode(this.isDarkMode)
      },
      methods: {
        
      }
    }
</script>

<style scoped>
/* .enableDark {
    background-color: #181818;
    color: white;
} */

/* @media (prefers-color-scheme: dark) {
  .enableDark {
    background-color: #181818;
    color: white;
  }
} */
</style>
