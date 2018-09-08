let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('arrays', _ => {
    describe('literal', _ => {
      test('empty array', {
        code: '[]',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'ArrayExpression', elements: []}}],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('empty array', {
        code: '[x]',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [{type: 'Identifier', name: 'x'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('array empty 1 elision', {
        code: `[,]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [null],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('array empty 2 elisions', {
        code: `[,,]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [null, null],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('array empty 3 elisions', {
        code: `[,,,]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [null, null, null],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('array with x and trailing comma', {
        code: `[x,]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [{type: 'Identifier', name: 'x'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('array with x and elisions', {
        code: `[x,,,]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [{type: 'Identifier', name: 'x'}, null, null],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('array with x and leading comma', {
        code: `[,x]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [null, {type: 'Identifier', name: 'x'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('array with x and two leading commas', {
        code: `[,,x]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [null, null, {type: 'Identifier', name: 'x'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('array with middle elisions', {
        code: `[x,,y]`,
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [{type: 'Identifier', name: 'x'}, null, {type: 'Identifier', name: 'y'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('can contain this', {
        code: '[this];',
        desc: 'assert that the keyword is a ThisExpression in the ast... (regression)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [{type: 'ThisExpression'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      describe('spread', _ => {
        // https://tc39.github.io/ecma262/#prod-SpreadElement
        // ...AssignmentExpression[+In, ?Yield, ?Await]
        // (in other words; any expression is fair game here)

        test('splat another value', {
          code: '[x, y, ...z]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {type: 'Identifier', name: 'y'},
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Identifier', name: 'z'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can splat in the middle', {
          code: '[x, ...y, z]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Identifier', name: 'y'},
                    },
                    {type: 'Identifier', name: 'z'},
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can splat an assignment at the end', {
          code: '[x, y, ...z = arr]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {type: 'Identifier', name: 'y'},
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'z'},
                        operator: '=',
                        right: {type: 'Identifier', name: 'arr'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('cant rest an assignment at the end', {
          code: '[x, y, ...z = arr] = x',
          throws: true,
        });

        test('can splat a call at the end', {
          code: '[x, y, ...z()]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {type: 'Identifier', name: 'y'},
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'z'},
                        arguments: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('can splat an expression at the end', {
          code: '[x, y, ...z + arr]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {type: 'Identifier', name: 'y'},
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'z'},
                        operator: '+',
                        right: {type: 'Identifier', name: 'arr'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can splat an assignment at the end', {
          code: '[x, ...z = arr, y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'z'},
                        operator: '=',
                        right: {type: 'Identifier', name: 'arr'},
                      },
                    },
                    {type: 'Identifier', name: 'y'},
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can splat a call at the end', {
          code: '[x, ...z(), y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'z'},
                        arguments: [],
                      },
                    },
                    {type: 'Identifier', name: 'y'},
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can splat an expression at the end', {
          code: '[x, ...z + arr, y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {type: 'Identifier', name: 'x'},
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'z'},
                        operator: '+',
                        right: {type: 'Identifier', name: 'arr'},
                      },
                    },
                    {type: 'Identifier', name: 'y'},
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can splat this', {
          code: '[...this];',
          ast: true,
          tokens: true,
        });

        test.fail('spread on string assignment', {
          code: '[..."foo"=x]',
        });

        test.pass('spread on string property assignment', {
          code: '[..."foo".foo=x]',
        });
      });
    });

    describe('destructuring', _ => {
      test('one var, no init, semi', {
        code: '[foo] = arr;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]},
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('one var, with init, semi', {
        code: '[foo = A] = arr;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'foo'},
                      //operator: '=', // innocent artifact because the AssignmentPattern was an AssignmentExpression before
                      right: {type: 'Identifier', name: 'A'},
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('two vars, no init, semi', {
        code: '[foo, bar] = arr;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('two vars, both init, semi', {
        code: '[foo = A, bar = B] = arr;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'foo'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'A'}},
                    {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('let, nested array pattern', {
        code: '[foo, [x,y,z], bar = B] = arr;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {type: 'Identifier', name: 'foo'},
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}, {type: 'Identifier', name: 'z'}],
                    },
                    {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            },
          ],
        },
        tokens: [
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
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
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
        ],
      });

      test('let, super nested array pattern to make sure that isnt hardcoded', {
        code: '[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {type: 'Identifier', name: 'foo'},
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'ArrayPattern',
                                  elements: [
                                    {
                                      type: 'ArrayPattern',
                                      elements: [
                                        {
                                          type: 'ArrayPattern',
                                          elements: [
                                            {
                                              type: 'ArrayPattern',
                                              elements: [
                                                {
                                                  type: 'ArrayPattern',
                                                  elements: [
                                                    {
                                                      type: 'ArrayPattern',
                                                      elements: [
                                                        {
                                                          type: 'ArrayPattern',
                                                          elements: [
                                                            {
                                                              type: 'ArrayPattern',
                                                              elements: [
                                                                {
                                                                  type: 'ArrayPattern',
                                                                  elements: [
                                                                    {
                                                                      type: 'ArrayPattern',
                                                                      elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}, {type: 'Identifier', name: 'z'}],
                                                                    },
                                                                  ],
                                                                },
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            },
          ],
        },
        tokens: [
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
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
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
        ],
      });

      test('let, nested array pattern with inner init and outer init', {
        code: '[foo, [x,y = 20,z], bar = B] = arr;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {type: 'Identifier', name: 'foo'},
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {type: 'Identifier', name: 'x'},
                        {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'y'}, /*operator: '=',*/ right: {type: 'Literal', value: '<TODO>', raw: '20'}},
                        {type: 'Identifier', name: 'z'},
                      ],
                    },
                    {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, /*operator: '=',*/ right: {type: 'Identifier', name: 'B'}},
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            },
          ],
        },
        tokens: [
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $NUMBER_DEC,
          $PUNCTUATOR,
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
        ],
      });

      test('destructuring array as call arg', {
        code: 'foo([a, b] = arr);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [
                  {
                    type: 'AssignmentExpression',
                    left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]},
                    operator: '=',
                    right: {type: 'Identifier', name: 'arr'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('only destructuring inside an expr with assignmentpattern', {
        code: '([foo]) = arr;',
        throws: 'Invalid assignment',
      });

      test('spread with ident with tail is ok', {
        code: '[...x.list];',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'x'},
                      property: {type: 'Identifier', name: 'list'},
                      computed: false,
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('rest with member expression is destructible', {
        code: '[...x.list] = a;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'x'},
                        property: {type: 'Identifier', name: 'list'},
                        computed: false,
                      },
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('spread with ident is ok', {
        code: '[...x = y];',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '=',
                      right: {type: 'Identifier', name: 'y'},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('spread with ident and assignment throws', {
        code: '[...x = y] = a;',
        throws: true,
      });

      test('spread with ident and compound assignment is ok', {
        code: '[...x += y];',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '+=',
                      right: {type: 'Identifier', name: 'y'},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('spread with ident and compound assignment is not destructible', {
        code: '[...x += y] = a;',
        throws: true,
      });

      test('spread with array with tail is ok', {
        code: '[...[x].map(y, z)];',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ArrayExpression',
                          elements: [{type: 'Identifier', name: 'x'}],
                        },
                        property: {type: 'Identifier', name: 'map'},
                        computed: false,
                      },
                      arguments: [{type: 'Identifier', name: 'y'}, {type: 'Identifier', name: 'z'}],
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('spread with array with tail is not destructible', {
        code: '[...[x].map(y, z)] = a;',
        throws: true,
      });

      test('spread with array with member tail is destructible', {
        code: '[...[x].map(y, z)[x]] = a;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'MemberExpression',
                        object: {
                          type: 'CallExpression',
                          callee: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ArrayExpression',
                              elements: [{type: 'Identifier', name: 'x'}],
                            },
                            property: {type: 'Identifier', name: 'map'},
                            computed: false,
                          },
                          arguments: [{type: 'Identifier', name: 'y'}, {type: 'Identifier', name: 'z'}],
                        },
                        property: {type: 'Identifier', name: 'x'},
                        computed: true,
                      },
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('in comma expr', {
        code: 'x, [foo, bar] = doo',
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
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
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
        code: 'x, [foo = y, bar] = doo',
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
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'foo'},
                          right: {type: 'Identifier', name: 'y'},
                        },
                        {type: 'Identifier', name: 'bar'},
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
        code: 'x, [foo + y, bar] = doo',
        throws: true,
      });

      test('inside assignment chain', {
        code: 'x = [a, b] = y',
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
                    type: 'ArrayPattern',
                    elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
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
        code: '[a, b] = c = d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
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
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      describe('edge cases', _ => {
        test('should not transform the inner array to a arraydestruct', {
          code: '[a,b=[x,y]] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {type: 'Identifier', name: 'a'},
                      {
                        type: 'AssignmentPattern',
                        left: {type: 'Identifier', name: 'b'},
                        //operator: '=', NO!
                        right: {
                          type: 'ArrayExpression',
                          elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                        },
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('assignment pattern can only have regular assignments 1', {
          code: '[a,b^=[x,y]] = z',
          throws: true,
        });

        test('assignment pattern can only have regular assignments 2', {
          code: '[a,b+=[x,y]] = z',
          throws: true,
        });

        test('arr destruct inside an arr lit', {
          code: '(foo, [bar, baz] = doo);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'SequenceExpression',
                  expressions: [
                    {type: 'Identifier', name: 'foo'},
                    {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'bar'}, {type: 'Identifier', name: 'baz'}],
                      },
                      operator: '=',
                      right: {type: 'Identifier', name: 'doo'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('forward slash cases', _ => {

        test('spread with array-division', {
          code: '[...[x]/y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'ArrayExpression',
                          elements: [{type: 'Identifier', name: 'x'}],
                        },
                        operator: '/',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('spread with shorthand object-division will throw', {
          code: '[...{x}/y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {
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
                          ],
                        },
                        operator: '/',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('spread with object-division', {
          code: '[...{x:y}/y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'x'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: false,
                            },
                          ],
                        },
                        operator: '/',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('spread with just a regex', {
          code: '[.../x/]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {type: 'Literal', value: '<TODO>', raw: '/x/'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $ASI],
        });

        test('spread with regex-plus', {
          code: '[.../x/+y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Literal', value: '<TODO>', raw: '/x/'},
                        operator: '+',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('spread with regex-division', {
          code: '[.../x//y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Literal', value: '<TODO>', raw: '/x/'},
                        operator: '/',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('spread with regex-flag-division', {
          code: '[.../x/g/y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Literal', value: '<TODO>', raw: '/x/g'},
                        operator: '/',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test.fail('spread with a regex and weird followu', {
          code: '[.../x/ y]',
        });
      });

      describe('member exprs', _ => {

        test('property of ident is assignable', {
          code: '[x.y] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'x'},
                        property: {type: 'Identifier', name: 'y'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of call is assignable', {
          code: '[x().y] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'CallExpression',
                          callee: {type: 'Identifier', name: 'x'},
                          arguments: [],
                        },
                        property: {type: 'Identifier', name: 'y'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of new is assignable', {
          code: '[new x().y] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'NewExpression',
                          arguments: [],
                          callee: {type: 'Identifier', name: 'x'},
                        },
                        property: {type: 'Identifier', name: 'y'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of ident is assignable', {
          code: '[a[x.y]] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'a'},
                        property: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'x'},
                          property: {type: 'Identifier', name: 'y'},
                          computed: false,
                        },
                        computed: true,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of call is assignable', {
          code: '[x()[y]] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'CallExpression',
                          callee: {type: 'Identifier', name: 'x'},
                          arguments: [],
                        },
                        property: {type: 'Identifier', name: 'y'},
                        computed: true,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of new is assignable', {
          code: '[new x()[y]] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'NewExpression',
                          arguments: [],
                          callee: {type: 'Identifier', name: 'x'},
                        },
                        property: {type: 'Identifier', name: 'y'},
                        computed: true,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of ident with a init is assignable', {
          code: '[x.y = a] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'x'},
                          property: {type: 'Identifier', name: 'y'},
                          computed: false,
                        },
                        right: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of call with a init is assignable', {
          code: '[x().y = a] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {type: 'Identifier', name: 'x'},
                            arguments: [],
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: false,
                        },
                        right: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of new with a init is assignable', {
          code: '[new x().y = a] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'NewExpression',
                            arguments: [],
                            callee: {type: 'Identifier', name: 'x'},
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: false,
                        },
                        right: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of ident with a init is assignable', {
          code: '[a[x.y] = a] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'a'},
                          property: {
                            type: 'MemberExpression',
                            object: {type: 'Identifier', name: 'x'},
                            property: {type: 'Identifier', name: 'y'},
                            computed: false,
                          },
                          computed: true,
                        },
                        right: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of call with a init is assignable', {
          code: '[x()[y] = a ] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {type: 'Identifier', name: 'x'},
                            arguments: [],
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: true,
                        },
                        right: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of new with a init is assignable', {
          code: '[new x()[y] = a] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'NewExpression',
                            arguments: [],
                            callee: {type: 'Identifier', name: 'x'},
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: true,
                        },
                        right: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of ident with a+b init is assignable', {
          code: '[x.y = a + b] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'x'},
                          property: {type: 'Identifier', name: 'y'},
                          computed: false,
                        },
                        right: {
                          type: 'BinaryExpression',
                          left: {type: 'Identifier', name: 'a'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'b'},
                        },
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of call with a+b init is assignable', {
          code: '[x().y = a + b] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {type: 'Identifier', name: 'x'},
                            arguments: [],
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: false,
                        },
                        right: {
                          type: 'BinaryExpression',
                          left: {type: 'Identifier', name: 'a'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'b'},
                        },
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('property of new with a+b init is assignable', {
          code: '[new x().y = a + b] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'NewExpression',
                            arguments: [],
                            callee: {type: 'Identifier', name: 'x'},
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: false,
                        },
                        right: {
                          type: 'BinaryExpression',
                          left: {type: 'Identifier', name: 'a'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'b'},
                        },
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of ident with a+b init is assignable', {
          code: '[a[x.y] = a + b] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'a'},
                          property: {
                            type: 'MemberExpression',
                            object: {type: 'Identifier', name: 'x'},
                            property: {type: 'Identifier', name: 'y'},
                            computed: false,
                          },
                          computed: true,
                        },
                        right: {
                          type: 'BinaryExpression',
                          left: {type: 'Identifier', name: 'a'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'b'},
                        },
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of call with a+b init is assignable', {
          code: '[x()[y] = a + b] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'CallExpression',
                            callee: {type: 'Identifier', name: 'x'},
                            arguments: [],
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: true,
                        },
                        right: {
                          type: 'BinaryExpression',
                          left: {type: 'Identifier', name: 'a'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'b'},
                        },
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('dynamic property of new with a+b init is assignable', {
          code: '[new x()[y] = a + b] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'NewExpression',
                            arguments: [],
                            callee: {type: 'Identifier', name: 'x'},
                          },
                          property: {type: 'Identifier', name: 'y'},
                          computed: true,
                        },
                        right: {
                          type: 'BinaryExpression',
                          left: {type: 'Identifier', name: 'a'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'b'},
                        },
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can be a function', {
          code: '[function(){}.length] = x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          expression: true,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                        property: {type: 'Identifier', name: 'length'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can be a number', {
          code: '[5..length] = x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {type: 'Literal', value: '<TODO>', raw: '5.'},
                        property: {type: 'Identifier', name: 'length'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can be a string', {
          code: '["X".length] = x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {type: 'Literal', value: '<TODO>', raw: '"X"'},
                        property: {type: 'Identifier', name: 'length'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: true,
        });

        test('can be a simple template', {
          code: '[`x`.length] = x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'TemplateLiteral',
                          expressions: [],
                          quasis: [
                            {
                              type: 'TemplateElement',
                              tail: true,
                              value: {raw: '`x`', cooked: '<TODO>'},
                            },
                          ],
                        },
                        property: {type: 'Identifier', name: 'length'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $TICK_PURE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can be a complex template', {
          code: '[`a${5}b`.length] = x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {
                          type: 'TemplateLiteral',
                          expressions: [{type: 'Literal', value: '<TODO>', raw: '5'}],
                          quasis: [
                            {
                              type: 'TemplateElement',
                              tail: false,
                              value: {raw: '`a${', cooked: '<TODO>'},
                            },
                            {
                              type: 'TemplateElement',
                              tail: true,
                              value: {raw: '}b`', cooked: '<TODO>'},
                            },
                          ],
                        },
                        property: {type: 'Identifier', name: 'length'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $TICK_HEAD, $NUMBER_DEC, $TICK_TAIL, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can be a regex', {
          code: '[/foo/.length] = x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {type: 'Literal', value: '<TODO>', raw: '/foo/'},
                        property: {type: 'Identifier', name: 'length'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can be a flagged regex', {
          code: '[/x/g.length] = x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'MemberExpression',
                        object: {type: 'Literal', value: '<TODO>', raw: '/x/g'},
                        property: {type: 'Identifier', name: 'length'},
                        computed: false,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });
      });

      test('this cant destruct', {
        code: '[this] = obj',
        throws: 'destructible',
      });

      describe('spread mirror rest tests', _ => {
        // https://tc39.github.io/ecma262/#prod-SpreadElement
        // ...AssignmentExpression[+In, ?Yield, ?Await]
        // (in other words; any expression is fair game here)

        test('rest another value', {
          code: '[x, y, ...z] = obj',
          ast: true,
          tokens: true,
        });

        test('can not rest in the middle', {
          code: '[x, ...y, z] = obj',
          throws: true,
        });

        test('can not rest an assignment at the end', {
          code: '[x, y, ...z = arr] = obj',
          throws: true,
        });

        test('cant rest an assignment at the end', {
          code: '[x, y, ...z = arr] = x = obj',
          throws: true,
        });

        test('can not rest a call at the end', {
          code: '[x, y, ...z()] = obj',
          throws: true,
        });

        test('can not splat an expression at the end', {
          code: '[x, y, ...z + arr] = obj',
          throws: true,
        });

        test('can not rest an assignment at the end', {
          code: '[x, ...z = arr, y] = obj',
          throws: true,
        });

        test('can not rest a call at the end', {
          code: '[x, ...z(), y] = obj',
          throws: true,
        });

        test('can not rest an expression at the end', {
          code: '[x, ...z + arr, y] = obj',
          throws: true,
        });

        test('rest this cant destruct', {
          code: '[...this] = obj',
          throws: 'destructible',
        });
      });

      test('comma expression assignment', {
        code: '[(x, y)] = x;',
        throws: 'not destructible',
      });

      test('wrapped comma expression assignment', {
        code: '[[(x, y)]] = x;',
        throws: 'not destructible',
      });

      test('spreaded comma expression assignment', {
        code: '[...[(x, y)]] = x;',
        throws: 'not destructible',
      });

      test('destructuring an objlit with property in an array', {
        code: '[{}.x] = y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {type: 'ObjectExpression', properties: []},
                      property: {type: 'Identifier', name: 'x'},
                      computed: false,
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('destructuring an objlit with computed property in an array', {
        code: '[{}[x]] = y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {type: 'ObjectExpression', properties: []},
                      property: {type: 'Identifier', name: 'x'},
                      computed: true,
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test.pass('destructuring an arrlit with property in an array', {
        code: '[[].x] = y',
      });

      test.pass('destructuring an arrlit with computed property in an array', {
        code: '[[][x]] = y',
      });

      test('destruct to keyword', {
        code: '[true = x] = x',
        throws: 'keyword',
      });

      test('assignment to keyword without destruct', {
        code: '[true = x]',
        throws: 'keyword',
      });

      describe('spreadrest keywords', _ => {

        test.pass('spread a value keyword', {
          code: '[...true]',
          desc: 'runtime error',
        });

        test('destruct assign rest a value keyword', {
          code: '[...true] = x',
          throws: 'destructible',
        });

        test.fail('arrow rest a value keyword', {
          code: '[...true] => x',
        });

        test.fail('spread a bad keyword', {
          code: '[...new]',
        });

        test.fail('destruct assign rest a bad keyword', {
          code: '[...new] = x',
        });

        test.fail('arrow rest a bad keyword', {
          code: '[...new] => x',
        });
      });

      test('rest on string assignment to destruct assignment', {
        code: '[..."foo"=x] = x',
        throws: 'destructible',
      });

      test('spread on string property assignment to destruct assignment', {
        code: '[..."foo".foo=x] = x',
        throws: 'destructible',
      });

      test('rest on string assignment to arrow', {
        code: '([..."foo"=x]) => x',
        throws: 'destructible',
      });

      test('spread on string property assignment to arrow', {
        code: '([..."foo".foo=x]) => x',
        throws: 'destructible',
      });
    });
  });
