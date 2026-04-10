<script setup lang="ts">
import type { InterviewQuizQuestionItem } from "@/shared/constants/interview";
import { computed, ref, shallowRef, watch } from "vue";

interface Props {
    questions: InterviewQuizQuestionItem[];
    roleLabel: string;
}

const props = defineProps<Props>();

const currentIndex = shallowRef(0);
const isCompleted = shallowRef(false);
const answers = ref<Record<string, number>>({});

const currentQuestion = computed(() => {
    return props.questions[currentIndex.value] ?? null;
});

const answeredCount = computed(() => Object.keys(answers.value).length);
const totalQuestions = computed(() => props.questions.length);
const currentAnswerIndex = computed<number | null>(() => {
    if (!currentQuestion.value) {
        return null;
    }

    return answers.value[currentQuestion.value.id] ?? null;
});

const score = computed(() => {
    return props.questions.reduce((total, question) => {
        return total + Number(answers.value[question.id] === question.quiz.correctIndex);
    }, 0);
});

const scorePercent = computed(() => {
    if (!totalQuestions.value) {
        return 0;
    }

    return Math.round((score.value / totalQuestions.value) * 100);
});

const canGoNext = computed(() => {
    return currentAnswerIndex.value !== null;
});

const resetQuiz = () => {
    currentIndex.value = 0;
    isCompleted.value = false;
    answers.value = {};
};

watch(
    () => props.questions,
    () => {
        resetQuiz();
    },
    { immediate: true },
);

const chooseAnswer = (choiceIndex: number) => {
    if (!currentQuestion.value || isCompleted.value) {
        return;
    }

    answers.value = {
        ...answers.value,
        [currentQuestion.value.id]: choiceIndex,
    };
};

const goToPrevious = () => {
    if (currentIndex.value === 0) {
        return;
    }

    currentIndex.value -= 1;
};

const goToNext = () => {
    if (!canGoNext.value) {
        return;
    }

    if (currentIndex.value === totalQuestions.value - 1) {
        isCompleted.value = true;
        return;
    }

    currentIndex.value += 1;
};
</script>

<template>
    <section class="interview-quiz-panel">
        <div class="interview-quiz-panel__summary">
            <div class="interview-quiz-panel__summary-copy">
                <span class="interview-quiz-panel__eyebrow">
                    {{ roleLabel }} quiz
                </span>
                <h2 class="interview-quiz-panel__title">
                    {{ isCompleted ? "Ket qua bai test" : "Tra loi tung cau hoi" }}
                </h2>
                <p class="interview-quiz-panel__description">
                    {{
                        isCompleted
                            ? "Ban co the xem dap an dung, giai thich va lam lai de luyen tiep."
                            : "Moi cau co 1 dap an dung. Hoan thanh het de xem diem va giai thich chi tiet."
                    }}
                </p>
            </div>

            <div class="interview-quiz-panel__score-card">
                <span class="interview-quiz-panel__score-label">Tien do</span>
                <strong class="interview-quiz-panel__score-value">
                    {{ answeredCount }}/{{ totalQuestions }}
                </strong>
                <span class="interview-quiz-panel__score-subtext">
                    {{ isCompleted ? `${scorePercent}% dung` : `Cau ${currentIndex + 1}` }}
                </span>
            </div>
        </div>

        <div
            v-if="!isCompleted && currentQuestion"
            class="interview-quiz-panel__question-card"
        >
            <div class="interview-quiz-panel__question-head">
                <span class="interview-quiz-panel__pill">
                    {{ currentQuestion.level }}
                </span>
                <span class="interview-quiz-panel__pill is-soft">
                    {{ currentQuestion.focus }}
                </span>
            </div>

            <h3 class="interview-quiz-panel__question">
                {{ currentQuestion.question }}
            </h3>

            <div class="interview-quiz-panel__choices">
                <button
                    v-for="(choice, choiceIndex) in currentQuestion.quiz.choices"
                    :key="choice"
                    type="button"
                    class="interview-quiz-panel__choice"
                    :class="{ 'is-selected': currentAnswerIndex === choiceIndex }"
                    @click="chooseAnswer(choiceIndex)"
                >
                    <span class="interview-quiz-panel__choice-index">
                        {{ String.fromCharCode(65 + choiceIndex) }}
                    </span>
                    <span>{{ choice }}</span>
                </button>
            </div>

            <div class="interview-quiz-panel__actions">
                <button
                    type="button"
                    class="interview-quiz-panel__button interview-quiz-panel__button--ghost"
                    :disabled="currentIndex === 0"
                    @click="goToPrevious"
                >
                    Cau truoc
                </button>
                <button
                    type="button"
                    class="interview-quiz-panel__button"
                    :disabled="!canGoNext"
                    @click="goToNext"
                >
                    {{ currentIndex === totalQuestions - 1 ? "Nop bai" : "Cau tiep theo" }}
                </button>
            </div>
        </div>

        <div
            v-if="!isCompleted && !currentQuestion"
            class="interview-quiz-panel__empty"
        >
            Khong co cau hoi nao khop voi filter hien tai.
        </div>

        <div v-if="isCompleted" class="interview-quiz-panel__results">
            <article class="interview-quiz-panel__result-hero">
                <span class="interview-quiz-panel__eyebrow">Tong ket</span>
                <h3 class="interview-quiz-panel__result-score">
                    {{ score }}/{{ totalQuestions }} cau dung
                </h3>
                <p class="interview-quiz-panel__description">
                    Ty le dung hien tai la {{ scorePercent }}%. Xem tung cau ben duoi de
                    biet dap an dung va giai thich.
                </p>
                <button
                    type="button"
                    class="interview-quiz-panel__button"
                    @click="resetQuiz"
                >
                    Lam lai bai test
                </button>
            </article>

            <article
                v-for="question in props.questions"
                :key="question.id"
                class="interview-quiz-panel__result-item"
            >
                <div class="interview-quiz-panel__result-head">
                    <h4 class="interview-quiz-panel__result-question">
                        {{ question.question }}
                    </h4>
                    <span
                        class="interview-quiz-panel__result-state"
                        :class="{
                            'is-correct':
                                answers[question.id] === question.quiz.correctIndex,
                            'is-wrong':
                                answers[question.id] !== question.quiz.correctIndex,
                        }"
                    >
                        {{
                            answers[question.id] === question.quiz.correctIndex
                                ? "Dung"
                                : "Sai"
                        }}
                    </span>
                </div>

                <p class="interview-quiz-panel__result-answer">
                    Ban chon:
                    <strong>
                        {{
                            answers[question.id] !== undefined
                                ? question.quiz.choices[answers[question.id]]
                                : "Chua tra loi"
                        }}
                    </strong>
                </p>
                <p class="interview-quiz-panel__result-answer">
                    Dap an dung:
                    <strong>
                        {{ question.quiz.choices[question.quiz.correctIndex] }}
                    </strong>
                </p>
                <p class="interview-quiz-panel__result-explanation">
                    {{ question.quiz.explanation }}
                </p>
            </article>
        </div>
    </section>
</template>

<style scoped lang="scss">
.interview-quiz-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__summary,
    &__question-card,
    &__empty,
    &__result-hero,
    &__result-item {
        border: 1px solid rgba(193, 205, 221, 0.86);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 18px 40px rgba(24, 38, 67, 0.08);
    }

    &__summary {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 220px;
        gap: 20px;
        padding: 22px;
    }

    &__summary-copy,
    &__question-card,
    &__results {
        display: flex;
        flex-direction: column;
    }

    &__question-card,
    &__empty,
    &__result-hero,
    &__result-item {
        gap: 18px;
        padding: 22px;
    }

    &__results {
        gap: 16px;
    }

    &__eyebrow,
    &__score-label {
        display: inline-flex;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        color: #60708a;
    }

    &__title {
        margin: 8px 0 10px;
        font-size: 1.6rem;
        line-height: 1.25;
        font-weight: 700;
        color: #172134;
    }

    &__description,
    &__result-answer,
    &__result-explanation {
        margin: 0;
        font-size: 0.96rem;
        line-height: 1.75;
        color: #556176;
    }

    &__empty {
        font-size: 0.96rem;
        line-height: 1.8;
        color: #556176;
        text-align: center;
    }

    &__score-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
        padding: 18px;
        border-radius: 22px;
        background: rgba(23, 33, 52, 0.98);
        color: #f7fbff;
    }

    &__score-value {
        font-size: 2rem;
        line-height: 1;
        font-weight: 700;
    }

    &__score-subtext {
        color: rgba(247, 251, 255, 0.78);
        font-size: 0.92rem;
    }

    &__question-head {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    &__pill,
    &__result-state {
        display: inline-flex;
        align-items: center;
        min-height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 0.84rem;
        font-weight: 700;
    }

    &__pill {
        background: rgba(64, 104, 232, 0.1);
        color: #355fe5;

        &.is-soft {
            background: rgba(23, 161, 97, 0.1);
            color: #19895a;
        }
    }

    &__question,
    &__result-score,
    &__result-question {
        margin: 0;
        color: #172134;
        font-weight: 700;
    }

    &__question {
        font-size: 1.15rem;
        line-height: 1.65;
    }

    &__choices {
        display: grid;
        gap: 12px;
    }

    &__choice {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        padding: 16px;
        border: 1px solid rgba(193, 205, 221, 0.86);
        border-radius: 18px;
        background: #f8fbff;
        color: #22324d;
        text-align: left;
        transition:
            border-color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-1px);
            border-color: rgba(64, 104, 232, 0.26);
            box-shadow: 0 12px 24px rgba(64, 104, 232, 0.08);
        }

        &.is-selected {
            border-color: #4068e8;
            background: rgba(64, 104, 232, 0.08);
        }
    }

    &__choice-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #ffffff;
        font-size: 0.9rem;
        font-weight: 700;
    }

    &__actions {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border: 0;
        border-radius: 14px;
        background: linear-gradient(135deg, #2448b8 0%, #3266e3 100%);
        color: #ffffff;
        font-size: 0.94rem;
        font-weight: 700;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;

        &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 18px 28px rgba(50, 102, 227, 0.22);
        }

        &:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }

        &--ghost {
            border: 1px solid rgba(64, 104, 232, 0.18);
            background: rgba(64, 104, 232, 0.08);
            color: #355fe5;
        }
    }

    &__result-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
    }

    &__result-state {
        &.is-correct {
            background: rgba(23, 161, 97, 0.12);
            color: #19895a;
        }

        &.is-wrong {
            background: rgba(226, 73, 56, 0.12);
            color: #c74435;
        }
    }

    &__result-score {
        font-size: 2rem;
    }
}

@media (max-width: 820px) {
    .interview-quiz-panel {
        &__summary {
            grid-template-columns: 1fr;
        }

        &__actions {
            flex-direction: column;
        }

        &__button {
            width: 100%;
        }

        &__result-head {
            flex-direction: column;
        }
    }
}
</style>
