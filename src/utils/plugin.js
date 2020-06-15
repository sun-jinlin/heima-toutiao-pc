import MyBread from "@/components/my-bread.vue";
import axios from '@/api'


export default {
    install(Vue) {
        Vue.component(MyBread.name, MyBread)
        Vue.prototype.$http = axios
    }
}
