let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  $REGEX,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('class statement', _ => {

  describe('empty classes', _ => {

    describe('as declaration', _ => {

      test('base case empty class',{
        code: 'class A {}',
        ast: {type: 'Program', body: [
          {type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'A'},
            superClass: null,
            body: {type: 'ClassBody',
              body: [],
            }
          },
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('semi in an empty class',{
        code: 'class A {;}',
        ast: {type: 'Program', body: [
          {type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'A'},
            superClass: null,
            body: {type: 'ClassBody',
              body: [],
            }
          },
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('semis in an empty class',{
        code: 'class A {; ;; ;}',
        ast: {type: 'Program', body: [
          {type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'A'},
            superClass: null,
            body: {type: 'ClassBody',
              body: [],
            }
          },
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('as expression', _ => {

      test('base case empty class',{
        code: 'x = class A {};',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression:
            {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'x'},
              operator: '=',
              right: {type: 'ClassExpression',
                id: {type: 'Identifier', name: 'A'},
                superClass: null,
                body: {type: 'ClassBody',
                  body: [],
                },
              },
            },
          },
        ]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });
  });

  describe('extending', _ => {
    test('empty class with trivial extends',{
      code: 'class A extends B {}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: {type: 'Identifier', name: 'B'},
          body: {type: 'ClassBody',
            body: [],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty class that extends an expression',{
      code: 'class A extends foo() {}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: []},
          body: {type: 'ClassBody',
            body: [],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty class extending an empty object because i had to be smart about it',{
      code: 'class A extends {} {}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: {type: 'ObjectExpression', properties: []},
          body: {type: 'ClassBody',
            body: [],
          }
        },
      ]},
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
      throws: 'strict mode',
      desc: 'the name of the function is also considered strict mode so `let` is outlawed',
      tokens: [],
    })
  });

  describe('ident methods', _ => {

    test('class with simple ident method',{
      code: 'class A {a(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'a'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('static ident method',{
      code: 'class A {static a(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: true,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'a'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('regular constructor',{
      code: 'class A {constructor(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'constructor',
                key: {type: 'Identifier', name: 'constructor'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('static constructor',{
      code: 'class A {static constructor(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: true,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'constructor'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async method',{
      code: 'class A {async foo(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('generator method',{
      code: 'class A {*foo(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: true,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('getter method',{
      code: 'class A {get foo(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'get',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('getter named set',{
      code: 'class A {get set(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'get',
                key: {type: 'Identifier', name: 'set'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('static getter',{
      code: 'class A {static get foo(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: true,
                computed: false,
                kind: 'get',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async getter method',{
      code: 'class A {async get foo(){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('generator getter method',{
      code: 'class A {* get foo(){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('setter method',{
      code: 'class A {set foo(x){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'set',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'x'}],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('setter named get',{
      code: 'class A {set get(x){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'set',
                key: {type: 'Identifier', name: 'get'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'x'}],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('static setter method',{
      code: 'class A {static set foo(x){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: true,
                computed: false,
                kind: 'set',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'x'}],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async setter method',{
      code: 'class A {async set foo(x){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('generator setter method',{
      code: 'class A {* set foo(x){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('class with non-special method named get, set, and async',{
      code: 'class A {set(){} get(){} async(){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'set'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'get'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
              {type: 'MethodDefinition',
                static: false,
                computed: false,
                kind: 'method',
                key: {type: 'Identifier', name: 'async'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('dynamic methods', _ => {

    test('without modifier',{
      code: 'class A {[a](){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: true,
                kind: 'method',
                key: {type: 'Identifier', name: 'a'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  
    test('static member',{
      code: 'class A {static [a](){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: true,
                computed: true,
                kind: 'method',
                key: {type: 'Identifier', name: 'a'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  
    test('async member',{
      code: 'class A {async [foo](){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: true,
                kind: 'method',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  
    test('generator member',{
      code: 'class A {*[foo](){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: true,
                kind: 'method',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: true,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  
    test('getter member',{
      code: 'class A {get [foo](){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: true,
                kind: 'get',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  
    test('static getter member',{
      code: 'class A {static get [foo](){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: true,
                computed: true,
                kind: 'get',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('generator setter member', {
      code: 'class A {* get [x](){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async getter member',{
      code: 'class A {async get [x](){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('setter member', {
      code: 'class A {set [foo](x){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: false,
                computed: true,
                kind: 'set',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'x'}],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('static setter member',{
      code: 'class A {static set [foo](x){}}',
      ast: {type: 'Program', body: [
        {type: 'ClassDeclaration',
          id: {type: 'Identifier', name: 'A'},
          superClass: null,
          body: {type: 'ClassBody',
            body: [
              {type: 'MethodDefinition',
                static: true,
                computed: true,
                kind: 'set',
                key: {type: 'Identifier', name: 'foo'},
                value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'x'}],
                  body: {type: 'BlockStatement', body: []}
                },
              },
            ],
          }
        },
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('generator setter member', {
      code: 'class A {* set [foo](x){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async getter member',{
      code: 'class A {async get [foo](){}}',
      throws: 'Missing method arg parens',
      desc: 'setters dont syntactically support async/generator modifiers',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('literal members', _ => {

    // https://github.com/tc39/test262/blob/8213224280e94ea4b7949c085cb9bf8e99bf0df6/test/language/expressions/class/fields-after-same-line-gen-string-literal-names.js
    // https://github.com/tc39/test262/blob/master/src/class-fields/string-literal-names.case

    //test('string without value', {
    //  code: `
    //    class C {
    //      *m() { return 42; }
    //      'a';
    //      "b";
    //      'c' = 39;
    //      "d" = 42;
    //    }
    //  `,
    //  ast: null,
    //  tokens: [],
    //});

  });

  describe('regex edge case', _ => {

    describe('declaration', _ => {

      test('sans flag', {
        code: 'class x{}\n/foo/',
        ast: { type: 'Program',
          body:
            [ { type: 'ClassDeclaration',
              id: { type: 'Identifier', name: 'x' },
              superClass: null,
              body: { type: 'ClassBody', body: [] } },
              { type: 'ExpressionStatement',
                expression: { type: 'Literal', value: '<TODO>', raw: '/foo/' } } ] },
        desc: 'note: not a division because class decl requires no semi so there is no need to ASI',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
      });

      test('with flag', {
        code: 'class x{}\n/foo/g',
        ast: { type: 'Program',
          body:
            [ { type: 'ClassDeclaration',
              id: { type: 'Identifier', name: 'x' },
              superClass: null,
              body: { type: 'ClassBody', body: [] } },
              { type: 'ExpressionStatement',
                expression: { type: 'Literal', value: '<TODO>', raw: '/foo/g' } } ] },
        desc: 'note: not a division because class decl requires no semi so there is no need to ASI',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
      });
    });

    describe('expression', _ => {

      test('sans flag', {
        code: 'typeof class{}\n/foo/',
        throws: 'Expected to parse a value',
        desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
        tokens: [],
      });

      test('with flag', {
        code: 'typeof class{}\n/foo/g',
        ast: { type: 'Program',
          body:
            [ { type: 'ExpressionStatement',
              expression:
              { type: 'BinaryExpression',
                left:
                { type: 'BinaryExpression',
                  left:
                  { type: 'UnaryExpression',
                    operator: 'typeof',
                    prefix: true,
                    argument:
                    { type: 'ClassExpression',
                      id: null,
                      superClass: null,
                      body: { type: 'ClassBody', body: [] } } },
                  operator: '/',
                  right: { type: 'Identifier', name: 'foo' } },
                operator: '/',
                right: { type: 'Identifier', name: 'g' } } } ] },
        desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });
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
