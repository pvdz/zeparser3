let {
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('class statement', _ => {

  test('empty class',{
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

    test('class with simple ident method',{
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

    test('class with special constructor method',{
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

    test('class with not-so-special static constructor method',{
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

    test('class with async method',{
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

    test('class with generator method',{
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

    test('class with getter method',{
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

    test('class with static getter method because why not',{
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

    test('class with setter method',{
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

    test('class with setter method',{
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

    test('class with setter named get',{
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

    test('class with getter named set',{
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

    test('class with simple ident method',{
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
  
    test('class with simple ident method',{
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
  
    test('class with async method',{
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
  
    test('class with generator method',{
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
  
    test('class with getter method',{
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
  
    test('class with static getter method because why not',{
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
  
    test('class with setter method',{
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
  
    test('class with setter method',{
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
});
