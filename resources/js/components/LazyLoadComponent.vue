<script setup lang="ts">
import {
    computed,
    onBeforeUnmount,
    onMounted,
    shallowRef,
    useTemplateRef,
} from "vue";

interface Props {
    minHeight?: number | string;
    once?: boolean;
    placeholderText?: string;
    rootMargin?: string;
    threshold?: number | number[];
}

const props = withDefaults(defineProps<Props>(), {
    minHeight: 180,
    once: true,
    placeholderText: "Dang tai noi dung...",
    rootMargin: "160px 0px",
    threshold: 0.1,
});

const emit = defineEmits<{
    visible: [];
}>();

const containerRef = useTemplateRef<HTMLDivElement>("container");
const isVisible = shallowRef(false);
const hasRendered = shallowRef(false);
const normalizedMinHeight = computed(() => {
    return typeof props.minHeight === "number"
        ? `${props.minHeight}px`
        : props.minHeight;
});
const shouldRender = computed(() => {
    return props.once ? hasRendered.value : isVisible.value;
});

let observer: IntersectionObserver | null = null;

const disconnectObserver = () => {
    observer?.disconnect();
    observer = null;
};

const handleIntersect = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];

    if (!entry) {
        return;
    }

    if (entry.isIntersecting) {
        isVisible.value = true;

        if (!hasRendered.value) {
            hasRendered.value = true;
            emit("visible");
        }

        if (props.once) {
            disconnectObserver();
        }

        return;
    }

    if (!props.once) {
        isVisible.value = false;
    }
};

onMounted(() => {
    if (typeof window === "undefined") {
        isVisible.value = true;
        hasRendered.value = true;
        return;
    }

    if (!("IntersectionObserver" in window) || !containerRef.value) {
        isVisible.value = true;
        hasRendered.value = true;
        return;
    }

    observer = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: props.rootMargin,
        threshold: props.threshold,
    });

    observer.observe(containerRef.value);
});

onBeforeUnmount(() => {
    disconnectObserver();
});
</script>

<template>
    <div ref="container" class="lazy-load-component">
        <slot v-if="shouldRender" />

        <slot v-else name="placeholder">
            <div
                class="lazy-load-component__placeholder"
                :style="{ minHeight: normalizedMinHeight }"
                role="status"
                :aria-label="placeholderText"
            >
                <span class="lazy-load-component__pulse" aria-hidden="true" />
                <span class="lazy-load-component__text">{{ placeholderText }}</span>
            </div>
        </slot>
    </div>
</template>

<style scoped lang="scss">
.lazy-load-component {
    display: block;
    width: 100%;

    &__placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        width: 100%;
        padding: 20px;
        border: 1px dashed #c8d3e2;
        border-radius: 20px;
        background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(244, 247, 252, 0.86));
        color: #708099;
        text-align: center;
    }

    &__pulse {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: linear-gradient(135deg, #c7d6f5 0%, #e6ecf8 100%);
        animation: lazy-load-pulse 1.8s ease-in-out infinite;
    }

    &__text {
        font-size: 0.92rem;
        font-weight: 600;
        line-height: 1.5;
    }
}

@keyframes lazy-load-pulse {
    0%,
    100% {
        opacity: 0.45;
        transform: scale(0.94);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
