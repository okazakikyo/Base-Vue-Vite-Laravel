<script setup lang="ts">
import type {
    InterviewRoleGroup,
    InterviewRoleId,
} from "@/shared/constants/interview";

interface Props {
    modelValue: InterviewRoleId;
    roles: InterviewRoleGroup[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:modelValue": [InterviewRoleId];
}>();

const updateRole = (roleId: InterviewRoleId) => {
    if (roleId === props.modelValue) {
        return;
    }

    emit("update:modelValue", roleId);
};
</script>

<template>
    <div class="interview-role-selector">
        <button
            v-for="role in roles"
            :key="role.id"
            type="button"
            class="interview-role-selector__item"
            :class="{ 'is-active': role.id === modelValue }"
            @click="updateRole(role.id)"
        >
            <span class="interview-role-selector__label">{{ role.label }}</span>
            <span class="interview-role-selector__summary">{{ role.summary }}</span>
        </button>
    </div>
</template>

<style scoped lang="scss">
.interview-role-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;

    &__item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 110px;
        padding: 16px;
        border: 1px solid rgba(193, 205, 221, 0.88);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.88);
        color: #22324d;
        text-align: left;
        transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-1px);
            border-color: rgba(73, 109, 231, 0.28);
            box-shadow: 0 16px 28px rgba(38, 55, 90, 0.08);
        }

        &.is-active {
            border-color: #4068e8;
            background: linear-gradient(
                135deg,
                rgba(64, 104, 232, 0.12),
                rgba(64, 104, 232, 0.04)
            );
            box-shadow: 0 16px 28px rgba(64, 104, 232, 0.14);
        }
    }

    &__label {
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.4;
    }

    &__summary {
        font-size: 0.9rem;
        line-height: 1.6;
        color: #62718c;
    }
}
</style>
