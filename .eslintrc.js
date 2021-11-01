module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
    },
    env: {
        browser: true,
    },
    extends: [
        'plugin:vue/recommended',
    ],
    plugins: [
        'vue',
    ],
    rules: {
        'vue/html-self-closing': 'off',
        'vue/max-attributes-per-line': 'off',
        'nenerator-start-spacing': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unsafe-finally': 0,
        'no-return-assign': 0,
        'keyword-spacing': ['error', { before: true, after: true }],
    },
};