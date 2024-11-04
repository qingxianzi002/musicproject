import App from './App'
import { musicuser } from './lib/js/musicuser'
import { musicapi } from './lib/js/musicapi'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.musicuser = musicuser;
  app.config.globalProperties.musicapi = musicapi;
  return {
    app
  }
}
// #endif