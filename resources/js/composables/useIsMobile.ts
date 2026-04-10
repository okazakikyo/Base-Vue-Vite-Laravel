// composables/useIsMobile.ts
import { onBeforeUnmount, onMounted, ref } from "vue";

const MOBILE_MAX_WIDTH_PX = 768;

export function useIsMobile(maxWidth: number = MOBILE_MAX_WIDTH_PX) {
    const isMobile = ref(false);

    const update = () => {
        if (typeof window === "undefined") return;
        isMobile.value = window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
    };

    onMounted(() => {
        update();
        window.addEventListener("resize", update, { passive: true });
    });

    onBeforeUnmount(() => window.removeEventListener("resize", update));

    return { isMobile };
}
