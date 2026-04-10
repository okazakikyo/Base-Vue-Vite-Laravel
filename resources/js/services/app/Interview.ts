import type { InterviewQuestionItem } from "@/shared/constants/interview";

const GITHUB_README_API_URL =
    "https://api.github.com/repos/Devtools-Tech-Team/front-end-interview-questions/readme";
const README_START_HEADING = "# Top 200 Frontend Interview Questions";
const README_END_HEADING = "# Advanced Frontend Learning Tutorials";

function normalizeQuestionTitle(title: string): string {
    return title
        .replace(/\s+/g, " ")
        .replace(/\s+\|\s+/g, " | ")
        .trim();
}

export function parseGithubFrontendQuestions(markdown: string): InterviewQuestionItem[] {
    const lines = markdown.split("\n");
    const questions: InterviewQuestionItem[] = [];

    let isInsideQuestionSection = false;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine === README_START_HEADING) {
            isInsideQuestionSection = true;
            return;
        }

        if (trimmedLine === README_END_HEADING) {
            isInsideQuestionSection = false;
            return;
        }

        if (!isInsideQuestionSection || !trimmedLine.startsWith("* ")) {
            return;
        }

        const markdownLinkMatch = trimmedLine.match(
            /^\*\s+\[(.+?)\]\((https?:\/\/[^\s)]+)\)$/,
        );

        if (!markdownLinkMatch) {
            return;
        }

        const [, rawTitle, sourceUrl] = markdownLinkMatch;

        questions.push({
            id: `github-fe-${index}`,
            question: normalizeQuestionTitle(rawTitle),
            answer:
                "Danh sach nay duoc lay truc tiep tu GitHub README. Bam vao link nguon de xem bai goc va huong dan chi tiet.",
            level: "Nguon GitHub",
            focus: "Frontend interview",
            tags: ["GitHub", "Frontend", "External source"],
            sourceLabel: "Mo bai goc",
            sourceUrl,
        });
    });

    return questions;
}

async function fetchReadmeMarkdown(): Promise<string> {
    const response = await fetch(GITHUB_README_API_URL, {
        headers: {
            Accept: "application/vnd.github.raw+json",
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub README request failed with status ${response.status}`);
    }

    return response.text();
}

export default {
    async getFrontendQuestionsFromGithub(): Promise<InterviewQuestionItem[]> {
        const markdown = await fetchReadmeMarkdown();
        return parseGithubFrontendQuestions(markdown);
    },
};
