<template>
    <div
        class="image-component"
        :class="[
                parentClass,
                { 'is-empty': !hasImage }
            ]"
    >
        <img
            v-if="hasImage"
            class="image-component__img"
            :src="normalizedSrc"
            :alt="alt"
            @error="handleImageError"
        />

        <div
            v-else
            class="image-component__placeholder"
            role="img"
            :aria-label="placeholderText"
        >
            <span class="image-component__placeholder-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                    <path
                        d="M7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5Z"
                        fill="currentColor"
                    />
                    <path
                        d="M5 5.75C5 4.7835 5.7835 4 6.75 4H17.25C18.2165 4 19 4.7835 19 5.75V18.25C19 19.2165 18.2165 20 17.25 20H6.75C5.7835 20 5 19.2165 5 18.25V5.75Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                    />
                    <path
                        d="M6 16L9.29289 12.7071C9.68342 12.3166 10.3166 12.3166 10.7071 12.7071L12 14L13.7929 12.2071C14.1834 11.8166 14.8166 11.8166 15.2071 12.2071L18 15"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                    />
                </svg>
            </span>

            <span class="image-component__placeholder-text">
                {{ placeholderText }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

interface Props {
    src?: string | null;
    alt?: string;
    placeholderText?: string;
    parentClass?: string | Record<string, boolean>;
}

const props = withDefaults(defineProps<Props>(), {
    src: "",
    alt: "image",
    placeholderText: "No image",
});

const hasLoadError = shallowRef(false);

const normalizedSrc = computed(() => props.src?.trim() ?? "");
const hasImage = computed(() => {
    return normalizedSrc.value.length > 0 && !hasLoadError.value;
});

const handleImageError = () => {
    hasLoadError.value = true;
};

watch(
    () => props.src,
    () => {
        hasLoadError.value = false;
    },
);
</script>

<style scoped lang="scss">
.image-component {
    display: flex;
    width: 100%;
    min-height: 160px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid #d7deea;
    border-radius: 12px;
    background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);

    &.is-empty {
        border-style: dashed;
    }

    &__img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__placeholder {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        width: 100%;
        height: 100%;
        padding: 24px;
        color: #7c8798;
        text-align: center;
    }

    &__placeholder-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: rgba(124, 135, 152, 0.12);

        svg {
            width: 28px;
            height: 28px;
        }
    }

    &__placeholder-text {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.4;
    }
}
</style>
