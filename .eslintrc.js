module.exports = {
  env: {
    'browser': true,
    'es6': true
  },
  extends: [
    'standard',
    'plugin:vue/base'
  ],
  globals: {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  parserOptions: {
    'ecmaVersion': 2018,
    'sourceType': 'module'
    // 'parser': 'babel-eslint'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
  }
}