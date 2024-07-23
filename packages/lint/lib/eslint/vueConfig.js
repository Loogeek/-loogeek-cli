// import '@rushstack/eslint-patch/modern-module-resolution'

export default {

  env: {
    browser: true,
  },
  extends: ['plugin:vue/recommended',
    // '@vue/eslint-config-airbnb',
    // 'prettier'
  ],
  // parser: 'vue-eslint-parser',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
  },
}
