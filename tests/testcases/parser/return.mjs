/** @format */
import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('return statement', _ => {
    test('return, no value, semi', {
      code: 'function f(){   return;    }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
    test.fail('should fail in global', {
      code: 'return',
    });
    test.pass('should work in arrow A', {
      code: '() => {return}',
    });
    test.fail('should not work in expr arrow', {
      code: '() => return',
    });
    test.pass('should work in arrow B', {
      code: 'x => {return}',
    });
    test.pass('should work in arrow C', {
      code: '(a, b) => {return}',
    });
    test.pass('should work in async arrow', {
      code: 'async () => {return}',
    });
    test.pass('should work in arrow D', {
      code: 'async foo => {return}',
    });
    test.fail('should work in generator arrow haha jk they dont exist. yet.', {
      code: '*() => {return}',
    });
    test.pass('should work in generator', {
      code: 'function *f() { return }',
    });
    test.pass('should work in async function', {
      code: 'async function f(){ return; }',
    });
    test.pass('should work in func expr', {
      code: '(function(){ return })',
    });
    test.pass('should work in constructor', {
      code: 'class x { constructor(){ return }}',
    });
    test.pass('should work in class method', {
      code: 'class x {foo(){ return }}',
    });
    test.pass('should work in obj method', {
      code: '({foo(){ return }})',
    });
    test('return, no value, eof', {
      code: 'function f(){   return   }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
    });
    test('double return, no value, semi', {
      code: 'function f(){   return;return    };',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
              ],
            },
          },
          {
            type: 'EmptyStatement',
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('double return, no value, eof', {
      code: 'function f(){   return\nreturn   }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $ASI, $PUNCTUATOR],
    });
    test('return, no value, semi', {
      code: 'function f(){   return foo;    }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('return, no value, semi', {
      code: 'function f(){   return 15;    }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'Literal',
                    value: '<TODO>',
                    raw: '15',
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('return, asi check', {
      code: 'function f(){   return \n foo;    }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('return, asi check, wrapped in body', {
      code: 'function f(){   {return \n foo}    }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: null,
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'Identifier',
                        name: 'foo',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('return, confirm body acts as asi', {
      code: 'function f(){   {return}    }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              name: 'f',
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: null,
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
    });
    describe('return with option', _ => {
      test('return, no value, eof', {
        code: 'return',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ReturnStatement',
              argument: null,
            },
          ],
        },
        tokens: [$IDENT, $ASI],
      });
      test('double return, no value, semi', {
        code: 'return;return',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ReturnStatement',
              argument: null,
            },
            {
              type: 'ReturnStatement',
              argument: null,
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
      test('double return, no value, eof', {
        code: 'return\nreturn',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ReturnStatement',
              argument: null,
            },
            {
              type: 'ReturnStatement',
              argument: null,
            },
          ],
        },
        tokens: [$IDENT, $ASI, $IDENT, $ASI],
      });
      test('return, no value, semi', {
        code: 'return foo;',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ReturnStatement',
              argument: {
                type: 'Identifier',
                name: 'foo',
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR],
      });
      test('return, no value, semi', {
        code: 'return 15;',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ReturnStatement',
              argument: {
                type: 'Literal',
                value: '<TODO>',
                raw: '15',
              },
            },
          ],
        },
        tokens: [$IDENT, $NUMBER_DEC, $PUNCTUATOR],
      });
      test('return, asi check', {
        code: 'return \n foo;',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ReturnStatement',
              argument: null,
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'foo',
              },
            },
          ],
        },
        tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
      });
      test('return, asi check, wrapped in body', {
        code: '{return \n foo}',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
              ],
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI, $IDENT, $ASI, $PUNCTUATOR],
      });
      test('return, confirm body acts as asi', {
        code: '{return}',
        OPTIONS: {
          allowGlobalReturn: true,
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: null,
                },
              ],
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });
    });
  });
