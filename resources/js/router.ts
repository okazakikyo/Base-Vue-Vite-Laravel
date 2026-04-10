import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalizedGeneric,
    RouteLocationNormalizedLoadedGeneric,
    RouteRecordRaw,
} from "vue-router";
import { RouteGuard, RouterMeta } from "@/shared/interfaces/index";
import { useAuthStore } from "./stores/auth";
import auth from "./middlewares/auth";
import { ROUTE } from "./shared/constants/routing";

const routeMiddleware = (
    context: RouteGuard,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    middlewares: Array<any>,
    index: number,
) => {
    const nextMiddleware = middlewares[index];

    if (!nextMiddleware) {
        return context.next;
    }

    return () => {
        nextMiddleware({
            ...context,
            next: routeMiddleware(context, middlewares, index + 1),
        });
    };
};

const defaultRedirect = (
    to: RouteLocationNormalizedGeneric,
    from: RouteLocationNormalizedLoadedGeneric,
    next: NavigationGuardNext,
) => {
    const store = useAuthStore();
    if (store.token) {
        next({ name: "Home" });
    } else {
        if (to?.path == "/") {
            next({ name: "Login" });
        }
        next();
    }
};

const routes: RouteRecordRaw[] = [
    {
        path: ROUTE.PATH.HOME,
        name: ROUTE.NAME.HOME,
        component: () => import("@/views/HomePage.vue"),
        meta: {
            title: ROUTE.TITLE.HOME,
            middleware: [auth],
        },
    },
    {
        path: ROUTE.PATH.LOGIN,
        name: ROUTE.NAME.LOGIN,
        component: () => import("@/views/LoginPage.vue"),
        beforeEnter: defaultRedirect,
        meta: {
            title: ROUTE.TITLE.LOGIN,
        },
    },
    {
        path: ROUTE.PATH.INTERVIEW_QUESTIONS,
        name: ROUTE.NAME.INTERVIEW_QUESTIONS,
        component: () => import("@/views/InterviewQuestionsPage.vue"),
        meta: {
            title: ROUTE.TITLE.INTERVIEW_QUESTIONS,
            middleware: [auth],
        },
    },
    {
        path: ROUTE.PATH.INTERVIEW_QUIZ,
        name: ROUTE.NAME.INTERVIEW_QUIZ,
        component: () => import("@/views/InterviewQuizPage.vue"),
        meta: {
            title: ROUTE.TITLE.INTERVIEW_QUIZ,
            middleware: [auth],
        },
    },
    {
        path: ROUTE.PATH.OCR,
        name: ROUTE.NAME.OCR,
        component: () => import("@/views/OcrPage.vue"),
        meta: {
            title: ROUTE.TITLE.OCR,
            middleware: [auth],
        },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const context: RouteGuard = { to, from, next, store: useAuthStore() };
    if (!to.meta.middleware) {
        return next();
    }
    const middleware = Array.isArray(to.meta.middleware)
        ? to.meta.middleware
        : [to.meta.middleware];

    middleware[0]({
        ...context,
        next: routeMiddleware(context, middleware, 1),
    });
});

router.afterEach((to) => {
    const meta: RouterMeta = to.meta;
    const titleKey = meta?.title as string | undefined;
    if (titleKey) {
        document.title = titleKey;
    }
});

export default router;
