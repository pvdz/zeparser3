let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('var statement', _ => {
    describe('binding generic', _ => {
      // for destructuring, these are the array pattern tests to check for all places where we'd want to check it:
      // var [] = x;
      // var [,] = x;
      // var [,,] = x;
      // var [foo] = x;
      // var [foo,] = x;
      // var [foo,,] = x;
      // var [,foo] = x;
      // var [,,foo] = x;
      // var [foo,bar] = x;
      // var [foo,,bar] = x;
      // var [foo] = x, [foo] = y;
      // var [foo] = x, b;
      // var [foo] = x, b = y;
      // var x, [foo] = y;
      // var x = y, [foo] = z;
      // var [foo=a] = c;
      // var [foo=a,bar] = x;
      // var [foo,bar=b] = x;
      // var [foo=a,bar=b] = x;
      // var [foo];                 // error
      // var [foo=a];               // error
      // var [foo], bar;            // error
      // var foo, [bar];            // error
      // var [...bar] = obj;
      // var [foo, ...bar] = obj;
      // var [...foo, bar] = obj;   // error
      // var [...foo,] = obj;       // ok!
      // var [...foo,,] = obj;      // error
      // var [...[a, b]] = obj;
      // var [...[a, b],] = obj;    // ok!
      // var [...[a, b],,] = obj;   // error
      // var [x, ...[a, b]] = obj;
      // var [...bar = foo] = obj;  // error (TODO: except in funcs, arrows, and maybe `for`?)
      // var [... ...foo] = obj;    // error
      // var [...] = obj;           // error
      // var [...,] = obj;          // error
      // var [.x] = obj;            // error
      // var [..x] = obj;           // error
      // var [a=[...b], ...c] = obj;

      // and these are the object versions:
      // var {} = x;
      // var {,} = x;             // error
      // var {,,} = x;            // error
      // var {foo} = x;
      // var {foo,} = x;          // ok
      // var {foo,,} = x;         // error
      // var {,foo} = x;          // error
      // var {,,foo} = x;         // error
      // var {foo,bar} = x;
      // var {foo,,bar} = x;      // error
      // var {foo} = x, {foo} = y;
      // var {foo} = x, b;
      // var {foo} = x, b = y;
      // var x, {foo} = y;
      // var x = y, {foo} = z;
      // var {foo=a} = x;
      // var {foo=a,bar} = x;
      // var {foo,bar=b} = x;
      // var {foo=a,bar=b} = x;
      // var {foo:a} = x;
      // var {foo:a,bar} = x;
      // var {foo,bar:b} = x;
      // var {foo:a,bar:b} = x;
      // var {foo:a,bar:b} = x;
      // var {foo:a=b} = x;
      // var {foo:a=b, bar:c=d} = x;
      // var {foo};
      // var {foo=a};
      // var {foo:a};
      // var {foo:a=b};
      // var {foo}, bar;
      // var foo, {bar};

      // All variations of tests are executed for statement start, inside for-headers (4x), and in export declaration
      // When new syntax is introduced that allows let/const binding syntax those variations should apply to them as well

      describe('reserved words', _ => {
        [
          'break',
          'case',
          'catch',
          'class',
          'const',
          'continue',
          'debugger',
          'default',
          'delete',
          'do',
          'else',
          'export',
          'extends',
          'finally',
          'for',
          'function',
          'if',
          'import',
          'in',
          'instanceof',
          'new',
          'return',
          'super',
          'switch',
          'this',
          'throw',
          'try',
          'typeof',
          'var',
          'void',
          'while',
          'with',
          // null / boolean
          'null',
          'true',
          'false',
          // future reserved keyword,
          'enum',
        ].forEach(name => {
          describe(`always keyword=${name}`, _ => {
            test(`var statement`, {
              code: `var ${name} = x;`,
              throws: 'reserved word',
            });

            test(`for header`, {
              code: `for (var ${name} = x;;);`,
              throws: 'reserved word',
            });

            test(`function arg`, {
              code: `function f(${name}) {}`,
              throws: true,
            });

            test(`function object destructured arg`, {
              code: `function f({${name}}) {}`,
              throws: true,
            });

            test(`function object alias destructured arg`, {
              code: `function fh({x: ${name}}) {}`,
              // certain tokens fail because they are part of a multi-token expression
              throws: true,
            });

            test(`function array destructured arg`, {
              code: `function f([${name}]) {}`,
              throws: true,
            });

            test(`catch clause`, {
              code: `try {} catch (${name}) {}`,
              throws: 'reserved word',
            });

            test(`export`, {
              code: `export var ${name} = 10;`,
              SCRIPT: {
                desc: 'export is only allowed in module code',
                throws: true,
              },
              throws: 'reserved word',
            });

            test(`can be property`, {
              code: `obj.${name}`,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'obj'},
                      property: {type: 'Identifier', name: name},
                      computed: false,
                    },
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
            });
          });
        });

        // in strict mode only
        [
          'implements',
          'package',
          'protected',
          'interface',
          'private',
          'public',
          // 'let', // skip: has custom error messages (covered in other tests)
          'static',
          // 'await', // skip: has custom error messages (covered in other tests)
          'yield',
        ].forEach(name => {
          describe(`strict mode keyword=${name}`, _ => {
            test(`var statement`, {
              code: `var ${name} = x;`,
              throws: 'reserved word',
              SLOPPY_SCRIPT: {ast: true, tokens: true},
            });

            test(`for header`, {
              code: `for (var ${name} = x;;);`,
              throws: 'reserved word',
              SLOPPY_SCRIPT: {ast: true, tokens: true},
            });

            test(`function arg`, {
              code: `function f(${name}) {}`,
              throws: 'reserved word',
              SLOPPY_SCRIPT: {ast: true, tokens: true},
            });

            test(`function object destructured arg`, {
              code: `function f({${name}}) {}`,
              throws: true,
              SLOPPY_SCRIPT: {ast: true, tokens: true},
            });

            test(`function object alias destructured arg`, {
              code: `function fg({x: ${name}}) {}`,
              throws: true,
              SLOPPY_SCRIPT: {ast: true, tokens: true},
            });

            test(`function array destructured arg`, {
              code: `function f([${name}]) {}`,
              throws: 'not destructible',
              SLOPPY_SCRIPT: {ast: true, tokens: true},
            });

            test(`catch clause`, {
              code: `try {} catch (${name}) {}`,
              throws: 'reserved word',
              SLOPPY_SCRIPT: {ast: true, tokens: true},
            });

            test(`export`, {
              code: `export var ${name} = 10;`,
              SLOPPY: {
                desc: 'export is only allowed in module code',
                throws: 'export',
              },
              throws: 'reserved word',
            });

            test(`can be property`, {
              code: `obj.${name}`,
              ast: true,
              tokens: true,
            });
          });
        });
      });

      describe('as a statement', _ => {
        describe('regular vars', _ => {
          test('var, one var, no init, semi', {
            code: 'var foo;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR],
          });

          test('var, one var, no init, eof', {
            code: 'var foo',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $ASI],
          });

          test('var, two vars, no init, semi', {
            code: 'var foo, bar;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('var, two vars, no init, eof', {
            code: 'var foo, bar',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('var, var with init, semi', {
            code: 'var foo = bar;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('var, var with init, eof', {
            code: 'var foo = bar',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
          });

          test('var, var with init, asi', {
            code: 'var foo = bar\nvar zoo;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}}],
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null}],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
          });

          test('var, two vars with both init, semi', {
            code: 'var foo = bar, zoo = boo;',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
                    {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
                  ],
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
          });

          test('var, two vars with both init, asi', {
            code: 'var foo = bar, zoo = boo',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
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
            code: 'var\nfoo',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
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
            code: 'var\nfoo()',
            throws: 'ASI',
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });

        describe('destructuring', _ => {
          describe('array', _ => {
            test('empty "array" should work', {
              code: 'var [] = x;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var [,] = x;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var [,,] = x;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var [foo] = arr;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]}, init: {type: 'Identifier', name: 'arr'}},
                    ],
                  },
                ],
              },
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('trailing comma is insignificant', {
              code: 'var [foo,] = arr;',
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
              code: 'var [foo,,] = arr;',
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
              code: 'var [,foo] = arr;',
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
              code: 'var [,,foo] = arr;',
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
              code: 'var [foo,bar] = arr;',
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
              code: 'var [foo,,bar] = arr;',
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
              code: 'var [foo] = arr, [bar] = arr2;',
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
              code: 'var [foo] = arr, bar;',
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
              code: 'var [foo] = arr, bar = arr2;',
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
              code: 'var foo, [bar] = arr2;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var foo = arr, [bar] = arr2;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var [foo=a] = arr;',
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
              code: 'var [foo=a, bar] = arr;',
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
              code: 'var [foo, bar=b] = arr;',
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
              code: 'var [foo=a, bar=b] = arr;',
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
              code: 'var [foo];',
              throws: 'destructuring must have init',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'var [foo = x];',
              throws: 'destructuring must have init',
              desc: 'this could be legal in sloppy except not at the start of a statement',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'var [foo], bar;',
              throws: 'destructuring must have init',
              desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'var foo, [bar];',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('cannot rename a var like obj destruct can', {
              code: 'var [foo:bar] = obj;',
              throws: true,
            });

            describe('rest operator', _ => {
              test('rest as the only destruct', {
                code: 'var [...foo] = obj;',
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
                code: 'var [foo, ...bar] = obj;',
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
                code: 'var [...foo, bar] = obj;',
                throws: true,
              });

              test('rest followed by a trailing comma', {
                code: 'var [...foo,] = obj;',
                desc: 'while feasible the syntax spec currently does not have a rule for allowing trailing commas after rest',
                throws: true,
              });

              test('rest followed by two commas', {
                code: 'var [...foo,,] = obj;',
                throws: true,
              });

              test('rest on a nested destruct', {
                code: 'var [...[foo, bar]] = obj;',
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
                code: 'var [...[foo, bar],] = obj;',
                throws: true,
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'var [...[foo, bar],,] = obj;',
                throws: true,
              });

              test('second param rest on a nested destruct', {
                code: 'var [x, ...[foo, bar]] = obj;',
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
                code: 'var [...bar = foo] = obj;',
                desc: 'rest cannot get a default in var decls but they can as func args',
                throws: true,
              });

              test('double rest / spread rest', {
                code: 'var [... ...foo] = obj;',
                throws: 'Can not rest twice',
                tokens: [],
              });

              test('rest without value', {
                code: 'var [...] = obj;',
                throws: true,
              });

              test('rest with comma without value', {
                code: 'var [...,] = obj;',
                throws: true,
              });

              test('single dot vs rest', {
                code: 'var [.x] = obj;',
                throws: true,
              });

              test('double dot vs rest', {
                code: 'var [..x] = obj;',
                throws: true,
              });

              test('spread vs rest', {
                code: 'var [a=[...b], ...c] = obj;',
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
              code: 'var {} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var {,} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'var {,,} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'var {x} = obj;',
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
              code: 'var {x,} = obj;',
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
              code: 'var {x,,} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'var {,x} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'var {,,x} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'var {x, y} = obj;',
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
              code: 'var {x,, y} = obj;',
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'var {x} = a, {y} = obj;',
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
              code: 'var {x} = a, y = obj;',
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
              code: 'var {x} = a, obj;',
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
              code: 'var x = a, {y} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var x, {y} = obj;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
              code: 'var {x = y} = obj;',
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
              code: 'var {x = y, z} = obj;',
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
              code: 'var {x, y = z} = obj;',
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
              code: 'var {x = y, z = a} = obj;',
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
              code: 'var {x : y} = obj;',
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
              code: 'var {x : y, z} = obj;',
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
              code: 'var {x, y : z} = obj;',
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
              code: 'var {x : y, z : a} = obj;',
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
              code: 'var {x : y = z} = obj;',
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
              code: 'var {x : y, z, a : b = c} = obj;',
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
              code: 'var {x};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'var {x}, {y} = z;',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'var x, {y};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'var {x}, y;',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'var x = y, {z};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'var {x:y};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'var {x=y};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'var {x:y=z};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'var {x:y=z} = obj, {a:b=c};',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'var {x:y=z}, {a:b=c} = obj;',
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'var {a:=c} = z;',
              throws: true,
            });

            test('correct dynamic property destructuring', {
              code: 'var {[x]: y} = z;',
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
              code: 'var {[x]} = z;',
              throws: 'computed property name',
              tokens: [],
            });

            test('dynamic property destructuring missing alias and init', {
              code: 'var {[x]};',
              throws: 'computed property name',
              tokens: [],
            });

            test('dynamic property destructuring missing assignment', {
              code: 'var {[x]: y};',
              throws: 'destructuring must have init',
              tokens: [],
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'var {[x] = y} = z;',
              throws: 'computed property name',
              tokens: [],
            });

            test('dynamic property destructuring with default and alias missing init', {
              code: 'var {[x]: y = z};',
              throws: 'destructuring must have init',
              tokens: [],
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'var {[x]: y = z} = a;',
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
              code: 'var {a, [x]: y} = a;',
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
            test('var, one var, no init, semi', {
              code: 'for (var foo;;);',
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

            test('var, two vars, no init, semi', {
              code: 'for (var foo, bar;;);',
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

            test('var, var with init, semi', {
              code: 'for (var foo = bar;;);',
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

            test('var, two vars with both init, semi', {
              code: 'for (var foo = bar, zoo = boo;;);',
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
              code: 'for (var\nfoo;;);',
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
              code: 'for (var\nfoo();;);',
              throws: '(;)', // expecting for-header semi
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });

          describe('invalid colorless for statement', _ => {
            test('var, one var, no init, semi', {
              code: 'for (var foo);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var, two vars, no init, semi', {
              code: 'for (var foo, bar);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var, var with init, semi', {
              code: 'for (var foo = bar);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var, two vars with both init, semi', {
              code: 'for (var foo = bar, zoo = boo);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var on next line does not trigger asi', {
              code: 'for (var\nfoo);',
              throws: '(;)',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('asi can not trigger if next token is ident', {
              code: 'for (var\nfoo());',
              throws: '(;)', // expecting for-header semi
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });

          describe('for-in', _ => {
            test('var, one var, no init, semi', {
              code: 'for (var foo in x);',
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

            test('var, two vars, no init, semi', {
              code: 'for (var foo, bar in x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var, var with init, semi', {
              code: 'for (var foo = bar in x);',
              throws: 'binding can not have an init',
              desc: 'for some reason, it is not the "cannot have an init" one, probably because `in` is an op while `of` is not',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var, two vars with both init, semi', {
              code: 'for (var foo = bar, zoo = boo in x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var on next line does not trigger asi', {
              code: 'for (var\nfoo in x);',
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
              code: 'for (var\nfoo() in x);',
              throws: '(;)', // expecting for-header semi
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
            });
          });

          describe('for-of', _ => {
            test('var, one var, no init, semi', {
              code: 'for (var foo of x);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForOfStatement',
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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

            test('var, two vars, no init, semi', {
              code: 'for (var foo, bar of x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var, var with init, semi', {
              code: 'for (var foo = bar of x);',
              throws: 'binding can not have an init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var, two vars with both init, semi', {
              code: 'for (var foo = bar, zoo = boo of x);',
              throws: 'can only have one binding',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('var on next line does not trigger asi', {
              code: 'for (var\nfoo of x);',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ForOfStatement',
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'for (var\nfoo() of x);',
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
                code: 'for (var [] = x;;);',
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
                code: 'for (var [,] = x;;);',
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
                code: 'for (var [,,] = x;;);',
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
                code: 'for (var [foo] = arr;;);',
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
                code: 'for (var [foo,] = arr;;);',
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
                code: 'for (var [foo,,] = arr;;);',
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
                code: 'for (var [,foo] = arr;;);',
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
                code: 'for (var [,,foo] = arr;;);',
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
                code: 'for (var [foo,bar] = arr;;);',
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
                code: 'for (var [foo,,bar] = arr;;);',
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
                code: 'for (var [foo] = arr, [bar] = arr2;;);',
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
                code: 'for (var [foo] = arr, bar;;);',
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
                code: 'for (var [foo] = arr, bar = arr2;;);',
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
                code: 'for (var foo, [bar] = arr2;;);',
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
                code: 'for (var foo = arr, [bar] = arr2;;);',
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
                code: 'for (var [foo=a] = arr;;);',
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
                code: 'for (var [foo=a, bar] = arr;;);',
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
                code: 'for (var [foo, bar=b] = arr;;);',
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
                code: 'for (var [foo=a, bar=b] = arr;;);',
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
                code: 'for (var [foo];;);',
                throws: 'destructuring must have init',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with init', {
                code: 'for (var [foo = x];;);',
                throws: 'destructuring must have init',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations first', {
                code: 'for (var [foo], bar;;);',
                throws: 'destructuring must have init',
                desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations second', {
                code: 'for (var foo, [bar];;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (var [...foo] = obj;;);',
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
                  code: 'for (var [foo, ...bar] = obj;;);',
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
                  code: 'for (var [...foo, bar] = obj;;);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (var [...foo,] = obj;;);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (var [...foo,,] = obj;;);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (var [...[foo, bar]] = obj;;);',
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
                  code: 'for (var [...[foo, bar],] = obj;;);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (var [...[foo, bar],,] = obj;;);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (var [x, ...[foo, bar]] = obj;;);',
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
                  code: 'for (var [...bar = foo] = obj;;);',
                  desc: 'rest cannot get a default in var decls but they can as func args',
                  throws: true,
                });

                test('double rest / spread rest', {
                  code: 'for (var [... ...foo] = obj;;);',
                  throws: 'Can not rest twice',
                  tokens: [],
                });

                test('rest without value', {
                  code: 'for (var [...] = obj;;);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (var [...,] = obj;;);',
                  throws: true,
                });

                test('single dot vs rest', {
                  code: 'for (var [.x] = obj;;);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (var [..x] = obj;;);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (var [a=[...b], ...c] = obj;;);',
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
                code: 'for (var {} = obj;;);',
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
                code: 'for (var {,} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('empty obj with elided commas', {
                code: 'for (var {,,} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('single var base case', {
                code: 'for (var {x} = obj;;);',
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
                code: 'for (var {x,} = obj;;);',
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
                code: 'for (var {x,,} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with leading comma', {
                code: 'for (var {,x} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with double leading comma', {
                code: 'for (var {,,x} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x, y} = obj;;);',
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
                code: 'for (var {x,, y} = obj;;);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x} = a, {y} = obj;;);',
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
                code: 'for (var {x} = a, y = obj;;);',
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
                code: 'for (var {x} = a, obj;;);',
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
                code: 'for (var x = a, {y} = obj;;);',
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
                code: 'for (var x, {y} = obj;;);',
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
                code: 'for (var {x = y} = obj;;);',
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
                code: 'for (var {x = y, z} = obj;;);',
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
                code: 'for (var {x, y = z} = obj;;);',
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
                code: 'for (var {x = y, z = a} = obj;;);',
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
                code: 'for (var {x : y} = obj;;);',
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
                code: 'for (var {x : y, z} = obj;;);',
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
                code: 'for (var {x, y : z} = obj;;);',
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
                code: 'for (var {x : y, z : a} = obj;;);',
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
                code: 'for (var {x : y = z} = obj;;);',
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
                code: 'for (var {x : y, z, a : b = c} = obj;;);',
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
                code: 'for (var {x};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (var {x}, {y} = z;;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (var x, {y};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (var {x}, y;;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (var x = y, {z};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (var {x:y};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (var {x=y};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (var {x:y=z};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (var {x:y=z} = obj, {a:b=c};;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (var {x:y=z}, {a:b=c} = obj;;);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (var {a:=c} = z;;);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (var {[x]: y} = z;;);',
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
                code: 'for (var {[x]} = z;;);',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring missing alias and init', {
                code: 'for (var {[x]};;);',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring missing assignment', {
                code: 'for (var {[x]: y};;);',
                throws: 'destructuring must have init',
                tokens: [],
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (var {[x] = y} = z;;);',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring with default and alias missing init', {
                code: 'for (var {[x]: y = z};;);',
                throws: 'destructuring must have init',
                tokens: [],
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (var {[x]: y = z} = a;;);',
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
                code: 'for (var {a, [x]: y} = a;;);',
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
            // these are all the var tests sans `in`, `of`, and double semi in the for-header

            describe('array', _ => {
              test('empty "array" should work', {
                code: 'for (var [] = x);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with one comma', {
                code: 'for (var [,] = x);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty array with double comma', {
                code: 'for (var [,,] = x);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('with one var, no init, semi', {
                code: 'for (var [foo] = arr);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('trailing comma is insignificant', {
                code: 'for (var [foo,] = arr);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double trailing comma is significant', {
                code: 'for (var [foo,,] = arr);',
                throws: '(;)',
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
                code: 'for (var [,foo] = arr);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('double leading comma', {
                code: 'for (var [,,foo] = arr);',
                throws: '(;)',
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
                code: 'for (var [foo,bar] = arr);',
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

              test('two vars with eliding comma', {
                code: 'for (var [foo,,bar] = arr);',
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
                  $PUNCTUATOR,
                  $PUNCTUATOR,
                ],
              });

              test('double destruct', {
                code: 'for (var [foo] = arr, [bar] = arr2);',
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

              test('destruct and non-destruct without init', {
                code: 'for (var [foo] = arr, bar);',
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

              test('destruct and non-destruct with init', {
                code: 'for (var [foo] = arr, bar = arr2);',
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

              test('non-destruct without init and destruct', {
                code: 'for (var foo, [bar] = arr2);',
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

              test('non-destruct with init and destruct', {
                code: 'for (var foo = arr, [bar] = arr2);',
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

              test('one var with initializer', {
                code: 'for (var [foo=a] = arr);',
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

              test('two vars, with and without initializer', {
                code: 'for (var [foo=a, bar] = arr);',
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

              test('two vars, without and with initializer', {
                code: 'for (var [foo, bar=b] = arr);',
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

              test('two vars, with and with initializer', {
                code: 'for (var [foo=a, bar=b] = arr);',
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

              test('no assignment without init', {
                code: 'for (var [foo]);',
                throws: 'destructuring must have init',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with init', {
                code: 'for (var [foo = x]);',
                throws: 'destructuring must have init',
                desc: 'this could be legal in sloppy except not at the start of a statement',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations first', {
                code: 'for (var [foo], bar);',
                throws: 'destructuring must have init',
                desc: 'just like `foo[bar],baz` which is a fine expression in sloppy mode, except that it is still illegal',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations second', {
                code: 'for (var foo, [bar]);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (var [...foo] = obj);',
                  throws: true,
                });

                test('rest preceded by an ident', {
                  code: 'for (var [foo, ...bar] = obj);',
                  throws: true,
                });

                test('rest followed by an ident', {
                  code: 'for (var [...foo, bar] = obj);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (var [...foo,] = obj);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (var [...foo,,] = obj);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (var [...[foo, bar]] = obj);',
                  throws: true,
                });

                test('trailing comma after rest on a nested destruct', {
                  code: 'for (var [...[foo, bar],] = obj);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (var [...[foo, bar],,] = obj);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (var [x, ...[foo, bar]] = obj);',
                  throws: true,
                });

                test('rest with default', {
                  code: 'for (var [...bar = foo] = obj);',
                  desc: 'rest cannot get a default in var decls but they can as func args',
                  throws: true,
                });

                test('double rest / spread rest', {
                  code: 'for (var [... ...foo] = obj);',
                  throws: 'Can not rest twice',
                  tokens: [],
                });

                test('rest without value', {
                  code: 'for (var [...] = obj);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (var [...,] = obj);',
                  throws: true,
                });

                test('single dot vs rest', {
                  code: 'for (var [.x] = obj);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (var [..x] = obj);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (var [a=[...b], ...c] = obj);',
                  throws: true,
                });
              });
            });

            describe('object', _ => {
              test('empty obj', {
                code: 'for (var {} = obj);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('empty obj with trailing comma', {
                code: 'for (var {,} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('empty obj with elided commas', {
                code: 'for (var {,,} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('single var base case', {
                code: 'for (var {x} = obj);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with trailing comma', {
                code: 'for (var {x,} = obj);',
                throws: '(;)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('single var with double trailing comma', {
                code: 'for (var {x,,} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with leading comma', {
                code: 'for (var {,x} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with double leading comma', {
                code: 'for (var {,,x} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x, y} = obj);',
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
                code: 'for (var {x,, y} = obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x} = a, {y} = obj);',
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
                code: 'for (var {x} = a, y = obj);',
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
                code: 'for (var {x} = a, obj);',
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
                code: 'for (var x = a, {y} = obj);',
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
                code: 'for (var x, {y} = obj);',
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
                code: 'for (var {x = y} = obj);',
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
                code: 'for (var {x = y, z} = obj);',
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
                code: 'for (var {x, y = z} = obj);',
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
                code: 'for (var {x = y, z = a} = obj);',
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
                code: 'for (var {x : y} = obj);',
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
                code: 'for (var {x : y, z} = obj);',
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
                code: 'for (var {x, y : z} = obj);',
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
                code: 'for (var {x : y, z : a} = obj);',
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
                code: 'for (var {x : y = z} = obj);',
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
                code: 'for (var {x : y, z, a : b = c} = obj);',
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
                code: 'for (var {x});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (var {x}, {y} = z);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (var x, {y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (var {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (var x = y, {z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (var {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (var {x:y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (var {x=y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (var {x:y=z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (var {x:y=z} = obj, {a:b=c});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (var {x:y=z}, {a:b=c} = obj);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (var {a:=c} = z);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (var {[x]: y} = z);',
                throws: '(;)',
                desc: 'TODO: the message is actually wrong here (since the init is present). not a big deal right now as long as something throws.',
                tokens: [],
              });

              test('dynamic property destructuring missing alias', {
                code: 'for (var {[x]} = z);',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring missing alias and init', {
                code: 'for (var {[x]});',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring missing assignment', {
                code: 'for (var {[x]: y});',
                throws: 'destructuring must have init',
                tokens: [],
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (var {[x] = y} = z);',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring with default and alias missing init', {
                code: 'for (var {[x]: y = z});',
                throws: 'destructuring must have init',
                tokens: [],
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (var {[x]: y = z} = a);',
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
                code: 'for (var {a, [x]: y} = a);',
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
                code: 'for (var [] in x);',
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
                code: 'for (var [,] in x);',
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
                code: 'for (var [,,] in x);',
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
                code: 'for (var [foo] in arr);',
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
                code: 'for (var [foo,] in arr);',
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
                code: 'for (var [foo,,] in arr);',
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
                code: 'for (var [,foo] in arr);',
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
                code: 'for (var [,,foo] in arr);',
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
                code: 'for (var [foo,bar] in arr);',
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
                code: 'for (var [foo,,bar] in arr);',
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
                code: 'for (var [foo] = arr, [bar] in arr);',
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
                code: 'for (var [foo], bar in arr);',
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
                code: 'for (var [foo] = arr, bar in arr);',
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
                code: 'for (var foo, [bar] in arr);',
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
                code: 'for (var foo = arr, [bar] in arr);',
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
                code: 'for (var [foo=a] in arr);',
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
                code: 'for (var [foo=a, bar] in arr);',
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
                code: 'for (var [foo, bar=b] in arr);',
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
                code: 'for (var [foo=a, bar=b] in arr);',
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
                code: 'for (var [foo]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with init', {
                code: 'for (var [foo = x]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations first', {
                code: 'for (var [foo], bar);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations second', {
                code: 'for (var foo, [bar]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-in)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (var [...foo] in obj);',
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
                  code: 'for (var [foo, ...bar] in obj);',
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
                  code: 'for (var [...foo, bar] in obj);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (var [...foo,] in obj);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (var [...foo,,] in obj);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (var [...[foo, bar]] in obj);',
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
                  code: 'for (var [...[foo, bar],] in obj);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (var [...[foo, bar],,] in obj);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (var [x, ...[foo, bar]] in obj);',
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
                  code: 'for (var [...bar = foo] in obj);',
                  desc: 'rest cannot get a default in var decls but they can as func args',
                  throws: true,
                });

                test('double rest / spread rest', {
                  code: 'for (var [... ...foo] in obj);',
                  throws: 'Can not rest twice',
                  tokens: [],
                });

                test('rest without value', {
                  code: 'for (var [...] in obj);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (var [...,] in obj);',
                  throws: true,
                });

                test('single dot vs rest', {
                  code: 'for (var [.x] in obj);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (var [..x] in obj);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (var [a=[...b], ...c] in obj);',
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
                code: 'for (var {} in obj);',
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
                code: 'for (var {,} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('empty obj with elided commas', {
                code: 'for (var {,,} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works for array but not for obj',
                tokens: [],
              });

              test('single var base case', {
                code: 'for (var {x} in obj);',
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
                code: 'for (var {x,} in obj);',
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
                code: 'for (var {x,,} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with leading comma', {
                code: 'for (var {,x} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single var with double leading comma', {
                code: 'for (var {,,x} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x, y} in obj);',
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
                code: 'for (var {x,, y} in obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x} = a, {y} in obj);',
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
                code: 'for (var {x} = a, y in obj);',
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
                code: 'for (var {x} = a, obj in obj2);',
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
                code: 'for (var x = a, {y} in obj);',
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
                code: 'for (var x, {y} in obj);',
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
                code: 'for (var {x = y} in obj);',
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
                code: 'for (var {x = y, z} in obj);',
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
                code: 'for (var {x, y = z} in obj);',
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
                code: 'for (var {x = y, z = a} in obj);',
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
                code: 'for (var {x : y} in obj);',
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
                code: 'for (var {x : y, z} in obj);',
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
                code: 'for (var {x, y : z} in obj);',
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
                code: 'for (var {x : y, z : a} in obj);',
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
                code: 'for (var {x : y = z} in obj);',
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
                code: 'for (var {x : y, z, a : b = c} in obj);',
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
                code: 'for (var {x});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (var {x}, {y} in z);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (var x, {y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (var {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (var x = y, {z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (var {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (var {x:y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (var {x=y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (var {x:y=z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (var {x:y=z} = obj, {a:b=c});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (var {x:y=z}, {a:b=c} in obj);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (var {a:=c} in z);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (var {[x]: y} in obj);',
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
                code: 'for (var {[x]} in obj);',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (var {[x] = y} in obj);',
                throws: 'computed property name',
                tokens: [],
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (var {[x]: y = z} in obj);',
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
                code: 'for (var {a, [x]: y} in obj);',
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
                code: 'for (var [] of x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [,] of x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [,,] of x);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo,] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo,,] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [,foo] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [,,foo] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo,bar] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo,,bar] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo] = arr, [bar] of arr);',
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
                code: 'for (var [foo], bar of arr);',
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
                code: 'for (var [foo] = arr, bar of arr);',
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
                code: 'for (var foo, [bar] of arr);',
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
                code: 'for (var foo = arr, [bar] of arr);',
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
                code: 'for (var [foo=a] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo=a, bar] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo, bar=b] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo=a, bar=b] of arr);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var [foo]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with init', {
                code: 'for (var [foo = x]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations first', {
                code: 'for (var [foo], bar);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              test('no assignment with two declarations second', {
                code: 'for (var foo, [bar]);',
                throws: 'destructuring must have init',
                desc: '(these mirror tests are kind of moot as per for-of)',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
              });

              describe('rest operator', _ => {
                test('rest as the only destruct', {
                  code: 'for (var [...foo] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'var',
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
                  code: 'for (var [foo, ...bar] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'var',
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
                  code: 'for (var [...foo, bar] of obj);',
                  throws: true,
                });

                test('rest followed by a trailing comma', {
                  code: 'for (var [...foo,] of obj);',
                  throws: true,
                });

                test('rest followed by two commas', {
                  code: 'for (var [...foo,,] of obj);',
                  throws: true,
                });

                test('rest on a nested destruct', {
                  code: 'for (var [...[foo, bar]] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'var',
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
                  code: 'for (var [...[foo, bar],] of obj);',
                  throws: true,
                });

                test('double trailing comma after rest on a nested destruct', {
                  code: 'for (var [...[foo, bar],,] of obj);',
                  throws: true,
                });

                test('second param rest on a nested destruct', {
                  code: 'for (var [x, ...[foo, bar]] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'var',
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
                  code: 'for (var [...bar = foo] of obj);',
                  desc: 'rest cannot get a default of var decls but they can as func args',
                  throws: true,
                });

                test('double rest / spread rest', {
                  code: 'for (var [... ...foo] of obj);',
                  throws: 'Can not rest twice',
                });

                test('rest without value', {
                  code: 'for (var [...] of obj);',
                  throws: true,
                });

                test('rest with comma without value', {
                  code: 'for (var [...,] of obj);',
                  throws: true,
                });

                test('single dot vs rest', {
                  code: 'for (var [.x] of obj);',
                  throws: true,
                });

                test('double dot vs rest', {
                  code: 'for (var [..x] of obj);',
                  throws: true,
                });

                test('spread and rest', {
                  code: 'for (var [a=[...b], ...c] of obj);',
                  ast: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ForOfStatement',
                        left: {
                          type: 'VariableDeclaration',
                          kind: 'var',
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
                code: 'for (var {} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'for (var {,} of obj);',
                desc: 'works for array but not for obj',
                throws: true,
              });

              test('empty obj with elided commas', {
                code: 'for (var {,,} of obj);',
                desc: 'works for array but not for obj',
                throws: true,
              });

              test('single var base case', {
                code: 'for (var {x} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x,} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x,,} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'does not work with obj, only array',
              });

              test('single var with leading comma', {
                code: 'for (var {,x} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
              });

              test('single var with double leading comma', {
                code: 'for (var {,,x} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not with obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x, y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x,, y} of obj);',
                throws: 'Objects cant have comma without something preceding it',
                desc: 'works with array but not obj',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double var simple', {
                code: 'for (var {x} = a, {y} of obj);',
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
                code: 'for (var {x} = a, y of obj);',
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
                code: 'for (var {x} = a, obj of obj2);',
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
                code: 'for (var x = a, {y} of obj);',
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
                code: 'for (var x, {y} of obj);',
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
                code: 'for (var {x = y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x = y, z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x, y = z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x = y, z = a} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x : y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x : y, z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x, y : z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x : y, z : a} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x : y = z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x : y, z, a : b = c} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {x});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct no assignment', {
                code: 'for (var {x}, {y} of z);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident and destruct no assignment', {
                code: 'for (var x, {y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (var {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('ident with init and destruct no assignment', {
                code: 'for (var x = y, {z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('destruct no assignment and ident', {
                code: 'for (var {x}, y);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and no assignment', {
                code: 'for (var {x:y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with default and no assignment', {
                code: 'for (var {x=y});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with rename and default and no assignment', {
                code: 'for (var {x:y=z});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and with and without assignment', {
                code: 'for (var {x:y=z} = obj, {a:b=c});',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('double destruct with rename and default and without and with assignment', {
                code: 'for (var {x:y=z}, {a:b=c} of obj);',
                throws: 'destructuring must have init',
                tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
              });

              test('single destruct with colon-eq', {
                code: 'for (var {a:=c} of z);',
                throws: true,
              });

              test('correct dynamic property destructuring', {
                code: 'for (var {[x]: y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {[x]} of obj);',
                throws: 'computed property name',
                tokens: [],
              });

              test('dynamic property destructuring with default missing alias', {
                code: 'for (var {[x] = y} of obj);',
                throws: 'computed property name',
                tokens: [],
              });

              test('correct dynamic property destructuring with default and alias', {
                code: 'for (var {[x]: y = z} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
                code: 'for (var {a, [x]: y} of obj);',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ForOfStatement',
                      left: {
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
          test('var, one var, no init, semi', {
            code: 'export var foo;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'var',
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

          test('var, two vars, no init, semi', {
            code: 'export var foo, bar;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'var',
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

          test('var, var with init, semi', {
            code: 'export var foo = bar;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'var',
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

          test('var, two vars with both init, semi', {
            code: 'export var foo = bar, zoo = boo;',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'var',
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

          test('var on next line does not trigger asi', {
            code: 'export\nvar foo',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
            code: 'export var\nfoo',
            SCRIPT: {throws: 'module goal'},
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExportNamedDeclaration',
                  specifiers: [],
                  declaration: {
                    type: 'VariableDeclaration',
                    kind: 'var',
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
            code: 'export var\nfoo()',
            SCRIPT: {throws: 'module goal'},
            throws: 'ASI',
            tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });

        describe('destructuring', _ => {
          describe('array', _ => {
            test('empty "array" should work even if that does not export anything', {
              code: 'export var [] = x;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var [foo] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var [foo,,] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var [foo,bar] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var [foo] = arr, [bar] = arr2;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var [foo=a, bar] = arr;',
              SCRIPT: {throws: 'module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var [foo];',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              desc: 'module goal is always strict',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with init', {
              code: 'export var [foo = x];',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              desc: 'module goal is always strict',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations first', {
              code: 'export var [foo], bar;',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              desc: 'module goal is always strict',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('no assignment with two declarations second', {
              code: 'export var foo, [bar];',
              SCRIPT: {throws: 'module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            describe('rest operator', _ => {
              test('rest as the only destruct', {
                code: 'export var [...foo] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'export var [foo, ...bar] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'export var [...foo, bar] = obj;',
                throws: true,
              });

              test('rest followed by a trailing comma', {
                code: 'export var [...foo,] = obj;',
                desc: 'while feasible the syntax spec currently does not have a rule for allowing trailing commas after rest',
                throws: true,
              });

              test('rest followed by two commas', {
                code: 'export var [...foo,,] = obj;',
                throws: true,
              });

              test('rest on a nested destruct', {
                code: 'export var [...[foo, bar]] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'export var [...[foo, bar],] = obj;',
                throws: true,
              });

              test('double trailing comma after rest on a nested destruct', {
                code: 'export var [...[foo, bar],,] = obj;',
                throws: true,
              });

              test('second param rest on a nested destruct', {
                code: 'export var [x, ...[foo, bar]] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
                code: 'export var [...bar = foo] = obj;',
                desc: 'rest cannot get a default in var decls but they can as func args',
                throws: true,
              });

              test('double rest / spread rest', {
                code: 'export var [... ...foo] = obj;',
                throws: 'Can not rest twice',
                SCRIPT: {throws: 'module goal'},
              });

              test('rest without value', {
                code: 'export var [...] = obj;',
                throws: true,
              });

              test('rest with comma without value', {
                code: 'export var [...,] = obj;',
                throws: true,
              });

              test('single dot vs rest', {
                code: 'export var [.x] = obj;',
                throws: true,
              });

              test('double dot vs rest', {
                code: 'export var [..x] = obj;',
                throws: true,
              });

              test('spread and rest', {
                code: 'export var [a=[...b], ...c] = obj;',
                ast: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExportNamedDeclaration',
                      specifiers: [],
                      declaration: {
                        type: 'VariableDeclaration',
                        kind: 'var',
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
              code: 'export var {} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var {,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('empty obj with elided commas', {
              code: 'export var {,,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works for array but not for obj',
              tokens: [],
            });

            test('single var base case', {
              code: 'export var {x} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x,,} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'does not work with obj, only array',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with leading comma', {
              code: 'export var {,x} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single var with double leading comma', {
              code: 'export var {,,x} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not with obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'export var {x, y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x,, y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'Objects cant have comma without something preceding it',
              desc: 'works with array but not obj',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double var simple', {
              code: 'export var {x} = a, {y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x} = a, y = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x} = a, obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var x = a, {y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var x, {y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
                      type: 'VariableDeclaration',
                      kind: 'var',
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
              code: 'export var {x = y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x = y, z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x, y = z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x = y, z = a} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x : y} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x : y, z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x, y : z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x : y, z : a} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x : y = z} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x : y, z, a : b = c} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {x};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct no assignment', {
              code: 'export var {x}, {y} = z;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident and destruct no assignment', {
              code: 'export var x, {y};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('destruct no assignment and ident', {
              code: 'export var {x}, y;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('ident with init and destruct no assignment', {
              code: 'export var x = y, {z};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and no assignment', {
              code: 'export var {x:y};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with default and no assignment', {
              code: 'export var {x=y};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with rename and default and no assignment', {
              code: 'export var {x:y=z};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and with and without assignment', {
              code: 'export var {x:y=z} = obj, {a:b=c};',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('double destruct with rename and default and without and with assignment', {
              code: 'export var {x:y=z}, {a:b=c} = obj;',
              SCRIPT: {throws: 'can only be used with the module goal'},
              throws: 'destructuring must have init',
              tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
            });

            test('single destruct with colon-eq', {
              code: 'export var {a:=c} = z;',
              throws: true,
            });

            test('correct dynamic property destructuring', {
              code: 'export var {[x]: y} = z;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {[x]} = z;',
              throws: 'computed property name',
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [],
            });

            test('dynamic property destructuring missing alias and init', {
              code: 'export var {[x]};',
              throws: 'computed property name',
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [],
            });

            test('dynamic property destructuring missing assignment', {
              code: 'export var {[x]: y};',
              throws: 'destructuring must have init',
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [],
            });

            test('dynamic property destructuring with default missing alias', {
              code: 'export var {[x] = y} = z;',
              throws: 'computed property name',
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [],
            });

            test('dynamic property destructuring with default and alias missing init', {
              code: 'export var {[x]: y = z};',
              throws: 'destructuring must have init',
              SCRIPT: {throws: 'can only be used with the module goal'},
              tokens: [],
            });

            test('correct dynamic property destructuring with default and alias', {
              code: 'export var {[x]: y = z} = a;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
              code: 'export var {a, [x]: y} = a;',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExportNamedDeclaration',
                    specifiers: [],
                    declaration: {
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
          code: 'var [...x] = y',
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
          code: 'var a, [...x] = y',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'var',
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
          code: 'var {...x} = y',
          throws: true, // TODO
        });

        test('ummmm no', {
          code: 'var ...x = y',
          throws: true,
        });
      });
    });

    test('html comment close marks start of single line comment', {
      code: 'var foo = [23]\n-->[0];',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'foo'},
                init: {
                  type: 'ArrayExpression',
                  elements: [{type: 'Literal', value: '<TODO>', raw: '23'}],
                },
              },
            ],
          },
        ],
      },
      desc: 'source: test262/test/annexB/language/comments/single-line-html-close-asi.js (the html comment acts as // and the rest is ignored)',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $ASI],
    });
  });

// forbid "let" and "static" only in strict mode
// add more rules where var differs from let/const
// html comments are outlawed in strict mode (needs reference)
