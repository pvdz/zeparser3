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
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'await'}},
    ]},
    mode: MODE_SCRIPT,
    desc: 'await is a valid identifier in script mode',
    tokens: [$IDENT, $ASI],
  },
  {
    code: 'await',
    throws: 'Cannot use await here',
    mode: MODE_MODULE,
    desc: 'await is an invalid identifier in module mode',
  },
  {
    code: 'call(await)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'call'}, arguments: [{type: 'Identifier', name: 'await'}]}},
    ]},
    mode: MODE_SCRIPT,
    desc: 'await is a valid identifier in script mode',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  },
  {
    code: 'call(await())',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'call'}, arguments: [
        {type: 'CallExpression', callee: {type: 'Identifier', name: 'await'}, arguments: []},
      ]}},
    ]},
    mode: MODE_SCRIPT,
    desc: 'await is a valid identifier in script mode',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  },
  {
    code: 'call(await.foo)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'call'}, arguments: [
        {type: 'MemberExpression', object: {type: 'Identifier', name: 'await'}, property: {type: 'Identifier', name: 'foo'}, computed: false},
      ]}},
    ]},
    mode: MODE_SCRIPT,
    desc: 'await is a valid identifier in script mode',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  },
  {
    code: 'function call(await){}',
    ast: {type: 'Program', body: [{type: 'FunctionDeclaration',
      generator: false,
      async: false,
      expression: false,
      id: {type: 'Identifier', name: 'call'},
      params: [{type: 'Identifier', name: 'await'}],
      body: {type: 'BlockStatement', body: []},
    }]},
    mode: MODE_SCRIPT,
    desc: 'dont throw for await as param name in script mode',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'function call(foo=await){}',
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
    mode: MODE_SCRIPT,
    desc: 'dont throw for await in param default value if not an actual await expression and in script mode',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },

  // error:
  // - await without arg in module code or inside async func args/body
  // - await outside of async body in module code
];

module.exports = awaits;
