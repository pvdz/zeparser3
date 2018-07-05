let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('let statement', _ => {
    describe('binding generic', _ => {
      // for destructuring, these are the array pattern tests to check for all places where we'd want to check it:
      // let [] = x;
      // let [,] = x;
      // let [,,] = x;
      // let [foo] = x;
      // let [foo,] = x;
      // let [foo,,] = x;
      // let [,foo] = x;
      // let [,,foo] = x;
      // let [foo,bar] = x;
      // let [foo,,bar] = x;
      // let [foo] = x, [foo] = y;
      // let [foo] = x, b;
      // let [foo] = x, b = y;
      // let x, [foo] = y;
      // let x = y, [foo] = z;
      // let [foo=a] = c;
      // let [foo=a,bar] = x;
      // let [foo,bar=b] = x;
      // let [foo=a,bar=b] = x;
      // let [foo];                 // error
      // let [foo=a];               // error
      // let [foo], bar;            // error
      // let foo, [bar];            // error
      // let [...bar] = obj;
      // let [foo, ...bar] = obj;
      // let [...foo, bar] = obj;   // error
      // let [...foo,] = obj;       // ok!
      // let [...foo,,] = obj;      // error
      // let [...[a, b]] = obj;
      // let [...[a, b],] = obj;    // ok!
      // let [...[a, b],,] = obj;   // error
      // let [x, ...[a, b]] = obj;
      // let [...bar = foo] = obj;  // error (TODO: except in funcs, arrows, and maybe `for`?)
      // let [... ...foo] = obj;    // error
      // let [...] = obj;           // error
      // let [...,] = obj;          // error
      // let [.x] = obj;            // error
      // let [..x] = obj;           // error
      // let [a=[...b], ...c] = obj;

      // and these are the object versions:
      // let {} = x;
      // let {,} = x;             // error
      // let {,,} = x;            // error
      // let {foo} = x;
      // let {foo,} = x;          // ok
      // let {foo,,} = x;         // error
      // let {,foo} = x;          // error
      // let {,,foo} = x;         // error
      // let {foo,bar} = x;
      // let {foo,,bar} = x;      // error
      // let {foo} = x, {foo} = y;
      // let {foo} = x, b;
      // let {foo} = x, b = y;
      // let x, {foo} = y;
      // let x = y, {foo} = z;
      // let {foo=a} = x;
      // let {foo=a,bar} = x;
      // let {foo,bar=b} = x;
      // let {foo=a,bar=b} = x;
      // let {foo:a} = x;
      // let {foo:a,bar} = x;
      // let {foo,bar:b} = x;
      // let {foo:a,bar:b} = x;
      // let {foo:a,bar:b} = x;
      // let {foo:a=b} = x;
      // let {foo:a=b, bar:c=d} = x;
      // let {foo};
      // let {foo=a};
      // let {foo:a};
      // let {foo:a=b};
      // let {foo}, bar;
      // let foo, {bar};

      // All variations of tests are executed for statement start, inside for-headers (4x), and in export declaration
      // When new syntax is introduced that allows let/const binding syntax those variations should apply to them as well

      describe('as a statement', _ => {
        describe('regular vars', _ => {
          test('let, one var, no init, semi', {
            code: 'let foo;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let, one var, no init, eof', {
            code: 'let foo',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('let, two vars, no init, semi', {
            code: 'let foo, bar;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let, two vars, no init, eof', {
            code: 'let foo, bar',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('let, var with init, semi', {
            code: 'let foo = bar;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let, var with init, eof', {
            code: 'let foo = bar',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('let, var with init, asi', {
            code: 'let foo = bar\nlet zoo;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}}],
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let, two vars with both init, semi', {
            code: 'let foo = bar, zoo = boo;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let, two vars with both init, asi', {
            code: 'let foo = bar, zoo = boo',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('var on next line does not trigger asi', {
            code: 'let\nfoo',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'Identifier', name: 'foo'},
                      init: null,
                    },
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('asi can not trigger if next token is ident', {
            code: 'let\nfoo()',
            throws: 'ASI',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });

        describe('destructuring', _ => {
          describe('array', _ => {
            test('empty "array" should work', {
              code: 'let [] = x;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'ArrayPattern', elements: []},
                        init: {type: 'Identifier', name: 'x'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('empty array with one comma', {
              code: 'let [,] = x;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'ArrayPattern', elements: [null]},
                        init: {type: 'Identifier', name: 'x'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('empty array with double comma', {
              code: 'let [,,] = x;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'ArrayPattern', elements: [null, null]},
                        init: {type: 'Identifier', name: 'x'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('with one var, no init, semi', {
              code: 'let [foo] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]}, init: {type: 'Identifier', name: 'arr'}},
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('trailing comma is insignificant', {
              code: 'let [foo,] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'foo'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double trailing comma is significant', {
              code: 'let [foo,,] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'foo'}, null],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('leading comma', {
              code: 'let [,foo] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [null, {type: 'Identifier', name: 'foo'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double leading comma', {
              code: 'let [,,foo] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [null, null, {type: 'Identifier', name: 'foo'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('two vars', {
              code: 'let [foo,bar] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('two vars with eliding comma', {
              code: 'let [foo,,bar] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'foo'}, null, {type: 'Identifier', name: 'bar'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct', {
              code: 'let [foo] = arr, [bar] = arr2;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'foo'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'bar'}],
                        },
                        init: {type: 'Identifier', name: 'arr2'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'let [foo] = arr, bar;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'foo'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'bar'},
                        init: null,
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'let [foo] = arr, bar = arr2;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'foo'}],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'bar'},
                        init: {type: 'Identifier', name: 'arr2'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('non-destruct without init and destruct', {
              code: 'let foo, [bar] = arr2;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: null,
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'bar'}],
                        },
                        init: {type: 'Identifier', name: 'arr2'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('non-destruct with init and destruct', {
              code: 'let foo = arr, [bar] = arr2;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: {type: 'Identifier', name: 'arr'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'bar'}],
                        },
                        init: {type: 'Identifier', name: 'arr2'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('one var with initializer', {
              code: 'let [foo=a] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'AssignmentPattern',
                              left: {type: 'Identifier', name: 'foo'},
                              right: {type: 'Identifier', name: 'a'},
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('two vars, with and without initializer', {
              code: 'let [foo=a, bar] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [
                            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'foo'}, right: {type: 'Identifier', name: 'a'}},
                            {type: 'Identifier', name: 'bar'},
                          ],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('two vars, without and with initializer', {
              code: 'let [foo, bar=b] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [
                            {type: 'Identifier', name: 'foo'},
                            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, right: {type: 'Identifier', name: 'b'}},
                          ],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('two vars, without and with initializer', {
              code: 'let [foo=a, bar=b] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [
                            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'foo'}, right: {type: 'Identifier', name: 'a'}},
                            {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, right: {type: 'Identifier', name: 'b'}},
                          ],
                        },
                        init: {type: 'Identifier', name: 'arr'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment without init', {
              code: 'let [foo];',
              throws: 'destructuring must have init',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'let [foo = x];',
              throws: 'destructuring must have init',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'let [foo], bar;',
              throws: 'destructuring must have init',
              desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'let foo, [bar];',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('cannot rename a var like obj destruct can', {
              code: 'let [foo:bar] = obj;',
              throws: true,
            });

            describe('rest operator', _ => {
              test('rest as the only destruct', {
                code: 'let [...foo] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'RestElement',
                                argument: {type: 'Identifier', name: 'foo'},
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest preceded by an ident', {
                code: 'let [foo, ...bar] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [
                              {type: 'Identifier', name: 'foo'},
                              {
                                type: 'RestElement',
                                argument: {type: 'Identifier', name: 'bar'},
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest followed by an ident', {
                code: 'let [...foo, bar] = obj;',
                throws: true,
              });

              test('rest followed by a trailing comma', {
                code: 'let [...foo,] = obj;',
                throws: true,
                desc: 'while feasible the syntax spec currently does not have a rule for allowing trailing commas after rest',
              });

              test('rest followed by two commas', {
                code: 'let [...foo,,] = obj;',
                throws: true,
              });

              test('rest on a nested destruct', {
                code: 'let [...[foo, bar]] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'RestElement',
                                argument: {
                                  type: 'ArrayPattern',
                                  elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                },
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('trailing comma after rest on a nested destruct', {
                code: 'let [...[foo, bar],] = obj;',
                throws: true,
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'let [...[foo, bar],,] = obj;',
                throws: true,
              });

              test('second param rest on a nested destruct', {
                code: 'let [x, ...[foo, bar]] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [
                              {type: 'Identifier', name: 'x'},
                              {
                                type: 'RestElement',
                                argument: {
                                  type: 'ArrayPattern',
                                  elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                },
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                  ],
                },
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                ],
              });

              test('rest with default', {
                code: 'let [...bar = foo] = obj;',
                throws: true,
                desc: 'rest cannot get a default in var decls but they can as func args',
              });

              test('double rest / spread rest', {
                code: 'let [... ...foo] = obj;',
                throws: 'Can not rest twice',
                tokens: [],
              });

              test('rest without value', {
                code: 'let [...] = obj;',
                throws: true,
              });

              test('rest with comma without value', {
                code: 'let [...,] = obj;',
                throws: true,
              });

              test('single dot vs rest', {
                code: 'let [.x] = obj;',
                throws: true,
              });

              test('double dot vs rest', {
                code: 'let [..x] = obj;',
                throws: true,
              });

              test('spread vs rest', {
                code: 'let [a=[...b], ...c] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'AssignmentPattern',
                                left: {type: 'Identifier', name: 'a'},
                                right: {
                                  type: 'ArrayExpression',
                                  elements: [
                                    {
                                      type: 'SpreadElement',
                                      argument: {type: 'Identifier', name: 'b'},
                                    },
                                  ],
                                },
                              },
                              {
                                type: 'RestElement',
                                argument: {type: 'Identifier', name: 'c'},
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                  ],
                },
                desc: 'expecting both a rest and spread node in the ast',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
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
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                ],
              });
            });
          });

          describe('object', _ => {
            test('empty obj', {
              code: 'let {} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'ObjectPattern', properties: []},
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('empty obj with trailing comma', {
              code: 'let {,} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'let {,,} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'let {x} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with trailing comma', {
              code: 'let {x,} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double trailing comma', {
              code: 'let {x,,} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'let {,x} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'let {,,x} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'let {x, y} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                              type: 'Property',
                              key: {type: 'Identifier', name: 'y'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var with double comma', {
              code: 'let {x,, y} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'let {x} = a, {y} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                        init: {type: 'Identifier', name: 'a'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'y'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'let {x} = a, y = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                        init: {type: 'Identifier', name: 'a'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'y'},
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'let {x} = a, obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                        init: {type: 'Identifier', name: 'a'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'obj'},
                        init: null,
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('non-destruct with ini and destruct', {
              code: 'let x = a, {y} = obj;',
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
                        init: {type: 'Identifier', name: 'a'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'y'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('non-destruct without ini and destruct', {
              code: 'let x, {y} = obj;',
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
                        init: null,
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'y'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with init', {
              code: 'let {x = y} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
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
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              desc: 'note: value gets the assignment pattern! not the objectpattern:properties',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with and without init', {
              code: 'let {x = y, z} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
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
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'z'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'z'},
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct without and with init', {
              code: 'let {x, y = z} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                              type: 'Property',
                              key: {type: 'Identifier', name: 'y'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {
                                type: 'AssignmentPattern',
                                left: {type: 'Identifier', name: 'y'},
                                right: {type: 'Identifier', name: 'z'},
                              },
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct both with init', {
              code: 'let {x = y, z = a} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
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
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'z'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {
                                type: 'AssignmentPattern',
                                left: {type: 'Identifier', name: 'z'},
                                right: {type: 'Identifier', name: 'a'},
                              },
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename', {
              code: 'let {x : y} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with and without rename', {
              code: 'let {x : y, z} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'z'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'z'},
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct without and with rename', {
              code: 'let {x, y : z} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct both with rename', {
              code: 'let {x : y, z : a} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'z'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'a'},
                              shorthand: false,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and init', {
              code: 'let {x : y = z} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
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
                                left: {type: 'Identifier', name: 'y'},
                                right: {type: 'Identifier', name: 'z'},
                              },
                              shorthand: false,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and init', {
              code: 'let {x : y, z, a : b = c} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
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
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'z'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'z'},
                              shorthand: true,
                            },
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'a'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {
                                type: 'AssignmentPattern',
                                left: {type: 'Identifier', name: 'b'},
                                right: {type: 'Identifier', name: 'c'},
                              },
                              shorthand: false,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                  },
                ],
              },
              tokens: [
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
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
              ],
            });

            test('single destruct no assignment', {
              code: 'let {x};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'let {x}, {y} = z;',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'let x, {y};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'let {x}, y;',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'let x = y, {z};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'let {x:y};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'let {x=y};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'let {x:y=z};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'let {x:y=z} = obj, {a:b=c};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'let {x:y=z}, {a:b=c} = obj;',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'let {a:=c} = z;',
              throws: true,
            });

            test('correct dynamic property destructuring', {
              code: 'let {[x]: y} = z;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'x'},
                              kind: 'init',
                              method: false,
                              computed: true,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: false,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'z'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('dynamic property destructuring missing alias', {
              code: 'let {[x]} = z;',
              throws: 'computed property name',
            });

            test('dynamic property destructuring missing alias and init', {
              code: 'let {[x]};',
              throws: 'computed property name',
            });

            test('dynamic property destructuring missing assignment', {
              code: 'let {[x]: y};',
              throws: 'destructuring must have init',
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'let {[x] = y} = z;',
              throws: 'computed property name',
            });

            test('dynamic property destructuring with default and alias missing init', {
              code: 'let {[x]: y = z};',
              throws: 'destructuring must have init',
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'let {[x]: y = z} = a;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'x'},
                              kind: 'init',
                              method: false,
                              computed: true,
                              value: {
                                type: 'AssignmentPattern',
                                left: {type: 'Identifier', name: 'y'},
                                right: {type: 'Identifier', name: 'z'},
                              },
                              shorthand: false,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('dynamic prop as second prop', {
              code: 'let {a, [x]: y} = a;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
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
                              key: {type: 'Identifier', name: 'x'},
                              kind: 'init',
                              method: false,
                              computed: true,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: false,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'a'},
                      },
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });
          });
        });
      });

      describe('in a for-header', _ => {
        describe('regular vars', _ => {
          describe('regular for-loop', _ => {
            test('let, one var, no init, semi', {
              code: 'for (let foo;;);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: null,
                        },
                      ],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars, no init, semi', {
              code: 'for (let foo, bar;;);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: null,
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'bar'},
                          init: null,
                        },
                      ],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, var with init, semi', {
              code: 'for (let foo = bar;;);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: {type: 'Identifier', name: 'bar'},
                        },
                      ],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars with both init, semi', {
              code: 'for (let foo = bar, zoo = boo;;);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: {type: 'Identifier', name: 'bar'},
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'zoo'},
                          init: {type: 'Identifier', name: 'boo'},
                        },
                      ],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var on next line does not trigger asi', {
              code: 'for (let\nfoo;;);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: null,
                        },
                      ],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('asi can not trigger if next token is ident', {
              code: 'for (let\nfoo();;);',
              throws: '(;)', // expecting for-header semi
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });

          describe('invalid colorless for statement', _ => {
            test('let, one var, no init, semi', {
              code: 'for (let foo);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars, no init, semi', {
              code: 'for (let foo, bar);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, var with init, semi', {
              code: 'for (let foo = bar);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars with both init, semi', {
              code: 'for (let foo = bar, zoo = boo);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var on next line does not trigger asi', {
              code: 'for (let\nfoo);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('asi can not trigger if next token is ident', {
              code: 'for (let\nfoo());',
              throws: '(;)', // expecting for-header semi
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });

          describe('for-in', _ => {
            test('let, one var, no init, semi', {
              code: 'for (let foo in x);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForInStatement',
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: null,
                        },
                      ],
                    },
                    right: {type: 'Identifier', name: 'x'},
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars, no init, semi', {
              code: 'for (let foo, bar in x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, var with init, semi', {
              code: 'for (let foo = bar in x);',
              throws: 'binding can not have an init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars with both init, semi', {
              code: 'for (let foo = bar, zoo = boo in x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var on next line does not trigger asi', {
              code: 'for (let\nfoo in x);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForInStatement',
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: null,
                        },
                      ],
                    },
                    right: {type: 'Identifier', name: 'x'},
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('asi can not trigger if next token is ident', {
              code: 'for (let\nfoo() in x);',
              throws: '(;)', // expecting for-header semi
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });

          describe('for-of', _ => {
            test('let, one var, no init, semi', {
              code: 'for (let foo of x);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForOfStatement',
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: null,
                        },
                      ],
                    },
                    right: {type: 'Identifier', name: 'x'},
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars, no init, semi', {
              code: 'for (let foo, bar of x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, var with init, semi', {
              code: 'for (let foo = bar of x);',
              throws: 'binding can not have an init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('let, two vars with both init, semi', {
              code: 'for (let foo = bar, zoo = boo of x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var on next line does not trigger asi', {
              code: 'for (let\nfoo of x);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForOfStatement',
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'foo'},
                          init: null,
                        },
                      ],
                    },
                    right: {type: 'Identifier', name: 'x'},
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('asi can not trigger if next token is ident', {
              code: 'for (let\nfoo() of x);',
              throws: '(;)', // expecting for-header semi
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });
        });

        describe('destructuring', _ => {
          // note: a for-header must use `in` or `of` for the assignment if and only if it
          //       concerns a for-in or for-of statement respectively. For a regular
          //       for-loop the assignment can still only be `=`.

          // note: all tests are mirrored between for-loop for-in and for-of to ensure
          //       they all work (this caught at least one bug by itself; they're staying)

          describe('regular for-loop', _ => {
            describe('array', _ => {
              test('empty "array" should work', {
                code: 'for (let [] = x;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: []},
                            init: {type: 'Identifier', name: 'x'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with one comma', {
                code: 'for (let [,] = x;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: [null]},
                            init: {type: 'Identifier', name: 'x'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with double comma', {
                code: 'for (let [,,] = x;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: [null, null]},
                            init: {type: 'Identifier', name: 'x'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('with one var, no init, semi', {
                code: 'for (let [foo] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('trailing comma is insignificant', {
                code: 'for (let [foo,] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double trailing comma is significant', {
                code: 'for (let [foo,,] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, null],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
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
                ],
              });

              test('leading comma', {
                code: 'for (let [,foo] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [null, {type: 'Identifier', name: 'foo'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double leading comma', {
                code: 'for (let [,,foo] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [null, null, {type: 'Identifier', name: 'foo'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('two vars', {
                code: 'for (let [foo,bar] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('two vars with eliding comma', {
                code: 'for (let [foo,,bar] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, null, {type: 'Identifier', name: 'bar'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct', {
                code: 'for (let [foo] = arr, [bar] = arr2;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'bar'}],
                            },
                            init: {type: 'Identifier', name: 'arr2'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct without init', {
                code: 'for (let [foo] = arr, bar;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'bar'},
                            init: null,
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct with init', {
                code: 'for (let [foo] = arr, bar = arr2;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'bar'},
                            init: {type: 'Identifier', name: 'arr2'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct without init and destruct', {
                code: 'for (let foo, [bar] = arr2;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'foo'},
                            init: null,
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'bar'}],
                            },
                            init: {type: 'Identifier', name: 'arr2'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct with init and destruct', {
                code: 'for (let foo = arr, [bar] = arr2;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'foo'},
                            init: {type: 'Identifier', name: 'arr'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'bar'}],
                            },
                            init: {type: 'Identifier', name: 'arr2'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('one var with initializer', {
                code: 'for (let [foo=a] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('two vars, with and without initializer', {
                code: 'for (let [foo=a, bar] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                                {type: 'Identifier', name: 'bar'},
                              ],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('two vars, without and with initializer', {
                code: 'for (let [foo, bar=b] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {type: 'Identifier', name: 'foo'},
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'bar'},
                                  right: {type: 'Identifier', name: 'b'},
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('two vars, with and with initializer', {
                code: 'for (let [foo=a, bar=b] = arr;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'bar'},
                                  right: {type: 'Identifier', name: 'b'},
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'arr'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('no assignment without init', {
                code: 'for (let [foo];;);',
                throws: 'destructuring must have init',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with init', {
                code: 'for (let [foo = x];;);',
                throws: 'destructuring must have init',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations first', {
                code: 'for (let [foo], bar;;);',
                throws: 'destructuring must have init',
                desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations second', {
                code: 'for (let foo, [bar];;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (let [...foo] = obj;;);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForStatement',
                        init: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'foo'},
                                  },
                                ],
                              },
                              init: {type: 'Identifier', name: 'obj'},
                            },
                          ],
                        },
                        test: null,
                        update: null,
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
                });

                test('rest preceded by an ident', {
                  code: 'for (let [foo, ...bar] = obj;;);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForStatement',
                        init: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {type: 'Identifier', name: 'foo'},
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'bar'},
                                  },
                                ],
                              },
                              init: {type: 'Identifier', name: 'obj'},
                            },
                          ],
                        },
                        test: null,
                        update: null,
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
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
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });

                test('rest followed by an ident', {
                  code: 'for (let [...foo, bar] = obj;;);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (let [...foo,] = obj;;);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (let [...foo,,] = obj;;);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (let [...[foo, bar]] = obj;;);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForStatement',
                        init: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'RestElement',
                                    argument: {
                                      type: 'ArrayPattern',
                                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                    },
                                  },
                                ],
                              },
                              init: {type: 'Identifier', name: 'obj'},
                            },
                          ],
                        },
                        test: null,
                        update: null,
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
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
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });

                test('trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],] = obj;;);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],,] = obj;;);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (let [x, ...[foo, bar]] = obj;;);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForStatement',
                        init: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {type: 'Identifier', name: 'x'},
                                  {
                                    type: 'RestElement',
                                    argument: {
                                      type: 'ArrayPattern',
                                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                    },
                                  },
                                ],
                              },
                              init: {type: 'Identifier', name: 'obj'},
                            },
                          ],
                        },
                        test: null,
                        update: null,
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
                    $IDENT,
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
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });

                test('rest with default', {
                  code: 'for (let [...bar = foo] = obj;;);',
                  throws: true,
                  desc: 'rest cannot get a default in var decls but they can as func args',
                });

                test('double rest / spread rest', {
                  code: 'for (let [... ...foo] = obj;;);',
                  throws: true,
                });

                test('rest without value', {
                  code: 'for (let [...] = obj;;);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (let [...,] = obj;;);',
                  throws: true,
                });

                test('single dot vs rest', {
                  code: 'for (let [.x] = obj;;);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (let [..x] = obj;;);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (let [a=[...b], ...c] = obj;;);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForStatement',
                        init: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'a'},
                                    right: {
                                      type: 'ArrayExpression',
                                      elements: [
                                        {
                                          type: 'SpreadElement',
                                          argument: {type: 'Identifier', name: 'b'},
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'c'},
                                  },
                                ],
                              },
                              init: {type: 'Identifier', name: 'obj'},
                            },
                          ],
                        },
                        test: null,
                        update: null,
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
                    $IDENT,
                    $PUNCTUATOR,
                    $IDENT,
                    $PUNCTUATOR,
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
                    $PUNCTUATOR,
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });
              });
            });

            describe('object', _ => {
              test('empty obj', {
                code: 'for (let {} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ObjectPattern', properties: []},
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty obj with trailing comma', {
                code: 'for (let {,} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('empty obj with elided commas', {
                code: 'for (let {,,} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('single var base case', {
                code: 'for (let {x} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with trailing comma', {
                code: 'for (let {x,} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with double trailing comma', {
                code: 'for (let {x,,} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with leading comma', {
                code: 'for (let {,x} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with double leading comma', {
                code: 'for (let {,,x} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x, y} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double var with double comma', {
                code: 'for (let {x,, y} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x} = a, {y} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: {type: 'Identifier', name: 'a'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct with init', {
                code: 'for (let {x} = a, y = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: {type: 'Identifier', name: 'a'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'y'},
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct without init', {
                code: 'for (let {x} = a, obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: {type: 'Identifier', name: 'a'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'obj'},
                            init: null,
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct with ini and destruct', {
                code: 'for (let x = a, {y} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'x'},
                            init: {type: 'Identifier', name: 'a'},
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct without ini and destruct', {
                code: 'for (let x, {y} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'Identifier', name: 'x'},
                            init: null,
                          },
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with init', {
                code: 'for (let {x = y} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct with and without init', {
                code: 'for (let {x = y, z} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct without and with init', {
                code: 'for (let {x, y = z} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct both with init', {
                code: 'for (let {x = y, z = a} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'z'},
                                    right: {type: 'Identifier', name: 'a'},
                                  },
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename', {
                code: 'for (let {x : y} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct with and without rename', {
                code: 'for (let {x : y, z} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct without and with rename', {
                code: 'for (let {x, y : z} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct both with rename', {
                code: 'for (let {x : y, z : a} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'a'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename and init', {
                code: 'for (let {x : y = z} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct with rename and init', {
                code: 'for (let {x : y, z, a : b = c} = obj;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'a'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'b'},
                                    right: {type: 'Identifier', name: 'c'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct no assignment', {
                code: 'for (let {x};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (let {x}, {y} = z;;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (let x, {y};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (let {x}, y;;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (let x = y, {z};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (let {x:y};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (let {x=y};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (let {x:y=z};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (let {x:y=z} = obj, {a:b=c};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (let {x:y=z}, {a:b=c} = obj;;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (let {a:=c} = z;;);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (let {[x]: y} = z;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'z'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('dynamic property destructuring missing alias', {
                code: 'for (let {[x]} = z;;);',
                throws: 'computed property name',
              });

              test('dynamic property destructuring missing alias and init', {
                code: 'for (let {[x]};;);',
                throws: 'computed property name',
              });

              test('dynamic property destructuring missing assignment', {
                code: 'for (let {[x]: y};;);',
                throws: 'destructuring must have init',
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (let {[x] = y} = z;;);',
                throws: 'computed property name',
              });

              test('dynamic property destructuring with default and alias missing init', {
                code: 'for (let {[x]: y = z};;);',
                throws: 'destructuring must have init',
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (let {[x]: y = z} = a;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'a'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('dynamic prop as second prop', {
                code: 'for (let {a, [x]: y} = a;;);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForStatement',
                      init: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'a'},
                          },
                        ],
                      },
                      test: null,
                      update: null,
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });
            });
          });

          describe('invalid colorless for-statement', _ => {
            // these are all the let tests sans `in`, `of`, and double semi in the for-header

            describe('array', _ => {
              test('empty "array" should work', {
                code: 'for (let [] = x);',
                throws: true,
              });

              test('empty array with one comma', {
                code: 'for (let [,] = x);',
                throws: true,
              });

              test('empty array with double comma', {
                code: 'for (let [,,] = x);',
                throws: true,
              });

              test('with one var, no init, semi', {
                code: 'for (let [foo] = arr);',
                throws: true,
              });

              test('trailing comma is insignificant', {
                code: 'for (let [foo,] = arr);',
                throws: true,
              });

              test('double trailing comma is significant', {
                code: 'for (let [foo,,] = arr);',
                throws: true,
              });

              test('leading comma', {
                code: 'for (let [,foo] = arr);',
                throws: true,
              });

              test('double leading comma', {
                code: 'for (let [,,foo] = arr);',
                throws: true,
              });

              test('two vars', {
                code: 'for (let [foo,bar] = arr);',
                throws: true,
              });

              test('two vars with eliding comma', {
                code: 'for (let [foo,,bar] = arr);',
                throws: true,
              });

              test('double destruct', {
                code: 'for (let [foo] = arr, [bar] = arr2);',
                throws: true,
              });

              test('destruct and non-destruct without init', {
                code: 'for (let [foo] = arr, bar);',
                throws: true,
              });

              test('destruct and non-destruct with init', {
                code: 'for (let [foo] = arr, bar = arr2);',
                throws: true,
              });

              test('non-destruct without init and destruct', {
                code: 'for (let foo, [bar] = arr2);',
                throws: true,
              });

              test('non-destruct with init and destruct', {
                code: 'for (let foo = arr, [bar] = arr2);',
                throws: true,
              });

              test('one var with initializer', {
                code: 'for (let [foo=a] = arr);',
                throws: true,
              });

              test('two vars, with and without initializer', {
                code: 'for (let [foo=a, bar] = arr);',
                throws: true,
              });

              test('two vars, without and with initializer', {
                code: 'for (let [foo, bar=b] = arr);',
                throws: true,
              });

              test('two vars, with and with initializer', {
                code: 'for (let [foo=a, bar=b] = arr);',
                throws: true,
              });

              test('no assignment without init', {
                code: 'for (let [foo]);',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                throws: true,
              });

              test('no assignment with init', {
                code: 'for (let [foo = x]);',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                throws: true,
              });

              test('no assignment with two declarations first', {
                code: 'for (let [foo], bar);',
                desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
                throws: true,
              });

              test('no assignment with two declarations second', {
                code: 'for (let foo, [bar]);',
                throws: true,
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (let [...foo] = obj);',
                  throws: true,
                });

                test('rest preceded by an ident', {
                  code: 'for (let [foo, ...bar] = obj);',
                  throws: true,
                });

                test('rest followed by an ident', {
                  code: 'for (let [...foo, bar] = obj);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (let [...foo,] = obj);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (let [...foo,,] = obj);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (let [...[foo, bar]] = obj);',
                  throws: true,
                });

                test('trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],] = obj);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],,] = obj);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (let [x, ...[foo, bar]] = obj);',
                  throws: true,
                });

                test('rest with default', {
                  code: 'for (let [...bar = foo] = obj);',
                  throws: true,
                  desc: 'rest cannot get a default in var decls but they can as func args',
                });

                test('double rest / spread rest', {
                  code: 'for (let [... ...foo] = obj);',
                  throws: true,
                });

                test('rest without value', {
                  code: 'for (let [...] = obj);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (let [...,] = obj);',
                  throws: true,
                });

                test('single dot vs rest', {
                  code: 'for (let [.x] = obj);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (let [..x] = obj);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (let [a=[...b], ...c] = obj);',
                  throws: true,
                });
              });
            });

            describe('object', _ => {
              test('empty obj', {
                code: 'for (let {} = obj);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty obj with trailing comma', {
                code: 'for (let {,} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('empty obj with elided commas', {
                code: 'for (let {,,} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('single var base case', {
                code: 'for (let {x} = obj);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with trailing comma', {
                code: 'for (let {x,} = obj);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with double trailing comma', {
                code: 'for (let {x,,} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with leading comma', {
                code: 'for (let {,x} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with double leading comma', {
                code: 'for (let {,,x} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x, y} = obj);',
                throws: '(;)',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double var with double comma', {
                code: 'for (let {x,, y} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x} = a, {y} = obj);',
                throws: '(;)',
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct with init', {
                code: 'for (let {x} = a, y = obj);',
                throws: '(;)',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct without init', {
                code: 'for (let {x} = a, obj);',
                throws: '(;)',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct with ini and destruct', {
                code: 'for (let x = a, {y} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct without ini and destruct', {
                code: 'for (let x, {y} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with init', {
                code: 'for (let {x = y} = obj);',
                throws: '(;)',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct with and without init', {
                code: 'for (let {x = y, z} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct without and with init', {
                code: 'for (let {x, y = z} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct both with init', {
                code: 'for (let {x = y, z = a} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename', {
                code: 'for (let {x : y} = obj);',
                throws: '(;)',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct with and without rename', {
                code: 'for (let {x : y, z} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct without and with rename', {
                code: 'for (let {x, y : z} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct both with rename', {
                code: 'for (let {x : y, z : a} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename and init', {
                code: 'for (let {x : y = z} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct with rename and init', {
                code: 'for (let {x : y, z, a : b = c} = obj);',
                throws: '(;)',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct no assignment', {
                code: 'for (let {x});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (let {x}, {y} = z);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (let x, {y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (let {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (let x = y, {z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (let {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (let {x:y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (let {x=y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (let {x:y=z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (let {x:y=z} = obj, {a:b=c});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (let {x:y=z}, {a:b=c} = obj);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (let {a:=c} = z);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (let {[x]: y} = z);',
                throws: '(;)',
                desc: 'TODO: the message is actually wrong here (since the init is present). not a big deal right now as long as something throws.',
              });

              test('dynamic property destructuring missing alias', {
                code: 'for (let {[x]} = z);',
                throws: 'computed property name',
              });

              test('dynamic property destructuring missing alias and init', {
                code: 'for (let {[x]});',
                throws: 'computed property name',
              });

              test('dynamic property destructuring missing assignment', {
                code: 'for (let {[x]: y});',
                throws: 'destructuring must have init',
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (let {[x] = y} = z);',
                throws: 'computed property name',
              });

              test('dynamic property destructuring with default and alias missing init', {
                code: 'for (let {[x]: y = z});',
                throws: 'destructuring must have init',
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (let {[x]: y = z} = a);',
                throws: '(;)',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('dynamic prop as second prop', {
                code: 'for (let {a, [x]: y} = a);',
                throws: '(;)',
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });
            });
          });

          describe('for-in', _ => {
            describe('array', _ => {
              test('empty "array" should work', {
                code: 'for (let [] in x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: []},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with one comma', {
                code: 'for (let [,] in x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: [null]},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with double comma', {
                code: 'for (let [,,] in x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: [null, null]},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('with one var, no init, semi', {
                code: 'for (let [foo] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('trailing comma is insignificant', {
                code: 'for (let [foo,] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double trailing comma is significant', {
                code: 'for (let [foo,,] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, null],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('leading comma', {
                code: 'for (let [,foo] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [null, {type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double leading comma', {
                code: 'for (let [,,foo] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [null, null, {type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars', {
                code: 'for (let [foo,bar] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars with eliding comma', {
                code: 'for (let [foo,,bar] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, null, {type: 'Identifier', name: 'bar'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct', {
                code: 'for (let [foo] = arr, [bar] in arr);',
                throws: 'can only have one binding',
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct without init', {
                code: 'for (let [foo], bar in arr);',
                throws: 'destructuring must have init',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct with init', {
                code: 'for (let [foo] = arr, bar in arr);',
                throws: 'can only have one binding',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct without init and destruct', {
                code: 'for (let foo, [bar] in arr);',
                throws: 'can only have one binding',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct with init and destruct', {
                code: 'for (let foo = arr, [bar] in arr);',
                throws: ' can only have one binding',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('one var with initializer', {
                code: 'for (let [foo=a] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars, with and without initializer', {
                code: 'for (let [foo=a, bar] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                                {type: 'Identifier', name: 'bar'},
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars, without and with initializer', {
                code: 'for (let [foo, bar=b] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {type: 'Identifier', name: 'foo'},
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'bar'},
                                  right: {type: 'Identifier', name: 'b'},
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars, with and with initializer', {
                code: 'for (let [foo=a, bar=b] in arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'bar'},
                                  right: {type: 'Identifier', name: 'b'},
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('no assignment without init', {
                code: 'for (let [foo]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with init', {
                code: 'for (let [foo = x]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations first', {
                code: 'for (let [foo], bar);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations second', {
                code: 'for (let foo, [bar]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (let [...foo] in obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForInStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'foo'},
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                });

                test('rest preceded by an ident', {
                  code: 'for (let [foo, ...bar] in obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForInStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {type: 'Identifier', name: 'foo'},
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'bar'},
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                });

                test('rest followed by an ident', {
                  code: 'for (let [...foo, bar] in obj);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (let [...foo,] in obj);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (let [...foo,,] in obj);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (let [...[foo, bar]] in obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForInStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'RestElement',
                                    argument: {
                                      type: 'ArrayPattern',
                                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                    },
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
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
                    $IDENT,
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });

                test('trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],] in obj);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],,] in obj);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (let [x, ...[foo, bar]] in obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForInStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {type: 'Identifier', name: 'x'},
                                  {
                                    type: 'RestElement',
                                    argument: {
                                      type: 'ArrayPattern',
                                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                    },
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
                    $IDENT,
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
                    $IDENT,
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });

                test('rest with default', {
                  code: 'for (let [...bar = foo] in obj);',
                  desc: 'rest cannot get a default in var decls but they can as func args',
                  throws: true,
                });

                test('double rest / spread rest', {
                  code: 'for (let [... ...foo] in obj);',
                  throws: true,
                });

                test('rest without value', {
                  code: 'for (let [...] in obj);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (let [...,] in obj);',
                  throws: true,
                });

                test('single dot vs rest', {
                  code: 'for (let [.x] in obj);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (let [..x] in obj);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (let [a=[...b], ...c] in obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForInStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'a'},
                                    right: {
                                      type: 'ArrayExpression',
                                      elements: [
                                        {
                                          type: 'SpreadElement',
                                          argument: {type: 'Identifier', name: 'b'},
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'c'},
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
                    $IDENT,
                    $PUNCTUATOR,
                    $IDENT,
                    $PUNCTUATOR,
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
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });
              });
            });

            describe('object', _ => {
              test('empty obj', {
                code: 'for (let {} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ObjectPattern', properties: []},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty obj with trailing comma', {
                code: 'for (let {,} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('empty obj with elided commas', {
                code: 'for (let {,,} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('single var base case', {
                code: 'for (let {x} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with trailing comma', {
                code: 'for (let {x,} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with double trailing comma', {
                code: 'for (let {x,,} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with leading comma', {
                code: 'for (let {,x} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with double leading comma', {
                code: 'for (let {,,x} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x, y} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double var with double comma', {
                code: 'for (let {x,, y} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x} = a, {y} in obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct with init', {
                code: 'for (let {x} = a, y in obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct without init', {
                code: 'for (let {x} = a, obj in obj2);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct with ini and destruct', {
                code: 'for (let x = a, {y} in obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct without ini and destruct', {
                code: 'for (let x, {y} in obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with init', {
                code: 'for (let {x = y} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct with and without init', {
                code: 'for (let {x = y, z} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct without and with init', {
                code: 'for (let {x, y = z} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct both with init', {
                code: 'for (let {x = y, z = a} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'z'},
                                    right: {type: 'Identifier', name: 'a'},
                                  },
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename', {
                code: 'for (let {x : y} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct with and without rename', {
                code: 'for (let {x : y, z} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct without and with rename', {
                code: 'for (let {x, y : z} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct both with rename', {
                code: 'for (let {x : y, z : a} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'a'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename and init', {
                code: 'for (let {x : y = z} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct with rename and init', {
                code: 'for (let {x : y, z, a : b = c} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'a'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'b'},
                                    right: {type: 'Identifier', name: 'c'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct no assignment', {
                code: 'for (let {x});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (let {x}, {y} in z);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (let x, {y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (let {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (let x = y, {z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (let {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (let {x:y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (let {x=y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (let {x:y=z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (let {x:y=z} = obj, {a:b=c});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (let {x:y=z}, {a:b=c} in obj);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (let {a:=c} in z);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (let {[x]: y} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('dynamic property destructuring missing alias', {
                code: 'for (let {[x]} in obj);',
                throws: 'computed property name',
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (let {[x] = y} in obj);',
                throws: 'computed property name',
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (let {[x]: y = z} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('dynamic prop as second prop', {
                code: 'for (let {a, [x]: y} in obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForInStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });
            });
          });

          describe('for-of', _ => {
            describe('array', _ => {
              test('empty "array" should work', {
                code: 'for (let [] of x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: []},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with one comma', {
                code: 'for (let [,] of x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: [null]},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with double comma', {
                code: 'for (let [,,] of x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ArrayPattern', elements: [null, null]},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('with one var, no init, semi', {
                code: 'for (let [foo] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('trailing comma is insignificant', {
                code: 'for (let [foo,] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double trailing comma is significant', {
                code: 'for (let [foo,,] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, null],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('leading comma', {
                code: 'for (let [,foo] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [null, {type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double leading comma', {
                code: 'for (let [,,foo] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [null, null, {type: 'Identifier', name: 'foo'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars', {
                code: 'for (let [foo,bar] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars with eliding comma', {
                code: 'for (let [foo,,bar] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'foo'}, null, {type: 'Identifier', name: 'bar'}],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct', {
                code: 'for (let [foo] = arr, [bar] of arr);',
                throws: 'can only have one binding',
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct without init', {
                code: 'for (let [foo], bar of arr);',
                throws: 'destructuring must have init',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct with init', {
                code: 'for (let [foo] = arr, bar of arr);',
                throws: 'can only have one binding',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct without init and destruct', {
                code: 'for (let foo, [bar] of arr);',
                throws: 'can only have one binding',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct with init and destruct', {
                code: 'for (let foo = arr, [bar] of arr);',
                throws: 'can only have one binding',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('one var with initializer', {
                code: 'for (let [foo=a] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars, with and without initializer', {
                code: 'for (let [foo=a, bar] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                                {type: 'Identifier', name: 'bar'},
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars, without and with initializer', {
                code: 'for (let [foo, bar=b] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {type: 'Identifier', name: 'foo'},
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'bar'},
                                  right: {type: 'Identifier', name: 'b'},
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('two vars, with and with initializer', {
                code: 'for (let [foo=a, bar=b] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'foo'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'bar'},
                                  right: {type: 'Identifier', name: 'b'},
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('no assignment without init', {
                code: 'for (let [foo]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with init', {
                code: 'for (let [foo = x]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations first', {
                code: 'for (let [foo], bar);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations second', {
                code: 'for (let foo, [bar]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (let [...foo] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'foo'},
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                });

                test('rest preceded by an ident', {
                  code: 'for (let [foo, ...bar] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {type: 'Identifier', name: 'foo'},
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'bar'},
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                });

                test('rest followed by an ident', {
                  code: 'for (let [...foo, bar] of obj);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (let [...foo,] of obj);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (let [...foo,,] of obj);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (let [...[foo, bar]] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'RestElement',
                                    argument: {
                                      type: 'ArrayPattern',
                                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                    },
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
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
                    $IDENT,
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });

                test('trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],] of obj);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (let [...[foo, bar],,] of obj);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (let [x, ...[foo, bar]] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {type: 'Identifier', name: 'x'},
                                  {
                                    type: 'RestElement',
                                    argument: {
                                      type: 'ArrayPattern',
                                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                    },
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
                    $IDENT,
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
                    $IDENT,
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });

                test('rest with default', {
                  code: 'for (let [...bar = foo] of obj);',
                  desc: 'rest cannot get a default of var decls but they can as func args',
                  throws: true,
                });

                test('double rest / spread rest', {
                  code: 'for (let [... ...foo] of obj);',
                  throws: true,
                });

                test('rest without value', {
                  code: 'for (let [...] of obj);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (let [...,] of obj);',
                  throws: true,
                });

                test('single dot v rest', {
                  code: 'for (let [.x] of obj);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (let [..x] of obj);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (let [a=[...b], ...c] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              id: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'a'},
                                    right: {
                                      type: 'ArrayExpression',
                                      elements: [
                                        {
                                          type: 'SpreadElement',
                                          argument: {type: 'Identifier', name: 'b'},
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    type: 'RestElement',
                                    argument: {type: 'Identifier', name: 'c'},
                                  },
                                ],
                              },
                              init: null,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                        body: {type: 'EmptyStatement'},
                      },
                    ],
                  },
                  tokens: [
                    $IDENT,
                    $PUNCTUATOR,
                    $IDENT,
                    $PUNCTUATOR,
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
                    $IDENT,
                    $PUNCTUATOR,
                    $PUNCTUATOR,
                  ],
                });
              });
            });

            describe('object', _ => {
              test('empty obj', {
                code: 'for (let {} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {type: 'ObjectPattern', properties: []},
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty obj with trailing comma', {
                code: 'for (let {,} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('empty obj with elided commas', {
                code: 'for (let {,,} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('single var base case', {
                code: 'for (let {x} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with trailing comma', {
                code: 'for (let {x,} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with double trailing comma', {
                code: 'for (let {x,,} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with leading comma', {
                code: 'for (let {,x} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with double leading comma', {
                code: 'for (let {,,x} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x, y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double var with double comma', {
                code: 'for (let {x,, y} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (let {x} = a, {y} of obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct with init', {
                code: 'for (let {x} = a, y of obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('destruct and non-destruct without init', {
                code: 'for (let {x} = a, obj of obj2);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct with ini and destruct', {
                code: 'for (let x = a, {y} of obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('non-destruct without ini and destruct', {
                code: 'for (let x, {y} of obj);',
                throws: 'can only have one binding',
                desc: 'confusing message for only supporting one var with this for-statement type',
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with init', {
                code: 'for (let {x = y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct with and without init', {
                code: 'for (let {x = y, z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct without and with init', {
                code: 'for (let {x, y = z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'y'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct both with init', {
                code: 'for (let {x = y, z = a} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'z'},
                                    right: {type: 'Identifier', name: 'a'},
                                  },
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename', {
                code: 'for (let {x : y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct with and without rename', {
                code: 'for (let {x : y, z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct without and with rename', {
                code: 'for (let {x, y : z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct both with rename', {
                code: 'for (let {x : y, z : a} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'a'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct with rename and init', {
                code: 'for (let {x : y = z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double destruct with rename and init', {
                code: 'for (let {x : y, z, a : b = c} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
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
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'z'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {type: 'Identifier', name: 'z'},
                                  shorthand: true,
                                },
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'a'},
                                  kind: 'init',
                                  method: false,
                                  computed: false,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'b'},
                                    right: {type: 'Identifier', name: 'c'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('single destruct no assignment', {
                code: 'for (let {x});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (let {x}, {y} of z);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (let x, {y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (let {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (let x = y, {z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (let {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (let {x:y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (let {x=y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (let {x:y=z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (let {x:y=z} = obj, {a:b=c});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (let {x:y=z}, {a:b=c} of obj);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (let {a:=c} of z);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (let {[x]: y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('dynamic property destructuring missing alias', {
                code: 'for (let {[x]} of obj);',
                throws: 'computed property name',
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (let {[x] = y} of obj);',
                throws: 'computed property name',
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (let {[x]: y = z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {type: 'Identifier', name: 'y'},
                                    right: {type: 'Identifier', name: 'z'},
                                  },
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('dynamic prop as second prop', {
                code: 'for (let {a, [x]: y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
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
                                  key: {type: 'Identifier', name: 'x'},
                                  kind: 'init',
                                  method: false,
                                  computed: true,
                                  value: {type: 'Identifier', name: 'y'},
                                  shorthand: false,
                                },
                              ],
                            },
                            init: null,
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'obj'},
                      body: {type: 'EmptyStatement'},
                    },
                  ],
                },
                tokens: [
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
                  $IDENT,
                  $PUNCTUATOR,
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });
            });
          });
        });
      });

      describe('in export decl', _ => {
        // not an extensive test suite here since it's always strict mode and uses the same parsing mechanisms

        describe('regular vars', _ => {
          test('let, one var, no init, semi', {
            code: 'export let foo;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: null,
                      },
                    ],
                  },
                  source: null,
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let, two vars, no init, semi', {
            code: 'export let foo, bar;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: null,
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'bar'},
                        init: null,
                      },
                    ],
                  },
                  source: null,
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let, var with init, semi', {
            code: 'export let foo = bar;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: {type: 'Identifier', name: 'bar'},
                      },
                    ],
                  },
                  source: null,
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let, two vars with both init, semi', {
            code: 'export let foo = bar, zoo = boo;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: {type: 'Identifier', name: 'bar'},
                      },
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'zoo'},
                        init: {type: 'Identifier', name: 'boo'},
                      },
                    ],
                  },
                  source: null,
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let on next line does not trigger asi', {
            code: 'export\nlet foo',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: null,
                      },
                    ],
                  },
                  source: null,
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $ASI],
          });

          test('var on next line does not trigger asi', {
            code: 'export let\nfoo',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'foo'},
                        init: null,
                      },
                    ],
                  },
                  source: null,
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $IDENT, $ASI],
          });

          test('asi can not trigger if next token is ident', {
            code: 'export let\nfoo()',
            SCRIPT: {throws: 'module goal'},
            throws: 'ASI',
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });

        describe('destructuring', _ => {
          describe('array', _ => {
            test('empty "array" should work even if that does not export anything', {
              code: 'export let [] = x;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'ArrayPattern', elements: []},
                          init: {type: 'Identifier', name: 'x'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('with one var, no init, semi', {
              code: 'export let [foo] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [{type: 'Identifier', name: 'foo'}],
                          },
                          init: {type: 'Identifier', name: 'arr'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double trailing comma is significant', {
              code: 'export let [foo,,] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [{type: 'Identifier', name: 'foo'}, null],
                          },
                          init: {type: 'Identifier', name: 'arr'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('two vars', {
              code: 'export let [foo,bar] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                          },
                          init: {type: 'Identifier', name: 'arr'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct', {
              code: 'export let [foo] = arr, [bar] = arr2;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [{type: 'Identifier', name: 'foo'}],
                          },
                          init: {type: 'Identifier', name: 'arr'},
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [{type: 'Identifier', name: 'bar'}],
                          },
                          init: {type: 'Identifier', name: 'arr2'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('two vars, with and without initializer', {
              code: 'export let [foo=a, bar] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ArrayPattern',
                            elements: [
                              {
                                type: 'AssignmentPattern',
                                left: {type: 'Identifier', name: 'foo'},
                                right: {type: 'Identifier', name: 'a'},
                              },
                              {type: 'Identifier', name: 'bar'},
                            ],
                          },
                          init: {type: 'Identifier', name: 'arr'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment without init', {
              code: 'export let [foo];',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              desc: 'module goal is always strict',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'export let [foo = x];',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              desc: 'module goal is always strict',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'export let [foo], bar;',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              desc: 'module goal is always strict',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'export let foo, [bar];',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            describe('rest operator', _ => {
              test('rest as the only destruct', {
                code: 'export let [...foo] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'RestElement',
                                  argument: {type: 'Identifier', name: 'foo'},
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      source: null,
                    },
                  ],
                },
                SCRIPT: {throws: 'module goal'},
                tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest preceded by an ident', {
                code: 'export let [foo, ...bar] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {type: 'Identifier', name: 'foo'},
                                {
                                  type: 'RestElement',
                                  argument: {type: 'Identifier', name: 'bar'},
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      source: null,
                    },
                  ],
                },
                SCRIPT: {throws: 'module goal'},
                tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('rest followed by an ident', {
                code: 'export let [...foo, bar] = obj;',
                throws: true,
              });

              test('rest followed by a trailing comma', {
                code: 'export let [...foo,] = obj;',
                desc: 'while feasible the syntax spec currently does not have a rule for allowing trailing commas after rest',
                throws: true,
              });

              test('rest followed by two commas', {
                code: 'export let [...foo,,] = obj;',
                throws: true,
              });

              test('rest on a nested destruct', {
                code: 'export let [...[foo, bar]] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'RestElement',
                                  argument: {
                                    type: 'ArrayPattern',
                                    elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                  },
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      source: null,
                    },
                  ],
                },
                SCRIPT: {throws: 'module goal'},
                tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('trailing comma after rest on a nested destruct', {
                code: 'export let [...[foo, bar],] = obj;',
                throws: true,
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'export let [...[foo, bar],,] = obj;',
                throws: true,
              });

              test('second param rest on a nested destruct', {
                code: 'export let [x, ...[foo, bar]] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {type: 'Identifier', name: 'x'},
                                {
                                  type: 'RestElement',
                                  argument: {
                                    type: 'ArrayPattern',
                                    elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                                  },
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      source: null,
                    },
                  ],
                },
                SCRIPT: {throws: 'module goal'},
                tokens: [
                  $IDENT,
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
                  $IDENT,
                  $PUNCTUATOR,
                ],
              });

              test('rest with default', {
                code: 'export let [...bar = foo] = obj;',
                desc: 'rest cannot get a default in var decls but they can as func args',
                throws: true,
              });

              test('double rest / spread rest', {
                code: 'export let [... ...foo] = obj;',
                throws: 'Can not rest twice',
                SCRIPT: {throws: 'module goal'},
              });

              test('rest without value', {
                code: 'export let [...] = obj;',
                throws: true,
              });

              test('rest with comma without value', {
                code: 'export let [...,] = obj;',
                throws: true,
              });

              test('single dot vs rest', {
                code: 'export let [.x] = obj;',
                throws: true,
              });

              test('double dot vs rest', {
                code: 'export let [..x] = obj;',
                throws: true,
              });

              test('spread and rest', {
                code: 'export let [a=[...b], ...c] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'a'},
                                  right: {
                                    type: 'ArrayExpression',
                                    elements: [
                                      {
                                        type: 'SpreadElement',
                                        argument: {type: 'Identifier', name: 'b'},
                                      },
                                    ],
                                  },
                                },
                                {
                                  type: 'RestElement',
                                  argument: {type: 'Identifier', name: 'c'},
                                },
                              ],
                            },
                            init: {type: 'Identifier', name: 'obj'},
                          },
                        ],
                      },
                      source: null,
                    },
                  ],
                },
                SCRIPT: {throws: 'the module goal'},
                tokens: [
                  $IDENT,
                  $IDENT,
                  $PUNCTUATOR,
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
                  $PUNCTUATOR,
                  $IDENT,
                  $PUNCTUATOR,
                ],
              });
            });
          });

          describe('object', _ => {
            test('empty obj', {
              code: 'export let {} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'ObjectPattern', properties: []},
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('empty obj with trailing comma', {
              code: 'export let {,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'export let {,,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'export let {x} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with trailing comma', {
              code: 'export let {x,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double trailing comma', {
              code: 'export let {x,,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'export let {,x} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'export let {,,x} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'export let {x, y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                                type: 'Property',
                                key: {type: 'Identifier', name: 'y'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'y'},
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var with double comma', {
              code: 'export let {x,, y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'export let {x} = a, {y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                          init: {type: 'Identifier', name: 'a'},
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'y'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'y'},
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct and non-destruct with init', {
              code: 'export let {x} = a, y = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                          init: {type: 'Identifier', name: 'a'},
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'y'},
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct and non-destruct without init', {
              code: 'export let {x} = a, obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                          init: {type: 'Identifier', name: 'a'},
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'obj'},
                          init: null,
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('non-destruct with ini and destruct', {
              code: 'export let x = a, {y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'x'},
                          init: {type: 'Identifier', name: 'a'},
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'y'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'y'},
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('non-destruct without ini and destruct', {
              code: 'export let x, {y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'x'},
                          init: null,
                        },
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'y'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'y'},
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with init', {
              code: 'export let {x = y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
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
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              desc: 'note: value gets the assignment pattern! not the objectpattern:properties',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with and without init', {
              code: 'export let {x = y, z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
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
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'z'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'z'},
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct without and with init', {
              code: 'export let {x, y = z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                                type: 'Property',
                                key: {type: 'Identifier', name: 'y'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'y'},
                                  right: {type: 'Identifier', name: 'z'},
                                },
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct both with init', {
              code: 'export let {x = y, z = a} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
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
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'z'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'z'},
                                  right: {type: 'Identifier', name: 'a'},
                                },
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename', {
              code: 'export let {x : y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with and without rename', {
              code: 'export let {x : y, z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'z'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'z'},
                                shorthand: true,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct without and with rename', {
              code: 'export let {x, y : z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct both with rename', {
              code: 'export let {x : y, z : a} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'z'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'a'},
                                shorthand: false,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and init', {
              code: 'export let {x : y = z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
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
                                  left: {type: 'Identifier', name: 'y'},
                                  right: {type: 'Identifier', name: 'z'},
                                },
                                shorthand: false,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and init', {
              code: 'export let {x : y, z, a : b = c} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
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
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'z'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {type: 'Identifier', name: 'z'},
                                shorthand: true,
                              },
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'a'},
                                kind: 'init',
                                method: false,
                                computed: false,
                                value: {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'b'},
                                  right: {type: 'Identifier', name: 'c'},
                                },
                                shorthand: false,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'obj'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              tokens: [
                $IDENT,
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
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
              ],
            });

            test('single destruct no assignment', {
              code: 'export let {x};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'export let {x}, {y} = z;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'export let x, {y};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'export let {x}, y;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'export let x = y, {z};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'export let {x:y};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'export let {x=y};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'export let {x:y=z};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'export let {x:y=z} = obj, {a:b=c};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'export let {x:y=z}, {a:b=c} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'export let {a:=c} = z;',
              throws: true,
            });

            test('correct dynamic property destructuring', {
              code: 'export let {[x]: y} = z;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'x'},
                                kind: 'init',
                                method: false,
                                computed: true,
                                value: {type: 'Identifier', name: 'y'},
                                shorthand: false,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'z'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('dynamic property destructuring missing alias', {
              code: 'export let {[x]} = z;',
              throws: 'computed property name',
              SCRIPT: {throws: 'can only be used with the module goal'},
            });

            test('dynamic property destructuring missing alias and init', {
              code: 'export let {[x]};',
              throws: 'computed property name',
              SCRIPT: {throws: 'can only be used with the module goal'},
            });

            test('dynamic property destructuring missing assignment', {
              code: 'export let {[x]: y};',
              throws: 'destructuring must have init',
              SCRIPT: {throws: 'can only be used with the module goal'},
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'export let {[x] = y} = z;',
              throws: 'computed property name',
              SCRIPT: {throws: 'can only be used with the module goal'},
            });

            test('dynamic property destructuring with default and alias missing init', {
              code: 'export let {[x]: y = z};',
              throws: 'destructuring must have init',
              SCRIPT: {throws: 'can only be used with the module goal'},
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'export let {[x]: y = z} = a;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {type: 'Identifier', name: 'x'},
                                kind: 'init',
                                method: false,
                                computed: true,
                                value: {
                                  type: 'AssignmentPattern',
                                  left: {type: 'Identifier', name: 'y'},
                                  right: {type: 'Identifier', name: 'z'},
                                },
                                shorthand: false,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'a'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('dynamic prop as second prop', {
              code: 'export let {a, [x]: y} = a;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
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
                                key: {type: 'Identifier', name: 'x'},
                                kind: 'init',
                                method: false,
                                computed: true,
                                value: {type: 'Identifier', name: 'y'},
                                shorthand: false,
                              },
                            ],
                          },
                          init: {type: 'Identifier', name: 'a'},
                        },
                      ],
                    },
                    source: null,
                  },
                ],
              },
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });
          });
        });
      });

      describe('rest', _ => {
        test('rest arr', {
          code: 'let [...x] = y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'let',
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
                    init: {type: 'Identifier', name: 'y'},
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('var and rest arr', {
          code: 'let a, [...x] = y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'a'},
                    init: null,
                  },
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
                    init: {type: 'Identifier', name: 'y'},
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('rest obj', {
          code: 'let {...x} = y',
          throws: true, // TODO
        });

        test('ummmm no', {
          code: 'let ...x = y',
          throws: true,
        });
      });
    });

    describe('let as identifier in sloppy mode', _ => {
      /*
    See section E: https://tc39.github.io/ecma262/#sec-additions-and-changes-that-introduce-incompatibilities-with-prior-editions

    13.2: In ECMAScript 2015, a StatementList beginning with the token let followed by the input elements LineTerminator then Identifier is the start of a LexicalDeclaration. In previous editions, automatic semicolon insertion would always insert a semicolon before the Identifier input element.

    13.5: In ECMAScript 2015, a StatementListItem beginning with the token let followed by the token [ is the start of a LexicalDeclaration. In previous editions such a sequence would be the start of an ExpressionStatement.

    13.7: In ECMAScript 2015, if the ( token of a for statement is immediately followed by the token sequence let [ then the let is treated as the start of a LexicalDeclaration. In previous editions such a token sequence would be the start of an Expression.

    13.7: In ECMAScript 2015, if the ( token of a for-in statement is immediately followed by the token sequence let [ then the let is treated as the start of a ForDeclaration. In previous editions such a token sequence would be the start of an LeftHandSideExpression.
    */

      // (note: the spec doesn't explicitly allow `let` as a var name but rather forbids
      // it under certain situations. For example: in strict mode and as let/const names)

      describe('let as var name', _ => {
        describe('in global', _ => {
          test('var decl', {
            code: 'var let;',
            throws: 'Cannot use this name',
            SLOPPY_SCRIPT: {
              desc: 'let as a var name is only allowed in (non-module) sloppy mode to support pre-es6-code',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: 'let'},
                        init: null,
                      },
                    ],
                  },
                ],
              },
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('var arr destruct', {
            code: 'var [let] = x;',
            throws: 'Cannot use this name',
            SLOPPY_SCRIPT: {
              desc: 'let as var in destruct can be ok',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'let'}],
                        },
                        init: {type: 'Identifier', name: 'x'},
                      },
                    ],
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('var obj destruct', {
            code: 'var {let} = x;',
            throws: 'Cannot use this name',
            SLOPPY_SCRIPT: {
              desc: 'let as var in destruct can be ok',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'let'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'let'},
                              shorthand: true,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'x'},
                      },
                    ],
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('var obj alias destruct', {
            code: 'var {foo: let} = x;',
            throws: true,
            SLOPPY_SCRIPT: {
              desc: 'let as var in destruct can be ok',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'foo'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'let'},
                              shorthand: false,
                            },
                          ],
                        },
                        init: {type: 'Identifier', name: 'x'},
                      },
                    ],
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let as let name is illegal', {
            code: 'let let;',
            throws: 'Cannot use this name',
            STRICT: {throws: 'Cannot use this name'},
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let as const name is illegal', {
            code: 'const let = x;',
            throws: 'when binding through',
            STRICT: {throws: 'Cannot use this name'},
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let let does not get asi', {
            code: 'let\nlet;',
            throws: 'Cannot use this name',
            desc: 'and `let` is always an illegal name for const/let bindings',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let foo does not get asi', {
            code: 'let\nfoo;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'Identifier', name: 'foo'},
                      init: null,
                    },
                  ],
                },
              ],
            },
            desc: 'in es5 this would get ASI',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let at eof', {
            code: 'let',
            throws: true,
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Identifier', name: 'let'},
                  },
                ],
              },
              tokens: [$IDENT, $ASI],
            },
          });

          test('prop access as expr stmt', {
            code: 'let.foo;',
            throws: 'Let statement missing binding names',
            SLOPPY_SCRIPT: {
              desc: 'in sloppy mode this is okay as it is not ambiguous with a let binding',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'let'},
                      property: {type: 'Identifier', name: 'foo'},
                      computed: false,
                    },
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            },
          });

          test('call as expr stmt', {
            code: 'let();',
            throws: 'Let statement missing binding names',
            SLOPPY_SCRIPT: {
              desc: 'in sloppy mode this is okay as it is not ambiguous with a let binding',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'let'},
                      arguments: [],
                    },
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            },
          });

          test('let as name in array destructuring is always illegal', {
            code: 'let [let] = x;',
            throws: 'when binding through',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let as array destruct name with default', {
            code: 'let [let = y] = x;',
            throws: 'when binding through',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let as array destruct name as second name', {
            code: 'let [a, let] = x;',
            throws: 'when binding through',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let as name in object destructuring is always illegal', {
            code: 'let {let} = x;',
            throws: 'when binding through',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let as object destruct name with default', {
            code: 'let {let = y} = x;',
            throws: 'when binding through',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let as object destruct name as second name', {
            code: 'let {a, let} = x;',
            throws: 'when binding through',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('let as _prop_ name in object destructuring is okay', {
            code: 'let {let: foo} = x;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'let'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'foo'},
                            shorthand: false,
                          },
                        ],
                      },
                      init: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let as _prop_ name in object destruct name with default', {
            code: 'let {let: foo = y} = x;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'let'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {
                              type: 'AssignmentPattern',
                              left: {type: 'Identifier', name: 'foo'},
                              right: {type: 'Identifier', name: 'y'},
                            },
                            shorthand: false,
                          },
                        ],
                      },
                      init: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let as _prop_ name in object destruct name as second name', {
            code: 'let {a, let: foo} = x;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
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
                            key: {type: 'Identifier', name: 'let'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'foo'},
                            shorthand: false,
                          },
                        ],
                      },
                      init: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              ],
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('let as _alias_ in object destructuring is bad', {
            code: 'let {foo: let} = x;',
            throws: true,
          });

          test('let as _alias_ in object destruct name with default is bad', {
            code: 'let {foo: let = y} = x;',
            throws: true,
          });

          test('let as _alias_ in object destruct name as second name is bad', {
            code: 'let {a, foo: let} = x;',
            throws: true,
          });

          test('just let', {
            code: 'let',
            throws: true,
            desc: 'a statement that starts with let should be a binding in strict mode',
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Identifier', name: 'let'},
                  },
                ],
              },
              tokens: [$IDENT, $ASI],
            },
          });

          test('let with semi', {
            code: 'let;',
            throws: true,
            desc: 'a statement that starts with let should be a binding',
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Identifier', name: 'let'},
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR],
          });
        });

        describe('in for-loop-header', _ => {
          test('var decl', {
            code: 'for (var let;;);',
            throws: 'Cannot use this name',
            SLOPPY_SCRIPT: {
              desc: 'let as a var name is only allowed in (non-module) sloppy mode to support pre-es6-code',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'VariableDeclaration',
                      kind: 'var',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {type: 'Identifier', name: 'let'},
                          init: null,
                        },
                      ],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('let as let name is illegal', {
            code: 'for (let let;;);',
            throws: 'Cannot use this name',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('for header never has asi', {
            code: 'for (let\nlet;;);',
            throws: 'when binding through',
            desc: 'and `let` is always an illegal name for const/let bindings',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('let as name in destructuring is always illegal', {
            code: 'for (let [let] = x;;);',
            throws: 'when binding through',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('let as name in destructuring with init', {
            code: 'for (let [let = y] = x;;);',
            throws: 'when binding through',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('let as name in destructuring as second name', {
            code: 'for (let [a, let] = x;;);',
            throws: 'when binding through',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('cannot const let', {
            code: 'for (const let;;);',
            throws: 'when binding through',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('just let as left part', {
            code: 'for (let;;);',
            throws: true,
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {type: 'Identifier', name: 'let'},
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('just let with comma', {
            code: 'for (let,foo;;);',
            throws: true,
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'SequenceExpression',
                      expressions: [{type: 'Identifier', name: 'let'}, {type: 'Identifier', name: 'foo'}],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            },
          });

          test('let in part 2', {
            code: 'for (;let;);',
            throws: true,
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: null,
                    test: {type: 'Identifier', name: 'let'},
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('let in part 3', {
            code: 'for (;let;);',
            throws: true,
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: null,
                    test: {type: 'Identifier', name: 'let'},
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('prop access as expr stmt', {
            code: 'for (let.foo;;);',
            throws: 'Let binding missing binding names',
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'let'},
                      property: {type: 'Identifier', name: 'foo'},
                      computed: false,
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('call as expr stmt', {
            code: 'for (let();;);',
            throws: 'Let binding missing binding names',
            SLOPPY_SCRIPT: {
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForStatement',
                    init: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'let'},
                      arguments: [],
                    },
                    test: null,
                    update: null,
                    body: {type: 'EmptyStatement'},
                  },
                ],
              },
            },
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
        });

        describe('in export decl (always strict mode)', _ => {
          test('var decl', {
            code: 'export var let;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('let as let name is illegal', {
            code: 'export let let;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('let let does not get asi', {
            code: 'export let\nlet;',
            throws: true,
            desc: 'and `let` is always an illegal name for const/let bindings',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('let as name in destructuring is always illegal', {
            code: 'export let [let] = x;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('let as name in destructuring with default', {
            code: 'export let [let = a] = x;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('let as name in destructuring as second name', {
            code: 'export let [a, let] = x;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('cannot const let', {
            code: 'export const let;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('just let', {
            code: 'export let;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('prop access as expr stmt', {
            code: 'export let.foo;',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('call as expr stmt', {
            code: 'export let();',
            throws: true,
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
        });
      });

      describe('dynamic prop on let var', _ => {
        describe('illegal ambiguous cases', _ => {
          // A statement can not start with dynamic property access on `let` (`let[foo]=bar`)
          // because it would be ambiguous with let destructuring. See note in
          // https://tc39.github.io/ecma262/#prod-ExpressionStatement

          test('in global', {
            code: 'let[foo];',
            throws: 'destructuring must have init',
            tokens: [],
          });

          test('proper case with confusing newline', {
            code: 'let\n[x] = x;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'x'}]},
                      init: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              ],
            },
            desc: 'asi is only applied when the next token would lead to parse error; in this case the [ does not so it cannot parse this as prop-access',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('proper case with less confusing newline', {
            code: 'let [x]\n= x;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'x'}]},
                      init: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              ],
            },
            desc: 'I think this is less confusing and not a super important test',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('bad confusing newline', {
            code: 'let\n[foo];',
            throws: 'destructuring must have init',
            desc:
              'the newline is confusing here but since the whole thing could be a valid destructuring the token is not an error itself and by the time the parser realizes it is the ASI is not applied retroactively',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('in for-loop-header', {
            code: 'for (let[foo];;);',
            throws: 'destructuring must have init',
            tokens: [],
          });

          test('in regular function', {
            code: 'function f(){ let[foo]; }',
            throws: 'destructuring must have init',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('in arrow expr body', {
            code: '_ => let[foo];',
            throws: 'strict mode',
            SLOPPY_SCRIPT: {
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
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'let'},
                        property: {type: 'Identifier', name: 'foo'},
                        computed: true,
                      },
                    },
                  },
                ],
              },
            },
            desc: '(arrows are not strict by default) the non-block arrow body is an expression',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('in arrow stmt body', {
            code: '_ => { let[foo]; }',
            throws: 'destructuring must have init',
            desc: '(arrows are not strict by default) the non-block arrow body is a statement block',
            tokens: [],
          });

          test('in classes', {
            code: 'class x { foo() { let[foo]; }}',
            throws: 'destructuring must have init',
            tokens: [],
            desc: 'classes are implicitly always strict',
          });
        });
      });

      describe('let asi block', _ => {
        describe('illegal ambiguous cases', _ => {
          // While the spec doesn't mention it explicitly, I'm pretty sure the let-asi-block
          // is illegal since it's equally ambigous as let-dynamic-prop.
          // https://tc39.github.io/ecma262/#prod-ExpressionStatement

          test('in global', {
            code: 'let\n{foo};',
            throws: 'destructuring must have init',
            tokens: [],
          });

          test('proper case with confusing newline', {
            code: 'let\n{x} = x;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ObjectPattern',
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
                      init: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              ],
            },
            desc: 'asi is only applied when the next token would lead to parse error; in this case the [ does not so it cannot parse this as prop-access',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('proper case with less confusing newline', {
            code: 'let {x}\n= x;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'ObjectPattern',
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
                      init: {type: 'Identifier', name: 'x'},
                    },
                  ],
                },
              ],
            },
            desc: 'I think this is less confusing and not a super important test',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('in regular function', {
            code: 'function f(){ let\n{foo}; }',
            throws: 'destructuring must have init',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('in arrow expr body', {
            code: '_ => let\n{foo};',
            throws: 'strict mode',
            SLOPPY_SCRIPT: {
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
                      body: {type: 'Identifier', name: 'let'},
                    },
                  },
                  {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {type: 'Identifier', name: 'foo'},
                      },
                    ],
                  },
                  {
                    type: 'EmptyStatement',
                  },
                ],
              },
            },
            desc:
              'mirror case for array destruct, this version is should be fine because the body is an expression so the let would never be parsed as a decl, the curlies always a block',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('in arrow expr body', {
            code: '_ => let {foo};',
            throws: 'strict mode',
            SLOPPY_SCRIPT: {
              throws: 'ASI',
            },
            desc: 'mirror case for array destruct, this version is interesting because it cannot parse a let decl here',
            tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('in arrow stmt body', {
            code: '_ => { let\n{foo}; }',
            throws: 'destructuring must have init',
            desc: '(arrows are not strict by default) the non-block arrow body is a statement block',
            tokens: [],
          });

          test('in classes', {
            code: 'class x { foo() { let\n{foo}; }}',
            throws: 'destructuring must have init',
            tokens: [],
            desc: 'classes are implicitly always strict',
          });
        });
      });

      describe('as a label', _ => {
        test('in global', {
          code: 'let: foo;',
          throws: 'Let statement missing binding names', // TODO: could error about label specifically...
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'LabeledStatement',
                  label: {type: 'Identifier', name: 'let'},
                  body: {
                    type: 'ExpressionStatement',
                    expression: {type: 'Identifier', name: 'foo'},
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('in function', {
          code: 'function f(){ let: foo; }',
          throws: 'Let statement missing binding names', // TODO: could error about label specifically
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'LabeledStatement',
                        label: {type: 'Identifier', name: 'let'},
                        body: {
                          type: 'ExpressionStatement',
                          expression: {type: 'Identifier', name: 'foo'},
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('as continue arg', {
          code: 'while (true) let: continue let;',
          throws: 'Let statement missing binding names', // TODO: label specific message
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'WhileStatement',
                  test: {type: 'Literal', value: true, raw: 'true'},
                  body: {
                    type: 'LabeledStatement',
                    label: {type: 'Identifier', name: 'let'},
                    body: {
                      type: 'ContinueStatement',
                      label: {type: 'Identifier', name: 'let'},
                    },
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
        });

        test('as sub-statement statement', {
          code: 'if (x) let: y;',
          throws: 'Let statement missing binding names', // TODO: label specific message
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'IfStatement',
                  test: {type: 'Identifier', name: 'x'},
                  consequent: {
                    type: 'LabeledStatement',
                    label: {type: 'Identifier', name: 'let'},
                    body: {
                      type: 'ExpressionStatement',
                      expression: {type: 'Identifier', name: 'y'},
                    },
                  },
                  alternate: null,
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('as nested label', {
          code: 'foo: let: y;',
          throws: 'Let statement missing binding names', // TODO: label specific message
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'LabeledStatement',
                  label: {type: 'Identifier', name: 'foo'},
                  body: {
                    type: 'LabeledStatement',
                    label: {type: 'Identifier', name: 'let'},
                    body: {
                      type: 'ExpressionStatement',
                      expression: {type: 'Identifier', name: 'y'},
                    },
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('as continue arg', {
          code: 'while (true) let: continue let;',
          throws: 'Let statement missing binding names', // TODO: label specific message
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'WhileStatement',
                  test: {type: 'Literal', value: true, raw: 'true'},
                  body: {
                    type: 'LabeledStatement',
                    label: {type: 'Identifier', name: 'let'},
                    body: {
                      type: 'ContinueStatement',
                      label: {type: 'Identifier', name: 'let'},
                    },
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
        });

        test('in arrow', {
          code: '_ => { let: foo; }',
          throws: 'Let statement missing binding names', // TODO: label specific message
          SLOPPY_SCRIPT: {
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
                    expression: false,
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'LabeledStatement',
                          label: {type: 'Identifier', name: 'let'},
                          body: {
                            type: 'ExpressionStatement',
                            expression: {type: 'Identifier', name: 'foo'},
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('as label and var name', {
          code: 'let: let;',
          throws: 'Let statement missing binding names', // TODO: label specific message
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'LabeledStatement',
                  label: {type: 'Identifier', name: 'let'},
                  body: {
                    type: 'ExpressionStatement',
                    expression: {type: 'Identifier', name: 'let'},
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });
      });
    });
  });

// duplicate keys = error

// TODO: can't bind the same var twice in the same scope
// TODO: can't bind reserved names (etc), both as idents and destructs
// TODO: mix obj and arr destructurings

// TODO: rest: destruct {a, ...b}
