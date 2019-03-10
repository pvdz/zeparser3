import {$IDENT, $NUMBER_HEX, $NUMBER_DEC, $NUMBER_BIN, $NUMBER_OCT, $PUNCTUATOR, $REGEX, $STRING_DOUBLE, $STRING_SINGLE, $ASI} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('objects', _ => {

    describe('literals', _ => {
      test('empty object', {
        code: 'wrap({});',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'wrap'},
                arguments: [{type: 'ObjectExpression', properties: []}],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      describe('identifier properties', _ => {
        test('object with one shorthand', {
          code: 'wrap({a});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'a'},
                          shorthand: true,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('get can be special but can also be shorthand', {
          code: 'wrap({get});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'get'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'get'},
                          shorthand: true,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('set can be special but can also be shorthand', {
          code: 'wrap({set});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'set'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'set'},
                          shorthand: true,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('async can be special but can also be shorthand', {
          code: 'wrap({async});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'async'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'async'},
                          shorthand: true,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('get can be special but can also be destructured shorthand', {
          code: 'wrap({get} = x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'get'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'get'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('set can be special but can also be destructured shorthand', {
          code: 'wrap({set} = x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'set'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'set'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('async can be special but can also be destructured shorthand', {
          code: 'wrap({async} = x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'async'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'async'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one classic property', {
          code: 'wrap({a:b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one classic property get', {
          code: 'wrap({get:b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'get'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one classic property set', {
          code: 'wrap({set:b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'set'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one classic property async', {
          code: 'wrap({async:b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'async'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two shorthand sans init', {
          code: 'wrap({a, b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'a'},
                          shorthand: true,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'b'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: true,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two shorthand with init', {
          code: 'wrap({a, b} = x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'b'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two classic properties', {
          code: 'wrap({a:b, c:d});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'c'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with a shorthand and a classic property', {
          code: 'wrap({a, c:d});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'a'},
                          shorthand: true,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'c'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with a classic property and a shorthand', {
          code: 'wrap({a:b, c});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'c'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'c'},
                          shorthand: true,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object destructuring with a shorthand and a classic property', {
          code: 'wrap({a, c:d} = x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object destructuring with a classic property and a shorthand', {
          code: 'wrap({a:b, c} = x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'c'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test.fail('shorthand cannot have default without init', {
          code: '({x=y})',
        });

        test('shorthand can have default without init when lhs of for-in', {
          code: 'for ({x=y} in a) b',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {type: 'Identifier', name: 'x'},
                        right: {type: 'Identifier', name: 'y'},
                      },
                      shorthand: true,
                    },
                  ],
                },
                right: {type: 'Identifier', name: 'a'},
                body: {
                  type: 'ExpressionStatement',
                  expression: {type: 'Identifier', name: 'b'},
                },
              },
            ],
          },
          tokens: true,
        });

        test('shorthand can have default without init when lhs of for-of', {
          code: 'for ({x=y} of a) b',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForOfStatement',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {type: 'Identifier', name: 'x'},
                        right: {type: 'Identifier', name: 'y'},
                      },
                      shorthand: true,
                    },
                  ],
                },
                right: {type: 'Identifier', name: 'a'},
                await: false,
                body: {
                  type: 'ExpressionStatement',
                  expression: {type: 'Identifier', name: 'b'},
                },
              },
            ],
          },
          tokens: true,
        });

        test.fail('shorthand cannot have default without init of for-loop', {
          code: 'for ({x=y};;);',
          desc: 'the test is to assert this is properly acceptable with for-in and for-of but rejected with a for-loop',
        });
      });

      describe('number properties', _ => {
        test('object with one number property', {
          code: 'wrap({15:b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '15'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one number property', {
          code: 'wrap({.9:a, 0x84:b, 0b1:c, 0o27:d, 1e234:e});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '.9'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'a'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0x84'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0b1'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'c'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0o27'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '1e234'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'e'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_HEX,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_BIN,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_OCT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with two number properties', {
          code: 'wrap({1:b, 0:d});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '1'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
        // error with number as shorthand
      });

      describe('string properties', _ => {
        test('object with one double quoted property', {
          code: 'wrap({"a":b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"a"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two double quoted properties', {
          code: 'wrap({"a":b, "c":d});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"a"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"c"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one double quoted property', {
          code: "wrap({'a':b});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'a'"},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two double quoted properties', {
          code: "wrap({'a':b, 'c':d});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'a'"},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'c'"},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two double quoted properties', {
          code: "wrap({'a':b, c:d});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'a'"},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'c'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with a single and a double quoted property', {
          code: 'wrap({"a":b, \'c\':d});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"a"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'c'"},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('computed properties', _ => {
        test('object literal, one computed property', {
          code: 'wrap({[a]:b});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: true,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object literal, one computed property', {
          code: 'wrap({[a]:b, [15]:d});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          computed: true,
                          value: {type: 'Identifier', name: 'b'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '15'},
                          kind: 'init',
                          method: false,
                          computed: true,
                          value: {type: 'Identifier', name: 'd'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        // computed property that is a comma expression
      });

      describe('identifier method', _ => {

        test('object with one method', {
          code: 'wrap({foo(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        [
          'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
          'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
          'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'true',
          'false', 'enum', 'eval', 'arguments', 'implements', 'package', 'protected', 'interface', 'private',
          'public', 'await', 'yield',
          'let',
          'static', 'async', 'get', 'set',
        ].forEach(ident => {

          describe('special keys with ident=' + ident, _ => {

            test('as regular property in object', {
              code: '({' + ident + ': x});',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: ident},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'x'},
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('as regular property in arrow', {
              code: '({' + ident + ': x}) => x;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ArrowFunctionExpression',
                      params: [
                        {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: ident},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'x'},
                              shorthand: false,
                            },
                          ],
                        },
                      ],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {type: 'Identifier', name: 'x'},
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('as regular property in destructuring assignment', {
              code: '({' + ident + ': x} = y);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: ident},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'x'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'y'},
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('as method in obj', {
              code: '({' + ident + '(){}});',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: ident},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('as method in arrow', {
              code: '({' + ident + '(){}}) => x;',
              throws: true,
            });

            test('as method in destructuring assignment', {
              code: '({' + ident + '(){}} = y);',
              throws: true,
            });

            test('as static method in obj', {
              code: '({static ' + ident + '(){}});',
              throws: true,
            });

            test('as generator in obj', {
              code: '({* ' + ident + '(){}});',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: ident},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('as getter in obj', {
              code: '({get ' + ident + '(){}});',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: ident},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('as setter in obj', {
              code: '({set ' + ident + '(x){}});',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: ident},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            id: null,
                            params: [{type: 'Identifier', name: 'x'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('as async method in obj', {
              code: '({async ' + ident + '(){}});',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: ident},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test.pass('as async generator in obj', {
              code: '({async * ' + ident + '(){}});',
            });

            test('as static getter in obj', {
              code: '({static get ' + ident + '(){}});',
              throws: true,
            });

            test('as static generator in obj', {
              code: '({static * ' + ident + '(){}});',
              desc: 'not because static generator but because static in object',
              throws: true,
            });

            test('as static setter in obj', {
              code: '({static set ' + ident + '(x){}});',
              throws: true,
            });

            test('as static async method in obj', {
              code: '({static async ' + ident + '(){}});',
              throws: true,
            });

            test('as static async generator in obj', {
              code: '({static async * ' + ident + '(){}});',
              desc: 'note this is because of static, not async generator',
              throws: true,
            });
          });
        });

        test('object with one method get', {
          code: 'wrap({get(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'get'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one method set', {
          code: 'wrap({set(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'set'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one method async', {
          code: 'wrap({async(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'async'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two methods', {
          code: 'wrap({foo(){}, bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with one method with params', {
          code: 'wrap({foo(a,b,c){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}, {type: 'Identifier', name: 'c'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });

      describe('number method', _ => {
        test('object with one method', {
          code: 'wrap({0(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two methods', {
          code: 'wrap({.9(){}, 0x84(){}, 0b1(){}, 0o27(){}, 1e234(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '.9'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0x84'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0b1'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '0o27'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '1e234'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_HEX,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_BIN,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_OCT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });

      describe('string method', _ => {
        test('object with one double string keyed method', {
          code: 'wrap({"foo"(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one single string keyed method', {
          code: "wrap({'foo'(){}});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('async method', _ => {
        test('object with one async method', {
          code: 'wrap({async foo(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one async method get', {
          code: 'wrap({async get(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'get'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one async method set', {
          code: 'wrap({async set(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'set'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one async method async', {
          code: 'wrap({async async(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'async'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one async dstring method', {
          code: 'wrap({async "foo"(){}});',
          callback(ast, tokens, astJson) { return astJson.includes('"async":true'); },
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one async sstring method', {
          code: "wrap({async 'foo'(){}});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one async number method', {
          code: 'wrap({async 100(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '100'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one async method', {
          code: 'wrap({async [foo](){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with two async methods', {
          code: 'wrap({async foo(){}, async bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an async method and an ident method', {
          code: 'wrap({async foo(){}, bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an async method and an ident method', {
          code: 'wrap({foo(){}, async bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });

      describe('generator method', _ => {
        test('object with one async method', {
          code: 'wrap({*foo(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one generator method get', {
          code: 'wrap({*get(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'get'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one generator method set', {
          code: 'wrap({*set(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'set'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one generator method async', {
          code: 'wrap({*async(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'async'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one generator dstring method', {
          code: 'wrap({*"foo"(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one generator sstring method', {
          code: "wrap({*'foo'(){}});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one generator number method', {
          code: 'wrap({*123(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '123'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one generator dynamic prop method', {
          code: 'wrap({*[foo](){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with two generator methods', {
          code: 'wrap({* foo(){},*bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an generator method and an ident method', {
          code: 'wrap({* foo(){}, bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an ident method and a generator method', {
          code: 'wrap({foo(){}, *bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: true,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });

      describe('getters (ident)', _ => {
        test('object with one getter method', {
          code: 'wrap({get foo(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one getter method get', {
          code: 'wrap({get get(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'get'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two getter methods', {
          code: 'wrap({get foo(){}, get bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an getter method and an ident method', {
          code: 'wrap({get foo(){}, bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an getter method and an ident method', {
          code: 'wrap({foo(){}, get bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test.fail('getters can not have arguments', {
          code: 'wrap({get foo(a){}});',
        });
      });

      describe('getters (computed)', _ => {
        test('object with one getter method', {
          code: 'wrap({get [foo](){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'get',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with two getter methods', {
          code: 'wrap({get [foo](){}, get [bar](){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'get',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an getter method and an ident method', {
          code: 'wrap({get [foo](){}, [bar](){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'get',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an getter method and an ident method', {
          code: 'wrap({[foo](){}, get [bar](){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });

      describe('getters (rest)', _ => {
        test('object with one getter method', {
          code: "wrap({get 'foo'(){}});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one getter method', {
          code: 'wrap({get "foo"(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one getter method', {
          code: 'wrap({get 123(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '123'},
                          kind: 'get',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test.fail('getter number must be method', {
          code: 'wrap({get 123: x});',
        });

        test.fail('getter string must be method', {
          code: 'wrap({get "abc": x});',
        });
      });

      describe('setters (ident)', _ => {

        test('object with one setter method', {
          code: 'wrap({set foo(a){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            id: null,
                            params: [{type: 'Identifier', name: 'a'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one setter method', {
          code: 'wrap({set get(a){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'get'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            id: null,
                            params: [{type: 'Identifier', name: 'a'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two setter methods', {
          code: 'wrap({set foo(b){}, set bar(d){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'b'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'd'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an setter method and an ident method', {
          code: 'wrap({set foo(c){}, bar(){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'c'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an setter method and an ident method', {
          code: 'wrap({foo(){}, set bar(e){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'e'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test.fail('setters must have some args', {
          code: 'wrap({set bar(){}});',
        });

        test.fail('setters may not have more than one arg', {
          code: 'wrap({set bar(a,b){}});',
        });
      });

      describe('setters (computed)', _ => {
        test('object with one setter method', {
          code: 'wrap({set [foo](a){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'set',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'a'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with two setter methods', {
          code: 'wrap({set [foo](b){}, set [bar](d){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'set',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'b'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'd'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an setter method and an ident method', {
          code: 'wrap({set [foo](c){}, [bar](){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'set',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'c'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with an setter method and an ident method', {
          code: 'wrap({[foo](){}, set [bar](e){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'e'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });

      describe('setters (destruct arg)', _ => {
        test('small regression', {
          code: 'function x([a, b]){};',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'x'},
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                  },
                ],
                body: {type: 'BlockStatement', body: []},
              },
              {type: 'EmptyStatement'},
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one setter method', {
          code: 'wrap({set [foo]([a, b]){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'set',
                          method: false,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });

      describe('setters (rest)', _ => {
        test('object with one setter method', {
          code: "wrap({set 'foo'(a){}});",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'a'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one setter method', {
          code: 'wrap({set "foo"(a){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'a'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one setter method', {
          code: 'wrap({set 123(a){}});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '123'},
                          kind: 'set',
                          method: false,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,                            id: null,
                            params: [{type: 'Identifier', name: 'a'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test.fail('setter number must be method', {
          code: 'wrap({set 123: x});',
        });

        test.fail('setter string must be method', {
          code: 'wrap({set "abc": x});',
        });
      });

      test('property name followup error', {
        code: '({foo += bar})',
        desc: 'just tripping an error path',
        throws: 'Unexpected character',
      });

      test('dynamic properties can not be shorthand', {
        code: 'call({[x]})',
        throws: 'must be followed by a colon or paren',
      });

      test('can not use async/generators on getters/setters', {
        code: '({async get foo(){}});',
        throws: 'Must have left paren',
      });

      test('can not use async/generators on getters/setters', {
        code: '({get set foo(){}});',
        throws: 'Must have left paren',
      });

      test('can not use async/generators on getters/setters', {
        code: '({async set foo(){}});',
        throws: 'Must have left paren',
      });

      test.fail('getters with non-zero param count', {
        code: '({get foo(x){}});',
      });

      test.pass('setters with zero param count', {
        code: '({get foo(){}});',
       });

      test.fail('setters with two params', {
        code: '({get foo(x,y){}});',
      });

      describe('dont allow semi because it shares code with class', _ => {

        test('instead of comma', {
          code: '({x:y;a:b})',
          throws: true,
        });

        test('trailing semi', {
          code: '({x:y;})',
          throws: true,
        });

        test('leading semi', {
          code: '({;x:y,a:b})',
          throws: true,
        });

        test('only a semi', {
          code: '({;})',
          throws: true,
        });
      });

      test('key:value pair, typeof ident', {
        code: '({foo: typeof x});',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'foo'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'UnaryExpression',
                      operator: 'typeof',
                      prefix: true,
                      argument: {type: 'Identifier', name: 'x'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('key:value pair, division', {
        code: '({foo: true / false});',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'foo'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'BinaryExpression',
                      left: {type: 'Literal', value: true, raw: 'true'},
                      operator: '/',
                      right: {type: 'Literal', value: false, raw: 'false'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('key:value pair, typeof value, regex sans flag', {
        code: '({foo: typeof /x/});',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'foo'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'UnaryExpression',
                      operator: 'typeof',
                      prefix: true,
                      argument: {type: 'Literal', value: '<TODO>', raw: '/x/'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('key:value pair, typeof value, regex with flag', {
        code: '({foo: typeof /x/g});',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'foo'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'UnaryExpression',
                      operator: 'typeof',
                      prefix: true,
                      argument: {type: 'Literal', value: '<TODO>', raw: '/x/g'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test.fail('happy learned to putt', {
        code: '({this});',
        // https://tc39.github.io/ecma262/#prod-ObjectLiteral
        // https://tc39.github.io/ecma262/#prod-PropertyDefinitionList
        // https://tc39.github.io/ecma262/#prod-PropertyDefinition
        // https://tc39.github.io/ecma262/#prod-IdentifierReference
        // https://tc39.github.io/ecma262/#prod-Identifier
        // Identifier : IdentifierName but not ReservedWord
      });

      [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
        'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
        'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'true',
        'false', 'enum',
      ].forEach(keyword => {
        test.fail('cannot use as shorthand objlit ['+keyword+']', {
          code: '({'+keyword+'});',
        });

        test.fail('cannot use as assignment pattern ['+keyword+']', {
          code: '({'+keyword+'} = x);',
        });

        test.fail('cannot use as arrow header ['+keyword+']', {
          code: '({'+keyword+'}) => x;',
        });

        test.fail('cannot use as binding destruct ['+keyword+']', {
          code: 'const {'+keyword+'} = x;',
        });
      });

      [
        'implements', 'package', 'protected', 'interface',
        'private', 'public', 'await', 'yield', 'static', 'let',
      ].forEach(keyword => {
        test.fail_strict('cannot use as shorthand objlit ['+keyword+']', {
          code: '({'+keyword+'});',
        });

        test.fail_strict('cannot use as assignment pattern ['+keyword+']', {
          code: '({'+keyword+'} = x);',
        });

        test.fail_strict('cannot use as arrow header ['+keyword+']', {
          code: '({'+keyword+'}) => x;',
        });

        if (keyword !== 'let') {
          test.fail_strict('cannot use as binding destruct ['+keyword+']', {
            code: 'const {'+keyword+'} = x;',
          });
        }
      });

      [
        'await',
      ].forEach(keyword => {
        test.pass('cannot use as shorthand objlit ['+keyword+']', {
          code: '({'+keyword+'});',
          MODULE: {throws: true},
        });

        test.pass('cannot use as assignment pattern ['+keyword+']', {
          code: '({'+keyword+'} = x);',
          MODULE: {throws: true},
        });

        test.pass('cannot use as arrow header ['+keyword+']', {
          code: '({'+keyword+'}) => x;',
          MODULE: {throws: true},
        });

        test.pass('cannot use as binding destruct ['+keyword+']', {
          code: 'const {'+keyword+'} = x;',
          MODULE: {throws: true},
        });
      });

      [
        'eval', 'arguments',
      ].forEach(keyword => {
        test.pass('cannot use as shorthand objlit ['+keyword+']', {
          code: '({'+keyword+'});',
        });

        test.fail_strict('cannot use as assignment pattern ['+keyword+']', {
          code: '({'+keyword+'} = x);',
        });

        test.fail_strict('cannot use as arrow header ['+keyword+']', {
          code: '({'+keyword+'}) => x;',
        });

        test.fail_strict('cannot use as binding destruct ['+keyword+']', {
          code: 'const {'+keyword+'} = x;',
        });
      });

      test.fail('shorthands can NOT be keyword', {
        code: 'let o = {true, false, super, this, null};',
      });

      test.pass('eval as shorthand keys', {
        code: 'x = {eval}',
      });

      test.pass('arguments as shorthand keys', {
        code: 'x = {arguments}',
      });
    });

    describe('destructuring', _ => {
      test('empty object destruct', {
        code: 'wrap({}=obj);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'wrap'},
                arguments: [
                  {
                    type: 'AssignmentExpression',
                    left: {type: 'ObjectPattern', properties: []},
                    operator: '=',
                    right: {type: 'Identifier', name: 'obj'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      describe('identifier properties', _ => {
        test('object destruct with one shorthand', {
          code: 'wrap({a}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object destruct with one classic property', {
          code: 'wrap({a:b}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object destruct with two shorthand', {
          code: 'wrap({a, b}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'b'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object destruct with two classic properties', {
          code: 'wrap({a:b, c:d}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object destruct with a shorthand and a classic property', {
          code: 'wrap({a, c:d}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object destruct with a classic property and a shorthand', {
          code: 'wrap({a:b, c}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'c'},
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty object destructs fine', {
          code: 'wrap({}=x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {type: 'ObjectPattern', properties: []},
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one shorthand with initializer has to be invalid when not destructuring', {
          code: 'wrap({a=b});',
          throws: 'must be destructured',
        });

        test('object destruct with one shorthand with initializer, invalid when not destructuring', {
          code: 'wrap({a=b}=c);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'AssignmentPattern',
                              left: {type: 'Identifier', name: 'a'},
                              right: {type: 'Identifier', name: 'b'},
                            },
                            shorthand: true,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'c'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object destruct with one pair with initializer', {
          code: 'wrap({a:v=b}=c);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'AssignmentPattern',
                              left: {type: 'Identifier', name: 'v'},
                              right: {type: 'Identifier', name: 'b'},
                            },
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'c'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        describe('shorthand identifiers check', _ => {
          [
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
            'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
            'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'true',
            'false', 'enum',
          ].forEach(keyword => {
            test('keyword='+keyword, {
              code: '({'+keyword+'}) => null',
              throws: true,
            });
          });

          test('keyword=let', {
            code: '({let}) => null',
            throws: true,
            SLOPPY_SCRIPT: {
              desc: 'let is a valid var name in sloppy mode and destructuring is not "strict" by default',
              ast: true,
              tokens: true,
            },
          });

          ['static', 'implements', 'package', 'protected', 'interface', 'private', 'public', 'await', 'yield'].forEach(keyword => {
            test('strict-mode only keyword=' + keyword, {
              code: '({'+keyword+'}) => null',
              throws: true,
              SLOPPY_SCRIPT: {
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        params: [
                          {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: keyword},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: keyword},
                                shorthand: true,
                              },
                            ],
                          },
                        ],
                        id: null,
                        generator: false,
                        async: false,
                        expression: true,
                        body: {type: 'Literal', value: null, raw: 'null'},
                      },
                    },
                  ],
                },
                tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
              },
            });
          });

          ['eval', 'arguments'].forEach(keyword => {
            test.fail_strict('eval/arguments =' + keyword, {
              code: '({'+keyword+'}) => null',
            });
          });
        });

        describe('a:b identifier check', _ => {
          [
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
            'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
            'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'true',
            'false', 'enum',
          ].forEach(keyword => {
            test('arrow, keyword='+keyword, {
              code: '({ggg: '+keyword+'}) => null',
              throws: true,
            });

            test('assign, keyword='+keyword, {
              code: '({ggg: '+keyword+'} = null)',
              throws: true,
            });

            test('objlit, keyword='+keyword, {
              code: '({ggg: '+keyword+'} = null)',
              throws: true,
            });
          });

          test('arrow, keyword=let', {
            code: '({x:let}) => null',
            throws: true,
            SLOPPY_SCRIPT: {
              desc: 'let is a valid var name in sloppy mode and destructuring is not "strict" by default',
              ast: true,
              tokens: true,
            },
          });

          test('assign, keyword=let', {
            code: '({x:let} = null)',
            throws: true,
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'x'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'let'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Literal', value: null, raw: 'null'},
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
            },
          });

          test('objlit, keyword=let', {
            code: '({x:let})',
            throws: true,
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'x'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'let'},
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            },
          });

          ['eval', 'arguments', 'static', 'implements', 'package', 'protected', 'interface', 'private', 'public', 'await', 'yield'].forEach(keyword => {
            test('strict-mode only, arrow, keyword=' + keyword, {
              code: '({xxxx:'+keyword+'}) => null',
              throws: true,
              SLOPPY_SCRIPT: {
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        params: [
                          {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'xxxx'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: keyword},
                                shorthand: false,
                              },
                            ],
                          },
                        ],
                        id: null,
                        generator: false,
                        async: false,
                        expression: true,
                        body: {type: 'Literal', value: null, raw: 'null'},
                      },
                    },
                  ],
                },
                tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
              },
            });

            test('strict-mode only, assign, keyword=' + keyword, {
              code: '({xxxx:'+keyword+'} = null)',
              throws: true,
              SLOPPY_SCRIPT: {
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'xxxx'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: keyword},
                              shorthand: false,
                            },
                          ],
                        },
                        operator: '=',
                        right: {type: 'Literal', value: null, raw: 'null'},
                      },
                    },
                  ],
                },
                tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
              },
            });

            test('strict-mode only, objlit, keyword=' + keyword, {
              code: '({xxxx:'+keyword+'})',
              ...(['eval', 'arguments'].includes(keyword) ? {} : {
                STRICT: {
                  throws: true,
                },
              }),
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'xxxx'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: keyword},
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });
        });

        test('non-shorthand property with init', {
          code: 'wrap({a:b=x}=y);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'AssignmentPattern',
                              left: {type: 'Identifier', name: 'b'},
                              right: {type: 'Identifier', name: 'x'},
                            },
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'y'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('string properties', _ => {
        test('object with shorthand quoted key', {
          code: 'wrap({"a"}=obj);',
          desc: 'only ident can be shorthand',
          throws: true,
        });

        test('object with one double quoted property', {
          code: 'wrap({"a":b}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: '"a"'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two double quoted properties', {
          code: 'wrap({"a":b, "c":d}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: '"a"'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: '"c"'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with one single quoted property', {
          code: "wrap({'a':b}=obj);",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: "'a'"},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with two single quoted properties', {
          code: "wrap({'a':b, 'c':d}=obj);",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: "'a'"},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: "'c'"},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with mixed quoted properties', {
          code: "wrap({'a':b, c:d}=obj);",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: "'a'"},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object with other mixed quoted properties', {
          code: "wrap({a:b, 'c':d}=obj);",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: "'c'"},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        describe('value that would never destruct', _ => {

          test('object', {
            code: '({"x": y+z})',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {
                          type: 'BinaryExpression',
                          left: {type: 'Identifier', name: 'y'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'z'},
                        },
                        shorthand: false,
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('destructing', {
            code: '({"x": y+z} = x)',
            throws: true,
          });

          test('arrow', {
            code: '({"x": y+z}) => x',
            throws: true,
          });
        });

        describe('array value', _ => {

          describe('destructible', _ => {

            test('object', {
              code: '({"x": [y]})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'ArrayExpression',
                            elements: [{type: 'Identifier', name: 'y'}],
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test('destructing', {
              code: '({"x": [y]} = x)',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'y'}],
                            },
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
            });

            test('arrow', {
              code: '({"x": [y]}) => x',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ArrowFunctionExpression',
                      params: [
                        {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {
                                type: 'ArrayPattern',
                                elements: [{type: 'Identifier', name: 'y'}],
                              },
                              shorthand: false,
                            },
                          ],
                        },
                      ],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {type: 'Identifier', name: 'x'},
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
            });
          });

          describe('non-destructible', _ => {

            test('object', {
              code: '({"x": [y + x]})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'ArrayExpression',
                            elements: [
                              {
                                type: 'BinaryExpression',
                                left: {type: 'Identifier', name: 'y'},
                                operator: '+',
                                right: {type: 'Identifier', name: 'x'},
                              },
                            ],
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test('destructing', {
              code: '({"x": [y + x]} = x)',
              throws: true,
            });

            test('arrow', {
              code: '({"x": [y + x]}) => x',
              throws: true,
            });
          });

          describe('with tail', _ => {

            test('object', {
              code: '({"x": [y].slice(0)})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'CallExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ArrayExpression',
                                elements: [{type: 'Identifier', name: 'y'}],
                              },
                              property: {type: 'Identifier', name: 'slice'},
                              computed: false,
                            },
                            arguments: [{type: 'Literal', value: '<TODO>', raw: '0'}],
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test.fail('destructing', {
              code: '({"x": [y].slice(0)} = x)',
            });

            test('arrow', {
              code: '({"x": [y].slice(0)}) => x',
              throws: true,
            });
          });
        });

        describe('object value', _ => {

          describe('destructible', _ => {

            test('object', {
              code: '({"x": {y: z}})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'y'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'z'},
                                shorthand: false,
                              },
                            ],
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test('destructing', {
              code: '({"x": {y: z}} = x)',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: false,
                                },
                              ],
                            },
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
            });

            test('arrow', {
              code: '({"x": {y: z}}) => x',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ArrowFunctionExpression',
                      params: [
                        {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {
                                type: 'ObjectPattern',
                                properties: [
                                  {
                                    type: 'Property',
                                    key: {type: 'Identifier', name: 'y'},
                                    kind: 'init',
                                    method: false,
                                    computed: false,
                                    value: {type: 'Identifier', name: 'z'},
                                    shorthand: false,
                                  },
                                ],
                              },
                              shorthand: false,
                            },
                          ],
                        },
                      ],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {type: 'Identifier', name: 'x'},
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
            });
          });

          describe('non-destructible', _ => {

            test('object', {
              code: '({"x": {a: y + x}})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'a'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {
                                  type: 'BinaryExpression',
                                  left: {type: 'Identifier', name: 'y'},
                                  operator: '+',
                                  right: {type: 'Identifier', name: 'x'},
                                },
                                shorthand: false,
                              },
                            ],
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test('destructing', {
              code: '({"x": {a: y + x}} = x)',
              throws: true,
            });

            test('arrow', {
              code: '({"x": {a: y + x}}) => x',
              throws: true,
            });
          });

          describe('with tail', _ => {

            test('object', {
              code: '({"x": {a: y + x}.slice(0)})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'CallExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ObjectExpression',
                                properties: [
                                  {
                                    type: 'Property',
                                    key: {type: 'Identifier', name: 'a'},
                                    kind: 'init',
                                    method: false,
                                    computed: false,
                                    value: {
                                      type: 'BinaryExpression',
                                      left: {type: 'Identifier', name: 'y'},
                                      operator: '+',
                                      right: {type: 'Identifier', name: 'x'},
                                    },
                                    shorthand: false,
                                  },
                                ],
                              },
                              property: {type: 'Identifier', name: 'slice'},
                              computed: false,
                            },
                            arguments: [{type: 'Literal', value: '<TODO>', raw: '0'}],
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test('destructing', {
              code: '({"x": {a: y + x}.slice(0)} = x)',
              throws: true,
            });

            test('arrow', {
              code: '({"x": {a: y + x}.slice(0)}) => x',
              throws: true,
            });
          });
        });

        describe('number value', _ => {

          describe('non-destructible', _ => {

            test('object', {
              code: '({"x": 600})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Literal', value: '<TODO>', raw: '600'},
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test('destructing', {
              code: '({"x": 600} = x)',
              throws: true,
            });

            test('arrow', {
              code: '({"x": 600}) => x',
              throws: true,
            });
          });

          describe('with tail', _ => {
-
            test('object', {
              code: '({"x": 600..xyz})',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Literal', value: '<TODO>', raw: '"x"'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'MemberExpression',
                            object: {type: 'Literal', value: '<TODO>', raw: '600.'},
                            property: {type: 'Identifier', name: 'xyz'},
                            computed: false,
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });

            test.pass('destructing', {
              code: '({"x": 600..xyz} = x)',
            });

            test('arrow', {
              code: '({"x": 600..xyz}) => x',
              throws: true,
            });
          });
        });
      });

      describe('computed properties', _ => {

        test('object literal, one computed property', {
          code: 'wrap({[a]:b}=obj);',
          desc: 'you can destructure computed properties all the same',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: true,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('object literal, one computed property', {
          code: 'wrap({[a]:b, [15]:d}=obj);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'wrap'},
                  arguments: [
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: true,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Literal', value: '<TODO>', raw: '15'},
                            kind: 'init',
                            method: false,
                            computed: true,
                            value: {type: 'Identifier', name: 'd'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'obj'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        // computed property that is a comma expression
      });

      test('regression regarding shorthands', {
        code: 'x = {y}',
        desc: 'this was incorrectly flagged to have to destruct but thats just not true',
        ast: true,
        tokens: true,
      });

      test('in comma expr', {
        code: 'x, {foo, bar} = doo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [
                  {type: 'Identifier', name: 'x'},
                  {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'foo'},
                          shorthand: true,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'bar'},
                          shorthand: true,
                        },
                      ],
                    },
                    operator: '=',
                    right: {type: 'Identifier', name: 'doo'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('with default in comma expr', {
        code: 'x, {foo = y, bar} = doo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [
                  {type: 'Identifier', name: 'x'},
                  {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'foo'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'foo'},
                            right: {type: 'Identifier', name: 'y'},
                          },
                          shorthand: true,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Identifier', name: 'bar'},
                          shorthand: true,
                        },
                      ],
                    },
                    operator: '=',
                    right: {type: 'Identifier', name: 'doo'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('that cant destruct in comma expr', {
        code: 'x, {x: foo + y, bar} = doo',
        throws: 'not destructible',
      });

      test('inside assignment chain', {
        code: 'x = {a, b} = y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 'a'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Identifier', name: 'a'},
                        shorthand: true,
                      },
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 'b'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Identifier', name: 'b'},
                        shorthand: true,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'y'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('left of double assignment chain', {
        code: '({a, b} = c = d)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'a'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'a'},
                      shorthand: true,
                    },
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'b'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'b'},
                      shorthand: true,
                    },
                  ],
                },
                operator: '=',
                right: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('arr with yield', {
        code: 'result = [x[yield]] = vals;',
        throws: 'strict mode',
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'result'},
                  operator: '=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'x'},
                          property: {type: 'Identifier', name: 'yield'},
                          computed: true,
                        },
                      ],
                    },
                    operator: '=',
                    right: {type: 'Identifier', name: 'vals'},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
      });

      test('dynamic property as prop val can assign destruct', {
        code: '({ x: x[Y] } = x);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'x'},
                        property: {type: 'Identifier', name: 'Y'},
                        computed: true,
                      },
                      shorthand: false,
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('destruct assign with default when key is a string', {
        code: 'a={"b":c=d}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Literal', value: '<TODO>', raw: '"b"'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'c'},
                        operator: '=',
                        right: {type: 'Identifier', name: 'd'},
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      describe('ident', _ => {

        test.fail('destruct to keyword with destruct', {
          code: 's = {s: true = x} = x',
        });

        test.fail('assignment to keyword without destruct', {
          code: 's = {s: true = x}',
        });

        test.fail('using keyword as the value (new)', {
          code: 's = {s: new}',
        });

        test.fail('using keyword as the value (typeof)', {
          code: 's = {s: typeof}',
        });

        test('using keyword as the value (true)', {
          code: 's = {s: true}',
          desc: 'must be literal',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 's'},
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 's'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Literal', value: true, raw: 'true'},
                        shorthand: false,
                      },
                    ],
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('using keyword as the value (this)', {
          code: 's = {s: this}',
          desc: 'must be ThisExpression',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 's'},
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 's'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'ThisExpression'},
                        shorthand: false,
                      },
                    ],
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });
      });

      describe('string', _ => {

        test.fail('destruct to `true` with destruct', {
          code: 's = {"foo": true = x} = x',
        });

        test.fail('destruct to `false` with destruct', {
          code: 's = {"foo": false = x} = x',
        });

        test.fail('destruct to `null` with destruct', {
          code: 's = {"foo": null = x} = x',
        });

        test.fail('destruct to `this` with destruct', {
          code: 's = {"foo": this = x} = x',
        });

        test.fail('destruct to `super` with destruct', {
          code: 's = {"foo": super = x} = x',
        });

        test.fail_strict('destruct to `yield` with destruct', {
          code: 's = {"foo": yield = x} = x',
        });

        test.fail('destruct to `yield a` with destruct', {
          code: 's = {"foo": yield a = x} = x',
        });

        test.fail('destruct to `yield regex` should not end up with division', {
          code: 's = {"foo": yield /fail/g = x} = x',
        });

        test.fail('destruct to generatored `yield` with destruct', {
          code: 'function *g() {   s = {"foo": yield = x} = x   }',
        });

        test.fail('destruct to generatored `yield a` with destruct', {
          code: 'function *g() {   s = {"foo": yield a = x} = x   }',
        });

        test.fail('destruct to generatored `yield regex` with regex check', {
          code: 'function *g() {   s = {"foo": yield /brains/ = x} = x   }',
        });

        test.pass('destruct to `await` with destruct', {
          code: 's = {"foo": await = x} = x',
          MODULE: {throws: 'await'},
        });

        test.fail('destruct to `await a` with destruct', {
          code: 's = {"foo": await a = x} = x',
        });

        test.fail('destruct to `await regex` should not end up with division', {
          code: 's = {"foo": await /fail/g = x} = x',
        });

        test.fail('destruct to async `await` with destruct', {
          code: 'async function g() {   s = {"foo": await = x} = x   }',
        });

        test.fail('destruct to async `await a` with destruct', {
          code: 'async function g() {   s = {"foo": await a = x} = x   }',
        });

        test.fail('destruct to async `await regex` with regex check', {
          code: 'async function g() {   s = {"foo": await /brains/ = x} = x   }',
        });

        test.fail('assignment to keyword without destruct', {
          code: 's = {"foo": true = x}',
        });

        test.fail('using keyword as the value (new)', {
          code: 's = {"foo": new}',
        });

        test.fail('using keyword as the value (typeof)', {
          code: 's = {"foo": typeof}',
        });

        test('using keyword as the value (true)', {
          code: 's = {"foo": true}',
          desc: 'must be literal',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 's'},
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Literal', value: true, raw: 'true'},
                        shorthand: false,
                      },
                    ],
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('using keyword as the value (this)', {
          code: 's = {"foo": this}',
          desc: 'must be ThisExpression',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 's'},
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'ThisExpression'},
                        shorthand: false,
                      },
                    ],
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });
      });

      test('object rest with assign cannot destruct', {
        code: 'x={...x=y}=z',
        throws: 'destructible',
      });

      describe('spreadrest keywords', _ => {

        test.pass('spread a value keyword', {
          code: 'x={...true}',
          desc: 'runtime error',
        });

        test('destruct assign rest a value keyword', {
          code: 'x={...true} = x',
          throws: 'destructible',
        });

        test.fail('arrow rest a value keyword', {
          code: 'x={...true} => x',
        });

        test.fail('spread a bad keyword', {
          code: 'x={...new}',
        });

        test.fail('destruct assign rest a bad keyword', {
          code: 'x={...new} = x',
        });

        test.fail('arrow rest a bad keyword', {
          code: 'x={...new} => x',
        });
      });

      test('rest on string assignment to destruct assignment', {
        code: 'x={..."foo"=x} = x',
        throws: 'destructible',
      });

      test('spread on string property assignment to destruct assignment', {
        code: 'x={..."foo".foo=x} = x',
        throws: 'destructible',
      });

      test('rest on string assignment to arrow', {
        code: '({..."foo"=x}) => x',
        throws: 'destructible',
      });

      test('spread on string property assignment to arrow', {
        code: '({..."foo".foo=x}) => x',
        throws: 'destructible',
      });

      test.pass('destruct assignment that starts with number', {
        code: '({l: 50..foo} = x)',
      });

      test.pass('destruct assignment that starts with string', {
        code: '({s: "foo".foo} = x)',
      });

      test.pass('destruct assignment when value is property of arrlit ', {
        code: '({"foo": [x].foo}=y)',
      });

      test.pass('destruct assignment when value is property of objlit', {
        code: '({"foo": {x}.foo}=y)',
      });

      test.pass('destruct assignment when value is property of number', {
        code: '({"foo": 15..foo}=y)',
      });

      test.pass('assignment should not copy rhs state', {
        code: '({a: x = true} = y)',
        desc: 'the rhs is not assignable nor destructible but that should be reset due to the assignment',
      });

      test.pass('nested assignment should not copy rhs state', {
        code: '({a: {x} = true} = y)',
      });

      test.pass('more nested assignment should not copy rhs state', {
        code: '({a: {x = true} = true} = y)',
      });
    });

    describe('non-ident key with keyword value', _ => {

      ['true', 'false', 'null', 'this'].forEach(keyword => {
        describe('string key', _ => {

          test.pass('object', {
            code: `({"foo": ${keyword}})`,
          });

          test.fail('destructuring', {
            code: `({"foo": ${keyword}} = x)`,
          });

          test.fail('arrow', {
            code: `({"foo": ${keyword}}) => x`,
          });
        });

        describe('number key', _ => {

          test.pass('object', {
            code: `({790: ${keyword}})`,
          });

          test.fail('destructuring', {
            code: `({790: ${keyword}} = x)`,
          });

          test.fail('arrow', {
            code: `({790: ${keyword}}) => x`,
          });
        });
      });

      describe('good supers', _ => {

        // I can't find any rule that restricts the lexical position of `super()` beyond "in a proper constructor"
        // https://tc39.github.io/ecma262/#sec-super-keyword-runtime-semantics-evaluation
        // So it should syntactically be ok to use inside a property as long as it's inside a proper constructor
        // The rules for a super property are even more relaxed
        // Note: super properties are "simple" (heh) and should be valid in destructuring assignments
        // -> https://tc39.github.io/ecma262/#sec-static-semantics-static-semantics-assignmenttargettype
        ['super()', 'super.cool', 'super[cool]'].forEach(keyword => {
          describe('string key', _ => {

            test.pass('object', {
              code: `class x extends y {constructor(){    ({"foo": ${keyword}})    }}`,
            });

            test('destructuring', {
              code: `class x extends y {constructor(){    ({"foo": ${keyword}} = x)    }}`,
              // Note: super property is valid here, like any other property
              throws: keyword === 'super()',
              ast: true,
              tokens: true,
            });

            test.fail('arrow', {
              code: `class x extends y {constructor(){    ({"foo": ${keyword}}) => x    }}`,
            });
          });

          describe('number key', _ => {

            test.pass('object', {
              code: `class x extends y {constructor(){    ({790: ${keyword}})    }}`,
            });

            test('destructuring', {
              code: `class x extends y {constructor(){    ({790: ${keyword}} = x)    }}`,
              // Note: super property is valid here, like any other property
              throws: keyword === 'super()',
              ast: true,
              tokens: true,
            });

            test.fail('arrow', {
              code: `class x extends y {constructor(){    ({790: ${keyword}}) => x    }}`,
            });
          });
        });
      });

      describe('bad supers', _ => {

        ['super'].forEach(keyword => {
          describe('string key', _ => {

            test.fail('object', {
              code: `class x extends y {constructor(){    ({"foo": ${keyword}})    }}`,
            });

            test.fail('destructuring', {
              code: `class x extends y {constructor(){    ({"foo": ${keyword}} = x)    }}`,
            });

            test.fail('arrow', {
              code: `class x extends y {constructor(){    ({"foo": ${keyword}}) => x    }}`,
            });
          });

          describe('number key', _ => {

            test.fail('object', {
              code: `class x extends y {constructor(){    ({790: ${keyword}})    }}`,
            });

            test.fail('destructuring', {
              code: `class x extends y {constructor(){    ({790: ${keyword}} = x)    }}`,
            });

            test.fail('arrow', {
              code: `class x extends y {constructor(){    ({790: ${keyword}}) => x    }}`,
            });
          });
        });
      });
    });

    describe('ellipsis', _ => {

      test('base case', {
        code: 'x = {...y}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Identifier', name: 'y'},
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test.pass('base case', {
        code: 'x = {...y}',
        ES: 9, // first version where this was introduced
      });

      test.fail('base case', {
        code: 'x = {...y}',
        ES: 8,
      });

      test.fail('base case', {
        code: 'x = {...y}',
        ES: 7,
      });

      test.fail('base case', {
        code: 'x = {...y}',
        ES: 6,
      });

      test('as second element', {
        code: 'x = {x, ...y}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'x'},
                      shorthand: true,
                    },
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Identifier', name: 'y'},
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('as middle element', {
        code: 'x = {a, ...y, b}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'a'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'a'},
                      shorthand: true,
                    },
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Identifier', name: 'y'},
                    },
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'b'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'b'},
                      shorthand: true,
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('with next element', {
        code: 'x = {...y, b}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Identifier', name: 'y'},
                    },
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'b'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'b'},
                      shorthand: true,
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can have a trailing comma', {
        code: 'x = {...a,}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Identifier', name: 'a'},
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('can be assignment', {
        code: 'x = {...a=b}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'a'},
                        operator: '=',
                        right: {type: 'Identifier', name: 'b'},
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can be addition', {
        code: 'x = {...a + b}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'a'},
                        operator: '+',
                        right: {type: 'Identifier', name: 'b'},
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can be array', {
        code: 'x = {...[a, b]}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'ArrayExpression',
                        elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('can be object', {
        code: 'x = {...{a, b}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'b'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'b'},
                            shorthand: true,
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      describe('parened', _ => {

        describe('group', _ => {

          // ast tests are redundant with general tests

          test.pass('object base', {
            code: '({...a})',
          });

          test.pass('object assignment', {
            code: '({...a=b})',
          });

          test.pass('object addition', {
            code: '({...a+b})',
          });

          test.pass('object array', {
            code: '({...[a, b]})',
          });

          test.pass('object object', {
            code: '({...{a, b}})',
          });

          test('can have multiple spreads', {
            code: 'x = {...a, ...b}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'x'},
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {type: 'Identifier', name: 'a'},
                        },
                        {
                          type: 'SpreadElement',
                          argument: {type: 'Identifier', name: 'b'},
                        },
                      ],
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });
        });

        describe('destruct assignment', _ => {

          test('object base', {
            code: '({...a} = x)',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'RestElement',
                          argument: {type: 'Identifier', name: 'a'},
                        },
                      ],
                    },
                    operator: '=',
                    right: {type: 'Identifier', name: 'x'},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test.fail('object assignment', {
            code: '({...a=b} = x)',
          });

          test.fail('object addition', {
            code: '({...a+b} = x)',
          });

          test('object array', {
            code: '({...[a, b]} = x)',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'ArrayPattern',
                            elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                          },
                        },
                      ],
                    },
                    operator: '=',
                    right: {type: 'Identifier', name: 'x'},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test('object object', {
            code: '({...{a, b}} = x)',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'a'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'a'},
                                shorthand: true,
                              },
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'b'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'b'},
                                shorthand: true,
                              },
                            ],
                          },
                        },
                      ],
                    },
                    operator: '=',
                    right: {type: 'Identifier', name: 'x'},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test.fail('can not have two rest elements', {
            code: '({...a, ...b} = x)',
          });
        });

        describe('arrow', _ => {

          test('object base', {
            code: '({...a}) => x',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {type: 'Identifier', name: 'a'},
                          },
                        ],
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: true,
                    body: {type: 'Identifier', name: 'x'},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
          });

          test.fail('object assignment', {
            code: '({...a=b}) => x',
          });

          test.fail('object addition', {
            code: '({...a+b}) => x',
          });

          test('object array', {
            code: '({...[a, b]}) => x',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                            },
                          },
                        ],
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: true,
                    body: {type: 'Identifier', name: 'x'},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('object object', {
            code: '({...{a, b}}) => x',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'a'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'a'},
                                  shorthand: true,
                                },
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'b'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'b'},
                                  shorthand: true,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: true,
                    body: {type: 'Identifier', name: 'x'},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
          });

          test.fail('can not have two rest elements', {
            code: '({...a, ...b}) => x',
          });
        });
      });
    });

    describe('duplicate keys', _ => {

      // https://tc39.github.io/ecma262/#sec-additions-and-changes-that-introduce-incompatibilities-with-prior-editions
      // 12.2.6.1: In ECMAScript 2015, it is no longer an early error to have duplicate property names in Object Initializers.

      test.pass('base case of duplicate key', {
        code: '({a: 1, a: 2})',
      });

      test.pass('first and last', {
        code: '({a: 1, b: 3, a: 2})',
      });

      test.pass('last two', {
        code: '({b: x, a: 1, a: 2})',
      });

      test.pass('first two', {
        code: '({a: 1, a: 2, b: 3})',
      });

      test.pass('shorthand', {
        code: '({a, a})',
      });

      test.pass('shorthand and not-shorthand', {
        code: '({a, a: 1})',
      });

      test.pass('not-shorthand and shorthand', {
        code: '({a: 1, a})',
      });

      describe('dunderproto', _ => {

        // https://tc39.github.io/ecma262/#sec-__proto__-property-names-in-object-initializers
        // > It is a Syntax Error if PropertyNameList of PropertyDefinitionList contains any duplicate entries for
        //   "__proto__" and at least two of those entries were obtained from productions of the form PropertyDefinition:PropertyName:AssignmentExpression .

        // This restriction only applies to webcompat mode (annex B)

        describe('without webcompat', _ => {

          test.pass('bad case with two idents', {
            code: 'x = {__proto__: 1, __proto__: 2}',
          });

          test.pass('bad case with strings', {
            code: 'x = {\'__proto__\': 1, "__proto__": 2}',
          });

          test.pass('bad case with ident and string', {
            code: 'x = {__proto__: 1, "__proto__": 2}',
          });

          test.pass('bad case with string and ident', {
            code: 'x = {\'__proto__\': 1, __proto__: 2}',
          });

          test.pass('okay with shorthand right', {
            code: 'x = {__proto__: 1, __proto__}',
          });

          test.pass('okay with shorthand left', {
            code: 'x = {__proto__, __proto__: 2}',
          });

          test.pass('computed', {
            code: 'x = {[__proto__]: 1, __proto__: 2}',
          });

          test.pass('string computed', {
            code: 'x = {["__proto__"]: 1, __proto__: 2}',
          });

          test.pass('method prop', {
            code: 'x = {__proto__(){}, __proto__: 2}',
          });

          test.pass('method method', {
            code: 'x = {__proto__(){}, __proto__(){}}',
          });

          test.pass('async generator', {
            code: 'x = {async __proto__(){}, *__proto__(){}}',
          });

          test.pass('static getter', {
            code: 'class x {static __proto__(){}; get __proto__(){}}',
          });

          describe('exceptions', _ => {

            // https://tc39.github.io/ecma262/#sec-__proto__-property-names-in-object-initializers
            // When ObjectLiteral appears in a context where ObjectAssignmentPattern is required the Early Error rule is not applied.
            // In addition, it is not applied when initially parsing a CoverParenthesizedExpressionAndArrowParameterList or a CoverCallExpressionAndAsyncArrowHead.

            describe('not async', _ => {

              test.pass('plain group', {
                code: '({__proto__: a, __proto__: b});',
              });

              test.pass('destructuring assignment', {
                code: 'x = {__proto__: a, __proto__: b} = y',
              });

              test.pass('grouped destructuring assignment', {
                code: '({__proto__: a, __proto__: b} = x)',
              });

              test.pass('as an arrow', {
                code: '({__proto__: a, __proto__: b}) => x;',
              });

              test.pass('inside a complex destruct in an arrow', {
                code: '(a, [b, [c, {__proto__: d, __proto__: e}]], f) => x;',
              });

              test.pass('as a function with obvious pattern', {
                code: 'function f({__proto__: a, __proto__: b}) {}',
              });

              test.pass('inside a complex destruct in an arrow', {
                code: 'function f(a, [b, [c, {__proto__: d, __proto__: e}]], f) {}',
              });
            });

            describe('with async', _ => {

              test.pass('plain group', {
                code: 'async ({__proto__: a, __proto__: b});',
              });

              test.pass('grouped destructuring assignment', {
                code: 'async ({__proto__: a, __proto__: b} = x)',
              });

              test.pass('as an arrow', {
                code: 'async ({__proto__: a, __proto__: b}) => x;',
              });
            });
          });
        });

        describe('with webcompat', _ => {

          test('bad case with two idents', {
            code: 'x = {__proto__: 1, __proto__: 2}',
            throws: '__proto__',
            WEB: true,
          });

          test('bad case with strings', {
            code: 'x = {\'__proto__\': 1, "__proto__": 2}',
            throws: '__proto__',
            WEB: true,
          });

          test('bad case with ident and string', {
            code: 'x = {__proto__: 1, "__proto__": 2}',
            throws: '__proto__',
            WEB: true,
          });

          test('bad case with string and ident', {
            code: 'x = {\'__proto__\': 1, __proto__: 2}',
            throws: '__proto__',
            WEB: true,
          });

          test.pass('okay with shorthand right', {
            code: 'x = {__proto__: 1, __proto__}',
            WEB: true,
          });

          test.pass('okay with shorthand left', {
            code: 'x = {__proto__, __proto__: 2}',
            WEB: true,
          });

          test.pass('computed', {
            code: 'x = {[__proto__]: 1, __proto__: 2}',
            WEB: true,
          });

          test.pass('string computed', {
            code: 'x = {["__proto__"]: 1, __proto__: 2}',
            WEB: true,
          });

          test.pass('method prop', {
            code: 'x = {__proto__(){}, __proto__: 2}',
            WEB: true,
          });

          test.pass('method method', {
            code: 'x = {__proto__(){}, __proto__(){}}',
            WEB: true,
          });

          test.pass('async generator', {
            code: 'x = {async __proto__(){}, *__proto__(){}}',
            WEB: true,
          });

          test.pass('static getter', {
            code: 'class x {static __proto__(){}; get __proto__(){}}',
            WEB: true,
          });

          describe('exceptions', _ => {

            // https://tc39.github.io/ecma262/#sec-__proto__-property-names-in-object-initializers
            // When ObjectLiteral appears in a context where ObjectAssignmentPattern is required the Early Error rule is not applied.
            // In addition, it is not applied when initially parsing a CoverParenthesizedExpressionAndArrowParameterList or a CoverCallExpressionAndAsyncArrowHead.

            describe('not async', _ => {

              test.pass('plain group', {
                code: '({__proto__: a, __proto__: b});',
                WEB: true,
              });

              test.pass('destructuring assignment', {
                code: 'x = {__proto__: a, __proto__: b} = y',
                WEB: true,
              });

              test.pass('grouped destructuring assignment', {
                code: '({__proto__: a, __proto__: b} = x)',
                WEB: true,
              });

              test.pass('as an arrow', {
                code: '({__proto__: a, __proto__: b}) => x;',
                WEB: true,
              });

              test.pass('inside a complex destruct in an arrow', {
                code: '(a, [b, [c, {__proto__: d, __proto__: e}]], f) => x;',
                WEB: true,
              });

              test.pass('as a function with obvious pattern', {
                code: 'function f({__proto__: a, __proto__: b}) {}',
                WEB: true,
              });

              test.pass('inside a complex destruct in an arrow', {
                code: 'function f(a, [b, [c, {__proto__: d, __proto__: e}]], f) {}',
                WEB: true,
              });
            });

            describe('with async', _ => {

              test.pass('plain group', {
                code: 'async ({__proto__: a, __proto__: b});',
                WEB: true,
              });

              test.pass('grouped destructuring assignment', {
                code: 'async ({__proto__: a, __proto__: b} = x)',
                WEB: true,
              });

              test.pass('as an arrow', {
                code: 'async ({__proto__: a, __proto__: b}) => x;',
                WEB: true,
              });
            });
          });
        });
      });
    });

    describe('keywords should not parse as regular idents in awkward places', _ => {

      // see counter-test in arrow where this stuff is disallowed
      [
        'async ()=>x',
        'class{}',
        'delete x.y',
        'false',
        'function(){}',
        'new x',
        'null',
        'true',
        'this',
        'typeof x',
        'void x',
        'x + y',
        '[].length',
        '[x].length',
        '{}.length',
        '{x: y}.length',
      ].forEach(str => {

        test.fail('[' + str + '] in destructuring assignment as shorthand', {
          code: '({'+str+'} = x);',
        });

        // (can't really test these as property names because half of the input values are not a single ident)
        test.pass('[' + str + '] in destructuring assignment as property value', {
          code: '({x: '+str+'} = x);',
          throws: str.includes('.length') ? undefined : true,
          ast: str.includes('.length') ? true : undefined, // property is valid assignment target so should work
          tokens: str.includes('.length') ? true : undefined,
        });

        // `({function(){}})` is quite beautiful in its own way. and valid.
        test('[' + str + '] in object as shorthand', {
          code: '({'+str+'});',
          throws: str === 'function(){}' ? undefined : true,
          ast: str !== 'function(){}' ? undefined : true,
          tokens: str !== 'function(){}' ? undefined : true,
        });

        test.pass('[' + str + '] in object as value', {
          code: '({x: '+str+'});',
        });

        test.fail('[' + str + '] in arrow head as shorthand', {
          code: '({'+str+'}) => x;',
        });

        test.fail('[' + str + '] in arrow head as alias', {
          code: '({x: '+str+'}) => x;',
        });
      });
    });

    test.pass('dynamic property is not arrowable', {
      code: '({[foo]: x} = x) => y',
    });

    test.fail('call is not arrowable', {
      code: '({a: b()} = x) => y',
    });

    test.fail('dynamic property should not make call arrowable', {
      code: '({[foo]: x()} = x) => y',
    });

    test.fail('dynamic method is not assignable', {
      code: '({[foo]() {}} = y)',
    });

    test.fail('arrow; initializer of literal key should not override assignability of value', {
      code: '({3200: fail() = x}) => x',
    });

    test.fail('assignment; initializer of literal key should not override assignability of value', {
      code: '({3200: fail() = x} = x)',
    });

    test.fail('assignment and arrow; initializer of literal key should not override assignability of value', {
      code: '({3200: fail() = a} = b) => c',
    });

    test.fail('arrow; initializer of ident key should not override assignability of value', {
      code: '({foo: fail() = x}) => x',
    });

    test.fail('assignment; initializer of ident key should not override assignability of value', {
      code: '({foo: fail() = x} = x)',
    });

    test.fail('assignment and arrow; initializer of ident key should not override assignability of value', {
      code: '({foo: fail() = a} = b) => c',
    });

    describe('ident key with yield values', _ => {

      describe('global', _ => {

        test.fail_strict('string key sans yield arg', {
          code: 's = {foo: yield}',
        });

        test.fail_strict('string key with yield div', {
          code: 's = {foo: yield / x}',
        });

        test.fail('string key with yield arg', {
          code: 's = {foo: yield /x/}',
        });

        test.fail_strict('string key with yield divs', {
          code: 's = {foo: yield /x/g}',
        });
      });

      describe('generator', _ => {

        test.pass('string key sans yield arg', {
          code: 'function *f(){   s = {foo: yield}   }',
        });

        test.fail('string key with yield div', {
          code: 'function *f(){   s = {foo: yield / x}   }',
        });

        test.pass('string key with yield arg', {
          code: 'function *f(){   s = {foo: yield /x/}   }',
        });

        test.pass('string key with yield regex', {
          code: 'function *f(){   s = {foo: yield /x/g}   }',
        });
      });
    });

    describe('string key with yield values', _ => {

      describe('global', _ => {

        test.fail_strict('string key sans yield arg', {
          code: 's = {"foo": yield}',
        });

        test.fail_strict('string key with yield div', {
          code: 's = {"foo": yield / x}',
        });

        test.fail('string key with yield arg', {
          code: 's = {"foo": yield /x/}',
        });

        test.fail_strict('string key with yield divs', {
          code: 's = {"foo": yield /x/g}',
        });
      });

      describe('generator', _ => {

        test.pass('string key sans yield arg', {
          code: 'function *f(){   s = {"foo": yield}   }',
        });

        test.fail('string key with yield div', {
          code: 'function *f(){   s = {"foo": yield / x}   }',
        });

        test.pass('string key with yield arg', {
          code: 'function *f(){   s = {"foo": yield /x/}   }',
        });

        test.pass('string key with yield regex', {
          code: 'function *f(){   s = {"foo": yield /x/g}   }',
        });
      });
    });
  });
