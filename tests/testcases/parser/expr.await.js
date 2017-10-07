let {
  MODE_MODULE,
  MODE_SCRIPT,
} = require('../../utils.js');
let {
  $ASI,
  $EOF,
  $ERROR,
  $IDENT,
  $NUMBER,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $PUNCTUATOR,
  $REGEX,
  $REGEXU,
  $SPACE,
  $STRING,
  $STRING_DOUBLE,
  $STRING_SINGLE,
  $TAB,
  $TICK,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');

// https://tc39.github.io/ecma262/#prod-AwaitExpression
// await is parsed as an AwaitExpression when the [Await] parameter is present. The [Await] parameter is present in the following contexts:
//  -  In an AsyncFunctionBody.
//  -  In the FormalParameters of an AsyncFunctionDeclaration and AsyncFunctionExpression. AwaitExpression in this position is a Syntax error via static semantics.
//
//  When Module is the syntactic goal symbol and the [Await] parameter is absent, await is parsed as a keyword and will be a Syntax error.
//  When Script is the syntactic goal symbol, await may be parsed as an identifier when the [Await] parameter is absent. This includes the following contexts:
//  -  Anywhere outside of an AsyncFunctionBody or FormalParameters of an AsyncFunctionDeclaration or AsyncFunctionExpression.
//  -  In the BindingIdentifier of a FunctionExpression or GeneratorExpression.


let awaits = [
  '  await',
  {
    code: 'async function f(){ await foo; }',
    ast: {type: 'Program', body: [{type: 'FunctionDeclaration',
      generator: false,
      async: true,
      expression: false,
      id: {type: 'Identifier', name: 'f'},
      params: [],
      body: {
        type: 'BlockStatement',
        body: [{ type: 'ExpressionStatement', expression: {
          type: 'AwaitExpression',
          argument: {type: 'Identifier', name: 'foo'},
        }}],
      },
    }]},
    desc: 'simplest await',
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'async function f(){ await await foo; }',
    ast: {type: 'Program', body: [{type: 'FunctionDeclaration',
      generator: false,
      async: true,
      expression: false,
      id: {type: 'Identifier', name: 'f'},
      params: [],
      body: {
        type: 'BlockStatement',
        body: [{ type: 'ExpressionStatement', expression: {
          type: 'AwaitExpression',
          argument: {
            type: 'AwaitExpression',
            argument: {type: 'Identifier', name: 'foo'},
          },
        }}],
      },
    }]},
    desc: 'nested await',
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'await',
    SCRIPT: {
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'await'}},
      ]},
      tokens: [$IDENT, $ASI],
    },
    MODULE: {
      throws: 'Cannot use await here',
    },
    desc: 'await is a valid identifier in script mode',
  },
  {
    code: 'call(await)',
    SCRIPT: {
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'call'}, arguments: [{type: 'Identifier', name: 'await'}]}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    MODULE: {
      throws: 'Cannot use await here',
    },
    desc: 'await is a valid identifier in script mode',
  },
  {
    code: 'call(await())',
    SCRIPT: {
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'call'}, arguments: [
          {type: 'CallExpression', callee: {type: 'Identifier', name: 'await'}, arguments: []},
        ]}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    MODULE: {
      throws: 'Cannot use await here',
    },
    desc: 'await is a valid identifier in script mode',
  },
  {
    code: 'call(await.foo)',
    SCRIPT: {
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'call'}, arguments: [
          {type: 'MemberExpression', object: {type: 'Identifier', name: 'await'}, property: {type: 'Identifier', name: 'foo'}, computed: false},
        ]}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    MODULE: {
      throws: 'Cannot use await here',
    },
    desc: 'await is a valid identifier in script mode',
  },
  {
    code: 'function call(await){}',
    SCRIPT: {
      ast: {type: 'Program', body: [{type: 'FunctionDeclaration',
        generator: false,
        async: false,
        expression: false,
        id: {type: 'Identifier', name: 'call'},
        params: [{type: 'Identifier', name: 'await'}],
        body: {type: 'BlockStatement', body: []},
      }]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    MODULE: {
      throws: 'Await is illegal outside of async body',
    },
    desc: 'dont throw for await as param name in script mode',
  },
  {
    code: 'function call(foo=await){}',
    SCRIPT: {
      ast: {type: 'Program', body: [{type: 'FunctionDeclaration',
        generator: false,
        async: false,
        expression: false,
        id: {type: 'Identifier', name: 'call'},
        params: [{type: 'AssignmentPattern',
          left: {type: 'Identifier', name: 'foo'},
          right: {type: 'Identifier', name: 'await'}
        }],
        body: {type: 'BlockStatement', body: []},
      }]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    MODULE: {
      throws: 'Cannot use await here',
    },
    desc: 'dont throw for await in param default value if not an actual await expression and in script mode',
  },
  {
    code: 'function call(foo=await bar){}',
    MODULE: {
      throws: 'Cannot use await here',
    },
    SCRIPT: {
      throws: 'Next ord should be 41 ()) but was 98 (b)', // it's by far too much effort to proc a nice message here
    },
    desc: 'can never use await expression as default arg value',
  },
  {
    code: 'function call(foo=await bar=10){}',
    MODULE: {
      throws: 'Cannot use await here',
    },
    SCRIPT: {
      throws: 'Next ord should be 41 ()) but was 98 (b)', // it's by far too much effort to proc a nice message here
    },
    desc: 'arg with default that is awaitable that is an assignment (tests assignability check of an await expr)',
  },
  {
    code: 'function call(foo= 5 + (await bar())){}',
    MODULE: {
      throws: 'Cannot use await here',
    },
    SCRIPT: {
      throws: 'Next ord should be 41 ()) but was 98 (b)', // it's by far too much effort to proc a nice message here
    },
    desc: 'can never use await expression as default arg value (slightly more complex)',
  },

];

module.exports = awaits;
