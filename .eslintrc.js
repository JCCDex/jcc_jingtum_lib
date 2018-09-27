// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    'rules': {
        'standard/no-callback-literal': [0, ["cb", "callback"]],
        'space-before-function-paren': 0,
        'no-useless-constructor': 0,
        'arrow-parens': 0,
        'indent': 0,
        'semi': 0,
        'quotes': 0,
        'eol-last': 0,
        'generator-star-spacing': 0,
        "camelcase": 0
    }
}