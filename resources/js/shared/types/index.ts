import { LOCALE_CODE } from "@/shared/constants/variables";

export type LOCALE_TYPE = typeof LOCALE_CODE[keyof typeof LOCALE_CODE];

export type Pagination = {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
}
