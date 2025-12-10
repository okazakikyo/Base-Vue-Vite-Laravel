<template>
    <div class="">
        <h2>LOGIN</h2>
        <form class="" @submit="onSubmit" @invalid-submit="onInvalidSubmitError">
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <InputComponent
                    v-model="formData.email"
                    :childClass="'form-control'"
                    :name="'email'"
                    :placeholder="'Email'"
                    :type="'email'"
                    :rules="{ required: true, email: true }"
                    :value="formData.email"
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <InputComponent
                    v-model="formData.password"
                    :childClass="'form-control'"
                    :name="'password'"
                    :placeholder="'Password'"
                    :type="'password'"
                    :rules="{ required: true }"
                    :value="formData.password"
                />
            </div>
            <button type="submit" :disabled="isPending" class="btn btn-primary">Submit</button>
            <div class="" v-if="isError">
                {{ error }}
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { useFormErrorHandler } from '@/utils/useFormHandler';
import { useForm } from 'vee-validate';

const InputComponent = defineAsyncComponent(() => import('@/components/InputComponent.vue'));

const storeAuth = useAuthStore();
const loginMutation = storeAuth.login();
const { mutate, isPending, error, isError } = loginMutation
const formData = ref({
    email: '',
    password: ''
})

const { onInvalidSubmitError } = useFormErrorHandler();
const { handleSubmit } = useForm();

const onSubmit = handleSubmit(() => {
    mutate(formData.value, {
        onSuccess: () => {
            router.push({ name: 'Home' });
        },
        onError: (errorCatch) => {
            console.log('errorCatch', errorCatch);
        }
    });
}, onInvalidSubmitError);
</script>
