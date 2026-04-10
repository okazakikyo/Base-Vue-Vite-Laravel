<script setup lang="ts">
import { computed } from "vue";

interface OptionItem {
    label: string;
    value: string;
}

interface Props {
    keyword: string;
    level: string;
    levels: string[];
    resultCount: number;
    sourceType: string;
    sources: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    shuffle: [];
    "update:keyword": [string];
    "update:level": [string];
    "update:sourceType": [string];
}>();

const normalizeOptionLabel = (value: string): string => {
    if (value === "all") {
        return "Tat ca";
    }

    if (value === "github") {
        return "GitHub";
    }

    if (value === "local") {
        return "Local";
    }

    return value;
};

const buildOptions = (values: string[]): OptionItem[] => {
    return ["all", ...values].map((value) => ({
        label: normalizeOptionLabel(value),
        value,
    }));
};

const levelOptions = computed(() => buildOptions(props.levels));
const sourceOptions = computed(() => buildOptions(props.sources));
</script>

<template>
    <div class="interview-filter-bar">
        <div class="interview-filter-bar__field interview-filter-bar__field--wide">
            <label class="interview-filter-bar__label" for="interview-keyword">
                Tim theo tu khoa
            </label>
            <input
                id="interview-keyword"
                class="interview-filter-bar__input"
                :value="keyword"
                type="text"
                placeholder="Nhap keyword, tag, focus..."
                @input="
                    emit(
                        'update:keyword',
                        ($event.target as HTMLInputElement).value,
                    )
                "
            />
        </div>

        <div class="interview-filter-bar__field">
            <label class="interview-filter-bar__label" for="interview-level">
                Level
            </label>
            <select
                id="interview-level"
                class="interview-filter-bar__select"
                :value="level"
                @change="
                    emit(
                        'update:level',
                        ($event.target as HTMLSelectElement).value,
                    )
                "
            >
                <option
                    v-for="option in levelOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div class="interview-filter-bar__field">
            <label class="interview-filter-bar__label" for="interview-source">
                Nguon
            </label>
            <select
                id="interview-source"
                class="interview-filter-bar__select"
                :value="sourceType"
                @change="
                    emit(
                        'update:sourceType',
                        ($event.target as HTMLSelectElement).value,
                    )
                "
            >
                <option
                    v-for="option in sourceOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div class="interview-filter-bar__actions">
            <span class="interview-filter-bar__count">{{ resultCount }} ket qua</span>
            <button
                type="button"
                class="interview-filter-bar__button"
                @click="emit('shuffle')"
            >
                Random lai
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.interview-filter-bar {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(150px, 0.65fr)) auto;
    gap: 14px;
    align-items: end;

    &__field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__field--wide {
        min-width: 0;
    }

    &__label,
    &__count {
        font-size: 0.88rem;
        line-height: 1.4;
        font-weight: 700;
        color: #5f6d86;
    }

    &__input,
    &__select {
        width: 100%;
        min-height: 48px;
        padding: 0 14px;
        border: 1px solid rgba(193, 205, 221, 0.92);
        border-radius: 14px;
        background: #fbfcfe;
        color: #22324d;
        font-size: 0.94rem;
        outline: 0;

        &:focus {
            border-color: #4068e8;
            box-shadow: 0 0 0 4px rgba(64, 104, 232, 0.12);
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    &__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0 16px;
        border: 0;
        border-radius: 14px;
        background: rgba(64, 104, 232, 0.1);
        color: #355fe5;
        font-size: 0.92rem;
        font-weight: 700;
    }
}

@media (max-width: 980px) {
    .interview-filter-bar {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        &__actions {
            justify-content: flex-start;
        }
    }
}

@media (max-width: 640px) {
    .interview-filter-bar {
        grid-template-columns: 1fr;
    }
}
</style>
