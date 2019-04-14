import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>

  describe('unary ops', _ => {

    describe('positive prefix +x', _ => {
      test('statement', {
        code: '+a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '+',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('negative prefix -x', _ => {
      test('statement', {
        code: '-a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '-',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('bitwise invert', _ => {
      test('statement', {
        code: '~a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '~',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('incremental prefix', _ => {
      describe('sans newline', _ => {
        test('base', {
          code: '++a',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $ASI],
        });

        test('func', {
          code: 'function f(){ return ++a; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UpdateExpression',
                        operator: '++',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('arrow', {
          code: 'let x = () => ++a;',
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
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {
                        type: 'UpdateExpression',
                        operator: '++',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('statement header', {
          code: 'if (++a);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
                consequent: {type: 'EmptyStatement'},
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('sub-statement', {
          code: 'if (a) ++a;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'a'},
                  },
                },
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('one group', {
          code: '++(x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('multi groups', {
          code: '++(((x)));',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('with newline', _ => {
        test('base', {
          code: '++\na',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $ASI],
        });

        test('func', {
          code: 'function f(){ return ++\na; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UpdateExpression',
                        operator: '++',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('arrow', {
          code: 'let x = () => ++\na;',
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
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {
                        type: 'UpdateExpression',
                        operator: '++',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('statement header', {
          code: 'if (++\na);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
                consequent: {type: 'EmptyStatement'},
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('sub-statement', {
          code: 'if (a) ++\na;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'a'},
                  },
                },
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('one group', {
          code: '++\n(x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('multi groups', {
          code: '++\n(((x)));',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      test.pass('simple statement', {
        code: '++x',
      });

      test('complex statement', {
        code: '++x + y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test.pass('property of keyword as statement', {
        code: '++this.x',
      });

      test.pass('property of keyword as expr', {
        code: '(++this.x)',
      });
    });

    describe('decremental prefix', _ => {
      describe('sans newline', _ => {
        test('base', {
          code: '--a',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $ASI],
        });

        test('func', {
          code: 'function f(){ return --a; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UpdateExpression',
                        operator: '--',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('arrow', {
          code: 'let x = () => --a;',
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
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {
                        type: 'UpdateExpression',
                        operator: '--',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('statement header', {
          code: 'if (--a);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
                consequent: {type: 'EmptyStatement'},
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('sub-statement', {
          code: 'if (a) --a;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '--',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'a'},
                  },
                },
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('one group', {
          code: '--(x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('multi groups', {
          code: '--(((x)));',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('with newline', _ => {
        test('base', {
          code: '--\na',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $ASI],
        });

        test('func', {
          code: 'function f(){ return --\na; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UpdateExpression',
                        operator: '--',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('arrow', {
          code: 'let x = () => --\na;',
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
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {
                        type: 'UpdateExpression',
                        operator: '--',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'a'},
                      },
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('statement header', {
          code: 'if (--\na);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
                consequent: {type: 'EmptyStatement'},
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('sub-statement', {
          code: 'if (a) --\na;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '--',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'a'},
                  },
                },
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        });

        test('one group', {
          code: '--\n(x);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('multi groups', {
          code: '--\n(((x)));',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      test.pass('property of keyword as statement', {
        code: '--this.x',
      });

      test.pass('property of keyword as expr', {
        code: '(--this.x)',
      });
    });

    describe('incremental suffix', _ => {
      describe('sans newline', _ => {
        test('base', {
          code: 'a++',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'a'},
                  operator: '++',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $ASI],
        });

        test('func', {
          code: 'function f(){ return a++; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UpdateExpression',
                        argument: {type: 'Identifier', name: 'a'},
                        operator: '++',
                        prefix: false,
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('arrow', {
          code: 'let x = () => a++;',
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
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {
                        type: 'UpdateExpression',
                        argument: {type: 'Identifier', name: 'a'},
                        operator: '++',
                        prefix: false,
                      },
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('statement header', {
          code: 'if (a++);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'a'},
                  operator: '++',
                  prefix: false,
                },
                consequent: {type: 'EmptyStatement'},
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('sub-statement', {
          code: 'if (a) a++;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    argument: {type: 'Identifier', name: 'a'},
                    operator: '++',
                    prefix: false,
                  },
                },
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one group', {
          code: '(x)++;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '++',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('multi groups', {
          code: '(((x)))++;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '++',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('with newline', _ => {
        // TODO: could work throw a more relevant error message when detecting this error pattern

        test('base', {
          code: 'a\n++',
          throws: 'Expected to parse a value',
        });

        test('func', {
          code: 'function f(){ return a\n++; }',
          throws: 'Expected to parse a value',
        });

        test('arrow', {
          code: 'let x = () => a\n++;',
          throws: 'Expected to parse a value',
        });

        test.fail('statement header', {
          code: 'if (a\n++);',
        });

        test('sub-statement', {
          code: 'if (a) a\n++;',
          throws: 'Expected to parse a value',
        });

        test('one group', {
          code: '(x)\n++;',
          throws: 'Expected to parse a value',
        });

        test('multi groups', {
          code: '(((x)))\n++;',
          throws: 'Expected to parse a value',
        });
      });

      test('has no tail', {
        desc: 'there is no production that allows parsing a tail',
        code: 'x.foo++.bar',
        throws: 'Unable to ASI',
      });

      test.pass('property of keyword as statement', {
        code: 'this.x++',
      });

      test.pass('property of keyword as expr', {
        code: '(this.x++)',
      });
    });

    describe('decremental suffix', _ => {
      describe('sans newline', _ => {
        test('base', {
          code: 'a--',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'a'},
                  operator: '--',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $ASI],
        });

        test('func', {
          code: 'function f(){ return a--; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UpdateExpression',
                        argument: {type: 'Identifier', name: 'a'},
                        operator: '--',
                        prefix: false,
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('arrow', {
          code: 'let x = () => a--;',
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
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: false,
                      expression: true,
                      body: {
                        type: 'UpdateExpression',
                        argument: {type: 'Identifier', name: 'a'},
                        operator: '--',
                        prefix: false,
                      },
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('statement header', {
          code: 'if (a--);',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'a'},
                  operator: '--',
                  prefix: false,
                },
                consequent: {type: 'EmptyStatement'},
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('sub-statement', {
          code: 'if (a) a--;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'IfStatement',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    argument: {type: 'Identifier', name: 'a'},
                    operator: '--',
                    prefix: false,
                  },
                },
                alternate: null,
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one group', {
          code: '(x)--;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '--',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('multi groups', {
          code: '(((x)))--;',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '--',
                  prefix: false,
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('with newline', _ => {
        // TODO: could work throw a more relevant error message when detecting this error pattern

        test('base', {
          code: 'a\n--',
          throws: 'Expected to parse a value',
        });

        test('func', {
          code: 'function f(){ return a\n--; }',
          throws: 'Expected to parse a value',
        });

        test('arrow', {
          code: 'let x = () => a\n--;',
          throws: 'Expected to parse a value',
        });

        test.fail('statement header', {
          code: 'if (a\n--);',
        });

        test('sub-statement', {
          code: 'if (a) a\n--;',
          throws: 'Expected to parse a value',
        });

        test('one group', {
          code: '(x)\n--;',
          throws: 'Expected to parse a value',
        });

        test('multi groups', {
          code: '(((x)))\n--;',
          throws: 'Expected to parse a value',
        });
      });

      test('has no tail', {
        desc: 'there is no production that allows parsing a tail',
        code: 'x.foo--.bar',
        throws: 'Unable to ASI',
      });

      test.pass('property of keyword as statement', {
        code: 'this.x--',
      });

      test.pass('property of keyword as expr', {
        code: '(this.x--)',
      });
    });

    describe('typeof', _ => {

      test('base', {
        code: 'typeof x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'typeof',
                prefix: true,
                argument: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $ASI],
      });

      describe('reported in #14', _ => {
        // for the sake of completeness (the actual problem is about using a pattern with a func call)

        test.pass('counter-example where the object is not (necessarily) a pattern', {
          code: 'typeof async({a});',
        });

        test.fail('1', {
          code: 'typeof async({a = 1});',
        });

        test.fail('2', {
          code: 'typeof async({a = 1}, {b = 2}, {c = 3} = {});',
        });

        test.fail('3', {
          code: 'typeof async({a = 1}, {b = 2} = {}, {c = 3} = {});',
        });
      })
    });

    describe('ambiguity', _ => {
      describe('as statement', _ => {
        test('asi before', {
          code: 'a\n++b',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'a'},
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'b'},
                },
              },
            ],
          },
          desc: 'postfix is restricted so ASI should happen', // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion (see notes)
          tokens: [$IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('regression', {
          code: 'a=b\n++c',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'b'},
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'c'},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('asi after', {
          code: 'a++\nb',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'a'},
                  operator: '++',
                  prefix: false,
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'b'},
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $ASI, $IDENT, $ASI],
        });

        test('asi both', {
          code: 'a\n++\nb',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'a'},
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'b'},
                },
              },
            ],
          },
          desc: 'postfix is restricted so ASI should happen',
          tokens: [$IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
        });
      });

      describe('in statement header', _ => {

        test.fail('asi before', {
          code: 'if (a\n++b);',
          desc: 'postfix is restricted so ASI should happen', // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion (see notes)
        });

        test.fail('asi after', {
          code: 'if (a++\nb);',
        });

        test.fail('asi both', {
          code: 'if (a\n++\nb);',
          desc: 'postfix is restricted so ASI should happen',
        });
      });

      describe('return', _ => {
        test('asi before', {
          code: 'function f(){ return a\n++b; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {type: 'Identifier', name: 'a'},
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'UpdateExpression',
                        operator: '++',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'b'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          desc: 'postfix is restricted so ASI should happen', // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion (see notes)
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('asi after', {
          code: 'function f(){ return a++\nb; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'UpdateExpression',
                        argument: {type: 'Identifier', name: 'a'},
                        operator: '++',
                        prefix: false,
                      },
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {type: 'Identifier', name: 'b'},
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $ASI, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('asi both', {
          code: 'function f(){ return a\n++\nb; }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {type: 'Identifier', name: 'a'},
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'UpdateExpression',
                        operator: '++',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'b'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          desc: 'postfix is restricted so ASI should happen',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
      });
    });

    describe('boolean invert', _ => {
      test('statement', {
        code: '!a',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: '!',
                prefix: true,
                argument: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('precedent', _ => {

      test('operator should not consume binaries', {
        code: 'typeof x + y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('cannot unary an async ', {
        code: 'typeof x + y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });
  });

// TODO: disambiguation tests of all the unaries (some have their own test file)
// typeof x++  (the typeof wraps the update)
// tests for asi and ++/-- for anything where LF_CAN_POSTFIX_ASI appears and async arrow functions because they're weird
// check whether postfix asi (++/--) can be blocked by something else than objlit/arrlit/arrow/group
