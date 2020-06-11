import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/index.js'
import axios from 'axios'


Vue.config.productionTip = false
Vue.use(ElementUi);

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0';
Vue.prototype.$http = axios



new Vue({
  render: h => h(App),
  router
}).$mount('#app')
