//import ZeTokenizer, {
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
//} from '../../../src/zetokenizer';

let templates = [
  '  template',
  {
    code: '`foo`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [],
        quasis: [
          {type: 'TemplateElement', tail: true, value: {raw: '`foo`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'pure template',
    tokens: [$TICK_PURE, $ASI],
  },
  {
    code: '`foo${bar}baz`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'Identifier', name: 'bar'},
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'head${expr}tail template',
    tokens: [$TICK_HEAD, $IDENT, $TICK_TAIL, $ASI],
  },
  {
    code: '`foo ${a} and ${b} and ${c} baz`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
          {type: 'Identifier', name: 'c'},
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'template with multiple middle pieces',
    tokens: [$TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI],
  },
  {
    code: '{`foo baz`}',
    ast: {type: 'Program', body: [
      {type: 'BlockStatement', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
          ],
          quasis: [
            {type: 'TemplateElement', tail: true, value: {raw: '`foo baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
    ]},
    desc: 'block wrapped 1-part template to check disambiguation',
    tokens: [$PUNCTUATOR, $TICK_PURE, $ASI, $PUNCTUATOR],
  },
  {
    code: '{`foo ${a} baz`}',
    ast: {type: 'Program', body: [
      {type: 'BlockStatement', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'Identifier', name: 'a'},
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
    ]},
    desc: 'block wrapped 2-part template to check disambiguation',
    tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_TAIL, $ASI, $PUNCTUATOR],
  },
  {
    code: '{`foo ${a} and ${b} and ${c} baz`}',
    ast: {type: 'Program', body: [
      {type: 'BlockStatement', body: [
        {type: 'ExpressionStatement', expression: {type: 'TemplateLiteral',
          expressions: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
            {type: 'Identifier', name: 'c'},
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
    ]},
    desc: 'block wrapped 3-part template to check disambiguation',
    tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI, $PUNCTUATOR],
  },
  {
    code: '`foo${{}}baz`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'ObjectExpression', properties: []}
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'object literal inside the tick expression',
    tokens: [$TICK_HEAD, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
  },
  {
    code: '`foo${{a,b}}baz`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'ObjectExpression', properties: [
            {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
            {type: 'Property', key: {type: 'Identifier', name: 'b'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'b'}},
          ]},
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'object literal with multiple shorthands inside the tick expression',
    tokens: [$TICK_HEAD, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $TICK_TAIL, $ASI],
  },
  {
    code: '`foo${`foo`}baz`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {
            type: 'TemplateLiteral',
            expressions: [],
            quasis: [
              {type: 'TemplateElement', tail: true, value: {raw: '`foo`', cooked: '<TODO>'}},
            ],
          },
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'head${expr}tail template',
    tokens: [$TICK_HEAD, $TICK_PURE, $TICK_TAIL, $ASI],
  },
  {
    code: '`foo${`foo${bar}baz`}baz`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {
            type: 'TemplateLiteral',
            expressions: [
              {type: 'Identifier', name: 'bar'},
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
            ],
          },
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'nested tick pairs',
    tokens: [$TICK_HEAD, $TICK_HEAD, $IDENT, $TICK_TAIL, $TICK_TAIL, $ASI],
  },
  {
    code: '{`foo ${a} and ${b} and ${`w ${d} x ${e} y ${f} z`} baz`}',
    ast: {type: 'Program', body: [
      {type: 'BlockStatement', body: [
        {type: 'ExpressionStatement', expression: {type: 'TemplateLiteral',
          expressions: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
            {type: 'TemplateLiteral',
              expressions: [
                {type: 'Identifier', name: 'd'},
                {type: 'Identifier', name: 'e'},
                {type: 'Identifier', name: 'f'},
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`w ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: false, value: {raw: '} x ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: false, value: {raw: '} y ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '} z`', cooked: '<TODO>'}},
              ],
            },
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
    ]},
    desc: 'block wrapped 3-part template to check disambiguation',
    tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $TICK_TAIL, $ASI, $PUNCTUATOR],
  },
  {
    code: '`a ${function(){}} b`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'FunctionExpression',
            generator: false,
            async: false,
            expression: true,
            id: null,
            params: [],
            body: {type: 'BlockStatement', body: []},
          },
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'function body disambiguation inside template',
    tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
  },
  {
    code: '`a ${()=>{}} b`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'ArrowFunctionExpression',
            params: [],
            id: null,
            generator: false,
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
    tokens: [$TICK_HEAD, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
  },
  {
    code: '`a ${(k)=>{x}} b`',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'ArrowFunctionExpression',
            params: [
              {type: 'Identifier', name: 'k'},
            ],
            id: null,
            generator: false,
            expression: false,
            body: {type: 'BlockStatement', body: [
              {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
            ]},
          },
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
        ],
      }},
    ]},
    desc: 'arrow with block body disambiguation inside template',
    tokens: [$TICK_HEAD, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $TICK_TAIL, $ASI],
  },
  // empty template `${}`
];

module.exports = templates;
