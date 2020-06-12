import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Welcome from '@/views/welcome'
import auth from '@/utils/auth'
import Article from '@/views/article'

Vue.use(VueRouter)


const routes = [
    { path: '/login', component: Login },
    {
        path: '/', component: Layout, redirect: '/welcome', children: [
            { path: 'welcome', component: Welcome },
            { path: 'article', component: Article }
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

