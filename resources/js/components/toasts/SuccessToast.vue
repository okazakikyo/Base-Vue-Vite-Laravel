<template>
    <div class="toast__content">
        <div class="">
            {{ props.message }}
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    message: string;
}
const props = withDefaults(defineProps<Props>(), {
    message: '',
});
</script>
<style lang="scss">
:root {
    --toastify-toast-min-height: 28px;
    --toastify-color-progress-success: unset;
}

.Toastify__toast-container {
    width: fit-content;
}

.Toastify__toast {
    border-radius: 8px;
    background: var(--mono-400, #8a8a8a);
    width: fit-content;
    text-align: center;
    margin-left: auto;
    margin-right: auto;

    .Toastify__toast-body {
        margin: 0;
        padding: 0 20px;

        .toast__content {
            color: #fff;
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: 12px;
            word-break: break-all;
        }
    }
}
</style>
