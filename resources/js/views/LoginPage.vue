<script lang="ts" setup>
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { useFormErrorHandler } from "@/utils/useFormHandler";
import { useForm } from "vee-validate";
import { computed, defineAsyncComponent, ref } from "vue";

const InputComponent = defineAsyncComponent(
    () => import("@/components/InputComponent.vue"),
);

const storeAuth = useAuthStore();
const loginMutation = storeAuth.login();
const { mutate, isPending, error, isError } = loginMutation;
const formData = ref({
    email: "",
    password: "",
});

const { onInvalidSubmitError } = useFormErrorHandler();
const { handleSubmit } = useForm();

const submitLabel = computed(() => {
    return isPending.value ? "Dang dang nhap..." : "Dang nhap";
});

const onSubmit = handleSubmit(() => {
    mutate(formData.value, {
        onSuccess: () => {
            router.push({ name: "Home" });
        },
        onError: (errorCatch) => {
            console.log("errorCatch", errorCatch);
        },
    });
}, onInvalidSubmitError);
</script>

<template>
    <section class="login-page">
        <div class="login-page__panel login-page__panel--accent">
            <span class="login-page__eyebrow">Laravel + Vue workspace</span>
            <h1 class="login-page__title">Dang nhap de tiep tuc lam viec</h1>
            <p class="login-page__description">
                Mình đã chỉnh lại bo cuc trang theo huong sach se, de nhin va de tap
                trung hon vao form dang nhap.
            </p>

            <div class="login-page__feature-list">
                <div class="login-page__feature-item">
                    <strong>UI ro rang</strong>
                    <span>Khoang trang va nhom thong tin duoc phan tach tot hon.</span>
                </div>
                <div class="login-page__feature-item">
                    <strong>Tap trung thao tac</strong>
                    <span>Form dang nhap dat o vi tri trung tam, de scan va nhap lieu.</span>
                </div>
                <div class="login-page__feature-item">
                    <strong>Dong bo giao dien</strong>
                    <span>Mau sac, nen va card da duoc lam lai theo cung mot theme.</span>
                </div>
            </div>
        </div>

        <div class="login-page__panel login-page__panel--form">
            <div class="login-page__form-head">
                <span class="login-page__eyebrow">Sign in</span>
                <h2 class="login-page__form-title">Chao mung ban quay lai</h2>
                <p class="login-page__form-copy">
                    Su dung tai khoan cua ban de truy cap trang quan tri va tiep tuc
                    cong viec dang thuc hien.
                </p>
            </div>

            <form class="login-page__form" @submit.prevent="onSubmit">
                <div class="login-page__field">
                    <label for="email" class="login-page__label">Email address</label>
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

                <div class="login-page__field">
                    <label for="password" class="login-page__label">Password</label>
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

                <button
                    type="submit"
                    :disabled="isPending"
                    class="login-page__submit"
                >
                    {{ submitLabel }}
                </button>

                <div v-if="isError" class="login-page__error">
                    {{ error }}
                </div>
            </form>
        </div>
    </section>
</template>

<style scoped lang="scss">
.login-page {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
    gap: 28px;
    align-items: stretch;
    width: min(1080px, 100%);
    min-height: 100vh;
    margin: 0 auto;
    padding: 32px 20px;

    &__panel {
        position: relative;
        overflow: hidden;
        border-radius: 30px;
        border: 1px solid rgba(191, 203, 220, 0.86);
        box-shadow: 0 24px 60px rgba(21, 33, 56, 0.1);
    }

    &__panel--accent {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        min-height: 620px;
        padding: 36px;
        background:
            radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(255, 216, 117, 0.18), transparent 30%),
            linear-gradient(160deg, #1b2c49 0%, #274d7c 48%, #3e6fb3 100%);
        color: #f7fbff;
    }

    &__panel--form {
        padding: 36px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
    }

    &__eyebrow {
        display: inline-flex;
        margin-bottom: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        color: rgba(237, 243, 255, 0.8);
    }

    &__panel--form &__eyebrow {
        color: #60708a;
    }

    &__title {
        margin: 0;
        max-width: 460px;
        font-size: clamp(2.2rem, 3vw, 3.5rem);
        line-height: 1.04;
        font-weight: 700;
    }

    &__description {
        margin: 16px 0 0;
        max-width: 520px;
        font-size: 1rem;
        line-height: 1.8;
        color: rgba(241, 246, 255, 0.84);
    }

    &__feature-list {
        display: grid;
        gap: 14px;
        margin-top: 34px;
    }

    &__feature-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 16px 18px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(6px);

        strong {
            font-size: 1rem;
            font-weight: 700;
        }

        span {
            font-size: 0.94rem;
            line-height: 1.6;
            color: rgba(240, 246, 255, 0.8);
        }
    }

    &__form-head {
        margin-bottom: 28px;
    }

    &__form-title {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: #172134;
    }

    &__form-copy {
        margin: 12px 0 0;
        font-size: 0.98rem;
        line-height: 1.75;
        color: #5b677b;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__label {
        font-size: 0.95rem;
        font-weight: 700;
        color: #23304a;
    }

    &__submit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 54px;
        margin-top: 6px;
        padding: 0 18px;
        border: 0;
        border-radius: 16px;
        background: linear-gradient(135deg, #2448b8 0%, #3266e3 100%);
        box-shadow: 0 18px 30px rgba(50, 102, 227, 0.24);
        color: #ffffff;
        font-size: 0.98rem;
        font-weight: 700;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;

        &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 20px 34px rgba(50, 102, 227, 0.28);
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
    }

    &__error {
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(242, 34, 17, 0.08);
        color: #bc2f24;
        font-size: 0.94rem;
        line-height: 1.6;
    }

    :deep(.form-control) {
        min-height: 52px;
        padding: 14px 16px;
        border: 1px solid #d9e0ea;
        border-radius: 14px;
        background: #fbfcfe;
        box-shadow: none;
    }

    :deep(.form-control:focus) {
        border-color: #7b95e8;
        box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.12);
    }
}

@media (max-width: 991px) {
    .login-page {
        grid-template-columns: 1fr;
        min-height: auto;

        &__panel--accent {
            min-height: 420px;
        }
    }
}

@media (max-width: 640px) {
    .login-page {
        padding-inline: 16px;

        &__panel--accent,
        &__panel--form {
            padding: 24px;
            border-radius: 24px;
        }

        &__title {
            font-size: 2rem;
        }

        &__form-title {
            font-size: 1.7rem;
        }
    }
}
</style>
