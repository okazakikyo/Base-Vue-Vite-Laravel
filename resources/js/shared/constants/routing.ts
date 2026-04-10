export const PAGE_NAME = {
    HOME: 'Home',
    LOGIN: 'Login',
    INTERVIEW_QUESTIONS: 'InterviewQuestions',
    INTERVIEW_QUIZ: 'InterviewQuiz',
    OCR: 'Ocr',
} as const;

export const PAGE_PATH = {
    HOME: '/',
    LOGIN: '/login',
    INTERVIEW_QUESTIONS: '/interview-questions',
    INTERVIEW_QUIZ: '/interview-quiz',
    OCR: '/ocr',
} as const;

export const PAGE_TITLE = {
    HOME: 'Home',
    LOGIN: 'Login',
    INTERVIEW_QUESTIONS: 'Interview Questions',
    INTERVIEW_QUIZ: 'Interview Quiz',
    OCR: 'OCR Scanner',
} as const;

export const ROUTE = {
    NAME: PAGE_NAME,
    PATH: PAGE_PATH,
    TITLE: PAGE_TITLE,
}
