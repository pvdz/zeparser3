let {$IDENT, $NUMBER_HEX, $NUMBER_DEC, $NUMBER_BIN, $NUMBER_OCT, $PUNCTUATOR, $STRING_DOUBLE, $STRING_SINGLE, $ASI} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: true,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with one async method get', {
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with one async method set', {
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with one async method async', {
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with one async method', {
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with one async method', {
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with one async method', {
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with one computed generator method', {
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with two async methods', {
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with an async method and an ident method', {
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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

        test('object with an async method and an ident method', {
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'get',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
                            params: [{type: 'Identifier', name: 'b'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
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
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
                            params: [{type: 'Identifier', name: 'b'}],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
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
                            async: false,
                            expression: false,
                            id: null,
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'bar'},
                          kind: 'set',
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'x'},
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
                          method: true,
                          computed: true,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
                            id: null,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
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
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      // call({[x]}) is illegal; dynamic properties can not be shorthand
      // can not use async/generators on getters/setters ({async get foo(){}})
      // getters with non-zero param count
      // setters with not-one param count
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
              throws: 'reserved word',
            });
          });

          test('keyword=let', {
            code: '({let}) => null',
            throws: 'Cannot use this name',
          });

          ['eval', 'arguments', 'static', 'implements', 'package', 'protected', 'interface', 'private', 'public', 'await', 'yield'].forEach(keyword => {
            test('strict-mode only keyword=' + keyword, {
              code: '({'+keyword+'}) => null',
              throws: 'Cannot use this name',
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
        });

        // wrap({a:b=x}=y);
      });

      describe('string properties', _ => {
        test('object with one double quoted property', {
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

        test('object with two double quoted properties', {
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

        test('object with one double quoted property', {
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

        test('object with two double quoted properties', {
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
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $STRING_SINGLE,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $STRING_SINGLE,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('object with two double quoted properties', {
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
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $STRING_SINGLE,
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

        test('object with two double quoted properties', {
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
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $STRING_SINGLE,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
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
    });
  });

// todo: confirm static keyword cant be used in objlit
