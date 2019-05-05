import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

// ++ and -- are UpdateExpression nodes in the spec, not unary operators

export default (describe, test) =>

  describe('update (increment/decrement) ops', _ => {

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

      test.pass('left of ternary', {
        code: '++x ? b : c',
      });

      test.fail('left of assignment', {
        code: '++x = y',
      });

      test.fail('left of parenless arrow', {
        code: '++x => b',
      });

      test.fail('left of paren arrow', {
        code: '++(x) => b',
      });

      test.pass('regex arg case', {
        code: '++/b/.c',
      });

      test.fail('an array pattern', {
        code: '++[]',
        HAS_AST: true,
      });

      test.fail('an object pattern', {
        code: '++{}',
        HAS_AST: true,
      });

      test.pass('prop on an array', {
        code: '++[].foo',
      });

      test.pass('prop on an object', {
        code: '++{}.foo',
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

      test.pass('regex arg case', {
        code: '--/b/.c',
      });

      test.fail('an array pattern', {
        code: '--[]',
        HAS_AST: true,
      });

      test.fail('an object pattern', {
        code: '--{}',
        HAS_AST: true,
      });

      test.pass('a prop on an array pattern', {
        code: '--[].x',
      });

      test.pass('a prop on an object pattern', {
        code: '--{}.x',
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

      test.fail('an array pattern', {
        code: '[]++',
        HAS_AST: true,
      });

      test.fail('a block', {
        code: '{}++',
      });

      test.fail('an object pattern', {
        code: '({}++)',
        HAS_AST: true,
      });

      test.pass('a prop on an array pattern', {
        code: '[].x++',
      });

      test.pass('a prop on an object pattern', {
        code: '({}.x++)',
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

      test.fail('an array pattern', {
        code: '[]--',
        HAS_AST: true,
      });

      test.fail('a block', {
        code: '{}--',
      });

      test.fail('an object pattern', {
        code: '({}--)',
        HAS_AST: true,
      });
    });

    describe('update expression ambiguity', _ => {

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
  });

// typeof x++  (the typeof wraps the update)
// tests for asi and ++/-- for anything where LF_CAN_POSTFIX_ASI appears and async arrow functions because they're weird
// check whether postfix asi (++/--) can be blocked by something else than objlit/arrlit/arrow/group
