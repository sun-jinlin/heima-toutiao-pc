import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/index.js'
import plugin from '@/utils/plugin.js'
import style from '@/styles/index.less'


Vue.config.productionTip = false
Vue.use(ElementUi);
Vue.use(plugin)






new Vue({
  render: h => h(App),
  router
}).$mount('#app')
