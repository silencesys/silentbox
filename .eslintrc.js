module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    globals: {
        '__VUE_SSR_CONTEXT__': true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    // add your custom rules here
    rules: {
        'no-unused-vars': ["error", { "args": "none" }]
    }
}
