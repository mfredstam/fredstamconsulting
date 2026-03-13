export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        getComputedStyle: 'readonly',
        IntersectionObserver: 'readonly',
        setTimeout: 'readonly',
        addEventListener: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      eqeqeq: 'error',
      'no-console': 'warn',
    },
  },
];
