let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('new keyword', _ => {

  test('new on property without parens',{
    code: 'new Foo()',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'NewExpression',
        arguments: [],
        callee: {type: 'Identifier', name: 'Foo'},
      }},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('new on property without parens',{
    code: 'new Foo(x, y, z)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'NewExpression',
        arguments: [
          {type: 'Identifier', name: 'x'},
          {type: 'Identifier', name: 'y'},
          {type: 'Identifier', name: 'z'},
        ],
        callee: {type: 'Identifier', name: 'Foo'},
      }},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('new on property without parens',{
    code: 'new Foo.bar',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'NewExpression',
        arguments: [],
        callee: {type: 'MemberExpression',
          object: {type: 'Identifier', name: 'Foo'},
          property: {type: 'Identifier', name: 'bar'},
          computed: false,
        },
      }},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('new on property without parens',{
    code: 'new Foo.bar()',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'NewExpression',
        arguments: [],
        callee: {type: 'MemberExpression',
          object: {type: 'Identifier', name: 'Foo'},
          property: {type: 'Identifier', name: 'bar'},
          computed: false,
        },
      }},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('new on property without parens',{
    code: 'new Foo.bar(x, y, z)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'NewExpression',
        arguments: [
          {type: 'Identifier', name: 'x'},
          {type: 'Identifier', name: 'y'},
          {type: 'Identifier', name: 'z'},
        ],
        callee: {type: 'MemberExpression',
          object: {type: 'Identifier', name: 'Foo'},
          property: {type: 'Identifier', name: 'bar'},
          computed: false,
        },
      }},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('new on property with parens',{
    code: 'new Foo().bar',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'NewExpression',
        arguments: [],
        callee: {type: 'MemberExpression',
          object: {type: 'Identifier', name: 'Foo'},
          property: {type: 'Identifier', name: 'bar'},
          computed: false,
        },
      }},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });
});
