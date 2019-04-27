import {$ASI, $IDENT, $NUMBER_DEC, $NUMBER_HEX, $PUNCTUATOR, $REGEX, $STRING_DOUBLE, $STRING_SINGLE, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('new', _ => {
    describe('new operator', _ => {
      describe('callee cases', _ => {
        describe('sans parens', _ => {
          test('just one ident', {
            code: 'new Foo',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'Foo'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('ident member', {
            code: 'new Foo.Bar',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'Foo'},
                      property: {type: 'Identifier', name: 'Bar'},
                      computed: false,
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('multi ident member', {
            code: 'new a.b.c.d',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'a'},
                          property: {type: 'Identifier', name: 'b'},
                          computed: false,
                        },
                        property: {type: 'Identifier', name: 'c'},
                        computed: false,
                      },
                      property: {type: 'Identifier', name: 'd'},
                      computed: false,
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('dynamic member', {
            code: 'new Foo["bar"]',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'Foo'},
                      property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                      computed: true,
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $ASI],
          });
        });

        describe('with parens', _ => {
          test('just one ident', {
            code: 'new Foo()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'Foo'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('ident member', {
            code: 'new Foo.Bar()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'Foo'},
                      property: {type: 'Identifier', name: 'Bar'},
                      computed: false,
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('multi ident member', {
            code: 'new a.b.c.d()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'a'},
                          property: {type: 'Identifier', name: 'b'},
                          computed: false,
                        },
                        property: {type: 'Identifier', name: 'c'},
                        computed: false,
                      },
                      property: {type: 'Identifier', name: 'd'},
                      computed: false,
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('dynamic member', {
            code: 'new Foo["bar"]()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'Foo'},
                      property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                      computed: true,
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });
      });

      describe('one argument', _ => {
        test('just one ident', {
          code: 'new Foo(X)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [{type: 'Identifier', name: 'X'}],
                  callee: {type: 'Identifier', name: 'Foo'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('ident member', {
          code: 'new Foo.Bar(X)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [{type: 'Identifier', name: 'X'}],
                  callee: {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'Foo'},
                    property: {type: 'Identifier', name: 'Bar'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('dynamic member', {
          code: 'new Foo["bar"](X)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [{type: 'Identifier', name: 'X'}],
                  callee: {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'Foo'},
                    property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    computed: true,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });
      });

      describe('multi arguments', _ => {
        test('just one ident', {
          code: 'new Foo(X, Y, Z)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [{type: 'Identifier', name: 'X'}, {type: 'Identifier', name: 'Y'}, {type: 'Identifier', name: 'Z'}],
                  callee: {type: 'Identifier', name: 'Foo'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('ident member', {
          code: 'new Foo.Bar(X, Y, Z)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [{type: 'Identifier', name: 'X'}, {type: 'Identifier', name: 'Y'}, {type: 'Identifier', name: 'Z'}],
                  callee: {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'Foo'},
                    property: {type: 'Identifier', name: 'Bar'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('dynamic member', {
          code: 'new Foo["bar"](X, Y, Z)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [{type: 'Identifier', name: 'X'}, {type: 'Identifier', name: 'Y'}, {type: 'Identifier', name: 'Z'}],
                  callee: {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'Foo'},
                    property: {type: 'Literal', value: '<TODO>', raw: '"bar"'},
                    computed: true,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });
      });

      describe('before/after', _ => {
        test('can have dot property', {
          code: 'new x().y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'MemberExpression',
                  object: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'Identifier',
                      name: 'x',
                    },
                  },
                  property: {
                    type: 'Identifier',
                    name: 'y',
                  },
                  computed: false,
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can have dynamic property', {
          code: 'new x()[y]',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'MemberExpression',
                  object: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'Identifier',
                      name: 'x',
                    },
                  },
                  property: {
                    type: 'Identifier',
                    name: 'y',
                  },
                  computed: true,
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can be called', {
          code: 'new x()();',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'Identifier',
                      name: 'x',
                    },
                  },
                  arguments: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('can be tagged', {
          code: 'new x()`y`',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TaggedTemplateExpression',
                  tag: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'x'},
                  },
                  quasi: {
                    type: 'TemplateLiteral',
                    expressions: [],
                    quasis: [
                      {
                        type: 'TemplateElement',
                        value: {raw: 'y', cooked: '<TODO>'},
                        tail: true,
                      },
                    ],
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $TICK_PURE, $ASI],
        });

        test('can have property and assignment', {
          code: 'new x().y = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
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
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can have dot property and operator', {
          code: 'new x().y + z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
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
                  operator: '+',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can have dynamic property and assignment', {
          code: 'new x()[y] = z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
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
                  operator: '=',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can have dynamic property and operator', {
          code: 'new x()[y] + z',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
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
                  operator: '+',
                  right: {type: 'Identifier', name: 'z'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test.fail('are not assignable', {
          code: 'new x() = y',
        });

        test.fail('can not have prefix inc on its own', {
          code: '++new x()',
        });

        test('can have prefix inc with property', {
          code: '++new x().y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'x'},
                    },
                    property: {type: 'Identifier', name: 'y'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can not have postfix inc on its own', {
          code: 'new x()++',
          throws: 'Cannot inc/dec a non-assignable value',
          tokens: [],
        });

        test('can have postfix inc with property', {
          code: 'new x().y++',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'x'},
                    },
                    property: {type: 'Identifier', name: 'y'},
                    computed: false,
                  },
                  operator: '++',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('can delete on its own', {
          code: 'delete new x()',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: 'delete',
                  prefix: true,
                  argument: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'x'},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('can delete a property', {
          code: 'delete new x().y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: 'delete',
                  prefix: true,
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'x'},
                    },
                    property: {type: 'Identifier', name: 'y'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can typeof on its own', {
          code: 'typeof new x()',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'x'},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('can typeof a property', {
          code: 'typeof new x().y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'x'},
                    },
                    property: {type: 'Identifier', name: 'y'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('can new new value', {
          code: 'new new x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'x'},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $ASI],
        });

        test('cannot new new.target without func', {
          code: 'new new .target',
          throws: 'function',
        });

        test('can new new.target in func', {
          code: 'function f(){ new new .target; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'NewExpression',
                        arguments: [],
                        callee: {
                          type: 'MetaProperty',
                          meta: {type: 'Identifier', name: 'new'},
                          property: {type: 'Identifier', name: 'target'},
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test.fail('can not new a delete without prop', {
          code: 'new delete x',
        });

        test.fail('can not new a delete with prop', {
          code: 'new delete x.y',
        });

        test.fail('can not new a delete with call prop', {
          code: 'new delete x().y',
        });

        test('can not new a typeof without prop', {
          code: 'new typeof x',
          throws: 'new',
        });

        test('can not new a typeof with prop', {
          code: 'new typeof x.y',
          throws: 'new',
        });

        test('can not new a typeof with call prop', {
          code: 'new typeof x().y',
          throws: 'new',
        });

        test('can not new a ++ without prop', {
          code: 'new ++x',
          throws: 'Cannot `new` on an inc/dec expr',
          tokens: [],
        });

        test('can not new a ++ with prop', {
          code: 'new ++x.y',
          throws: 'Cannot `new` on an inc/dec expr',
          tokens: [],
        });

        test('can not new a ++ with call prop', {
          code: 'new ++x().y',
          throws: 'Cannot `new` on an inc/dec expr',
          tokens: [],
        });

        test('can not ++ a new without prop', {
          code: 'new x++',
          throws: 'Cannot inc/dec a non-assignable value',
          tokens: [],
        });

        test('can not new a ++ with prop', {
          code: 'new x.y++',
          throws: 'Cannot inc/dec a non-assignable value',
          tokens: [],
        });

        test('can ++ a new with call prop', {
          code: 'new x().y++',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'x'},
                    },
                    property: {type: 'Identifier', name: 'y'},
                    computed: false,
                  },
                  operator: '++',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });
      });

      describe('tagged template', _ => {
        test('new on tagged template', {
          code: 'new Foo`bar`',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'TaggedTemplateExpression',
                    tag: {type: 'Identifier', name: 'Foo'},
                    quasi: {
                      type: 'TemplateLiteral',
                      expressions: [],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            raw: 'bar',
                            cooked: '<TODO>',
                          },
                          tail: true,
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $TICK_PURE, $ASI],
          desc: 'Edge case. Example: function f(){ return f } new f`x`;',
        });

        test('new on tagged multi part template', {
          code: 'new Foo`a${b}c${c}e`',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'TaggedTemplateExpression',
                    tag: {type: 'Identifier', name: 'Foo'},
                    quasi: {
                      type: 'TemplateLiteral',
                      expressions: [{type: 'Identifier', name: 'b'}, {type: 'Identifier', name: 'c'}],
                      quasis: [
                        {
                          type: 'TemplateElement',
                          value: {
                            raw: 'a',
                            cooked: '<TODO>',
                          },
                          tail: false,
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            raw: 'c',
                            cooked: '<TODO>',
                          },
                          tail: false,
                        },
                        {
                          type: 'TemplateElement',
                          value: {
                            raw: 'e',
                            cooked: '<TODO>',
                          },
                          tail: true,
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI],
          desc: 'Edge case. Example: function f(){ return f } new f`x${5}y`;',
        });
      });

      describe('edge cases', _ => {
        test('after spread', {
          code: '[...new A()]',
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
                        type: 'NewExpression',
                        arguments: [],
                        callee: {type: 'Identifier', name: 'A'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('extends value', {
          code: 'class x extends new A() {}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'A'},
                },
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('dynamic prop', {
          code: 'x({[new A()]:y})',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'x'},
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'NewExpression', arguments: [], callee: {type: 'Identifier', name: 'A'}},
                          kind: 'init',
                          method: false,
                          computed: true,
                          value: {type: 'Identifier', name: 'y'},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });
      });

      describe('regex edge cases', _ => {
        test('regex as value with paren', {
          code: 'f(new /z/())',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'f'},
                  arguments: [
                    {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Literal', value: '<TODO>', raw: '/z/'},
                    },
                  ],
                },
              },
            ],
          },
          desc: 'guaranteed to be a runtime error unless the host environment does something wonky',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('regex as value sans paren', {
          code: 'f(new /z/)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'f'},
                  arguments: [
                    {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Literal', value: '<TODO>', raw: '/z/'},
                    },
                  ],
                },
              },
            ],
          },
          desc: 'guaranteed to be a runtime error unless the host environment does something wonky',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $ASI],
        });

        test('regex as value with property', {
          code: 'f(new /z/.foo)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'f'},
                  arguments: [
                    {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {
                        type: 'MemberExpression',
                        object: {type: 'Literal', value: '<TODO>', raw: '/z/'},
                        property: {type: 'Identifier', name: 'foo'},
                        computed: false,
                      },
                    },
                  ],
                },
              },
            ],
          },
          desc: 'foo could be an expando (`RegExp.prototype.foo = function(){}`) and then this works, *shrug*',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('division sans paren', {
          code: 'new x\n/y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'x'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'y'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('sans flag sans paren', {
          code: 'new x\n/y/',
          throws: 'Expected to parse a value',
          tokens: [],
        });

        test('with flag sans paren', {
          code: 'new x\n/y/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'x'},
                    },
                    operator: '/',
                    right: {type: 'Identifier', name: 'y'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'g'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('division with paren', {
          code: 'new x()\n/y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'x'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'y'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('sans flag with paren', {
          code: 'new x()\n/y/',
          throws: 'Expected to parse a value',
          tokens: [],
        });

        test('with flag with paren', {
          code: 'new x()\n/y/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'x'},
                    },
                    operator: '/',
                    right: {type: 'Identifier', name: 'y'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'g'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });
      });

      describe('argument special cases', _ => {
        test('arguments', {
          code: 'new arguments',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'arguments'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        describe('new async', _ => {

          test('async keyword sans parens', {
            code: 'new async',
            desc: 'okay in sloppy mode...',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'async'}
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('new async empty parens', {
            code: 'new async ()',
            desc: 'make sure the async does not end up as a callexpression in the ast',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'async'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('new async full parens', {
            code: 'new async (x, y)',
            desc: 'make sure the async does not end up as a callexpression in the ast',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                    callee: {type: 'Identifier', name: 'async'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test('new async spread', {
            code: 'new async (...x)',
            desc: 'spread, not rest',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [
                      {
                        type: 'SpreadElement',
                        argument: {type: 'Identifier', name: 'x'},
                      },
                    ],
                    callee: {type: 'Identifier', name: 'async'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test('new async newline parens', {
            code: 'new async \n ()',
            desc: 'async function is a restricted prod and cannot have newline after it, but this is always just a call',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'async'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test.fail('async arrow', {
            code: 'new async () => x',
            desc: 'cannot parse an assignment and an arrow is considered that',
          });

          test.fail('async newline arrow', {
            code: 'new async \n () => x',
          });

          test.fail('async arrow newline', {
            code: 'new async () \n => x',
          });


          test('async func', {
            code: 'new async function(){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('asi check async newline paren', {
            code: 'let x = new async \n (x)',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'Identifier', name: 'x'},
                      init: {
                        type: 'NewExpression',
                        arguments: [{type: 'Identifier', name: 'x'}],
                        callee: {type: 'Identifier', name: 'async'},
                      },
                    },
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test('asi check async newline arrow', {
            code: 'let x = new async \n (x) => x',
            throws: 'arrow',
          });

          test('asi check async paren newline arrow', {
            code: 'let x = new async (x) \n => x',
            throws: 'arrow',
          });
        });

        describe('typeof async', _ => {

          test('async keyword sans parens', {
            code: 'typeof async',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'typeof',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'async'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('typeof async parens', {
            code: 'typeof async ()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'typeof',
                    prefix: true,
                    argument: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'async'},
                      arguments: [],
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('typeof async newline parens', {
            code: 'typeof async \n ()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'typeof',
                    prefix: true,
                    argument: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'async'},
                      arguments: [],
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('async arrow', {
            code: 'typeof async () => x',
            throws: 'arrow',
          });

          test('async newline arrow', {
            code: 'typeof async \n () => x',
            throws: 'async',
          });

          test('async arrow newline', {
            code: 'typeof async () \n => x',
            throws: 'arrow',
          });

          test('async func', {
            code: 'typeof async function(){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'typeof',
                    prefix: true,
                    argument: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('asi check async newline paren', {
            code: 'let x = typeof async \n (x)',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'Identifier', name: 'x'},
                      init: {
                        type: 'UnaryExpression',
                        operator: 'typeof',
                        prefix: true,
                        argument: {
                          type: 'CallExpression',
                          callee: {type: 'Identifier', name: 'async'},
                          arguments: [{type: 'Identifier', name: 'x'}],
                        },
                      },
                    },
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test.fail('asi check async newline arrow', {
            code: 'let x = typeof async \n (x) => x',
          });

          test('asi check async paren newline arrow', {
            code: 'let x = typeof async (x) \n => x',
            throws: 'arrow',
          });

          test.fail('asi check typeof async arrow no newline', {
            code: 'let x = typeof async (x) => x',
            desc: 'arrow is assignment expression which is not valid as unary arg',
          });

          test.fail('asi check async boxed newline arrow', {
            code: 'let x = [typeof async \n (x) => x]',
          });

          test.fail('asi check async boxed paren newline arrow', {
            code: 'let x = [typeof async (x) \n => x]',
          });
        });

        describe('delete async', _ => {

          test('async keyword sans parens', {
            code: 'delete async',
            STRICT: {throws: 'without tail'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'async'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('delete async parens', {
            code: 'delete async ()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'async'},
                      arguments: [],
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('delete async newline parens', {
            code: 'delete async \n ()',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'async'},
                      arguments: [],
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('async arrow', {
            code: 'delete async () => x',
            throws: 'arrow',
          });

          test('async newline arrow', {
            code: 'delete async \n () => x',
            throws: 'async',
          });

          test('async arrow newline', {
            code: 'delete async () \n => x',
            throws: 'arrow',
          });

          test('async func', {
            code: 'delete async function(){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('asi check async newline paren', {
            code: 'let x = delete async \n (x)',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'Identifier', name: 'x'},
                      init: {
                        type: 'UnaryExpression',
                        operator: 'delete',
                        prefix: true,
                        argument: {
                          type: 'CallExpression',
                          callee: {type: 'Identifier', name: 'async'},
                          arguments: [{type: 'Identifier', name: 'x'}],
                        },
                      },
                    },
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
          });

          test.fail('asi check async newline arrow', {
            code: 'let x = delete async \n (x) => x',
          });

          test.fail('asi check async paren newline arrow', {
            code: 'let x = delete async (x) \n => x',
          });

          test.fail('boxed asi check async newline arrow', {
            code: 'let x = [delete async \n (x) => x]',
          });

          test.fail('boxed asi check async paren newline arrow', {
            code: 'let x = [delete async (x) \n => x]',
          });
        });

        test('await var', {
          code: 'new await',
          STRICT: {throws: true},
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'await'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('await call', {
          code: 'new await()',
          desc: 'NOT a call expression!',
          STRICT: {throws: true},
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'await'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('await expression fail', {
          code: 'new await foo',
          desc: 'not await expression so await is var name so it wants asi after `await` which fails',
          STRICT: {throws: true},
          throws: 'asi',
        });

        test('await expression in async arrow in new', {
          code: 'async () => new await x',
          desc: '`new` expects a NewExpression as arg, which is itself or a MemberExpression which can not lead to AwaitExpression',
          throws: 'new',
        });

        test('new await call who gets parens', {
          code: 'async () => new await x()',
          desc: '`new` expects a NewExpression as arg, which is itself or a MemberExpression which can not lead to AwaitExpression',
          throws: 'new',
        });

        test('calling the new await call', {
          code: 'async () => new await x()()',
          desc: '`new` expects a NewExpression as arg, which is itself or a MemberExpression which can not lead to AwaitExpression',
          throws: 'new',
        });

        test('await expression in async func in new', {
          code: 'async function f(){ new await foo }',
          desc: '`new` expects a NewExpression as arg, which is itself or a MemberExpression which can not lead to AwaitExpression',
          throws: 'new',
        });

        test('class sans body', {
          code: 'new class',
          throws: true,
        });

        test('class with body', {
          code: 'new class{}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'ClassExpression',
                    id: null,
                    superClass: null,
                    body: {type: 'ClassBody', body: []},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('class baited', {
          code: 'new class extends{}',
          desc: 'it might be valid to extend an expression that starts with an object literal',
          throws: true, // but this isnt valid
        });

        test('class extending', {
          code: 'new class extends x{}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'ClassExpression',
                    id: null,
                    superClass: {type: 'Identifier', name: 'x'},
                    body: {type: 'ClassBody', body: []},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('class extending grouped expression', {
          code: 'class x extends (x) {}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'x'},
                body: {type: 'ClassBody', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('class extending objlit', {
          code: 'class x extends {} {}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'ObjectExpression', properties: []},
                body: {type: 'ClassBody', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test.fail('class extending arrow silly case', {
          code: 'class x extends () => {} {}',
          desc: 'the extends value is not an assignment and arrow is so it fails',
        });

        test('delete sans arg', {
          code: 'new delete',
          throws: true,
        });

        test.fail('delete with arg', {
          code: 'new delete x',
        });

        test('eval ident', {
          code: 'new eval',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'eval'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('eval call', {
          code: 'new eval()',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'eval'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('false', {
          code: 'new false',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Literal', value: false, raw: 'false'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('this is why new false might not crash', {
          code: 'new false.__proto__.constructor',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: false, raw: 'false'},
                      property: {type: 'Identifier', name: '__proto__'},
                      computed: false,
                    },
                    property: {type: 'Identifier', name: 'constructor'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('function ident', {
          code: 'new function',
          throws: true,
        });

        test('function args', {
          code: 'new function()',
          throws: true,
        });

        test('function whole', {
          code: 'new function(){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: null,
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('function called whole', {
          code: 'new function(){}(x)',
          desc: 'this is interesting because is it an iffe or not',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [{type: 'Identifier', name: 'x'}],
                  callee: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: null,
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('let', {
          code: 'new let',
          throws: 'strict mode',
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'let'},
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          },
        });

        test('new ident', {
          code: 'new new',
          throws: true,
        });

        test('new arg', {
          code: 'new new A',
          desc: 'this could work',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'A'},
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $ASI],
        });

        test('new on the result of new can be made valid (1)', {
          code: 'new new A().foo',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'NewExpression',
                      arguments: [],
                      callee: {type: 'Identifier', name: 'A'},
                    },
                    property: {type: 'Identifier', name: 'foo'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('new on the result of new can be made valid (2)', {
          code: 'new new A.foo()',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'A'},
                      property: {type: 'Identifier', name: 'foo'},
                      computed: false,
                    },
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('null', {
          code: 'new null',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Literal', value: null, raw: 'null'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('toplevel super invalid', {
          code: 'new super',
          throws: 'super',
        });

        test('class super invalid', {
          code: 'class x { constructor() { new super }}',
          throws: 'super',
        });

        test('extending class super invalid', {
          code: 'class x extends y { constructor() { new super }}',
          throws: 'super',
        });

        test('new super property', {
          code: 'class x extends y { constructor() { new super.foo }}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'NewExpression',
                                arguments: [],
                                callee: {
                                  type: 'MemberExpression',
                                  object: {type: 'Super'},
                                  property: {type: 'Identifier', name: 'foo'},
                                  computed: false,
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('new super call', {
          code: 'class x extends y { constructor() { new super() }}',
          desc: 'you can probably make this work since the super could return a valid constructor (or like Function)',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: {type: 'Identifier', name: 'y'},
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'NewExpression',
                                arguments: [],
                                callee: {type: 'Super'},
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('true', {
          code: 'new true',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Literal', value: true, raw: 'true'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('this', {
          code: 'new this',
          decs: 'this could be extending Function',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'ThisExpression'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test('typeof ident', {
          code: 'new typeof',
          throws: true,
        });

        test('typeof arg', {
          code: 'new typeof x',
          throws: true,
        });

        test('typeof called arg', {
          code: 'new typeof x()',
          throws: true,
        });

        test('void ident', {
          code: 'new void',
          throws: true,
        });

        test('void arg', {
          code: 'new void x',
          throws: true,
        });

        test('dstring arg', {
          code: 'new "foo".__proto__.constructor',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                      property: {type: 'Identifier', name: '__proto__'},
                      computed: false,
                    },
                    property: {type: 'Identifier', name: 'constructor'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('sstring arg', {
          code: "new 'foo'.__proto__.constructor",
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: '<TODO>', raw: "'foo'"},
                      property: {type: 'Identifier', name: '__proto__'},
                      computed: false,
                    },
                    property: {type: 'Identifier', name: 'constructor'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('number arg', {
          code: 'new 1..__proto__.constructor',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: '<TODO>', raw: '1.'},
                      property: {type: 'Identifier', name: '__proto__'},
                      computed: false,
                    },
                    property: {type: 'Identifier', name: 'constructor'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('hex arg', {
          code: 'new 0x2.__proto__.constructor',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: '<TODO>', raw: '0x2'},
                      property: {type: 'Identifier', name: '__proto__'},
                      computed: false,
                    },
                    property: {type: 'Identifier', name: 'constructor'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $NUMBER_HEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('bool arg', {
          code: 'new true.__proto__.constructor',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: true, raw: 'true'},
                      property: {type: 'Identifier', name: '__proto__'},
                      computed: false,
                    },
                    property: {type: 'Identifier', name: 'constructor'},
                    computed: false,
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test.fail_strict('invalid yield ident', {
          code: 'new yield',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'yield'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $ASI],
        });

        test.fail_strict('yield call', {
          code: 'new yield()',
        });

        test.fail('yield inside generator', {
          code: 'function *f(){ new yield }',
        });

        test.fail('yield+arg inside generator', {
          code: 'function *f(){ new yield x }',
        });

        test.fail('yield+arg called inside generator', {
          code: 'function *f(){ new yield x(); }',
        });
      });

      test.fail('can not do arrow', {
        code: 'delete () => foo',
      });

      test.fail('can not do async arrow', {
        code: 'delete async() => foo',
      });

      test.pass('can do async function', {
        code: 'delete async function(){}',
      });

      test.pass('can do async call', {
        code: 'delete async(x);',
      });

      describe('assignment expressions as arg', _ => {

        test.fail('new argless arrow', {
          code: 'new ()=>{}',
        });

        test.fail('new parenless arrow', {
          code: 'new x=>{}',
        });

        test.fail('new arrow', {
          code: 'new (x)=>{}',
        });

        test.fail_strict('new yield var', {
          code: 'new yield',
        });

        test.fail('new yield keyword', {
          code: 'function *f(){ new yield }',
        });

        test.pass('new ternary', {
          code: 'new a ? b : c  ',
          desc: 'fine because `new` is stronger than `?`'
        });
      });
    });

    describe('new.target', _ => {
      // such a messed up syntax

      describe('basic tests', _ => {
        test('plain case', {
          code: 'function f(){ new.target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'MetaProperty',
                        meta: {type: 'Identifier', name: 'new'},
                        property: {type: 'Identifier', name: 'target'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });

        test('spacing should be allowed', {
          code: 'function f(){ new . target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'MetaProperty',
                        meta: {type: 'Identifier', name: 'new'},
                        property: {type: 'Identifier', name: 'target'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });

        test('bad prop', {
          code: 'function f(){ new.foo }',
          throws: 'no other "properties"',
          desc: 'only new.target is syntactic sequence, not an arbitrary property',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });
      });

      describe('scoping', _ => {
        test('in global', {
          code: 'new.target',
          throws: 'regular function',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
          desc: 'needs to be inside a function',
        });

        test('in a function', {
          code: 'function f(){ new.target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'MetaProperty',
                        meta: {type: 'Identifier', name: 'new'},
                        property: {type: 'Identifier', name: 'target'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
          desc: 'refers to the constructor being invoked when `new` is used',
        });

        test('in an arrow in global', {
          code: '_ => new.target',
          throws: 'regular function',
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          desc: 'there is no real function to refer to',
        });

        test('in a nested arrows in global', {
          code: '_ => _ => _ => _ => new.target',
          throws: 'regular function',
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          desc: 'still has no real function to refer to',
        });

        test('in an arrow in another function', {
          code: 'function f(){ return _ => new.target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'ArrowFunctionExpression',
                        params: [{type: 'Identifier', name: '_'}],
                        id: null,
                        generator: false,
                        async: false,
                        expression: true,
                        body: {
                          type: 'MetaProperty',
                          meta: {type: 'Identifier', name: 'new'},
                          property: {type: 'Identifier', name: 'target'},
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
          desc: 'refers to the surrounding function (okay, sure)',
        });

        test('in a nested arrow in a function', {
          code: 'function f(){ _ => _ => new.target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        params: [{type: 'Identifier', name: '_'}],
                        id: null,
                        generator: false,
                        async: false,
                        expression: true,
                        body: {
                          type: 'ArrowFunctionExpression',
                          params: [{type: 'Identifier', name: '_'}],
                          id: null,
                          generator: false,
                          async: false,
                          expression: true,
                          body: {
                            type: 'MetaProperty',
                            meta: {type: 'Identifier', name: 'new'},
                            property: {type: 'Identifier', name: 'target'},
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
          desc: 'refers to the surrounding function (okay, sure)',
        });

        test('in a function nested in an arrow', {
          code: '_ => function(){ new.target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: '_'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MetaProperty',
                            meta: {type: 'Identifier', name: 'new'},
                            property: {type: 'Identifier', name: 'target'},
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $ASI],
          desc: 'refers to the surrounding function (okay, sure)',
        });
      });

      describe('expression', _ => {
        test.fail('not assignable', {
          code: 'function f(){ new.target = foo }',
        });

        test('not incremental', {
          code: 'function f(){ ++new.target }',
          throws: 'non-assignable value',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });

        test('not decremental', {
         code: 'function f(){ new.target-- }',
         throws: 'non-assignable value',
        });

        test('operable left', {
          code: 'function f(){ new.target + foo }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'MetaProperty',
                          meta: {type: 'Identifier', name: 'new'},
                          property: {type: 'Identifier', name: 'target'},
                        },
                        operator: '+',
                        right: {type: 'Identifier', name: 'foo'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });

        test('operable right', {
          code: 'function f(){ foo + new.target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'foo'},
                        operator: '+',
                        right: {
                          type: 'MetaProperty',
                          meta: {type: 'Identifier', name: 'new'},
                          property: {type: 'Identifier', name: 'target'},
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });

        test('assigned', {
          code: 'function f(){ foo = new.target }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'foo'},
                        operator: '=',
                        right: {
                          type: 'MetaProperty',
                          meta: {type: 'Identifier', name: 'new'},
                          property: {type: 'Identifier', name: 'target'},
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });
      });

      describe('obj/class methods', _ => {
        test('obj method', {
          code: 'foo({bar(){ new.target }})',
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
                      type: 'ObjectExpression',
                      properties: [
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
                            body: {
                              type: 'BlockStatement',
                              body: [
                                {
                                  type: 'ExpressionStatement',
                                  expression: {
                                    type: 'MetaProperty',
                                    meta: {type: 'Identifier', name: 'new'},
                                    property: {type: 'Identifier', name: 'target'},
                                  },
                                },
                              ],
                            },
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
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          desc: '(the call wrapper only to disambiguate objlit)',
        });

        describe('class', _ => {
          test('constructor', {
            code: 'class X { constructor() { new.target }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'X'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: 'constructor'},
                        static: false,
                        computed: false,
                        kind: 'constructor',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'MetaProperty',
                                  meta: {type: 'Identifier', name: 'new'},
                                  property: {type: 'Identifier', name: 'target'},
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('method', {
            code: 'class X { foo() { new.target }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'X'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: 'foo'},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'MetaProperty',
                                  meta: {type: 'Identifier', name: 'new'},
                                  property: {type: 'Identifier', name: 'target'},
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('static member', {
            code: 'class X { static foo() { new.target }}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'X'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: 'foo'},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,                          id: null,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'MetaProperty',
                                  meta: {type: 'Identifier', name: 'new'},
                                  property: {type: 'Identifier', name: 'target'},
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
          });
        });
      });

      describe('inside args', _ => {
        test('func decl', {
          code: 'function f(f=new.target){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {type: 'Identifier', name: 'f'},
                    right: {
                      type: 'MetaProperty',
                      meta: {type: 'Identifier', name: 'new'},
                      property: {type: 'Identifier', name: 'target'},
                    },
                  },
                ],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          desc: 'func arg defaults are interpreted in the context of the call so this is fine',
        });

        test('func expr', {
          code: 'foo(function f(f=new.target){})',
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
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: {type: 'Identifier', name: 'f'},
                      params: [
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'f'},
                          right: {
                            type: 'MetaProperty',
                            meta: {type: 'Identifier', name: 'new'},
                            property: {type: 'Identifier', name: 'target'},
                          },
                        },
                      ],
                      body: {type: 'BlockStatement', body: []},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          desc: 'func arg defaults are interpreted in the context of the call so this is fine',
        });

        test('arrow', {
          code: '(f=new.target) => {}',
          throws: 'regular function',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          desc: 'still bad in arrow functions',
        });

        test('obj method', {
          code: '({foo(x=new.target){}})',
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
                      method: true,
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,                        id: null,
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'x'},
                            right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
                          },
                        ],
                        body: {type: 'BlockStatement', body: []},
                      },
                      shorthand: false,
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
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
            $ASI,
          ],
        });

        test('class constructor', {
          code: 'class A {constructor(x=new.target){}}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'A'},
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'constructor'},
                      static: false,
                      computed: false,
                      kind: 'constructor',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,                        id: null,
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'x'},
                            right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
                          },
                        ],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('class method', {
          code: 'class A {a(x=new.target){}}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'A'},
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'a'},
                      static: false,
                      computed: false,
                      kind: 'method',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,                        id: null,
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'x'},
                            right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
                          },
                        ],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('class static member', {
          code: 'class A {static a(x=new.target){}}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'A'},
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'MethodDefinition',
                      key: {type: 'Identifier', name: 'a'},
                      static: true,
                      computed: false,
                      kind: 'method',
                      value: {
                        type: 'FunctionExpression',
                        generator: false,
                        async: false,                        id: null,
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'x'},
                            right: {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}},
                          },
                        ],
                        body: {type: 'BlockStatement', body: []},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('edge cases', _ => {
        test('after spread', {
          code: 'function f(){ [...new.target] }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'SpreadElement',
                            argument: {
                              type: 'MetaProperty',
                              meta: {type: 'Identifier', name: 'new'},
                              property: {type: 'Identifier', name: 'target'},
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI, $PUNCTUATOR],
        });

        test('extends value', {
          code: 'function f(){ class x extends new.target {} }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ClassDeclaration',
                      id: {type: 'Identifier', name: 'x'},
                      superClass: {
                        type: 'MetaProperty',
                        meta: {type: 'Identifier', name: 'new'},
                        property: {type: 'Identifier', name: 'target'},
                      },
                      body: {
                        type: 'ClassBody',
                        body: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('dynamic prop', {
          code: 'function f(){ x({[new.target]:y}) }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'x'},
                        arguments: [
                          {
                            type: 'ObjectExpression',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'MetaProperty',
                                  meta: {type: 'Identifier', name: 'new'},
                                  property: {type: 'Identifier', name: 'target'},
                                },
                                kind: 'init',
                                method: false,
                                computed: true,
                                value: {type: 'Identifier', name: 'y'},
                                shorthand: false,
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
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
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $ASI,
            $PUNCTUATOR,
          ],
        });
      });
    });
  });
