let {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('templates', _ => {
    test('pure template', {
      code: '`foo`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [],
              quasis: [{type: 'TemplateElement', tail: true, value: {raw: '`foo`', cooked: '<TODO>'}}],
            },
          },
        ],
      },
      tokens: [$TICK_PURE, $ASI],
    });

    test('head${expr}tail template', {
      code: '`foo${bar}baz`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [{type: 'Identifier', name: 'bar'}],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $TICK_TAIL, $ASI],
    });

    test('template with multiple middle pieces', {
      code: '`foo ${a} and ${b} and ${c} baz`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}, {type: 'Identifier', name: 'c'}],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI],
    });

    test('block wrapped 1-part template to check disambiguation', {
      code: '{`foo baz`}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [{type: 'TemplateElement', tail: true, value: {raw: '`foo baz`', cooked: '<TODO>'}}],
                },
              },
            ],
          },
        ],
      },
      tokens: [$PUNCTUATOR, $TICK_PURE, $ASI, $PUNCTUATOR],
    });

    test('block wrapped 2-part template to check disambiguation', {
      code: '{`foo ${a} baz`}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [{type: 'Identifier', name: 'a'}],
                  quasis: [
                    {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
                    {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
                  ],
                },
              },
            ],
          },
        ],
      },
      tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_TAIL, $ASI, $PUNCTUATOR],
    });

    test('block wrapped 3-part template to check disambiguation', {
      code: '{`foo ${a} and ${b} and ${c} baz`}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}, {type: 'Identifier', name: 'c'}],
                  quasis: [
                    {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
                    {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
                    {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
                    {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
                  ],
                },
              },
            ],
          },
        ],
      },
      tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI, $PUNCTUATOR],
    });

    test('object literal inside the tick expression', {
      code: '`foo${{}}baz`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [{type: 'ObjectExpression', properties: []}],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    test('object literal without destruct with multiple shorthands inside the tick expression', {
      code: '`foo${{a,b}}baz`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'a'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'a'},
                      shorthand: true,
                    },
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'b'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'b'},
                      shorthand: true,
                    },
                  ],
                },
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  tail: false,
                  value: {raw: '`foo${', cooked: '<TODO>'},
                },
                {
                  type: 'TemplateElement',
                  tail: true,
                  value: {raw: '}baz`', cooked: '<TODO>'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    test('object literal that destructs with multiple shorthands inside the tick expression', {
      code: '`foo${{a,b} = x}baz`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 'a'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Identifier', name: 'a'},
                        shorthand: true,
                      },
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 'b'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Identifier', name: 'b'},
                        shorthand: true,
                      },
                    ],
                  },
                  operator: '=',
                  right: {type: 'Identifier', name: 'x'},
                },
              ],
              quasis: [
                {
                  type: 'TemplateElement',
                  tail: false,
                  value: {raw: '`foo${', cooked: '<TODO>'},
                },
                {
                  type: 'TemplateElement',
                  tail: true,
                  value: {raw: '}baz`', cooked: '<TODO>'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
    });

    test('head${expr}tail template', {
      code: '`foo${`foo`}baz`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [{type: 'TemplateElement', tail: true, value: {raw: '`foo`', cooked: '<TODO>'}}],
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $TICK_PURE, $TICK_TAIL, $ASI],
    });

    test('nested tick pairs', {
      code: '`foo${`foo${bar}baz`}baz`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'TemplateLiteral',
                  expressions: [{type: 'Identifier', name: 'bar'}],
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
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $TICK_HEAD, $IDENT, $TICK_TAIL, $TICK_TAIL, $ASI],
    });

    test('block wrapped 3-part template to check disambiguation', {
      code: '{`foo ${a} and ${b} and ${`w ${d} x ${e} y ${f} z`} baz`}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [
                    {type: 'Identifier', name: 'a'},
                    {type: 'Identifier', name: 'b'},
                    {
                      type: 'TemplateLiteral',
                      expressions: [{type: 'Identifier', name: 'd'}, {type: 'Identifier', name: 'e'}, {type: 'Identifier', name: 'f'}],
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
                },
              },
            ],
          },
        ],
      },
      tokens: [
        $PUNCTUATOR,
        $TICK_HEAD,
        $IDENT,
        $TICK_BODY,
        $IDENT,
        $TICK_BODY,
        $TICK_HEAD,
        $IDENT,
        $TICK_BODY,
        $IDENT,
        $TICK_BODY,
        $IDENT,
        $TICK_TAIL,
        $TICK_TAIL,
        $ASI,
        $PUNCTUATOR,
      ],
    });

    test('function body disambiguation inside template', {
      code: '`a ${function(){}} b`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'FunctionExpression',
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
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    test('empty arrow with block body disambiguation inside template', {
      code: '`a ${()=>{}} b`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [],
                  id: null,
                  generator: false,
                  async: false,
                  expression: false,
                  body: {type: 'BlockStatement', body: []},
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    test('arrow with block body disambiguation inside template', {
      code: '`a ${(k)=>{x}} b`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'k'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: false,
                  body: {
                    type: 'BlockStatement',
                    body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}}],
                  },
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    describe('bad escapes', _ => {

      // https://tc39.github.io/ecma262/#prod-CodePoint
      // "A conforming implementation must not use the extended definition of EscapeSequence described in B.1.2 when parsing a TemplateCharacter."
      // (these can be extended for string but should always be errors for non-tagged templates)

      test.pass('octal zero is ok, even in strict mode', {
        code: '`a\\0b`',
      });

      test.fail('octal at start', {
        code: '`\\00`',
      });

      test.fail('octal double zero in template is always illegal', {
        code: '`a\\00b`',
      });

      describe('in pure', _ => {

        describe('still bad in regular templates', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: '`\\xg`;',
            ES: 8,
          });

          test.fail('check illegal escapes in infinity mode', {
            code: '`\\xg`;',
            ES: Infinity,
          });

          test.fail('illegal escapes in ticks are still bad in es9', {
            code: '`\\xg`;',
            ES: 9,
          });
        });

        describe('only okay in tagged templates in es9', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: 'f`\\xg`;',
            ES: 8,
          });

          test.pass('check illegal escapes in infinity mode', {
            code: 'f`\\xg`;',
            ES: Infinity,
          });

          test.pass('illegal escapes in ticks are okay in es9', {
            code: 'f`\\xg`;',
            ES: 9,
          });
        });
      });

      describe('in head', _ => {

        describe('still bad in regular templates', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: '`\\xg ${x}`;',
            ES: 8,
          });

          test.fail('check illegal escapes in infinity mode', {
            code: '`\\xg ${x}`;',
            ES: Infinity,
          });

          test.fail('illegal escapes in ticks are still bad in es9', {
            code: '`\\xg ${x}`;',
            ES: 9,
          });
        });

        describe('only okay in tagged templates in es9', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: 'f`\\xg ${x}`;',
            ES: 8,
          });

          test.pass('check illegal escapes in infinity mode', {
            code: 'f`\\xg ${x}`;',
            ES: Infinity,
          });

          test.pass('illegal escapes in ticks are okay in es9', {
            code: 'f`\\xg ${x}`;',
            ES: 9,
          });
        });
      });

      describe('in body', _ => {

        describe('still bad in regular templates', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: '`${x} \\xg ${x}`;',
            ES: 8,
          });

          test.fail('check illegal escapes in infinity mode', {
            code: '`${x} \\xg ${x}`;',
            ES: Infinity,
          });

          test.fail('illegal escapes in ticks are still bad in es9', {
            code: '`${x} \\xg ${x}`;',
            ES: 9,
          });
        });

        describe('only okay in tagged templates in es9', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: 'f`${x} \\xg ${x}`;',
            ES: 8,
          });

          test.pass('check illegal escapes in infinity mode', {
            code: 'f`${x} \\xg ${x}`;',
            ES: Infinity,
          });

          test.pass('illegal escapes in ticks are okay in es9', {
            code: 'f`${x} \\xg ${x}`;',
            ES: 9,
          });
        });
      });
      describe('in tail', _ => {

        describe('still bad in regular templates', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: '`${x} \\xg`;',
            ES: 8,
          });

          test.fail('check illegal escapes in infinity mode', {
            code: '`${x} \\xg`;',
            ES: Infinity,
          });

          test.fail('illegal escapes in ticks are still bad in es9', {
            code: '`${x} \\xg`;',
            ES: 9,
          });
        });

        describe('only okay in tagged templates in es9', _ => {

          test.fail('illegal escapes are an error < es9', {
            code: 'f`${x} \\xg`;',
            ES: 8,
          });

          test.pass('check illegal escapes in infinity mode', {
            code: 'f`${x} \\xg`;',
            ES: Infinity,
          });

          test.pass('illegal escapes in ticks are okay in es9', {
            code: 'f`${x} \\xg`;',
            ES: 9,
          });
        });
      });
    });

    // empty template `${}`
  });
