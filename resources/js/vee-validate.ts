import {
    required,
    max,
    min,
    between,
    numeric,
    max_value,
    min_value,
    ext,
    alpha_num,
} from '@vee-validate/rules';
import { defineRule, configure } from 'vee-validate';

import i18n from './i18n';
import { default as eng } from './vee-validate/eng.json';
import { default as jpn } from './vee-validate/jpn.json';

configure({
    validateOnBlur: true,
    validateOnChange: false,
    validateOnInput: true,
    validateOnModelUpdate: true,
});

defineRule('regexPassword', (value: string) => {
    const regexPass = /^(?!.*\s)[A-Za-z\d]{8,32}$/;
    const passwordValue = regexPass.test(value);
    if (!passwordValue) {
        return false;
    }
    return true;
});

defineRule('regexFurigana', (value: string) => {
    /**
     * Regex allows:
     * - Hiragana characters: \u3040-\u309F
     * - Standard Katakana: \u30A0-\u30FF
     * - Extended Katakana phonetic symbols: \u31F0-\u31FF
     * - Long vowel mark: ー
     * - Whitespace characters: \s
     */
    const regexFurigana = /^[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FFー\s]+$/;

    // Test if the input matches the allowed Furigana characters
    const isValid = regexFurigana.test(value);

    // Return false if input is invalid
    if (!isValid) {
        return false;
    }

    // Return true if input passes the Furigana validation
    return true;
});

defineRule('maxLengthJP', (value: string, params: unknown) => {
    let limit: number | undefined;

    if (typeof params === 'object' && params !== null && !Array.isArray(params)) {
        limit = (params as { length: number }).length;
    } else if (Array.isArray(params)) {
        limit = Number(params[0]);
    }

    if (limit === undefined) {
        return true;
    }

    const maxLength = Number(limit);
    const calculatedLength = getCharacterWidthLength(value);

    if (calculatedLength > maxLength) {
        return false;
    }

    return true;
});

defineRule('confirmed', (value, [target]: string[], ctx) => {
    if (value === ctx.form[target]) {
        return true;
    }
    return false;
});

defineRule('email', (value: string) => {
    const asciiEmailRegex = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!asciiEmailRegex.test(value)) {
        return false;
    }
    const noFullwidthDot = value.includes('。');
    if (noFullwidthDot) {
        return false;
    }
    return true;
});

defineRule('required_with', (value: string, [target]: string[], ctx) => {
    const otherValue = ctx.form[target];
    if (otherValue) {
        return value ? true : false;
    }
    return true;
});

defineRule('url', (value: string) => {
    if (!value) {
        return true;
    }
    const urlRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

    return urlRegex.test(value);
});

defineRule('alpha_num_space', (value: string) => {
    if (!value) {
        return true;
    }
    const regex = /^[A-Za-z0-9\s\p{P}\p{S}]+$/u;

    return regex.test(value);
});

defineRule('required', required);
defineRule('between', between);
defineRule('numeric', numeric);
defineRule('max', max);
defineRule('min', min);
defineRule('max_value', max_value);
defineRule('min_value', min_value);
defineRule('ext', ext);
defineRule('alpha_num', alpha_num);

// validation.ts
const globalMessages = {
    jpn: jpn.messages,
    eng: eng.messages,
};

// 3) Per-field labels and optional overrides
type FieldConfig = {
    label: string;
    override?: Partial<Record<string, string>>;
};

const convertToFieldConfig = (obj: Record<string, string>): Record<string, FieldConfig> => {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, { label: value }]));
};

const getCharacterWidthLength = (str: string): number => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (char.match(/[\u0020-\u007E\uFF61-\uFF9F]/)) {
            // half-width
            length += 1;
        } else {
            // full-width
            length += 2;
        }
    }
    return length;
};

defineRule('youtube_embed', (value: string) => {
    const youtubeRegex = /^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11}(\?.*)?$/;
    if (!value) return true;
    if (
        value.includes('title=') ||
        value.includes('frameborder=') ||
        value.includes('>') ||
        value.includes('"')
    ) {
        return false;
    }
    return youtubeRegex.test(value);
});

interface BetweenLengthParams {
    min: number;
    max: number;
}

defineRule('betweenLength', (value: string, params: BetweenLengthParams) => {
    const min = params?.min;
    const max = params?.max;
    if (value.length < min) {
        return false;
    }

    if (value.length > max) {
        return false;
    }
    return true;
});

const fieldConfig: Record<'jp' | 'en', Record<string, FieldConfig>> = {
    jpn: {
        ...convertToFieldConfig(jpn.names),
        companyName: {
            label: '企業名',
            override: {
                required: '企業名を入力してください。',
            },
        },
        person_name: {
            label: '担当者名',
            override: {
                required: '担当者名を入力してください。',
            },
        },
        contractEmail: {
            label: '担当者名メールアドレス',
            override: {
                required: '担当者名メールアドレスを入力してください。',
            },
        },
        loginIdAccount: {
            label: 'ログインID',
            override: {
                required: 'ログインIDを入力してください。',
            },
        },
        password: {
            label: '①パスワード',
            override: {
                required: '①パスワードを入力してください。',
            },
        },
        location: {
            label: '小間番号',
            override: {
                required: '小間番号を入力してください。',
            },
        },
        accountType: {
            label: 'アカウント種類',
            override: {
                required: 'アカウント種類を選択してください。',
            },
        },
        tftCategory: {
            label: 'TFTカテゴリ',
            override: {
                required: 'TFTカテゴリを選択してください。',
            },
        },
        startUpExhibitorDateType: {
            label: 'スタートアップ出展日',
            override: {
                required: 'スタートアップ出展日を選択してください。',
            },
        },
        plans: {
            label: 'ブラン',
            override: {
                required: 'ブランを選択してください。',
            },
        },
        inAppBooking: {
            label: 'アプリ内予約',
            override: {
                required: 'アプリ内予約を選択してください。',
            },
        },
        'companyJp.companyLogo': {
            label: '企業ロゴ画像',
            override: {
                required: '入力必須項目です',
            },
        },
        'companyJp.pronunciation': {
            label: '企業名ふりがな',
            override: {
                required: '入力必須項目です',
            },
        },
        'companyJp.description': {
            label: '企業の説明文',
            override: {
                required: '入力必須項目です',
                max: '文字数オーバーです',
            },
        },
        'companyJp.companyName': {
            label: '企業名',
            override: {
                max: '文字数オーバーです',
                required: '入力必須項目です',
            },
        },
        'companyJp.companyNameFurigana': {
            label: '企業名ふりがな',
            override: {
                max: '文字数オーバーです',
                required: '入力必須項目です',
            },
        },
        'companyJp.keywords.keyword': {
            label: 'キーワード',
            override: {
                required: '入力必須項目です',
                max: '文字数オーバーです',
            },
        },
        'companyJp.categories': {
            label: 'カテゴリ',
            override: {
                required: '入力必須項目です',
            },
        },
        'b.jp.name': {
            label: 'モビリティ名',
            override: {
                required: '入力必須項目です',
            },
        },
        'b.jp.nameFurigana': {
            label: '企業名ふりがな',
            override: {
                required: '入力必須項目です',
            },
        },
        'b.jp.point': {
            label: 'モビリティポイント',
            override: {
                required: '入力必須項目です',
                max: '文字数オーバーです',
            },
        },
        'b.jp.desc': {
            label: 'モビリティ説明文',
            override: {
                required: '入力必須項目です',
                max: '文字数オーバーです',
            },
        },
        'b.jp.descCardView': {
            label: 'モビリティ説明文（カード内）',
            override: {
                required: '入力必須項目です',
                max: '文字数オーバーです',
            },
        },
        'b.jp.mainImage': {
            label: 'メイン画像',
            override: {
                required: '入力必須項目です',
            },
        },
        'b.jp.youtube': {
            label: 'イベント名',
            override: {
                required: '入力必須項目です',
            },
        },
        'b.jp.youtubeLinks': {
            label: 'YouTubeのURL',
            override: {
                required: '入力必須項目です',
            },
        },
        'event.jp.eventName': {
            label: 'イベント名',
            override: {
                required: '入力必須項目です',
            },
        },
        'event.jp.desc': {
            label: 'イベント説明文',
            override: {
                required: '入力必須項目です',
                max: '文字数オーバーです',
            },
        },
        'event.jp.mainImage': {
            label: 'メイン画像',
            override: {
                required: '入力必須項目です',
            },
        },
        'event.jp.youtube': {
            label: 'YouTubeのURL',
            override: {
                required: '入力必須項目です',
            },
        },
        'b.jp.image': {
            label: '画像',
            override: {
                required: '入力必須項目です',
            },
        },
        'b.jp.externalImages': {
            label: '画像',
            override: {
                required: '入力必須項目です',
            },
        },
        'event.jp.externalImages': {
            label: 'サブ画像',
            override: {
                required: '入力必須項目です',
            },
        },
        'event.jp.youtubeLinks': {
            label: 'YouTube URL',
            override: {
                required: '入力必須項目です',
            },
        },
        'event.jp.experienceEventReserved': {
            label: '体験イベントの予約ボタン 表示有無',
            override: {
                required: '入力必須項目です',
            },
        },
        'event.jp.reserveExternalLinks': {
            label: 'URL',
            override: {
                required: '入力必須項目です',
            },
        },
        jpExternalText: {
            label: 'テキストリンクの表示テキスト',
        },
        jpExternalLinks: {
            label: 'URL',
        },
        externalText_jp: {
            label: 'テキストリンクの表示テキスト',
        },
        externalLink_jp: {
            label: 'URL',
        },
        emailJpEn: {
            label: 'メールアドレス / Email address',
            override: {
                required: 'メールアドレスを入力してください / Enter your Email address',
            },
        },
        loginIdJpEn: {
            label: 'ログインID / Login ID',
            override: {
                required:
                    '公式アプリ専用アカウントIDを入力してください/Enter your Official App Dedicated Account ID',
                regexPassword:
                    '半角英数字8〜32文字でご入力ください/Please enter 8 to 32 alphanumeric characters.',
            },
        },
        passwordLogin: {
            label: 'パスワード / Password',
            override: {
                required: 'パスワードを入力してください / Enter your password',
                regexPassword:
                    '半角英数字8〜32文字でご入力ください/Please enter 8 to 32 alphanumeric characters.',
            },
        },
        newPassword: {
            label: '新しいパスワード / New Password',
            override: {
                required: '新しいパスワードを入力してください / Enter new password',
            },
        },
        passwordConfirm: {
            label: '確認用パスワード / Confirm Password',
            override: {
                required: '確認用パスワードを入力してください / Enter confirm password',
                confirmed: 'パスワードが一致しません / Passwords do not match',
            },
        },
        companyEmail: {
            label: 'メールアドレス',
            override: {
                required: 'メールアドレスを入力してください/Enter contact email address',
            },
        },
        loginId: {
            label: 'ログインID',
            override: {
                required: 'ログインIDを入力してください/Enter your login ID',
            },
        },
        publicEdDate: {
            label: 'スタートアップ出展日',
            override: {
                required: 'スタートアップ出展日を入力しない場合',
            },
        },
    },
    eng: {
        ...convertToFieldConfig(eng.names),
        companyName: {
            label: 'Company Name',
            override: {
                required: 'Please enter the company name.',
            },
        },
        person_name: {
            label: 'Person in Charge',
            override: {
                required: 'Please enter the name of the person in charge.',
            },
        },
        contractEmail: {
            label: 'Contact Email Address',
            override: {
                required: 'Please enter the contact email address.',
            },
        },
        loginIdAccount: {
            label: 'Login ID',
            override: {
                required: 'Please enter the login ID.',
            },
        },
        password: {
            label: 'Password',
            override: {
                required: 'Please enter the password.',
            },
        },
        location: {
            label: 'Booth Number',
            override: {
                required: 'Please enter the booth number.',
            },
        },
        accountType: {
            label: 'Account Type',
            override: {
                required: 'Please select an account type.',
            },
        },
        tftCategory: {
            label: 'TFT Category',
            override: {
                required: 'Please select a TFT category.',
            },
        },
        startUpExhibitorDateType: {
            label: 'Startup Exhibitor Date',
            override: {
                required: 'Please select a startup exhibitor date.',
            },
        },
        plans: {
            label: 'Plan',
            override: {
                required: 'Please select a plan.',
            },
        },
        inAppBooking: {
            label: 'In-app Booking',
            override: {
                required: 'Please select in-app booking option.',
            },
        },
        'companyEn.companyLogo': {
            label: 'Company Logo',
            override: {
                required: 'This field is required.',
            },
        },
        'companyEn.companyName': {
            label: 'Company Name',
            override: {
                max: 'Character limit exceeded.',
                required: 'This field is required.',
            },
        },
        'companyEn.description': {
            label: 'Company Description',
            override: {
                required: 'This field is required.',
                max: 'Character limit exceeded.',
            },
        },
        'companyEn.keywords.keyword': {
            label: 'Keyword',
            override: {
                required: 'This field is required.',
                max: 'Character limit exceeded.',
            },
        },
        'companyEn.categories': {
            label: 'Category',
            override: {
                required: 'This field is required.',
            },
        },
        'b.en.name': {
            label: 'Mobility Name',
            override: {
                required: 'This field is required.',
            },
        },
        'b.en.nameFurigana': {
            label: 'Furigana name',
            override: {
                required: 'This field is required',
            },
        },
        'b.en.desc': {
            label: 'Mobility Description',
            override: {
                required: 'This field is required.',
                max: 'Character limit exceeded.',
            },
        },
        'b.en.descCardView': {
            label: 'Mobility Description (Card View)',
            override: {
                required: 'This field is required.',
                max: 'Character limit exceeded.',
            },
        },
        'b.en.point': {
            label: 'Mobility Point',
            override: {
                required: 'This field is required.',
                max: 'Character limit exceeded.',
            },
        },
        'b.en.mainImage': {
            label: 'Main Image',
            override: {
                required: 'This field is required.',
            },
        },
        'b.en.youtube': {
            label: 'YouTube URL',
            override: {
                required: 'This field is required.',
            },
        },
        'b.en.youtubeLinks': {
            label: 'YouTube URL',
            override: {
                required: 'This field is required.',
            },
        },
        'event.en.eventName': {
            label: 'Event Name',
            override: {
                required: 'This field is required.',
            },
        },
        'event.en.desc': {
            label: 'Event Description',
            override: {
                required: 'This field is required.',
                max: 'Character limit exceeded.',
            },
        },
        'event.en.mainImage': {
            label: 'Image',
            override: {
                required: 'This field is required.',
            },
        },
        'event.en.youtube': {
            label: 'YouTube URL',
            override: {
                required: 'This field is required.',
            },
        },
        'b.en.image': {
            label: 'Secondary Image',
            override: {
                required: 'This field is required.',
            },
        },
        'b.en.externalImages': {
            label: 'Secondary Image',
            override: {
                required: 'This field is required.',
            },
        },
        'event.en.externalImages': {
            label: 'Secondary Image',
            override: {
                required: 'This field is required.',
            },
        },
        'event.en.youtubeLinks': {
            label: 'YouTube URL',
            override: {
                required: 'This field is required.',
            },
        },
        'event.en.experienceEventReserved': {
            label: 'Experience Event Reservation',
            override: {
                required: 'This field is required',
            },
        },
        'event.en.reserveExternalLinks': {
            label: 'URL',
            override: {
                required: 'This field is required',
            },
        },
        enExternalText: {
            label: 'Text',
            override: {
                required_with: 'Please enter the display text.',
            },
        },
        enExternalLinks: {
            label: 'URL',
        },
        externalText_en: {
            label: 'External links (e.g., brand websites)',
            override: {
                required_with: 'Please enter the display text.',
            },
        },
        externalLink_en: {
            label: 'URL',
        },
        emailJpEn: {
            label: 'メールアドレス / Email address',
            override: {
                required: 'メールアドレスを入力してください / Enter your Email',
            },
        },
        loginIdJpEn: {
            label: 'ログインID / Login ID',
            override: {
                required:
                    '公式アプリ専用アカウントIDを入力してください/Enter your Official App Dedicated Account ID',
                regexPassword:
                    '半角英数字8〜32文字でご入力ください/Please enter 8 to 32 alphanumeric characters.',
            },
        },
        passwordLogin: {
            label: 'パスワード / Password',
            override: {
                required: 'パスワードを入力してください / Enter your password',
                regexPassword:
                    '半角英数字8〜32文字でご入力ください/Please enter 8 to 32 alphanumeric characters.',
            },
        },
        companyEmail: {
            label: 'Email address',
            override: {
                required: 'メールアドレスを入力してください/Enter contact email address',
            },
        },
        loginId: {
            label: 'ログインID',
            override: {
                required: 'ログインIDを入力してください/Enter your login ID',
            },
        },
        publicEdDate: {
            label: 'Startup Exhibit Date',
            override: {
                required: 'Please enter the startup exhibition date',
            },
        },
    },
};

// 4) Configure vee-validate with a single generateMessage
configure({
    validateOnBlur: true,
    validateOnInput: true,
    validateOnChange: false,
    validateOnModelUpdate: true,

    generateMessage: ctx => {
        const currentLocale = i18n.global.locale.value;
        const rawField = ctx.field; // e.g. "companyJp.keyword2"
        const nameIncludesJp = rawField.includes('Jp') || rawField.includes('jp');
        const nameIncludesEn = rawField.includes('En') || rawField.includes('en');
        const isHasNameFieldLocale = nameIncludesJp || nameIncludesEn;
        const lang = isHasNameFieldLocale
            ? nameIncludesJp
                ? 'jpn'
                : 'eng'
            : currentLocale === 'jpn'
                ? 'jpn'
                : 'eng';

        // NEW: strip numeric suffix on keyword fields for lookup
        //      "companyJp.keyword2" → "companyJp.keyword"
        // Remove indices in square brackets, for example: "keywords[1]" -> "keywords"
        const keyWithoutBrackets = rawField.replace(/\[\d+\]/g, '');
        // const lookupKey = rawField.replace(/keyword\d+$/, 'keyword')
        const lookupKey = keyWithoutBrackets.replace(/\d+$/, '');

        // CHANGE: use lookupKey (not rawField) when reading fieldConfig
        const cfg = fieldConfig[lang]?.[lookupKey];

        if (!cfg) {
            const tmpl = globalMessages[lang][ctx.rule.name] || '{field} is invalid';
            return tmpl.replace('{field}', rawField);
        }

        // Build label—append index if you like
        // const label = cfg.label; // e.g. "キーワード"
        const label = cfg.label; // e.g. "キーワード"
        // Choose override or global template
        const tmpl = cfg.override?.[ctx.rule.name] ?? globalMessages[lang][ctx.rule.name];
        // Replace placeholders
        let msg = tmpl?.replace(/{field}/g, label);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params = (ctx.rule.params as Record<string, any>) || {};
        // Handle message validate
        if (ctx.rule.name === 'maxLengthJP') {
            let halfWidthLimit: number | undefined;

            if (typeof params === 'object' && params !== null && !Array.isArray(params)) {
                halfWidthLimit = (params as { length: number }).length;
            } else if (Array.isArray(params)) {
                halfWidthLimit = Number(params[0]);
            }

            if (halfWidthLimit !== undefined) {
                const fullWidthLimit = Math.floor(halfWidthLimit / 2);
                msg = msg.replace('{halfWidthLength}', String(halfWidthLimit));
                msg = msg.replace('{fullWidthLength}', String(fullWidthLimit));

                msg = msg.replace('{length}', String(halfWidthLimit));
            }
        } else {
            if ('length' in params) msg = msg?.replace('{length}', String(params.length));
            if ('min' in params) msg = msg?.replace('{min}', String(params.min));
            if ('max' in params) msg = msg?.replace('{max}', String(params.max));
        }

        return msg;
    },
});
