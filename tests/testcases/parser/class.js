//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'class statement',
  {
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
    desc: 'empty class',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
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
    desc: 'empty class with trivial extends',
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
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
    desc: 'empty class that extends an expression',
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
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
    desc: 'empty class with an object because i had to be smart about it',
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
  [
    '  ident methods',
    {
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
      desc: 'class with simple ident method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with simple ident method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with special constructor method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with not-so-special static constructor method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with async method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with generator method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with getter method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with static getter method because why not',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with setter method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with setter method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with setter named get',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with getter named set',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with non-special method named get, set, and async',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
  ], // ident methods
  [
    '  dynamic methods',
    {
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
      desc: 'class with simple ident method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with simple ident method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with async method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with generator method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with getter method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with static getter method because why not',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with setter method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'class with setter method',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
  ], // dynamic methods

  // export default class extends F {}
  // class extends {} {}
  // async constructor ?
];

//export default tests;
module.exports = tests;
