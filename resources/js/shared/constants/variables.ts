export const LOCALE_CODE = {
    JPN: 'jpn',
    ENG: 'eng',
} as const;

export const LOCALES = [
    LOCALE_CODE.JPN,
    LOCALE_CODE.ENG,
] as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 25;
