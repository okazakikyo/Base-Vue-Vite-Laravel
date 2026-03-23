<template>
    <div
        v-bind="$attrs"
        class="selectbox"
        :class="{ disabled: $attrs.disabled }"
        :name="name"
        :tabindex="$attrs.disabled ? -1 : 0"
        @keydown="handleSelectKeydown"
        @click="toggleDropdown"
        ref="selectRef"
    >
        <div class="selected-value" :class="{ error: !!errorMessage }">
            <div class="text-seleceted" :class="{ 'placeholder_text': !hasValue }">
                {{ selectedLabel }}
            </div>
            <span class="arrow" :class="{ open: isOpen }">
                <img src="@/assets/icons/arrow-selectbox.svg" alt="" />
            </span>
        </div>

        <!-- Dropdown menu -->
        <ul
            v-if="isOpen"
            ref="dropdownRef"
            class="dropdown"
            :class="{
                'dropdown-up': position === 'up',
                'dropdown-down': position === 'down',
            }"
            :style="{ maxHeight: maxDropdownHeight + 'px' }"
        >
            <li
                v-for="(option, index) in filteredOptions"
                :key="option[valueKey]"
                ref="optionRefs"
                :tabindex="index === focusedIndex ? 0 : -1"
                :class="{
                    active: emitObject
                        ? modelValue && option[valueKey] === modelValue[valueKey]
                        : option[valueKey] === modelValue,
                    focused: index === focusedIndex
                }"
                @click.stop="selectOption(option)"
            >
                {{ option[labelKey] }}
            </li>
        </ul>
    </div>
    <ErrorMessage :errors="errors" :meta="meta" />
</template>

<script lang="ts" setup name="SelectBoxComponent">
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch, useAttrs } from "vue";
import { useField } from "vee-validate";
import ErrorMessage from "./ErrorMessage.vue";
import { isEmptyObject } from "@/utils/commonFunction";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    rules: {
        type: [String, Object],
        default: "",
    },
    modelValue: {
        type: [String, Number, Object, null],
        default: null,
    },
    emitObject: {
        type: Boolean,
        default: false,
    },
    options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: Array as () => Record<string, any>[],
        default: () => [],
    },
    labelKey: {
        type: String,
        default: "label",
    },
    valueKey: {
        type: String,
        default: "value",
    },
    placeholder: {
        type: String,
        default: "",
    },
    hideCurrentValue: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const {
    value,
    errorMessage,
    handleChange,
    errors,
    meta,
} = useField(() => props.name, props.rules, {
    initialValue: props.modelValue ?? null,
});
const attrs = useAttrs()
const isOpen = ref<boolean>(false);
const focusedIndex = ref<number>(-1)
const optionRefs = ref<HTMLElement[]>([])
const selectRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const position = ref<"up" | "down">("down");
const maxDropdownHeight = ref<number>(300);

const toggleDropdown = async () => {
    if (attrs.disabled) return
    isOpen.value = !isOpen.value;

    if (isOpen.value) {
        await nextTick();
        checkDropdownPosition();

        optionRefs.value[focusedIndex.value]?.focus()
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectOption = (option: Record<string, any>) => {
    const newValue = props.emitObject
        ? option
        : option[props.valueKey];

    handleChange(newValue);
    emit("update:modelValue", newValue);

    isOpen.value = false;
};

const hasValue = computed(() => {
    if (props.modelValue === "" || props.modelValue === null || props.modelValue === undefined || isEmptyObject(props.modelValue)) {
        return false;
    }
    if (props.emitObject) {
        return typeof props.modelValue === 'object';
    }

    const selected = props.options.find(
        (opt) => opt[props.valueKey] === props.modelValue
    );
    return !!selected;
});

const selectedLabel = computed(() => {
    if (props.modelValue === "" || props.modelValue === null || props.modelValue === undefined) {
        return props.placeholder;
    }
    if (props.emitObject && typeof props.modelValue === 'object') {
        const selected = props.options.find(
            (opt) => opt[props.valueKey] === props.modelValue[props.valueKey]
        );
        return (selected ? selected[props.labelKey] : props.modelValue[props.labelKey]) ?? props.placeholder
    }

    const selected = props.options.find(
        (opt) => opt[props.valueKey] === props.modelValue
    );
    return selected ? selected[props.labelKey] : props.placeholder;
});

// Filter options to hide current value if hideCurrentValue is true
const filteredOptions = computed(() => {
    if (!props.hideCurrentValue) {
        return props.options;
    }
    return props.options.filter(
        (opt) => opt[props.valueKey] !== props.modelValue
    );
});

const checkDropdownPosition = () => {
    if (!selectRef.value) return;
    const rect = selectRef.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Determine position (up or down)
    if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        position.value = "up";
        // Calculate max height for dropdown when opening upward
        // Leave some margin (20px) from top of viewport
        maxDropdownHeight.value = Math.min(spaceAbove - 20, 300);
    } else {
        position.value = "down";
        // Calculate max height for dropdown when opening downward
        // Leave some margin (20px) from bottom of viewport
        maxDropdownHeight.value = Math.min(spaceBelow - 20, 300);
    }

    // Ensure minimum height
    if (maxDropdownHeight.value < 100) {
        maxDropdownHeight.value = 100;
    }
};

const handleClickOutside = (e: MouseEvent) => {
    if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};

const scrollIntoView = () => {
    nextTick(() => {
            optionRefs.value[focusedIndex.value]?.scrollIntoView({
            block: 'nearest'
        })
    })
}


const handleSelectKeydown = async (e: KeyboardEvent) => {
    if (attrs.disabled) return

    switch (e.key) {
        case 'Enter':
            e.preventDefault()
            if (!isOpen.value) {
                await toggleDropdown()
            } else if (focusedIndex.value >= 0) {
                selectOption(filteredOptions.value[focusedIndex.value])
                nextTick(() => selectRef.value?.focus())
            }
            break

        case ' ':
            e.preventDefault()
            if (!isOpen.value) await toggleDropdown()
            break

        case 'ArrowDown':
            e.preventDefault()
            if (!isOpen.value) {
                await toggleDropdown()
            } else {
                focusedIndex.value = Math.min(
                    focusedIndex.value + 1,
                    filteredOptions.value.length - 1
                )
                scrollIntoView()
            }
            break

        case 'ArrowUp':
            e.preventDefault()
            if (isOpen.value) {
                focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
                scrollIntoView()
            }
            break

        case 'Escape':
            isOpen.value = false
            break

        case 'Tab':
            isOpen.value = false
            break
    }
}

watch(
    () => props.modelValue,
    (val) => {
        value.value = val;
    }
);

watch(
    () => isOpen.value,
    (val) => {
        if (!val) focusedIndex.value = -1;
    }
);

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", checkDropdownPosition);
});
onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener("resize", checkDropdownPosition);
});
</script>

<style lang="scss" scoped>
.selectbox {
    cursor: pointer;
    position: relative;
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    user-select: none;
    color: #202325;
    &:focus-visible {
        outline: 2px solid #333F69;
        border-radius: 8px;
    }
    &.disabled {
        pointer-events: none;
        .selected-value {
            border-radius: 8px;
            border: 1px solid #E3E5E5;
            background-color: #CDCFD0;
            color: #4A5565;
        }
        .arrow {
            img {
                opacity: 0;
            }
        }
    }
}

.selected-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background-color: #FFF;
    font-weight: 400;
    border-radius: 8px;
    border: 1px solid #E3E5E5;
    min-height: 46px;
    &.error {
        border: 2px solid #F22211 !important;
    }
    .text-seleceted {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.placeholder_text {
            color: #86909C;
        }
    }
}

.arrow {
    flex-shrink: 0;
    margin-left: auto;
    transition: transform 0.2s ease;
}

.arrow.open {
    transform: rotate(180deg);
}

.dropdown {
    position: absolute;
    background: #fefefe;
    border: 1px solid #e6e6e7;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    z-index: 1000;
    max-height: 300px; /* Default max height, can be overridden by inline style */
    width: 100%;
    overflow-y: auto;
    padding: 0;
    border-radius: 6px;
    margin-bottom: 0;
}

.dropdown-down {
    top: 110%;
    right: 0;
}

.dropdown-up {
    bottom: 100%;
    right: 0;
}

.dropdown li {
    padding: 10px 18px;
    cursor: pointer;
    &::marker {
        content: "";
    }
}

.dropdown li:hover {
    background-color: #eaf3ff;
}

.dropdown li.active {
    background-color: rgba(0, 102, 255, 0.1);
    font-weight: 400;
}

.dropdown li.focused,
.dropdown li:focus {
    background-color: rgba(0, 102, 255, 0.1);
    outline: none;
}
</style>
