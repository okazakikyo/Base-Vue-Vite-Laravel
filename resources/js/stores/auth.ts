import { defineStore } from 'pinia'
import Auth from '@/services/app/Auth'
import { useMutation } from '@tanstack/vue-query';
import { Response } from '@/shared/interfaces/response';
import { LoginResponse } from '@/shared/interfaces/user';

interface AuthState {
    token: string | null
    user: object | null
}

export const useAuthStore = defineStore('auth', {
    state: ():AuthState => ({
        token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
        user: localStorage.getItem('user') ? JSON.parse(JSON.stringify(localStorage.getItem('user'))) : null,
    }),
    actions: {
        login() {
            return useMutation({
                mutationFn: async (payload: { email: string; password: string }) => {
                    const { data } = await Auth.login(payload)
                    return data
                },
                onSuccess: (data: Response<LoginResponse>) => {
                    this.token = data?.result.token
                    this.user = data?.result.user
                    localStorage.setItem('token', this.token)
                    localStorage.setItem('user', JSON.stringify(this.user))
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    if (error.response) {
                        console.error('Login error:', error.response.data)
                    }
                }
            })
        }
    }
})
