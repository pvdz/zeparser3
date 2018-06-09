let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
} = require('../../../../src/zetokenizer');

module.exports = (describe, test) => describe('arrays', _ => {

  describe('literal', _ => {

    test('empty array',{
      code: '[]',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'ArrayExpression', elements: []}},
      ]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('empty array',{
      code: '[x]',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'ArrayExpression', elements: [
          {type: 'Identifier', name: 'x'},
        ]}},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('array empty 1 elision', {
      code: `[,]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [null],
        },
      }]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('array empty 2 elisions', {
      code: `[,,]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [null, null],
        },
      }]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('array empty 3 elisions', {
      code: `[,,,]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [null, null, null],
        },
      }]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('array with x and trailing comma', {
      code: `[x,]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [{type: 'Identifier', name: 'x'}],
        },
      }]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('array with x and elisions', {
      code: `[x,,,]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [{type: 'Identifier', name: 'x'}, null, null],
        },
      }]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('array with x and leading comma', {
      code: `[,x]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [null, {type: 'Identifier', name: 'x'}],
        },
      }]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('array with x and two leading commas', {
      code: `[,,x]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [null, null, {type: 'Identifier', name: 'x'}],
        },
      }]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('array with middle elisions', {
      code: `[x,,y]`,
      ast: { type: 'Program', body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'ArrayExpression',
          elements: [{type: 'Identifier', name: 'x'}, null, {type: 'Identifier', name: 'y'}],
        },
      }]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    describe('spread', _ => {
      // https://tc39.github.io/ecma262/#prod-SpreadElement
      // ...AssignmentExpression[+In, ?Yield, ?Await]
      // (in other words; any expression is fair game here)

      test('splat another value', {
        code: '[x, y, ...z]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [ { type: 'Identifier', name: 'x' },
                      { type: 'Identifier', name: 'y' },
                      { type: 'SpreadElement',
                        argument: { type: 'Identifier', name: 'z' } } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can splat in the middle', {
        code: '[x, ...y, z]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [ { type: 'Identifier', name: 'x' },
                      { type: 'SpreadElement',
                        argument: { type: 'Identifier', name: 'y' } },
                      { type: 'Identifier', name: 'z' } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can splat an assignment at the end', {
        code: '[x, y, ...z = arr]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [ { type: 'Identifier', name: 'x' },
                      { type: 'Identifier', name: 'y' },
                      { type: 'SpreadElement',
                        argument:
                          { type: 'AssignmentExpression',
                            left: { type: 'Identifier', name: 'z' },
                            operator: '=',
                            right: { type: 'Identifier', name: 'arr' } } } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can splat a call at the end', {
        code: '[x, y, ...z()]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [ { type: 'Identifier', name: 'x' },
                      { type: 'Identifier', name: 'y' },
                      { type: 'SpreadElement',
                        argument:
                          { type: 'CallExpression',
                            callee: { type: 'Identifier', name: 'z' },
                            arguments: [] } } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('can splat an expression at the end', {
        code: '[x, y, ...z + arr]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [ { type: 'Identifier', name: 'x' },
                      { type: 'Identifier', name: 'y' },
                      { type: 'SpreadElement',
                        argument:
                          { type: 'BinaryExpression',
                            left: { type: 'Identifier', name: 'z' },
                            operator: '+',
                            right: { type: 'Identifier', name: 'arr' } } } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can splat an assignment at the end', {
        code: '[x, ...z = arr, y]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [ { type: 'Identifier', name: 'x' },
                      { type: 'SpreadElement',
                        argument:
                          { type: 'AssignmentExpression',
                            left: { type: 'Identifier', name: 'z' },
                            operator: '=',
                            right: { type: 'Identifier', name: 'arr' } } },
                      { type: 'Identifier', name: 'y' } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can splat a call at the end', {
        code: '[x, ...z(), y]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [
                      { type: 'Identifier', name: 'x' },
                      { type: 'SpreadElement',
                        argument: {
                          type: 'CallExpression',
                          callee: { type: 'Identifier', name: 'z' },
                          arguments: []
                        }
                      },
                      { type: 'Identifier', name: 'y' } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can splat an expression at the end', {
        code: '[x, ...z + arr, y]',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
                { type: 'ArrayExpression',
                  elements:
                    [ { type: 'Identifier', name: 'x' },
                      { type: 'SpreadElement',
                        argument:
                          { type: 'BinaryExpression',
                            left: { type: 'Identifier', name: 'z' },
                            operator: '+',
                            right: { type: 'Identifier', name: 'arr' } } },
                      { type: 'Identifier', name: 'y' } ] } } ] },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });
    });
  });

  describe('destructuring', _ => {

    test('one var, no init, semi',{
      code: '[foo] = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('one var, with init, semi',{
      code: '[foo = A] = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'AssignmentPattern',
              left: {type: 'Identifier', name: 'foo'},
              //operator: '=', // innocent artifact because the AssignmentPattern was an AssignmentExpression before
              right: {type: 'Identifier', name: 'A'},
            },
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('two vars, no init, semi',{
      code: '[foo, bar] = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'foo'},
            {type: 'Identifier', name: 'bar'},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('two vars, both init, semi',{
      code: '[foo = A, bar = B] = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'foo'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'A'}},
            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('let, nested array pattern',{
      code: '[foo, [x,y,z], bar = B] = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'foo'},
            {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'x'},
              {type: 'Identifier', name: 'y'},
              {type: 'Identifier', name: 'z'},
            ]},
            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('let, super nested array pattern to make sure that isnt hardcoded',{
      code: '[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'foo'},
              {type: 'ArrayPattern', elements: [{
                type: 'ArrayPattern', elements: [{
                  type: 'ArrayPattern', elements: [{
                    type: 'ArrayPattern', elements: [{
                      type: 'ArrayPattern', elements: [{
                        type: 'ArrayPattern', elements: [{
                          type: 'ArrayPattern', elements: [{
                            type: 'ArrayPattern', elements: [{
                              type: 'ArrayPattern', elements: [{
                                type: 'ArrayPattern', elements: [{
                                  type: 'ArrayPattern', elements: [{
                                    type: 'ArrayPattern', elements: [{
                                      type: 'ArrayPattern', elements: [
                                      {type: 'Identifier', name: 'x'},
                                      {type: 'Identifier', name: 'y'},
                                      {type: 'Identifier', name: 'z'},
                                    ]},
                                  ]},
                                ]},
                              ]},
                            ]},
                          ]},
                        ]},
                      ]},
                    ]},
                  ]},
                ]},
              ]},
            ]},
            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('let, nested array pattern with inner init and outer init',{
      code: '[foo, [x,y = 20,z], bar = B] = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'foo'},
            {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'x'},
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'y'}, /*operator: '=',*/ right: {type: 'Literal', value: '<TODO>', raw: '20'}},
              {type: 'Identifier', name: 'z'},
            ]},
            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('destructuring array as call arg',{
      code: 'foo([a, b] = arr);',
      ast: {type: 'Program', body: [{type: 'ExpressionStatement',
        expression: {type: 'CallExpression',
          callee: {type: 'Identifier', name: 'foo'},
          arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            },
          ],
        },
      }]},
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('only destructuring inside an expr with assignmentpattern',{
      code: '([foo]) = arr;',
      throws: 'Invalid assignment',
    });

    // (a=/i/) = /i/   -> error (invalid lhs)

    describe('edge cases', _ => {

      test('should not transform the inner array to a arraydestruct', {
        code: '[a,b=[x,y]] = z',
        ast: { type: 'Program', body: [{
          type: 'ExpressionStatement', expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'ArrayPattern',
              elements: [
                {type: 'Identifier', name: 'a'},
                {
                  type: 'AssignmentPattern',
                  left: { type: 'Identifier', name: 'b'},
                  //operator: '=', NO!
                  right: {
                    type: 'ArrayExpression',
                    elements: [
                      {type: 'Identifier', name: 'x'},
                      {type: 'Identifier', name: 'y'},
                    ],
                  },
                },
              ],
            },
            operator: '=',
            right: {type: 'Identifier', name: 'z'},
          },
        }]},
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      })

      test('assignment pattern can only have regular assignments 1', {
        code: '[a,b^=[x,y]] = z',
        throws: 'regular assignment',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('assignment pattern can only have regular assignments 2', {
        code: '[a,b+=[x,y]] = z',
        throws: 'regular assignment',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });
    });
  });
});
