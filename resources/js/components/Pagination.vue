<template>
    <div class="pagination-container">
        <div class="pagination-info">
            {{ pagination.current_page }}/{{ totalPages }}
        </div>
        <div class="pagination-controls">
            <button
                class="pagination-btn"
                @click="goToPage(pagination.current_page - 1)"
                :disabled="pagination.current_page === 1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="21" viewBox="0 0 11 21" fill="none">
                    <path d="M10 1L1 10.5L10 20" stroke="currentColor"/>
                </svg>
            </button>
            <button
                class="pagination-btn"
                @click="goToPage(pagination.current_page + 1)"
                :disabled="pagination.current_page === totalPages"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="21" viewBox="0 0 11 21" fill="none">
                    <path d="M1 20L10 10.5L1 1" stroke="currentColor"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { Pagination } from '@/types/index';

export default defineComponent({
    name: 'AppPagination',
    props: {
        pagination: {
            type: Object as () => Pagination,
            required: true
        }
    },
    emits: ['update:page'],
    setup(props, { emit }) {
        // Calculate totalPages from pagination
        const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.per_page) || 1);

        const goToPage = (page: number) => {
            if (page >= 1 && page <= totalPages.value) {
                emit('update:page', page);
            }
        };

        return {
            goToPage,
            totalPages
        };
    }
});
</script>

<style lang="scss" scoped>
.pagination-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
    padding: 10px 0;
}

.pagination-info {
    font-family: "Noto Sans", sans-serif;
    font-size: 14px;
    color: #333;
}

.pagination-controls {
    display: flex;
    gap: 8px;
}

.pagination-btn {
    background: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;

    &:hover:not(:disabled) {
        background-color: #f0f0f0;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        color: #C5C5C5;
    }

    svg {
        width: 11px;
        height: 21px;
    }
}
</style>
