let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('mixed array/object destructuring', _ => {

  test('object with shorthand inside array',{
    code: '[a, {b}, c] = obj',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'ArrayPattern', elements: [
          {type: 'Identifier', name: 'a'},
          {type: 'ObjectPattern', properties: [
            {
              type: 'Property',
              key: {type: 'Identifier', name: 'b'},
              kind: 'init',
              method: false,
              shorthand: true,
              computed: false,
              value: {type: 'Identifier', name: 'b'},
            },
          ]},
          {type: 'Identifier', name: 'c'},
        ]},
        operator: '=',
        right: {type: 'Identifier', name: 'obj'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('object with property pair inside array',{
    code: '[a, {b:d}, c] = obj',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'ArrayPattern', elements: [
          {type: 'Identifier', name: 'a'},
          {type: 'ObjectPattern', properties: [
            {
              type: 'Property',
              key: {type: 'Identifier', name: 'b'},
              kind: 'init',
              method: false,
              shorthand: false,
              computed: false,
              value: {type: 'Identifier', name: 'd'},
            },
          ]},
          {type: 'Identifier', name: 'c'},
        ]},
        operator: '=',
        right: {type: 'Identifier', name: 'obj'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('object with computed property inside array',{
    code: '[a, {[b]:d}, c] = obj',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'ArrayPattern', elements: [
          {type: 'Identifier', name: 'a'},
          {type: 'ObjectPattern', properties: [
            {
              type: 'Property',
              key: {type: 'Identifier', name: 'b'},
              kind: 'init',
              method: false,
              shorthand: false,
              computed: true,
              value: {type: 'Identifier', name: 'd'},
            },
          ]},
          {type: 'Identifier', name: 'c'},
        ]},
        operator: '=',
        right: {type: 'Identifier', name: 'obj'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('horrible addition. this could also be a valid array without the assignment suffixed',{
    code: '[please, {[make]: it}, stop] = bwahahahaha',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'ArrayPattern', elements: [
          {type: 'Identifier', name: 'please'},
          {type: 'ObjectPattern', properties: [
            {type: 'Property', key: {type: 'Identifier', name: 'make'},  kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'it'}},
          ]},
          {type: 'Identifier', name: 'stop'},
        ]},
        operator: '=',
        right: {type: 'Identifier', name: 'bwahahahaha'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('double assignment in first deconstruction',{
    code: '[pweeze = [pretty] = please, {[make]: it}, stop] = bwahahahaha',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'ArrayPattern', elements: [
          {type: 'AssignmentPattern',
            left: {type: 'Identifier', name: 'pweeze'},
            operator: '=',
            right: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [
                {type: 'Identifier', name: 'pretty'},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'please'},
            },
          },
          {type: 'ObjectPattern', properties: [
            {type: 'Property', key: {type: 'Identifier', name: 'make'},  kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'it'}},
          ]},
          {type: 'Identifier', name: 'stop'},
        ]},
        operator: '=',
        right: {type: 'Identifier', name: 'bwahahahaha'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('horrible addition. this could also be a valid array without the assignment suffixed',{
    code: 'log({foo: [bar]} = obj);',

    ast: {type: 'Program', body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {type: 'Identifier', name: 'log'},
          arguments: [
            {
              type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [{
                type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: false, shorthand: false, computed: false, value: {
                  type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'bar'}],
                },
              }]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ],
        },
      }],
    },
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });
});
