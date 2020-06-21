import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from '@/utils/auth'


const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Welcome = () => import('@/views/welcome')
const Article = () => import('@/views/article')
const Image = () => import('@/views/image')
const Publish = () => import('@/views/publish')
const Comment = () => import('@/views/comment')
const Fans = () => import('@/views/fans')
const Setting = () => import('@/views/setting')
const NotFound = () => import('@/views/404')

Vue.use(VueRouter)


const routes = [
    { path: '/login', component: Login },
    {
        path: '/', component: Layout, redirect: '/welcome', children: [
            { path: 'welcome', component: Welcome },
            { path: 'article', component: Article },
            { path: 'image', component: Image },
            { path: 'publish', component: Publish },
            { path: 'comment', component: Comment },
            { path: 'fans', component: Fans },
            { path: 'setting', component: Setting },
        ]
    },
    { path: '*', component: NotFound }
]


const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && !auth.getUser().token) return next('/login');
    next();
})
export default router

