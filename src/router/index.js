import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Welcome from '@/views/welcome'
import auth from '@/utils/auth'
import Article from '@/views/article'
import Image from '@/views/image'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
import Fans from '@/views/fans'

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
        ]
    }
]


const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && !auth.getUser().token) return next('/login');
    next();
})
export default router

