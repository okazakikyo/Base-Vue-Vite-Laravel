import { useAuthStore } from "@/stores/auth";
import { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric } from "vue-router";

export interface RouterMeta {
    middleware?: string[];
    title?: string;
}

export interface RouteGuard {
    to: RouteLocationNormalizedGeneric;
    from: RouteLocationNormalizedLoadedGeneric;
    next: NavigationGuardNext;
    store: ReturnType<typeof useAuthStore>;
}
