module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: 'airbnb-base',
    overrides: [],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'max-len': ['error', { code: 150, ignoreStrings: true }],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-param-reassign': ['error', { props: false }],
    },
};
