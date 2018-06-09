let {$IDENT, $NUMBER_DEC, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('for statement', _ => {
    describe('for-loop', _ => {
      test('empty for-classic', {
        code: 'for (;;);',
        ast: {
          type: 'Program',
          body: [{type: 'ForStatement', init: null, test: null, update: null, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, only init, empty body', {
        code: 'for (a;;);',
        ast: {
          type: 'Program',
          body: [{type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: null, update: null, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, only test, empty body', {
        code: 'for (;b;);',
        ast: {
          type: 'Program',
          body: [{type: 'ForStatement', init: null, test: {type: 'Identifier', name: 'b'}, update: null, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, only update, empty body', {
        code: 'for (;;c);',
        ast: {
          type: 'Program',
          body: [{type: 'ForStatement', init: null, test: null, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, only init and test, empty body', {
        code: 'for (a;b;);',
        ast: {
          type: 'Program',
          body: [{type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: {type: 'Identifier', name: 'b'}, update: null, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, only init and update, empty body', {
        code: 'for (a;;c);',
        ast: {
          type: 'Program',
          body: [{type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: null, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, only test and update, empty body', {
        code: 'for (;b;c);',
        ast: {
          type: 'Program',
          body: [{type: 'ForStatement', init: null, test: {type: 'Identifier', name: 'b'}, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, init and test and update, empty body', {
        code: 'for (a;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {type: 'Identifier', name: 'a'},
              test: {type: 'Identifier', name: 'b'},
              update: {type: 'Identifier', name: 'c'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, init and test and update, empty body', {
        code: 'for (a + b * c * d;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'b'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'c'},
                  },
                  operator: '*',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
              test: {type: 'Identifier', name: 'b'},
              update: {type: 'Identifier', name: 'c'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, init and test and update, empty body', {
        code: 'for (a * b + c * d;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
              test: {type: 'Identifier', name: 'b'},
              update: {type: 'Identifier', name: 'c'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, expression disambiguation test', {
        code: 'for ((a * b + c) * d;b;c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'b'},
                  },
                  operator: '+',
                  right: {type: 'Identifier', name: 'c'},
                },
                operator: '*',
                right: {type: 'Identifier', name: 'd'},
              },
              test: {type: 'Identifier', name: 'b'},
              update: {type: 'Identifier', name: 'c'},
              body: {type: 'EmptyStatement'},
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
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
        ],
      });
    });

    describe('var decls', _ => {
      test('for-classic, one var, empty body', {
        code: 'for (var a;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, three vars, empty body', {
        code: 'for (var a,b,c;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
                ],
              },
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, one let, empty body', {
        code: 'for (let a;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, three lets, empty body', {
        code: 'for (let a,b,c;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
                ],
              },
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, only init, empty body', {
        code: 'for (const a;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, three consts, empty body', {
        code: 'for (const a,b,c;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
                ],
              },
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('vars with initializers', _ => {
      test('for-classic, one var with init, empty body', {
        code: 'for (var a=1;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}}],
              },
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, two vars only first has init, empty body', {
        code: 'for (var a=1, b;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
                ],
              },
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, two vars only second has init, empty body', {
        code: 'for (var a, b=1;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
                ],
              },
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('for-classic, two vars both have init, empty body', {
        code: 'for (var a=1, b=2;;);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForStatement',
              init: {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
                  {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: {type: 'Literal', value: '<TODO>', raw: '2'}},
                ],
              },
              test: null,
              update: null,
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('for-in', _ => {
      test('empty for-in', {
        code: 'for (a in b);',
        ast: {
          type: 'Program',
          body: [{type: 'ForInStatement', left: {type: 'Identifier', name: 'a'}, right: {type: 'Identifier', name: 'b'}, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty for-in', {
        code: 'for (var a in b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              right: {type: 'Identifier', name: 'b'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty for-in', {
        code: 'for (let a in b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              right: {type: 'Identifier', name: 'b'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty for-in', {
        code: 'for (const a in b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              right: {type: 'Identifier', name: 'b'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      describe('web compat', _ => {
        // https://tc39.github.io/ecma262/#sec-iteration-statements
        //   for ( var ForBinding[?Yield, ?Await] in Expression[+In, ?Yield, ?Await] )
        //     Statement[?Yield, ?Await, ?Return]
        // https://tc39.github.io/ecma262/#sec-initializers-in-forin-statement-heads
        // The following augments the IterationStatement;
        //   IterationStatement[Yield, Await, Return]:
        //     for ( var BindingIdentifier[?Yield, ?Await] Initializer[~In, ?Yield, ?Await] in Expression[+In, ?Yield, ?Await] )
        //       Statement[?Yield, ?Await, ?Return]
        // (note that Expression also has comma-expression, there is no "Expressions" production)

        test('var with init left of `in`', {
          code: 'for (var a = b in c);',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing and only valid in sloppy mode
            desc: 'https://tc39.github.io/ecma262/#sec-initializers-in-forin-statement-heads',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'a'},
                        init: {type: 'Identifier', name: 'b'},
                      },
                    ],
                  },
                  right: {type: 'Identifier', name: 'c'},
                  body: {type: 'EmptyStatement'},
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('incremental in var init left of `in`', {
          code: 'for (var a = ++b in c);',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'a'},
                        init: {
                          type: 'UpdateExpression',
                          operator: '++',
                          prefix: true,
                          argument: {type: 'Identifier', name: 'b'},
                        },
                      },
                    ],
                  },
                  right: {type: 'Identifier', name: 'c'},
                  body: {type: 'EmptyStatement'},
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('var with init left and assignment right of `in`', {
          code: 'for (var a = 0 in stored = a, {});',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'a'},
                        init: {type: 'Literal', value: '<TODO>', raw: '0'},
                      },
                    ],
                  },
                  right: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'stored'},
                        operator: '=',
                        right: {type: 'Identifier', name: 'a'},
                      },
                      {type: 'ObjectExpression', properties: []},
                    ],
                  },
                  body: {type: 'EmptyStatement'},
                },
              ],
            },
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('grouped init left of `in`', {
          code: 'for (var a = (++effects, -1) in x);',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'a'},
                        init: {
                          type: 'SequenceExpression',
                          expressions: [
                            {
                              type: 'UpdateExpression',
                              operator: '++',
                              prefix: true,
                              argument: {type: 'Identifier', name: 'effects'},
                            },
                            {
                              type: 'UnaryExpression',
                              operator: '-',
                              prefix: true,
                              argument: {type: 'Literal', value: '<TODO>', raw: '1'},
                            },
                          ],
                        },
                      },
                    ],
                  },
                  right: {type: 'Identifier', name: 'x'},
                  body: {type: 'EmptyStatement'},
                },
              ],
            },
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('comma expression right of `in`', {
          code: 'for (var a in stored = a, {a: 0, b: 1, c: 2});',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'Identifier', name: 'a'},
                      init: null,
                    },
                  ],
                },
                right: {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'stored'},
                      operator: '=',
                      right: {type: 'Identifier', name: 'a'},
                    },
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'a'},
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          computed: false,
                          value: {type: 'Literal', value: '<TODO>', raw: '0'},
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'b'},
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          computed: false,
                          value: {type: 'Literal', value: '<TODO>', raw: '1'},
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'c'},
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          computed: false,
                          value: {type: 'Literal', value: '<TODO>', raw: '2'},
                        },
                      ],
                    },
                  ],
                },
                body: {type: 'EmptyStatement'},
              },
            ],
          },
          desc: '(not legacy but sanity check in this set. the rhs of `for-in` is a regular Expression node which have a comma)',
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('combination of last two tests', {
          code: 'for (var a = (++effects, -1) in stored = a, {a: 0, b: 1, c: 2});',
          throws: 'can not have an init',
          WEB: {
            // this is an annexB web compat thing
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ForInStatement',
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'a'},
                        init: {
                          type: 'SequenceExpression',
                          expressions: [
                            {
                              type: 'UpdateExpression',
                              operator: '++',
                              prefix: true,
                              argument: {type: 'Identifier', name: 'effects'},
                            },
                            {
                              type: 'UnaryExpression',
                              operator: '-',
                              prefix: true,
                              argument: {type: 'Literal', value: '<TODO>', raw: '1'},
                            },
                          ],
                        },
                      },
                    ],
                  },
                  right: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'stored'},
                        operator: '=',
                        right: {type: 'Identifier', name: 'a'},
                      },
                      {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            computed: false,
                            value: {type: 'Literal', value: '<TODO>', raw: '0'},
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'b'},
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            computed: false,
                            value: {type: 'Literal', value: '<TODO>', raw: '1'},
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            shorthand: false,
                            computed: false,
                            value: {type: 'Literal', value: '<TODO>', raw: '2'},
                          },
                        ],
                      },
                    ],
                  },
                  body: {type: 'EmptyStatement'},
                },
              ],
            },
          },
          tokens: [
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $NUMBER_DEC,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });

        test('destructuring with init is always illegal', {
          code: 'for (var [a] = 0 in {});',
          throws: 'can not have an init',
          WEB: {
            throws: 'can not have an init',
            desc: 'this is important; it should also throw in web-compat mode',
          },
          tokens: [],
        });

        test('destructuring with const is always illegal', {
          code: 'for (const x = 0 in {});',
          throws: true,
        });

        test('destructuring with const is always illegal', {
          code: 'for (let x = 0 in {});',
          throws: true,
        });
      });
    });

    describe('for-of', _ => {
      test('empty for-of', {
        code: 'for (a of b);',
        ast: {
          type: 'Program',
          body: [{type: 'ForOfStatement', left: {type: 'Identifier', name: 'a'}, right: {type: 'Identifier', name: 'b'}, body: {type: 'EmptyStatement'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty for-of', {
        code: 'for (var a of b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              right: {type: 'Identifier', name: 'b'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty for-of', {
        code: 'for (let a of b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              right: {type: 'Identifier', name: 'b'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty for-of', {
        code: 'for (const a of b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
              right: {type: 'Identifier', name: 'b'},
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('async for', _ => {
      // https://github.com/tc39/proposal-async-iteration
      //test('base case', {
      //  code: `
      //    async function * fn() {
      //      for await (x of y) {
      //      }
      //    }
      //  `,
      //});
    });
  });

// lhs can not use paren trick to avoid non-assignability (https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors)
// can not use `for (let[foo] as bar);` to refer to `let` as a varname. Similarly I don't think `for (let[foo].bar` is allowed (although it doesn't get the same explicit exception as statements).
