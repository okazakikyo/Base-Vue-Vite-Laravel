<script setup lang="ts">
import { useInterviewQuestionBank } from "@/composables/useInterviewQuestionBank";
import InterviewFilterBar from "@/components/interview/InterviewFilterBar.vue";
import InterviewQuestionAccordion from "@/components/interview/InterviewQuestionAccordion.vue";
import InterviewRoleSelector from "@/components/interview/InterviewRoleSelector.vue";
import {
    interviewRoleGroups,
    normalizeInterviewRoleId,
    type InterviewQuestionItem,
    type InterviewRoleId,
} from "@/shared/constants/interview";
import { ROUTE } from "@/shared/constants/routing";
import {
    DEFAULT_INTERVIEW_FILTERS,
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
const randomizedQuestions = shallowRef<InterviewQuestionItem[]>([]);

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
const quizLink = computed(() => {
    return {
        name: ROUTE.NAME.INTERVIEW_QUIZ,
        query: {
            role: selectedRoleId.value,
        },
    };
});

const shuffleDisplayedQuestions = () => {
    randomizedQuestions.value = shuffleArray(filteredQuestions.value);
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
        shuffleDisplayedQuestions();
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
    <section class="interview-page">
        <header class="interview-page__hero">
            <div class="interview-page__hero-copy">
                <span class="interview-page__eyebrow">Interview practice</span>
                <h1 class="interview-page__title">
                    List cau hoi phong van theo tung vi tri
                </h1>
                <p class="interview-page__description">
                    Chon role de xem bo cau hoi goi y. Moi cau hoi co dap an mau
                    ngan gon de dung cho viec on tap, mock interview hoac onboarding
                    team junior.
                </p>
            </div>

            <div class="interview-page__hero-card">
                <span class="interview-page__hero-label">Role hien tai</span>
                <strong class="interview-page__hero-value">
                    {{ selectedRole.label }}
                </strong>
                <p class="interview-page__hero-summary">
                    {{ selectedRole.summary }}
                </p>
                <RouterLink class="interview-page__hero-link" :to="quizLink">
                    Mo trang quiz
                </RouterLink>
            </div>
        </header>

        <section class="interview-page__panel">
            <div class="interview-page__section-head">
                <div>
                    <p class="interview-page__section-kicker">Chon vi tri</p>
                    <h2 class="interview-page__section-title">
                        Nhom cau hoi hien tai
                    </h2>
                </div>
            </div>

            <InterviewRoleSelector
                :roles="interviewRoleGroups"
                :model-value="selectedRoleId"
                @update:model-value="setSelectedRole"
            />
        </section>

        <section class="interview-page__content">
            <article class="interview-page__panel">
                <div class="interview-page__section-head">
                <div>
                    <p class="interview-page__section-kicker">Question bank</p>
                    <h2 class="interview-page__section-title">
                        {{ selectedRole.label }} interview prompts
                    </h2>
                    <p class="interview-page__section-note">
                        {{ selectedRole.description }}
                    </p>
                    <p class="interview-page__section-note">
                        Danh sach se duoc random khi page load va khi filter thay doi.
                    </p>
                    <div
                        class="interview-page__source-banner"
                        :class="{
                            'is-remote': isUsingGithubSource,
                            'is-error': githubFrontendQuestionsQuery.isError.value,
                        }"
                    >
                        {{ sourceStatusText }}
                    </div>
                </div>
            </div>

                <InterviewFilterBar
                    :keyword="filters.keyword"
                    :level="filters.level"
                    :levels="availableLevels"
                    :result-count="resultCount"
                    :source-type="filters.sourceType"
                    :sources="availableSources"
                    @shuffle="shuffleDisplayedQuestions"
                    @update:keyword="updateKeywordFilter"
                    @update:level="updateLevelFilter"
                    @update:source-type="updateSourceTypeFilter"
                />

                <InterviewQuestionAccordion :questions="randomizedQuestions" />
            </article>

            <aside class="interview-page__panel interview-page__panel--sidebar">
                <div class="interview-page__section-head">
                    <div>
                        <p class="interview-page__section-kicker">Practice mode</p>
                        <h2 class="interview-page__section-title">Goi y cach su dung</h2>
                    </div>
                </div>

                <div class="interview-page__tips">
                    <article class="interview-page__tip-card">
                        <strong>Tu hoc nhanh</strong>
                        <p>
                            Doc cau hoi truoc, tu tra loi trong 1-2 phut, roi moi mo dap an
                            de doi chieu cach trinh bay.
                        </p>
                    </article>
                    <article class="interview-page__tip-card">
                        <strong>Mock interview</strong>
                        <p>
                            Dung trang nay cho interviewer chon role, sau do di qua quiz de
                            test trinh tu duy nhanh hon.
                        </p>
                    </article>
                    <article class="interview-page__tip-card">
                        <strong>Onboarding team</strong>
                        <p>
                            Moi role dang co 4 cau hoi mau. Ban co the them tiep vao question
                            bank de dung cho noi bo.
                        </p>
                    </article>
                </div>

                <RouterLink class="interview-page__primary-link" :to="quizLink">
                    Sang trang trắc nghiệm
                </RouterLink>
                <RouterLink
                    class="interview-page__secondary-link"
                    :to="{ name: ROUTE.NAME.HOME }"
                >
                    Ve trang Home
                </RouterLink>
            </aside>
        </section>
    </section>
</template>

<style scoped lang="scss">
.interview-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: min(1180px, 100%);
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
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(250px, 0.85fr);
        gap: 22px;
        padding: 30px;
        background:
            radial-gradient(circle at top right, rgba(74, 108, 247, 0.16), transparent 28%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(242, 246, 252, 0.92));
    }

    &__eyebrow,
    &__section-kicker,
    &__hero-label {
        display: inline-flex;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        color: #60708a;
    }

    &__title {
        margin: 12px 0 10px;
        font-size: clamp(2rem, 3vw, 3.1rem);
        line-height: 1.08;
        font-weight: 700;
        color: #172134;
    }

    &__description,
    &__section-note,
    &__hero-summary,
    &__tip-card p {
        margin: 0;
        font-size: 0.98rem;
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

    &__hero-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 22px;
        border-radius: 24px;
        background: rgba(21, 31, 50, 0.96);
        color: #f6faff;
    }

    &__hero-value {
        font-size: 1.5rem;
        line-height: 1.2;
        font-weight: 700;
    }

    &__hero-summary {
        color: rgba(246, 250, 255, 0.76);
    }

    &__hero-link,
    &__primary-link,
    &__secondary-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border-radius: 14px;
        font-size: 0.94rem;
        font-weight: 700;
        text-decoration: none;
    }

    &__hero-link,
    &__primary-link {
        background: linear-gradient(135deg, #2448b8 0%, #3266e3 100%);
        color: #ffffff;
    }

    &__secondary-link {
        border: 1px solid rgba(64, 104, 232, 0.18);
        background: rgba(64, 104, 232, 0.08);
        color: #355fe5;
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 24px;
    }

    &__content {
        display: grid;
        grid-template-columns: minmax(0, 1.18fr) minmax(280px, 0.82fr);
        gap: 24px;
        align-items: start;
    }

    &__panel--sidebar {
        position: sticky;
        top: 24px;
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

    &__tips {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__tip-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 18px;
        border-radius: 20px;
        background: #f5f8fc;

        strong {
            font-size: 1rem;
            line-height: 1.4;
            color: #172134;
        }
    }
}

@media (max-width: 980px) {
    .interview-page {
        &__hero,
        &__content {
            grid-template-columns: 1fr;
        }

        &__panel--sidebar {
            position: static;
        }
    }
}

@media (max-width: 640px) {
    .interview-page {
        padding-inline: 16px;

        &__hero,
        &__panel {
            padding: 20px;
            border-radius: 22px;
        }
    }
}
</style>
