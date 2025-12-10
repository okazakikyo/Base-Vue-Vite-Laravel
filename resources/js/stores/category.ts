import { defineStore } from 'pinia'
import Category from '@/services/app/Category'
import { useMutation } from '@tanstack/vue-query';

interface CategoryState {
    categories: []
}

export const useCategoryStore = defineStore('category', {
    state: (): CategoryState => ({
        categories: [],
    }),
    actions: {
        getCategories() {
            return useMutation({
                mutationFn: async () => {
                    const { data } = await Category.getCategories()
                    return data
                },
                onSuccess: (data) => {
                    this.categories = data
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
