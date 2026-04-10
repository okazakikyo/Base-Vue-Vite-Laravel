<template>
    <div class="ocr-page">
        <div class="ocr-page__container">
            <OcrScanner />
        </div>
    </div>
</template>

<script setup lang="ts">
import OcrScanner from '@/components/ocr/OcrScanner.vue';
</script>

<style scoped lang="scss">
.ocr-page {
    padding: 24px;
    min-height: calc(100vh - 64px);
    background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);

    &__container {
        max-width: 900px;
        margin: 0 auto;
    }
}
</style>
