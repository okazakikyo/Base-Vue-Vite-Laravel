/* eslint-env node */

/**
 * ESLint config for Laravel + Vue 3 + TypeScript (ESLint v8.x classic mode)
 * Put this file at project root as **.eslintrc.cjs**
 */

module.exports = {
    root: true,

    env: {
        browser: true,
        node: true,
        es2023: true,
    },

    // ---------- Parsers ----------
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
    },

    // ---------- Base configs ----------
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
    ],

    // ---------- Plugins ----------
    plugins: ['vue', '@typescript-eslint', 'import', 'unused-imports'],

    // ---------- Custom rules ----------
    rules: {
        /* Vue 3 */
        'vue/multi-word-component-names': 'off',

        /* TypeScript */
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'off', // replaced by unused-imports

        /* Import order & grouping */
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],

        /* Unused imports / variables */
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
    },

    // ---------- Ignore patterns ----------
    ignorePatterns: ['node_modules', 'public', 'storage', 'dist', 'vendor', 'vite.config.*'],

    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@', './resources/js'], // ⚠️ match alias trong vite.config.ts
                ],
                extensions: ['.ts', '.js', '.vue', '.json'],
            },
        },
    },
};
