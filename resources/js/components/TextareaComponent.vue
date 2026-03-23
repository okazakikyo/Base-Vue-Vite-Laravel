<template>
    <div
        class="form-group textarea-group"
        :class="[
            parentClass,
            {
                'limit-length': showMaxLength,
            },
        ]"
    >
        <label v-if="labelText" :for="name" class="form-label">
            {{ labelText }}
        </label>

        <div class="position-relative">
            <textarea
                v-bind="$attrs"
                :id="name"
                :name="name"
                :class="[
                    childClass,
                    { error: errors[0] && meta.touched, 'form-textarea': true },
                ]"
                :style="styles"
                :maxlength="maxlength"
                :placeholder="normalizedPlaceholder"
                :readonly="readonly"
                :value="inputValue"
                @compositionstart="isComposing = true"
                @compositionend="handleCompositionEnd"
                @input="handleInput"
                @blur="handleBlur"
            />

            <div v-if="showMaxLength" class="char-count">
                {{
                    (isNormalInput
                        ? inputValue.toString().length
                        : calculateWidthText(inputValue.toString())) ?? 0
                }}/{{ maxInput }}
            </div>
        </div>

        <ErrorMessage :errors="errors" :meta="meta" />
    </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { computed, onMounted, ref, toRef, watch } from "vue";
import ErrorMessage from "./ErrorMessage.vue";

interface Props {
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
    placeholder?: string;
    readonly?: boolean;
    showMaxLength?: boolean;
    isNormalInput?: boolean;
}

interface Emits {
    (event: "update:modelValue", value: string): void;
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
const isComposing = ref<boolean>(false);

watch(
    () => props.value,
    (newValue) => {
        setValue(newValue ?? "");
    },
);

const {
    value: inputValue,
    handleBlur: veeHandleBlur,
    handleChange,
    meta,
    errors,
    setValue,
    validate,
} = useField(name, props.rules, {
    initialValue: props.value || props.modelValue || "",
});

const normalizedPlaceholder = computed(() =>
  props.placeholder?.replace(/&#10;|&#xA;/g, "\n")
)

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
            totalLength += 2;
        } else {
            totalLength += 1;
        }
    }
    return totalLength;
};

const handleCompositionEnd = (event: CompositionEvent) => {
    isComposing.value = false

    const target = event.target as HTMLInputElement
    const maxLength = Number(props.maxlength)

    if (maxLength && target.value.length > maxLength) {
        target.value = target.value.slice(0, maxLength)
    }

    // sync lại cho vee-validate + v-model
    handleChange(target.value)
    emit("update:modelValue", target.value)
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;

    if (isComposing.value) {
        handleChange(target.value)
        emit("update:modelValue", target.value)
        return
    }

    // remove emoji / surrogate pairs
    target.value = target.value.replace(/[\u{10000}-\u{10FFFF}]/gu, "");

    if (props.rules?.maxLength || props.rules?.maxLengthKeyWord) {
        meta.touched = true;
    }

    const maxLength = props.maxlength as number;
    if (maxLength && target.value.length > maxLength) {
        target.value = target.value.slice(0, maxLength);
    }

    handleChange(target.value);
    emit("update:modelValue", target.value);
};

onMounted(() => {
    if (props.value) {
        inputValue.value = props.value;
    } else if (props.modelValue) {
        inputValue.value = String(props.modelValue);
    }
});

defineExpose({
    inputValue,
    meta,
    validate: () => handleChange(inputValue.value),
});
</script>

<style lang="scss">
.textarea-group {
    textarea {
        width: 100%;
        height: 80px;
        padding: 16px;
        border: 1px solid #E3E5E5;
        border-radius: 8px;
        resize: none;
        font-family: 'Noto Sans JP';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 150%;
        color: #0A0A0A;

        &:focus {
            outline: 2px solid #333f69;
        }

        &::placeholder {
            color: #979c9e;
        }

        &:disabled {
            background: #CDCFD0;
        }
    }
}

.form-textarea {
    &.error {
        outline: 2px solid #f22211;
    }
}
</style>
