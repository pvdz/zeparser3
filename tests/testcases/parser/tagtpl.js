// Tagged templates

let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('tagged templates', _ => {
    test('base case', {
      code: 'foo`bar`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {type: 'Identifier', name: 'foo'},
              quasi: {
                type: 'TemplateLiteral',
                expressions: [],
                quasis: [{type: 'TemplateElement', value: {raw: 'bar', cooked: '<TODO>'}, tail: true}],
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $TICK_PURE, $ASI],
    });

    test('on an object method', {
      code: 'a.foo`bar`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'foo'}, computed: false},
              quasi: {
                type: 'TemplateLiteral',
                expressions: [],
                quasis: [{type: 'TemplateElement', value: {raw: 'bar', cooked: '<TODO>'}, tail: true}],
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $TICK_PURE, $ASI],
    });

    test('template with multiple parts', {
      code: 'foo`x${a}y${b}z`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {type: 'Identifier', name: 'foo'},
              quasi: {
                type: 'TemplateLiteral',
                expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                quasis: [
                  {type: 'TemplateElement', value: {raw: 'x', cooked: '<TODO>'}, tail: false},
                  {type: 'TemplateElement', value: {raw: 'y', cooked: '<TODO>'}, tail: false},
                  {type: 'TemplateElement', value: {raw: 'z', cooked: '<TODO>'}, tail: true},
                ],
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI],
    });

    test('cooked should process escapes etc', {
      code: 'foo`H\\x45Y`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TaggedTemplateExpression',
              tag: {type: 'Identifier', name: 'foo'},
              quasi: {
                type: 'TemplateLiteral',
                expressions: [],
                quasis: [{type: 'TemplateElement', value: {raw: 'H\\x45Y', cooked: '<TODO>'}, tail: true}],
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $TICK_PURE, $ASI],
    });
  });
