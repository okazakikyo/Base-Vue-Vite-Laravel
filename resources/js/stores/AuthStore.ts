import { defineStore } from 'pinia'
import Auth from '@/services/app/Auth'
import { useMutation } from '@tanstack/vue-query';

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
                onSuccess: (data) => {
                    this.token = data.token
                    this.user = data.user
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
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
