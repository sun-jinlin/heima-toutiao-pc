import router from '@/router'
import axios from 'axios'
import auth from '@/utils/auth.js'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0';

// axios.defaults.headers.Authorization = `Bearer ${auth.getUser().token}`

// 请求拦截器
axios.interceptors.request.use((config) => {
    const token = auth.getUser().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config

}, (error) => Promise.reject(error))

// 响应拦截器
axios.interceptors.response.use((res) => res, (err) => {
    if (err.response && err.response.status === 401) {
        router.push('/login')
    }
    return Promise.reject(err);
})

export default axios