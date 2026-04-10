import type {
    InterviewQuestionItem,
    InterviewQuizQuestionItem,
} from "@/shared/constants/interview";

export interface InterviewFilters {
    keyword: string;
    level: string;
    sourceType: string;
}

export const DEFAULT_INTERVIEW_FILTERS: InterviewFilters = {
    keyword: "",
    level: "all",
    sourceType: "all",
};

function toSearchText(question: InterviewQuestionItem): string {
    return [
        question.question,
        question.answer,
        question.focus,
        question.level,
        ...question.tags,
    ]
        .join(" ")
        .toLowerCase();
}

export function shuffleArray<T>(items: T[]): T[] {
    const clonedItems = [...items];

    for (let index = clonedItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [clonedItems[index], clonedItems[randomIndex]] = [
            clonedItems[randomIndex],
            clonedItems[index],
        ];
    }

    return clonedItems;
}

export function withInterviewSource(
    questions: InterviewQuestionItem[],
    sourceType: "local" | "github",
): InterviewQuestionItem[] {
    return questions.map((question) => ({
        ...question,
        sourceType,
    }));
}

export function getInterviewLevels(questions: InterviewQuestionItem[]): string[] {
    return questions.reduce<string[]>((levels, question) => {
        if (!levels.includes(question.level)) {
            levels.push(question.level);
        }

        return levels;
    }, []);
}

export function getInterviewSourceTypes(questions: InterviewQuestionItem[]): string[] {
    return questions.reduce<string[]>((sources, question) => {
        if (question.sourceType && !sources.includes(question.sourceType)) {
            sources.push(question.sourceType);
        }

        return sources;
    }, []);
}

export function filterInterviewQuestions(
    questions: InterviewQuestionItem[],
    filters: InterviewFilters,
): InterviewQuestionItem[] {
    const normalizedKeyword = filters.keyword.trim().toLowerCase();

    return questions.filter((question) => {
        const matchesKeyword =
            !normalizedKeyword || toSearchText(question).includes(normalizedKeyword);
        const matchesLevel =
            filters.level === "all" || question.level === filters.level;
        const matchesSource =
            filters.sourceType === "all" || question.sourceType === filters.sourceType;

        return matchesKeyword && matchesLevel && matchesSource;
    });
}

function shuffleQuizChoices(
    question: InterviewQuizQuestionItem,
): InterviewQuizQuestionItem {
    const correctChoice = question.quiz.choices[question.quiz.correctIndex];
    const shuffledChoices = shuffleArray(question.quiz.choices);

    return {
        ...question,
        quiz: {
            ...question.quiz,
            choices: shuffledChoices,
            correctIndex: shuffledChoices.findIndex((choice) => choice === correctChoice),
        },
    };
}

function buildGeneratedQuizQuestion(
    question: InterviewQuestionItem,
    questionPool: InterviewQuestionItem[],
): InterviewQuizQuestionItem {
    const distractorTitles = shuffleArray(
        questionPool
            .filter((item) => item.id !== question.id)
            .map((item) => item.question),
    ).slice(0, 3);

    const fallbackDistractors = [
        "Cau hoi nay khong co trong question bank hien tai",
        "Mot prompt khac khong thuoc bo cau hoi duoc chon",
        "Tieu de duoc tao de lam distractor cho auto quiz",
    ];

    const completedDistractors = [
        ...distractorTitles,
        ...fallbackDistractors,
    ].slice(0, 3);
    const shuffledChoices = shuffleArray([
        question.question,
        ...completedDistractors,
    ]);
    const sourcePath = question.sourceUrl
        ? new URL(question.sourceUrl).pathname.replaceAll("-", " ").replaceAll("/", " / ")
        : question.focus;

    return {
        ...question,
        question: question.sourceUrl
            ? `Tieu de nao khop nhat voi bai tham khao sau: ${sourcePath}?`
            : `Dau la tieu de xuat hien trong question bank thuoc chu de "${question.focus}"?`,
        answer:
            question.answer ||
            "Ban co the mo source link de doc them chi tiet ve bai goc nay.",
        quiz: {
            choices: shuffledChoices,
            correctIndex: shuffledChoices.findIndex(
                (choice) => choice === question.question,
            ),
            explanation: question.sourceUrl
                ? "Dap an dung chinh la tieu de bai viet/cau hoi xuat hien trong source GitHub. Bam vao link tham khao de xem chi tiet."
                : "Dap an dung la tieu de goc cua question bank hien tai.",
        },
    };
}

export function buildInterviewQuizQuestions(
    questions: InterviewQuestionItem[],
    questionPool: InterviewQuestionItem[] = questions,
): InterviewQuizQuestionItem[] {
    return questions.map((question) => {
        if ("quiz" in question && question.quiz) {
            return shuffleQuizChoices(question as InterviewQuizQuestionItem);
        }

        return buildGeneratedQuizQuestion(question, questionPool);
    });
}
