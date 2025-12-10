<template>
    <div
        class="form-group"
        :class="[
            parentClass,
            {
                'limit-length': showMaxLength,
                'has-clear-icon': hasClearIcon,
                'has-close-limit': showMaxLength && hasClearIcon,
            },
        ]"
    >
        <label v-if="labelText" :for="name" class="form-label">
            {{ labelText }}
        </label>
        <div class="position-relative">
            <input
                v-bind="$attrs"
                :id="name"
                :name="name"
                :class="[
                    childClass,
                    { 'error': errors[0] && meta.touched, 'form-input': true },
                ]"
                :type="typeInput"
                :style="styles"
                :maxlength="maxlength"
                :error="errorHandler(errors, meta)"
                :value="inputValue"
                @input="handleInput"
                @blur="handleBlur"
            />
            <div
                v-if="showMaxLength"
                class="char-count"
                :class="{ 'has-clear-icon': hasClearIcon }"
            >
                {{
                    (isNormalInput
                        ? inputValue.toString().length
                        : calculateWidthText(inputValue.toString())) ?? 0
                }}/{{ maxInput }}
            </div>
            <button
                v-if="hasEyeIcon"
                type="button"
                class="password-toggle icon-handler"
                :class="{ 'pointer-events-none': readonly }"
                @click="togglePassword"
            >
                <!-- <img
                    class=""
                    :src="typeInput === 'password' ? eyeShowIcon : eyeHideIcon"
                /> -->
            </button>
        </div>
        <ErrorMessage :errors="errors" :meta="meta" />
    </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { ref, onMounted, toRef, watch, defineAsyncComponent } from "vue";
// import eyeShowIcon from "@/assets/icons/eye-show.svg";
// import eyeHideIcon from "@/assets/icons/eye-hide.svg";
const ErrorMessage = defineAsyncComponent(() => import('@/components/ErrorMessage.vue'));

interface VeeValidateMeta {
    touched: boolean;
    dirty: boolean;
    valid: boolean;
    validated: boolean;
    pending: boolean;
}

interface Props {
    type: "text" | "password" | "number" | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rules?: any;
    value?: string;
    name: string;
    modelValue?: string | null;
    labelText?: string;
    styles?: Record<string, string> | string;
    childClass?: string | Record<string, boolean>;
    parentClass?: string | Record<string, boolean>;
    maxlength?: string | number;
    maxInput?: string | number;
    readonly?: boolean;
    hasEyeIcon?: boolean;
    hasClearIcon?: boolean;
    showMaxLength?: boolean;
    isNormalInput?: boolean;
}

interface Emits {
    (event: "update:modelValue", value: string): void;
    (event: "update:handleRemove", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
    rules: "",
    value: "",
    modelValue: "",
    styles: "",
    parentClass: "",
    childClass: "",
    maxInput: "",
    maxlength: "",
    isNormalInput: true,
});
const emit = defineEmits<Emits>();

const name = toRef(props, "name");

watch(
    () => props.value,
    (newValue) => {
        setValue(newValue ?? "");
    },
    { immediate: false },
);

const {
    value: inputValue,
    errorMessage,
    handleBlur: veeHandleBlur,
    handleChange,
    meta,
    errors,
    setValue,
    validate,
} = useField(name, props.rules, {
    initialValue: props.value || props.modelValue || "",
});

const typeInput = ref<string>("text");

const handleBlur = async (event: Event) => {
    await veeHandleBlur(event);
    await validate();
};

const calculateWidthText = (text: string): number => {
    let totalLength = 0;
    if (!text) return 0;

    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (char.match(/\p{ASCII}/u)) {
            // half-width
            totalLength += 2;
        } else {
            // full-width
            totalLength += 1;
        }
    }
    return totalLength;
};

const togglePassword = () => {
    typeInput.value = typeInput.value === "text" ? "password" : "text";
};

const errorHandler = (errors: string[], meta: VeeValidateMeta) => {
    if (typeInput.value === "password") {
        return errors[0] ? true : false;
    }
    return errors[0] && meta.touched;
};

const handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;

    if (props.type === "number" && target?.value) {
        const sanitized = target.value.replace(/\D/g, "");
        target.value = sanitized;
    }
    target.value = target.value.replace(/[\u{10000}-\u{10FFFF}]/gu, "");

    if (
        props.rules?.maxLength ||
        props.rules?.url1 ||
        props.rules?.maxLengthKeyWord
    ) {
        meta.touched = true;
    }
    const maxLength = props?.maxlength as number;
    if (maxLength && target.value?.length > maxLength) {
        target.value = target.value.slice(0, maxLength);
    }

    handleChange(target.value);

    emit("update:modelValue", target.value);
};

onMounted(() => {
    typeInput.value = props.type;

    // Initialize with prop values
    if (props.value && props.value !== undefined) {
        inputValue.value = props.value;
    } else if (props.modelValue && props.modelValue !== undefined) {
        inputValue.value = String(props.modelValue);
    }
});

// Expose for parent component access if needed
defineExpose({
    inputValue,
    errorMessage,
    meta,
    validate: () => handleChange(inputValue.value),
});
</script>

<style lang="scss">
.form-group {
    position: relative;
    width: 100%;


    &.limit-length {
        input {
            padding-right: 50px;
        }
    }
    &.has-clear-icon {
        input {
            padding-right: 24px;
        }
    }
    &.has-close-limit {
        input {
            padding-right: 70px;
        }
    }
    .char-count {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        &.has-clear-icon {
            right: 28px;
        }
    }
    .password-toggle {
        border: unset;
        background: unset;
        padding: 0;
    }
    .icon-handler {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
}

.show-error {
    display: block;
    transform: translateY(0);
    animation: slideIn 0.5s forwards;
    img {
        height: 13px;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-100%);
        z-index: -1;
    }

    to {
        transform: translateY(0);
        z-index: 1;
    }
}
</style>
