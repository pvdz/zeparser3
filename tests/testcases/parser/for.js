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

      test.pass('you can have `in` inside the ternary', {
        code: 'for (true ? a in b : {}; false; ) ;',
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
        throws: 'init',
      });

      test('for-classic, three consts, empty body', {
        code: 'for (const a,b,c;;);',
        throws: 'init',
      });

      describe('rest', _ => {
        test('rest arr', {
          code: 'for (const [...x] in y){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'RestElement',
                            argument: {type: 'Identifier', name: 'x'},
                          },
                        ],
                      },
                      init: null,
                    },
                  ],
                },
                right: {type: 'Identifier', name: 'y'},
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('var and rest arr', {
          code: 'for (const [...x] in y){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ForInStatement',
                left: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'RestElement',
                            argument: {type: 'Identifier', name: 'x'},
                          },
                        ],
                      },
                      init: null,
                    },
                  ],
                },
                right: {type: 'Identifier', name: 'y'},
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('rest obj', {
          code: 'for (const {...x} in y){}',
          throws: true, // TODO
        });

        test('ummmm no', {
          code: 'for (const ...x in y){}',
          throws: true, // TODO
        });

        test('absolutely no', {
          code: 'for (...x in y){}',
          throws: true, // TODO
        });
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

      test('assign as rhs', {
        code: 'for (a in b=c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'Identifier', name: 'a'},
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '=',
                right: {type: 'Identifier', name: 'c'},
              },
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      // TODO: cases for yield and await as rhs

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
                          computed: false,
                          value: {type: 'Literal', value: '<TODO>', raw: '0'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'b'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Literal', value: '<TODO>', raw: '1'},
                          shorthand: false,
                        },
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'c'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'Literal', value: '<TODO>', raw: '2'},
                          shorthand: false,
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
                            computed: false,
                            value: {type: 'Literal', value: '<TODO>', raw: '0'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'b'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Literal', value: '<TODO>', raw: '1'},
                            shorthand: false,
                          },
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'c'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Literal', value: '<TODO>', raw: '2'},
                            shorthand: false,
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

      test.fail('ternary in for-loop', {
        code: 'for (true ? 0 : 0 in {}; false; ) ;',
      });

      test('let edge case', {
        code: 'for (let in x) y',
        STRICT: {throws: 'strict mode'},
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {type: 'Identifier', name: 'in'},
              right: {type: 'Identifier', name: 'x'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: true,
      });

      test('arr destructuring without binding', {
        code: 'for ([a.b] in c) d',
        desc: '[a.b] is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'a'},
                    property: {type: 'Identifier', name: 'b'},
                    computed: false,
                  },
                ],
              },
              right: {type: 'Identifier', name: 'c'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: true,
      });

      test('no arr destructuring with property', {
        code: 'for ([a.b].foo in c) d',
        desc: 'the lhs must not contain a Pattern',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'a'},
                      property: {type: 'Identifier', name: 'b'},
                      computed: false,
                    },
                  ],
                },
                property: {type: 'Identifier', name: 'foo'},
                computed: false,
              },
              right: {type: 'Identifier', name: 'c'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: true,
      });


      test('obj destructuring without binding', {
        code: 'for ({a: b.c} in d) e',
        desc: '{a: b.c} is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
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
                    key: {type: 'Identifier', name: 'a'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'b'},
                      property: {type: 'Identifier', name: 'c'},
                      computed: false,
                    },
                    shorthand: false,
                  },
                ],
              },
              right: {type: 'Identifier', name: 'd'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: true,
      });

      test('no destructuring with property', {
        code: 'for ({a: b.c}.foo in d) e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForInStatement',
              left: {
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
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'b'},
                        property: {type: 'Identifier', name: 'c'},
                        computed: false,
                      },
                      shorthand: false,
                    },
                  ],
                },
                property: {type: 'Identifier', name: 'foo'},
                computed: false,
              },
              right: {type: 'Identifier', name: 'd'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: true,
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

      test('assign as rhs', {
        code: 'for (a of b=c);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {type: 'Identifier', name: 'a'},
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '=',
                right: {type: 'Identifier', name: 'c'},
              },
              body: {type: 'EmptyStatement'},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test.fail('let edge case does not work in for-of', {
        code: 'for (let of x) y',
      });

      test('destructuring without binding', {
        code: 'for ([a.b] of c) d',
        desc: '[a.b] is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'a'},
                    property: {type: 'Identifier', name: 'b'},
                    computed: false,
                  },
                ],
              },
              right: {type: 'Identifier', name: 'c'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: true,
      });

      test('no destructuring with property', {
        code: 'for ([a.b].foo of c) d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'a'},
                      property: {type: 'Identifier', name: 'b'},
                      computed: false,
                    },
                  ],
                },
                property: {type: 'Identifier', name: 'foo'},
                computed: false,
              },
              right: {type: 'Identifier', name: 'c'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: true,
      });

      test('obj destructuring without binding', {
        code: 'for ({a: b.c} of d) e',
        desc: '{a: b.c} is destructible so should be fine as lhs of any for loop. note: the lhs must be a Pattern with `in` or `of`!',
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
                    key: {type: 'Identifier', name: 'a'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'b'},
                      property: {type: 'Identifier', name: 'c'},
                      computed: false,
                    },
                    shorthand: false,
                  },
                ],
              },
              right: {type: 'Identifier', name: 'd'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: true,
      });

      test('no destructuring with property', {
        code: 'for ({a: b.c}.foo of d) e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ForOfStatement',
              left: {
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
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'b'},
                        property: {type: 'Identifier', name: 'c'},
                        computed: false,
                      },
                      shorthand: false,
                    },
                  ],
                },
                property: {type: 'Identifier', name: 'foo'},
                computed: false,
              },
              right: {type: 'Identifier', name: 'd'},
              body: {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: true,
      });

      test.fail('rhs must be AssignmentExpression', {
        code: 'for (let x of a,b) c',
      });

      // TODO: cases for yield and await as rhs
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

    test.pass('allow assignment', {
      code: 'for (foo=10;;);',
    });

    test.pass('allow let assignment', {
      code: 'for (let=10;;);',
      STRICT: {throws: 'let'},
    });

    test.fail('should not over accept an `of` after an `in` 1', {
      code: 'for (x in y of) ;',
    });

    test.fail('should not over accept an `of` after an `in` 2', {
      code: 'for (x in y of z) ;',
    });
  });

// lhs can not use paren trick to avoid non-assignability (https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors)
// can not use `for (let[foo] as bar);` to refer to `let` as a varname. Similarly I don't think `for (let[foo].bar` is allowed (although it doesn't get the same explicit exception as statements).
