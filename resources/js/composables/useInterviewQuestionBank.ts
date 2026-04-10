import Interview from "@/services/app/Interview";
import {
    getInterviewRole,
    type InterviewQuestionItem,
    type InterviewRoleId,
} from "@/shared/constants/interview";
import { withInterviewSource } from "@/utils/interview";
import { useQuery } from "@tanstack/vue-query";
import { computed, type ComputedRef, type Ref } from "vue";

type SupportedRoleRef = Ref<InterviewRoleId> | ComputedRef<InterviewRoleId>;

export function useInterviewQuestionBank(selectedRoleId: SupportedRoleRef) {
    const isFrontendRole = computed(() => selectedRoleId.value === "fe");
    const githubFrontendQuestionsQuery = useQuery({
        queryKey: ["github-frontend-interview-questions"],
        queryFn: () => Interview.getFrontendQuestionsFromGithub(),
        enabled: isFrontendRole,
        staleTime: 1000 * 60 * 30,
        retry: 1,
    });

    const selectedRole = computed(() => getInterviewRole(selectedRoleId.value));
    const localQuestions = computed<InterviewQuestionItem[]>(() => {
        return withInterviewSource(selectedRole.value.questions, "local");
    });
    const githubQuestions = computed<InterviewQuestionItem[]>(() => {
        return withInterviewSource(
            githubFrontendQuestionsQuery.data.value ?? [],
            "github",
        );
    });
    const questions = computed<InterviewQuestionItem[]>(() => {
        if (!isFrontendRole.value) {
            return localQuestions.value;
        }

        if (githubQuestions.value.length) {
            return githubQuestions.value;
        }

        return localQuestions.value;
    });
    const isUsingGithubSource = computed(() => {
        return isFrontendRole.value && githubQuestions.value.length > 0;
    });
    const sourceStatusText = computed(() => {
        if (!isFrontendRole.value) {
            return "Dang dung bo cau hoi local trong template.";
        }

        if (githubFrontendQuestionsQuery.isPending.value) {
            return "Dang tai bo cau hoi Frontend tu GitHub README API...";
        }

        if (githubFrontendQuestionsQuery.isError.value) {
            return "Khong lay duoc du lieu GitHub, dang fallback sang bo cau hoi local.";
        }

        if (isUsingGithubSource.value) {
            return "Bo cau hoi Frontend dang duoc lay tu GitHub README API.";
        }

        return "Dang dung bo cau hoi local trong template.";
    });

    return {
        githubFrontendQuestionsQuery,
        isFrontendRole,
        isUsingGithubSource,
        questions,
        selectedRole,
        sourceStatusText,
    };
}
