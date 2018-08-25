let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX, $STRING_DOUBLE} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('classes', _ => {

    describe('empty classes', _ => {
      describe('as declaration', _ => {
        test('base case empty class', {
          code: 'class A {}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'A'},
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('semi in an empty class', {
          code: 'class A {;}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'A'},
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('semis in an empty class', {
          code: 'class A {; ;; ;}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'A'},
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('as expression', _ => {
        test('base case empty class', {
          code: 'x = class A {};',
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
                    type: 'ClassExpression',
                    id: {type: 'Identifier', name: 'A'},
                    superClass: null,
                    body: {
                      type: 'ClassBody',
                      body: [],
                    },
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });
    });

    describe('extending', _ => {
      test('empty class with trivial extends', {
        code: 'class A extends B {}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'A'},
              superClass: {type: 'Identifier', name: 'B'},
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty class that extends an expression', {
        code: 'class A extends foo() {}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'A'},
              superClass: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: []},
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('empty class extending an empty object because i had to be smart about it', {
        code: 'class A extends {} {}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'A'},
              superClass: {type: 'ObjectExpression', properties: []},
              body: {
                type: 'ClassBody',
                body: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('extend expression also inherits the strict mode from class', {
        code: 'class X extends function(){ with(obj); } {}',
        throws: 'strict mode',
        desc: 'anything from the class keyword onwards is strict mode regardless of goal/sloppy state',
        tokens: [],
      });

      test('extend expression also inherits the strict mode from class', {
        code: 'class let {}',
        throws: 'Cannot use this name',
        desc: 'the name of the function is also considered strict mode so `let` is outlawed',
        tokens: [],
      });
    });

    describe('ident methods', _ => {

      test('class with simple ident method', {
        code: 'class A {a(){}}',
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
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('static ident method', {
        code: 'class A {static a(){}}',
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
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('regular constructor', {
        code: 'class A {constructor(){}}',
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
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('static constructor', {
        code: 'class A {static constructor(){}}',
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
                    static: true,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async method', {
        code: 'class A {async foo(){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator method', {
        code: 'class A {*foo(){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('getter method', {
        code: 'class A {get foo(){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('getter named set', {
        code: 'class A {get set(){}}',
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
                    key: {type: 'Identifier', name: 'set'},
                    static: false,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('static getter', {
        code: 'class A {static get foo(){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: true,
                    computed: false,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async getter method', {
        code: 'class A {async get foo(){}}',
        throws: 'left paren',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator getter method', {
        code: 'class A {* get foo(){}}',
        throws: 'can not be generator',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('setter method', {
        code: 'class A {set foo(x){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [{type: 'Identifier', name: 'x'}],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('setter named get', {
        code: 'class A {set get(x){}}',
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
                    key: {type: 'Identifier', name: 'get'},
                    static: false,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [{type: 'Identifier', name: 'x'}],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('static setter method', {
        code: 'class A {static set foo(x){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: true,
                    computed: false,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [{type: 'Identifier', name: 'x'}],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async setter method', {
        code: 'class A {async set foo(x){}}',
        throws: 'left paren',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator setter method', {
        code: 'class A {* set foo(x){}}',
        throws: 'can not be generator',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('class with non-special method named get, set, and async', {
        code: 'class A {set(){} get(){} async(){}}',
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
                    key: {type: 'Identifier', name: 'set'},
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'get'},
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'async'},
                    static: false,
                    computed: false,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
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
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
        ],
      });
    });

    describe('dynamic methods', _ => {

      test('without modifier', {
        code: 'class A {[a](){}}',
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
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('static member', {
        code: 'class A {static [a](){}}',
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
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async member', {
        code: 'class A {async [foo](){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator member', {
        code: 'class A {*[foo](){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('getter member', {
        code: 'class A {get [foo](){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('static getter member', {
        code: 'class A {static get [foo](){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: true,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator setter member', {
        code: 'class A {* get [x](){}}',
        throws: 'can not be generator',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async getter member', {
        code: 'class A {async get [x](){}}',
        throws: 'left paren',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('setter member', {
        code: 'class A {set [foo](x){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: false,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [{type: 'Identifier', name: 'x'}],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('static setter member', {
        code: 'class A {static set [foo](x){}}',
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
                    key: {type: 'Identifier', name: 'foo'},
                    static: true,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [{type: 'Identifier', name: 'x'}],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator setter member', {
        code: 'class A {* set [foo](x){}}',
        throws: 'can not be generator',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async getter member', {
        code: 'class A {async get [foo](){}}',
        throws: 'left paren',
        desc: 'setters dont syntactically support async/generator modifiers',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator with dynamic key', {
        code: 'class x { *[y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async with dynamic key', {
        code: 'class x { async [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('getter with dynamic key', {
        code: 'class x { get [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: false,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('setter with dynamic key', {
        code: 'class x { set [y](z){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: false,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [{type: 'Identifier', name: 'z'}],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('generator with dynamic key', {
        code: 'class x {static *[y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: true,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async with dynamic key', {
        code: 'class x { static async [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: true,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: true,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('getter with dynamic key', {
        code: 'class x { static get [y](){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: true,
                    computed: true,
                    kind: 'get',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('setter with dynamic key', {
        code: 'class x { static set [y](z){}}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: true,
                    computed: true,
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      expression: false,
                      id: null,
                      params: [{type: 'Identifier', name: 'z'}],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('async generator with dynamic key', {
        code: 'class x { async *[y](){}}',
        desc: 'important to assert that the AST marks the method as both async and a generator',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'y'},
                    static: false,
                    computed: true,
                    kind: 'method',
                    value: {
                      type: 'FunctionExpression',
                      generator: true,
                      async: true,
                      expression: false,
                      id: null,
                      params: [],
                      body: {type: 'BlockStatement', body: []},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('generators', _ => {

      describe('not static', _ => {

        describe('no prefix', _ => {

          test('with ident key', {
            code: 'class x{*foo(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
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
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with dynamic key', {
            code: 'class x{*[x](){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: 'x'},
                        static: false,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with string key', {
            code: 'class x{*"foo"(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with number key', {
            code: 'class x{*555(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '555'},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with crap', {
            code: 'class x{*%x(){}}',
            throws: true,
          });
        });

        describe('getter prefix', _ => {

          test('with ident key', {
            code: 'class x{get *foo(){}}',
            throws: 'getter cannot be a generator',
          });

          test('with dynamic key', {
            code: 'class x{get *[x](){}}',
            throws: 'getter cannot be a generator',
          });

          test('with string key', {
            code: 'class x{get *"foo"(){}}',
            throws: 'getter cannot be a generator',
          });

          test('with number key', {
            code: 'class x{get *555(){}}',
            throws: 'getter cannot be a generator',
          });

          test('with crap', {
            code: 'class x{get *%x(){}}',
            throws: 'getter cannot be a generator',
          });
        });

        describe('setter prefix', _ => {

          test('with ident key', {
            code: 'class x{set *foo(a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with dynamic key', {
            code: 'class x{set *[x](a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with string key', {
            code: 'class x{set *"foo"(a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with number key', {
            code: 'class x{set *555(a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with crap', {
            code: 'class x{set *%x(a){}}',
            throws: 'setter cannot be a generator',
          });
        });

        describe('async prefix', _ => {

          // important to assert that the AST marks the methods as both async and a generator and id=null

          test('with ident key', {
            code: 'class x{async *foo(a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
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
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with dynamic key', {
            code: 'class x{async *[x](a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: 'x'},
                        static: false,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with string key', {
            code: 'class x{async *"foo"(a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with number key', {
            code: 'class x{async *555(a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '555'},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with crap', {
            code: 'class x{async *%x(a){}}',
            throws: 'invalid', // just .fail here if the message changes too often
          });
        });
      });

      describe('with static', _ => {

        describe('no prefix', _ => {

          test('with ident key', {
            code: 'class x{static *foo(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
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
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with dynamic key', {
            code: 'class x{static *[x](){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: 'x'},
                        static: true,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with string key', {
            code: 'class x{static *"foo"(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with number key', {
            code: 'class x{static *555(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '555'},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with crap', {
            code: 'class x{static *%x(){}}',
            throws: true,
          });
        });

        describe('getter prefix', _ => {

          test('with ident key', {
            code: 'class x{static get *foo(){}}',
            throws: 'getter cannot be a generator',
          });

          test('with dynamic key', {
            code: 'class x{static get *[x](){}}',
            throws: 'getter cannot be a generator',
          });

          test('with string key', {
            code: 'class x{static get *"foo"(){}}',
            throws: 'getter cannot be a generator',
          });

          test('with number key', {
            code: 'class x{static get *555(){}}',
            throws: 'getter cannot be a generator',
          });

          test('with crap', {
            code: 'class x{static get *%x(){}}',
            throws: 'getter cannot be a generator',
          });
        });

        describe('setter prefix', _ => {

          test('with ident key', {
            code: 'class x{static set *foo(a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with dynamic key', {
            code: 'class x{static set *[x](a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with string key', {
            code: 'class x{static set *"foo"(a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with number key', {
            code: 'class x{static set *555(a){}}',
            throws: 'setter cannot be a generator',
          });

          test('with crap', {
            code: 'class x{static set *%x(a){}}',
            throws: 'setter cannot be a generator',
          });
        });

        describe('async prefix', _ => {

          test('with ident key', {
            code: 'class x{static async *foo(a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
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
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with dynamic key', {
            code: 'class x{static async *[x](a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: 'x'},
                        static: true,
                        computed: true,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with string key', {
            code: 'class x{static async *"foo"(a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with number key', {
            code: 'class x{static async *555(a){}}',
            callback(ast, tokens, astJson){
              return astJson.includes('"generator":true') && astJson.includes('"async":true') && astJson.includes('"id":null') && astJson.includes('"static":true')
            },
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Literal', value: '<TODO>', raw: '555'},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'a'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('with crap', {
            code: 'class x{static async *%x(a){}}',
            throws: 'invalid',
          });
        });
      });
    });

    describe('regex edge case', _ => {
      describe('declaration', _ => {
        test('sans flag', {
          code: 'class x{}\n/foo/',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: null,
                body: {type: 'ClassBody', body: []},
              },
              {
                type: 'ExpressionStatement',
                expression: {type: 'Literal', value: '<TODO>', raw: '/foo/'},
              },
            ],
          },
          desc: 'note: not a division because class decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });

        test('with flag', {
          code: 'class x{}\n/foo/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ClassDeclaration',
                id: {type: 'Identifier', name: 'x'},
                superClass: null,
                body: {type: 'ClassBody', body: []},
              },
              {
                type: 'ExpressionStatement',
                expression: {type: 'Literal', value: '<TODO>', raw: '/foo/g'},
              },
            ],
          },
          desc: 'note: not a division because class decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
      });

      describe('expression', _ => {
        test('sans flag', {
          code: 'typeof class{}\n/foo/',
          throws: 'Expected to parse a value',
          desc:
            'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [],
        });

        test('with flag', {
          code: 'typeof class{}\n/foo/g',
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
                      type: 'UnaryExpression',
                      operator: 'typeof',
                      prefix: true,
                      argument: {
                        type: 'ClassExpression',
                        id: null,
                        superClass: null,
                        body: {type: 'ClassBody', body: []},
                      },
                    },
                    operator: '/',
                    right: {type: 'Identifier', name: 'foo'},
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'g'},
                },
              },
            ],
          },
          desc:
            'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });
      });
    });

    describe('special keys', _ => {
      [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
        'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
        'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'true',
        'false', 'enum', 'eval', 'arguments', 'implements', 'package', 'protected', 'interface', 'private',
        'public', 'await', 'yield',
        'let', // "Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName"
        'static', // "Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName"
        'async', 'get', 'set',
      ].forEach(ident => {

        describe('ident=' + ident, _ => {

          test('as class name', {
            code: 'class ' + ident + ' {}',
            ...(
              ['async', 'get', 'set'].indexOf(ident) >= 0 ?
                {
                  ast: true,
                  tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                }
                :
                ['await'].indexOf(ident) >= 0 ?
                  {
                    ast: true,
                    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
                    // await is only considered a keyword when parsing in module mode
                    MODULE: {
                      throws: true,
                    },
                  }
                  :
                {
                  throws: 'variable name',
                }
            ),
          });

          test('as super class name', {
            code: 'class x extends ' + ident + ' {}',
            desc: 'since extends accept an arbitrary expression certain keywords lead to different errors',
            ...(
              ['async', 'this', 'null', 'true', 'false', 'eval', 'arguments', 'get', 'set'].indexOf(ident) >= 0 ?
              {
                ast: true,
                tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
              }
                :
              {
                throws: true,
              }
            ),
          });

          test('as regular property in class', {
            code: 'class x {' + ident + ': x}',
            desc: 'we will have to revisit this with class properties later',
            throws: 'method',
          });

          test('as method in class', {
            code: 'class x {' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as static method in class', {
            code: 'class x {static ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as generator in class', {
            code: 'class x {* ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as getter in class', {
            code: 'class x {get ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: false,
                        computed: false,
                        kind: 'get',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as setter in class', {
            code: 'class x {set ' + ident + '(x){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: false,
                        computed: false,
                        kind: 'set',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'x'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as async method in class', {
            code: 'class x {async ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: true,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as async generator in class', {
            code: 'class x {async * ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: false,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as static getter in class', {
            code: 'class x {static get ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: true,
                        computed: false,
                        kind: 'get',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as static generator in class', {
            code: 'class x {static * ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: false,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as static setter in class', {
            code: 'class x {static set ' + ident + '(x){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: true,
                        computed: false,
                        kind: 'set',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: false,
                          expression: false,
                          id: null,
                          params: [{type: 'Identifier', name: 'x'}],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as static async method in class', {
            code: 'class x {static async ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: false,
                          async: true,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('as static async generator in class', {
            code: 'class x {static async * ' + ident + '(){}}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ClassDeclaration',
                  id: {type: 'Identifier', name: 'x'},
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        key: {type: 'Identifier', name: ident},
                        static: true,
                        computed: false,
                        kind: 'method',
                        value: {
                          type: 'FunctionExpression',
                          generator: true,
                          async: true,
                          expression: false,
                          id: null,
                          params: [],
                          body: {type: 'BlockStatement', body: []},
                        },
                      },
                    ],
                  },
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
        });
      });
    });

    describe('method names cannot be `prototype`', _ => {

      test('plain', {
        code: 'class x { prototype(){} }',
        throws: 'prototype',
      });

      test('getter', {
        code: 'class x { get prototype(){} }',
        throws: 'prototype',
      });

      test('setter', {
        code: 'class x { set prototype(x){} }',
        throws: 'prototype',
      });

      test('generator', {
        code: 'class x { *prototype(){} }',
        throws: 'prototype',
      });

      test('async', {
        code: 'class x { async prototype(){} }',
        throws: 'prototype',
      });

      // test('gen async', {
      //   code: 'class x { async *prototype(){} }',
      // });
    });

    test.fail('cannot extend an assignment', {
      code: 'class x extends a = b {}',
    });

    test('constructor as dynamic property should be a method', {
      code: 'class x { [constructor](){} }',
      desc: 'checking the token name of the key is insufficient if the dynamic aspect is left unchecked',
      callback(ast, tokens, astJson) { return astJson.includes('"computed":true') && astJson.includes('"kind":"method"'); },
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'x'},
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  key: {type: 'Identifier', name: 'constructor'},
                  static: false,
                  computed: true,
                  kind: 'method',
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: false,
                    id: null,
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test.fail('getter named "constructor"', {
      code: 'class x { get constructor(){} }',
      desc: 'constructor can not have a modifier',
    });

    /*
  // string and numeric keys are also valid
class f {
  "foo"(){}
  'bar'(){}
  15(){}
  [x](){}
}

// shorthand checks
class f {
  get,
  set,
  async,
}

   */

    // export default class extends F {}
    // class extends {} {}
    // async constructor ?
    // expression classes: (class X{})
    //class x{static(){}}
    //class x{static static(){}}
    //class x{async static(){}}
    //class x{async static static(){}}
    //class x{*static(){}}
    //class x{static *static(){}}
    // confirm multiple usages of same member modifier is prevented (async async, static async static, etc)

    // class is always strict mode (note below https://tc39.github.io/ecma262/#prod-ClassBody )
  });


// https://tc39.github.io/ecma262/#sec-class-definitions-static-semantics-early-errors
// > It is a Syntax Error if PropName of MethodDefinition is "constructor" and SpecialMethod of MethodDefinition is true.
// (so can not do `async constructor` etc)

// > It is a Syntax Error if PropName of MethodDefinition is "prototype".
// (can not make a static method called "prototype")
