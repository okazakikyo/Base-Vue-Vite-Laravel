import { RouteGuard } from '@/shared/interfaces';

export default async function auth({ next, store }: RouteGuard): Promise<void> {
    if (!store.token) {
        next({ name: 'Login' });
    }
    return next();
}
