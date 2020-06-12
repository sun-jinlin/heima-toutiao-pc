import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/index.js'
import axios from '@/api'


Vue.config.productionTip = false
Vue.use(ElementUi);


Vue.prototype.$http = axios



new Vue({
  render: h => h(App),
  router
}).$mount('#app')
