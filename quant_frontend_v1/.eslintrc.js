module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // 分号：禁用分号限制规则
    'semi': [0, 'always'],
    // 单引号：禁用单引号规则
    'quotes': ['off', 'single'],
    // 空格：禁用空格规则
    'space-before-function-paren': ['off'],
    // 缩进：禁用缩进规则
    'indent': ['off'],
    // 逗号：禁用逗号规则
    'comma-dangle': ['off'],
    // 对象属性引号：禁用对象属性引号规则
    'quote-props': ['off'],
    // 箭头函数空格：禁用箭头函数空格规则
    'arrow-spacing': ['off'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
