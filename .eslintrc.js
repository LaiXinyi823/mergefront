module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    // '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    camelcase: [1,{properties:'never'}],
    'semi': ["error", "always"],
    'space-before-function-paren':0,
    'singleline-html-element-content-newline':0,
    'html-indent':0
  },

  'extends': [
    'plugin:vue/strongly-recommended',
    // '@vue/standard'
  ]
};
