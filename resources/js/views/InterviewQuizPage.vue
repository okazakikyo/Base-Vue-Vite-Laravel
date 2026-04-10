<script setup lang="ts">
import { useInterviewQuestionBank } from "@/composables/useInterviewQuestionBank";
import InterviewFilterBar from "@/components/interview/InterviewFilterBar.vue";
import InterviewQuizPanel from "@/components/interview/InterviewQuizPanel.vue";
import InterviewRoleSelector from "@/components/interview/InterviewRoleSelector.vue";
import {
    interviewRoleGroups,
    normalizeInterviewRoleId,
    type InterviewQuizQuestionItem,
    type InterviewRoleId,
} from "@/shared/constants/interview";
import { ROUTE } from "@/shared/constants/routing";
import {
    DEFAULT_INTERVIEW_FILTERS,
    buildInterviewQuizQuestions,
    filterInterviewQuestions,
    getInterviewLevels,
    getInterviewSourceTypes,
    shuffleArray,
} from "@/utils/interview";
import { computed, shallowRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const selectedRoleId = shallowRef<InterviewRoleId>(
    normalizeInterviewRoleId(route.query.role),
);
const filters = shallowRef({ ...DEFAULT_INTERVIEW_FILTERS });
const randomizedQuizQuestions = shallowRef<InterviewQuizQuestionItem[]>([]);

watch(
    () => route.query.role,
    (roleQuery) => {
        selectedRoleId.value = normalizeInterviewRoleId(roleQuery);
    },
    { immediate: true },
);

const {
    githubFrontendQuestionsQuery,
    isUsingGithubSource,
    questions,
    selectedRole,
    sourceStatusText,
} = useInterviewQuestionBank(selectedRoleId);
const availableLevels = computed(() => getInterviewLevels(questions.value));
const availableSources = computed(() => getInterviewSourceTypes(questions.value));
const filteredQuestions = computed(() => {
    return filterInterviewQuestions(questions.value, filters.value);
});
const resultCount = computed(() => filteredQuestions.value.length);
const questionListLink = computed(() => {
    return {
        name: ROUTE.NAME.INTERVIEW_QUESTIONS,
        query: {
            role: selectedRoleId.value,
        },
    };
});

const shuffleQuizQuestions = () => {
    const generatedQuizQuestions = buildInterviewQuizQuestions(
        filteredQuestions.value,
        questions.value,
    );

    randomizedQuizQuestions.value = shuffleArray(generatedQuizQuestions);
};

const updateKeywordFilter = (keyword: string) => {
    filters.value = {
        ...filters.value,
        keyword,
    };
};

const updateLevelFilter = (level: string) => {
    filters.value = {
        ...filters.value,
        level,
    };
};

const updateSourceTypeFilter = (sourceType: string) => {
    filters.value = {
        ...filters.value,
        sourceType,
    };
};

watch(
    filteredQuestions,
    () => {
        shuffleQuizQuestions();
    },
    { immediate: true },
);

const setSelectedRole = async (roleId: InterviewRoleId) => {
    selectedRoleId.value = roleId;
    filters.value = { ...DEFAULT_INTERVIEW_FILTERS };
    await router.replace({
        query: {
            ...route.query,
            role: roleId,
        },
    });
};
</script>

<template>
    <section class="interview-quiz-page">
        <header class="interview-quiz-page__hero">
            <div class="interview-quiz-page__hero-copy">
                <span class="interview-quiz-page__eyebrow">Quiz mode</span>
                <h1 class="interview-quiz-page__title">
                    Test nhanh kien thuc phong van theo tung role
                </h1>
                <p class="interview-quiz-page__description">
                    Chon vi tri muon test, tra loi tung cau hoi va xem giai thich sau
                    khi nop bai. Trang nay dung chung question bank voi trang list.
                </p>
            </div>

            <div class="interview-quiz-page__hero-actions">
                <RouterLink
                    class="interview-quiz-page__link interview-quiz-page__link--primary"
                    :to="questionListLink"
                >
                    Xem list cau hoi
                </RouterLink>
                <RouterLink
                    class="interview-quiz-page__link interview-quiz-page__link--secondary"
                    :to="{ name: ROUTE.NAME.HOME }"
                >
                    Ve Home
                </RouterLink>
            </div>
        </header>

        <section class="interview-quiz-page__panel">
            <div class="interview-quiz-page__section-head">
                <div>
                    <p class="interview-quiz-page__section-kicker">Role selector</p>
                    <h2 class="interview-quiz-page__section-title">
                        Chon bo quiz hien tai
                    </h2>
                    <p class="interview-quiz-page__section-note">
                        Quiz se duoc random ngay khi page load, khi doi role va khi filter thay doi.
                    </p>
                    <div
                        class="interview-quiz-page__source-banner"
                        :class="{
                            'is-remote': isUsingGithubSource,
                            'is-error': githubFrontendQuestionsQuery.isError.value,
                        }"
                    >
                        {{ sourceStatusText }}
                    </div>
                </div>
            </div>

            <InterviewRoleSelector
                :roles="interviewRoleGroups"
                :model-value="selectedRoleId"
                @update:model-value="setSelectedRole"
            />

            <InterviewFilterBar
                :keyword="filters.keyword"
                :level="filters.level"
                :levels="availableLevels"
                :result-count="resultCount"
                :source-type="filters.sourceType"
                :sources="availableSources"
                @shuffle="shuffleQuizQuestions"
                @update:keyword="updateKeywordFilter"
                @update:level="updateLevelFilter"
                @update:source-type="updateSourceTypeFilter"
            />
        </section>

        <InterviewQuizPanel
            :role-label="selectedRole.label"
            :questions="randomizedQuizQuestions"
        />
    </section>
</template>

<style scoped lang="scss">
.interview-quiz-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: 32px 20px 56px;

    &__hero,
    &__panel {
        border: 1px solid rgba(193, 205, 221, 0.84);
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 20px 46px rgba(21, 33, 56, 0.08);
        backdrop-filter: blur(10px);
    }

    &__hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 22px;
        padding: 30px;
        background:
            radial-gradient(circle at top right, rgba(255, 196, 89, 0.18), transparent 26%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(242, 246, 252, 0.92));
    }

    &__eyebrow,
    &__section-kicker {
        display: inline-flex;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        color: #60708a;
    }

    &__title {
        margin: 12px 0 10px;
        font-size: clamp(2rem, 3vw, 3rem);
        line-height: 1.08;
        font-weight: 700;
        color: #172134;
    }

    &__description {
        margin: 0;
        max-width: 720px;
        font-size: 0.98rem;
        line-height: 1.8;
        color: #556176;
    }

    &__section-note {
        margin: 10px 0 0;
        font-size: 0.96rem;
        line-height: 1.8;
        color: #556176;
    }

    &__source-banner {
        display: inline-flex;
        margin-top: 14px;
        padding: 10px 14px;
        border-radius: 14px;
        background: #f5f8fc;
        color: #60708a;
        font-size: 0.9rem;
        line-height: 1.6;

        &.is-remote {
            background: rgba(23, 161, 97, 0.12);
            color: #19895a;
        }

        &.is-error {
            background: rgba(226, 73, 56, 0.12);
            color: #c74435;
        }
    }

    &__hero-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border-radius: 14px;
        font-size: 0.94rem;
        font-weight: 700;
        text-decoration: none;

        &--primary {
            background: linear-gradient(135deg, #2448b8 0%, #3266e3 100%);
            color: #ffffff;
        }

        &--secondary {
            border: 1px solid rgba(64, 104, 232, 0.18);
            background: rgba(64, 104, 232, 0.08);
            color: #355fe5;
        }
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
    }

    &__section-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
    }

    &__section-title {
        margin: 6px 0 0;
        font-size: 1.4rem;
        line-height: 1.3;
        font-weight: 700;
        color: #172134;
    }
}

@media (max-width: 780px) {
    .interview-quiz-page {
        &__hero {
            flex-direction: column;
            align-items: stretch;
        }
    }
}

@media (max-width: 640px) {
    .interview-quiz-page {
        padding-inline: 16px;

        &__hero,
        &__panel {
            padding: 20px;
            border-radius: 22px;
        }
    }
}
</style>
