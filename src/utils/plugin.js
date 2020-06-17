import MyBread from "@/components/my-bread.vue";
import axios from '@/api'
import MyChannel from '@/components/my-channel.vue'
import MyImage from '@/components/my-image.vue'


export default {
    install(Vue) {
        Vue.component(MyBread.name, MyBread)
        Vue.prototype.$http = axios
        Vue.component(MyChannel.name, MyChannel)
        Vue.component(MyImage.name, MyImage)
    }
}
