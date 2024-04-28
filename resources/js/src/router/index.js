import { createRouter, createWebHistory } from 'vue-router';
import AuthLayout from "../components/AuthLayout.vue";
import SecretSanta from "../views/SecretSanta.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import store from "../store/index.js";
import NotFound from "../views/NotFound.vue";

const routes = [
    {
        path: "/",
        name: "SecretSanta",
        meta: { isAuth: true },
        component: SecretSanta
    },
    {
        path: "/auth",
        //redirect: "/login",
        name: "Auth",
        component: AuthLayout,
        children: [
            {
                path: "login",
                name: "Login",
                component: Login,
            },
            {
                path: "register",
                name: "Register",
                component: Register,
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.isAuth && !store.state.user.token) {
        next({ name: "Register" });
    } else {
        next();
    }
});

export default router;
