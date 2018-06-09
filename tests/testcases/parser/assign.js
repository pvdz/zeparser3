let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('assigns', _ => {
  
  test('bin *=',{
    code: 'a *= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '*=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin /=',{
    code: 'a /= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '/=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin %=',{
    code: 'a %= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '%=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin +=',{
    code: 'a += b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '+=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin -=',{
    code: 'a -= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '-=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin <<=',{
    code: 'a <<= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '<<=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin >>=',{
    code: 'a >>= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '>>=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin >>>=',{
    code: 'a >>>= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '>>>=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin &=',{
    code: 'a &= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '&=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin |=',{
    code: 'a |= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '|=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin ^=',{
    code: 'a ^= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '^=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin |=',{
    code: 'a |= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '|=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin **=',{
    code: 'a **= b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '**=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('triple eq chain',{
    code: 'a = b = c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '=',
        right: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '=',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('quad eq chain',{
    code: 'a = b = c = d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '=',
        right: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '=',
          right: {type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'c'},
            operator: '=',
            right: {type: 'Identifier', name: 'd'},
          },
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('assign plus assign', {
    code: 'a = b + c = d',
    throws: 'Cannot assign a value',
    tokens: [$IDENT, $PUNCTUATOR,$IDENT, $PUNCTUATOR,$IDENT, $PUNCTUATOR,$IDENT,$ASI],
  });

  test('assign to single wrapped group', {
    code: '(a) = b;',
    ast: {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '=',
            right: {type: 'Identifier', name: 'b'},
          },
        },
      ],
    },
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('assign to double wrapped group', {
    code: '((a)) = b;',
    ast: {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '=',
            right: {type: 'Identifier', name: 'b'},
          },
        },
      ],
    },
    tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('assign with dud group', {
    code: 'a = ((b)) = c;',
    ast: { type: 'Program',
      body:
        [ { type: 'ExpressionStatement',
          expression:
            { type: 'AssignmentExpression',
              left: { type: 'Identifier', name: 'a' },
              operator: '=',
              right:
                { type: 'AssignmentExpression',
                  left: { type: 'Identifier', name: 'b' },
                  operator: '=',
                  right: { type: 'Identifier', name: 'c' } } } } ] },
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });
});
