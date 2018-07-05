let {$IDENT, $NUMBER_HEX, $NUMBER_DEC, $NUMBER_BIN, $NUMBER_OCT, $PUNCTUATOR, $REGEX, $STRING_DOUBLE, $STRING_SINGLE, $ASI} = require('../../../src/zetokenizer');

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
        test('object with one shorthand must destruct', {
          code: 'wrap({a});',
          throws: 'must be destructured',
        });

        test('get can be special but can also be shorthand', {
          code: 'wrap({get});',
          throws: 'must be destructured',
        });

        test('set can be special but can also be shorthand', {
          code: 'wrap({set});',
          throws: 'must be destructured',
        });

        test('async can be special but can also be shorthand', {
          code: 'wrap({async});',
          throws: 'must be destructured',
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
          throws: 'must be destructured',
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
          throws: 'must be destructured',
        });

        test('object with a classic property and a shorthand', {
          code: 'wrap({a:b, c});',
          throws: 'must be destructured',
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
                          method: true,
                          computed: false,
                          value: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: false,
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
                  },
                ],
              },
              tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('as async generator in obj', {
              code: '({async * ' + ident + '(){}});',
              throws: true, // TODO: async generators
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

        test('getter number must be method', {
          code: 'wrap({get 123: x});',
          throws: 'must be a method',
        });

        test('getter string must be method', {
          code: 'wrap({get "abc": x});',
          throws: 'must be a method',
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

        test('setter number must be method', {
          code: 'wrap({set 123: x});',
          throws: 'must be a method',
        });

        test('setter string must be method', {
          code: 'wrap({set "abc": x});',
          throws: 'must be a method',
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

      // test('getters with non-zero param count', {
      //   code: '({get foo(x){}});',
      //   throws: 'Missing method arg',
      // });

      // test('setters with zero param count', {
      //   code: '({get foo(){}});',
      //  });

      // test('setters with two params', {
      //   code: '({get foo(x,y){}});',
      // });

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
              throws: 'name', // various messages related to the var name...
            });
          });

          test('keyword=let', {
            code: '({let}) => null',
            throws: 'Cannot use this name',
            SLOPPY_SCRIPT: {
              desc: 'let is a valid var name in sloppy mode and destructuring is not "strict" by default',
              ast: true,
              tokens: true,
            },
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
              ...(keyword === 'eval' || keyword === 'arguments' ? {} : {
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

            test('destructing', {
              code: '({"x": [y].slice(0)} = x)',
              throws: true,
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

            test('destructing', {
              code: '({"x": 600..xyz} = x)',
              throws: true,
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
    });

    describe('non-ident key with keyword value', _ => {
      ['true', 'false', 'null', 'this', 'super'].forEach(keyword => {
        describe('string key', _ => {
          test('object', {
            code: `({"foo": ${keyword}})`,
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
                        key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
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
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('destructuring', {
            code: `({"foo": ${keyword}} = x)`,
            throws: true,
          });

          test('arrow', {
            code: `({"foo": ${keyword}}) => x`,
            throws: true,
          });
        });

        describe('number key', _ => {
          test('object', {
            code: `({790: ${keyword}})`,
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
                        key: {type: 'Literal', value: '<TODO>', raw: '790'},
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
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('destructuring', {
            code: `({790: ${keyword}} = x)`,
            throws: true,
          });

          test('arrow', {
            code: `({790: ${keyword}}) => x`,
            throws: true,
          });
        });
      });
    });
  });
