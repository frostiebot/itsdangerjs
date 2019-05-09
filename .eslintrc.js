module.exports = {
  parser: 'babel-eslint',
  env: {
    amd: true,
    node: true,
    es6: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:import/errors'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    'arrow-parens': [1, 'as-needed', { requireForBlockBody: true }],
    'comma-dangle': [2, { arrays: 'always-multiline', objects: 'always-multiline', imports: 'always-multiline', exports: 'always-multiline', functions: 'never' } ],
    'eol-last': [2, 'always'],
    'indent': [2, 2],
    'no-console': 0,
    'no-duplicate-imports': [2, { includeExports: true }],
    'no-multi-spaces': 2,
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 0, maxBOF: 0 }],
    'no-trailing-spaces': [2, { ignoreComments: true }],
    'quotes': [2, 'single', { allowTemplateLiterals: true }],
    'semi': [2, 'never'],
  }
};
