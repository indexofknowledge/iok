module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'jsx-a11y/label-has-associated-control': ['error', {
      required: {
        some: ['nesting', 'id']
      }
    }],
    'jsx-a11y/label-has-for': ['error', {
      required: {
        some: ['nesting', 'id']
      }
    }]
  },
};
