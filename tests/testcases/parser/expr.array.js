let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');

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

    test('parenthesis should not matter for destructuring ast',{
      code: '([foo]) = arr;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]},
          operator: '=',
          right: {type: 'Identifier', name: 'arr'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
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
