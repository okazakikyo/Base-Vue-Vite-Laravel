import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '@/constants/variables';

import type { MetaPaging } from '@/shared/interfaces/response';
import type { RouteLocationNormalized } from 'vue-router';

export function getPage(route: RouteLocationNormalized): number {
    return route.query.page ? Number(route.query.page) : DEFAULT_PAGE;
}

export function getPagsize(route: RouteLocationNormalized): number {
    return route.query.pageSize ? Number(route.query.pageSize) : DEFAULT_PAGE_LIMIT;
}

export function getPagingParams(route: RouteLocationNormalized): MetaPaging {
    return {
        page: getPage(route),
        per_page: getPagsize(route),
    };
}
