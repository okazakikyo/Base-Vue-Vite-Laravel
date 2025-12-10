<template>
    <div
        v-if="props.errors[0] && meta.touched"
        class="error-message show-error"
    >
        {{ errors[0] }}
    </div>
</template>

<script lang="ts" setup name="ErrorMessage">
interface VeeValidateMeta {
    touched: boolean;
    dirty: boolean;
    valid: boolean;
    validated: boolean;
    pending: boolean;
}

interface Props {
    errors: string[];
    meta: VeeValidateMeta;
}

const props = defineProps<Props>();
</script>
