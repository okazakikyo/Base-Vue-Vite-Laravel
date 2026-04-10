<script setup lang="ts">
import type { InterviewQuestionItem } from "@/shared/constants/interview";
import { computed, shallowRef, watch } from "vue";

interface Props {
    questions: InterviewQuestionItem[];
}

const props = defineProps<Props>();
const openedQuestionId = shallowRef<string | null>(null);

watch(
    () => props.questions,
    (questions) => {
        openedQuestionId.value = questions[0]?.id ?? null;
    },
    { immediate: true },
);

const visibleQuestions = computed(() => props.questions);

const toggleQuestion = (questionId: string) => {
    openedQuestionId.value =
        openedQuestionId.value === questionId ? null : questionId;
};
</script>

<template>
    <div class="interview-question-accordion">
        <div
            v-if="visibleQuestions.length === 0"
            class="interview-question-accordion__empty"
        >
            Khong co cau hoi nao khop voi filter hien tai.
        </div>

        <article
            v-for="question in visibleQuestions"
            :key="question.id"
            class="interview-question-accordion__item"
            :class="{ 'is-open': openedQuestionId === question.id }"
        >
            <button
                type="button"
                class="interview-question-accordion__trigger"
                @click="toggleQuestion(question.id)"
            >
                <div class="interview-question-accordion__trigger-copy">
                    <div class="interview-question-accordion__chips">
                        <span class="interview-question-accordion__chip">
                            {{ question.level }}
                        </span>
                        <span class="interview-question-accordion__chip is-soft">
                            {{ question.focus }}
                        </span>
                    </div>
                    <h3 class="interview-question-accordion__question">
                        {{ question.question }}
                    </h3>
                </div>
                <span class="interview-question-accordion__icon">+</span>
            </button>

            <div
                v-if="openedQuestionId === question.id"
                class="interview-question-accordion__body"
            >
                <p class="interview-question-accordion__answer">
                    {{ question.answer }}
                </p>

                <a
                    v-if="question.sourceUrl"
                    class="interview-question-accordion__source"
                    :href="question.sourceUrl"
                    target="_blank"
                    rel="noreferrer"
                >
                    {{ question.sourceLabel ?? "Mo nguon tham khao" }}
                </a>

                <div class="interview-question-accordion__tags">
                    <span
                        v-for="tag in question.tags"
                        :key="tag"
                        class="interview-question-accordion__tag"
                    >
                        {{ tag }}
                    </span>
                </div>
            </div>
        </article>
    </div>
</template>

<style scoped lang="scss">
.interview-question-accordion {
    display: flex;
    flex-direction: column;
    gap: 14px;

    &__empty {
        padding: 22px;
        border: 1px solid rgba(193, 205, 221, 0.86);
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.92);
        color: #556176;
        font-size: 0.96rem;
        line-height: 1.8;
        text-align: center;
    }

    &__item {
        border: 1px solid rgba(193, 205, 221, 0.86);
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 18px 36px rgba(32, 47, 80, 0.06);

        &.is-open {
            border-color: rgba(64, 104, 232, 0.26);
            box-shadow: 0 18px 36px rgba(64, 104, 232, 0.08);
        }

        &.is-open .interview-question-accordion__icon {
            transform: rotate(45deg);
            color: #4068e8;
        }
    }

    &__trigger {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        width: 100%;
        padding: 20px;
        border: 0;
        background: transparent;
        text-align: left;
    }

    &__trigger-copy {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__chips,
    &__tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    &__chip,
    &__tag {
        display: inline-flex;
        align-items: center;
        min-height: 30px;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 700;
    }

    &__chip {
        background: rgba(64, 104, 232, 0.1);
        color: #355fe5;

        &.is-soft {
            background: rgba(23, 161, 97, 0.1);
            color: #19895a;
        }
    }

    &__tag {
        background: #f2f5fa;
        color: #5f6d86;
    }

    &__question {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.6;
        font-weight: 700;
        color: #172134;
    }

    &__icon {
        flex-shrink: 0;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #f4f7fb;
        color: #5f6d86;
        font-size: 1.5rem;
        line-height: 38px;
        text-align: center;
        transition:
            transform 0.2s ease,
            color 0.2s ease;
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 0 20px 20px;
    }

    &__answer {
        margin: 0;
        font-size: 0.97rem;
        line-height: 1.8;
        color: #4f5d75;
    }

    &__source {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        min-height: 36px;
        padding: 0 14px;
        border-radius: 999px;
        background: rgba(64, 104, 232, 0.1);
        color: #355fe5;
        font-size: 0.88rem;
        font-weight: 700;
        text-decoration: none;
    }
}
</style>
