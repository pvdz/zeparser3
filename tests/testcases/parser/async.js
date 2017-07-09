//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  $TICK_HEAD,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests =   [
  'async related edge cases',
  {
    code: 'foo(async())',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'CallExpression', callee: {type: 'Identifier', name: 'async'}, arguments: []}
      ]}},
    ]},
    desc: 'async is callable as long as it isnt the statement expression itself',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  },
  {
    code: 'foo(async)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'Identifier', name: 'async'},
      ]}},
    ]},
    desc: 'async is callable as long as it isnt the statement expression itself',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  },
  {
    code: 'foo(async.foo)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'MemberExpression', object: {type: 'Identifier', name: 'async'}, property: {type: 'Identifier', name: 'foo'}, computed: false}
      ]}},
    ]},
    desc: 'async is callable as long as it isnt the statement expression itself',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  },
  {
    code: 'f(async ()=>c)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'f'}, arguments: [
        {
          type: 'ArrowFunctionExpression',
          params: [],
          id: null,
          generator: false,
          async: true,
          expression: true,
          body: {type: 'Identifier', name: 'c'},
        },
      ]}},
    ]},
    desc: 'async arrow',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  },
  {
    code: 'f(async ())',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'f'}, arguments: [
        {type: 'CallExpression', callee: {type: 'Identifier', name: 'async'}, arguments: []},
      ]}},
    ]},
    desc: 'calling async as a function (so not an async function but async as a var name)',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  },
  {
    code: 'f(async)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'f'}, arguments: [
        {type: 'Identifier', name: 'async'},
      ]}},
    ]},
    desc: 'using async a regular var name instead of keyword',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  },
  {
    code: '`a ${async ()=>{}} b`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'ArrowFunctionExpression',
            params: [],
            id: null,
            generator: false,
            async: true,
            expression: false,
            body: {type: 'BlockStatement', body: []},
          },
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'empty arrow with block body disambiguation inside template',
    tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
  },
  {
    code: '`a ${async ()=>x} b`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'ArrowFunctionExpression',
            params: [],
            id: null,
            generator: false,
            async: true,
            expression: true,
            body: {type: 'Identifier', name: 'x'},
          },
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'empty arrow with block body disambiguation inside template',
    tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
  },
  // need to test invalid async arrows
  //[ // these are all syntax erros
  //  '    async call/arrow',
  //  {
  //    code: 'async ()=>x',
  //    ast: {type: 'Program', body: [
  //      {type: 'ExpressionStatement', expression: {
  //        type: 'ArrowFunctionExpression',
  //        params: [],
  //        id: null,
  //        generator: false,
  //        async: true,
  //        expression: true,
  //        body: {type: 'Identifier', name: 'x'},
  //      }},
  //    ]},
  //    desc: 'arrow, one arg without parens, expr',
  //    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  //  },
  //
  //  // async=>{}
  //  // async function(){}
  //  // export async function(){}
  //  // export async () => {}
  //
  //
  //], // async call/arrow

  // should throw for `async;` and `async.foo...` etc.
  // `async();` should be a syntax error

];

//export default tests;
module.exports = tests;
