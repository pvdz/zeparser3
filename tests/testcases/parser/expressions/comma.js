let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $TICK_HEAD,
  $TICK_BODY,
  $TICK_TAIL,
  } = require('../../../../src/zetokenizer');

module.exports = (describe, test) => describe('comma', _ => {

  test('as a statement', {
    code: 'a,b',
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'SequenceExpression',
        expressions:[
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('as a return result', {
    code: 'function g(){ return a,b; }',
    ast: {type: 'Program', body: [{
      type: 'FunctionDeclaration',
      generator: false,
      async: false,
      expression: false,
      id: {type: 'Identifier', name: 'g'},
      params: [],
      body: {
        type: 'BlockStatement', body: [{
          type: 'ReturnStatement',
          argument: {
            type: 'SequenceExpression',
            expressions:[
              {type: 'Identifier', name: 'a'},
              {type: 'Identifier', name: 'b'},
            ],
          },
        }],
      },
    }]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('in an if header', {
    code: 'if (a,b) c;',
    ast: { type: 'Program', body: [{
      type: 'IfStatement',
      test: {
        type: 'SequenceExpression',
        expressions:[
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
      },
      consequent: {
        type: 'ExpressionStatement',
        expression: { type: 'Identifier', name: 'c' },
      },
      alternate: null,
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a while header', {
    code: 'while (a,b) c;',
    ast: { type: 'Program', body: [{
      type: 'WhileStatement',
      test: {
        type: 'SequenceExpression',
        expressions:[
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
      },
      body: {
        type: 'ExpressionStatement',
        expression: { type: 'Identifier', name: 'c' },
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a for-in header part 1', {
    code: 'for (a,b in c) d;',
    throws: 'Comma not allowed',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a for-in header part 2', {
    code: 'for (a in b,c) d;',
    ast: {type: 'Program', body: [{
      type: 'ForInStatement',
      left: {type: 'Identifier', name: 'a' },
      right: {
        type: 'SequenceExpression',
        expressions: [{
          type: 'Identifier', name: 'b'
        }, {
          type: 'Identifier', name: 'c'
        },
      ]},
      body: {
        type: 'ExpressionStatement',
        expression: {type: 'Identifier', name: 'd'},
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a for-each header part 1', {
    code: 'for (a,b;;) c;',
    ast:  { type: 'Program', body: [{
      type: 'ForStatement',
      init: {
        type: 'SequenceExpression',
        expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
      },
      test: null,
      update: null,
      body: {
        type: 'ExpressionStatement',
        expression: { type: 'Identifier', name: 'c' },
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a for-each header part 1', {
    code: 'for (;a,b;) c;',
    ast:  { type: 'Program', body: [{
      type: 'ForStatement',
      init: null,
      test: {
        type: 'SequenceExpression',
        expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
      },
      update: null,
      body: {
        type: 'ExpressionStatement',
        expression: { type: 'Identifier', name: 'c' },
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a for-each header part 1', {
    code: 'for (;;a,b) c;',
    ast:  { type: 'Program', body: [{
      type: 'ForStatement',
      init: null,
      test: null,
      update: {
        type: 'SequenceExpression',
        expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
      },
      body: {
        type: 'ExpressionStatement',
        expression: { type: 'Identifier', name: 'c' },
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a for-of header part 1', {
    code: 'for (a,b of c) d;',
    throws: 'Comma not allowed',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a for-of header part 1', {
    code: 'for (a of b,c) d;',
    ast: {type: 'Program', body: [{
      type: 'ForOfStatement',
      left: {type: 'Identifier', name: 'a' },
      right: {
        type: 'SequenceExpression',
        expressions: [{
          type: 'Identifier', name: 'b'
        }, {
          type: 'Identifier', name: 'c'
        },
        ]},
      body: {
        type: 'ExpressionStatement',
        expression: {type: 'Identifier', name: 'd'},
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('in a yield arg', {
    code: 'function *f(){ yield a,b; }',
    ast: { type: 'Program', body: [{
      type: 'FunctionDeclaration',
      generator: true,
      async: false,
      expression: false,
      id: { type: 'Identifier', name: 'f' },
      params: [],
      body: {type: 'BlockStatement', body: [{
        type: 'ExpressionStatement', expression: {
          type: 'YieldExpression',
          delegate: false,
          argument: {
            type: 'SequenceExpression',
            expressions: [
              {type: 'Identifier', name: 'a'},
              {type: 'Identifier', name: 'b'},
            ],
          },
        },
      }]},
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('in a group', {
    code: '(a,b)',
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'SequenceExpression',
        expressions:[
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
      },
    }]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    desc: 'group with comma can also turn out to be arrow params',
  });

  test('arrow header', {
    code: '(a,b) => c',
    ast: {type: 'Program', body: [{type: 'ExpressionStatement',
      expression: {
        type: 'ArrowFunctionExpression',
        params: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ],
        id: null,
        generator: false,
        async: false,
        expression: true,
        body: {type: 'Identifier', name: 'c'},
      },
    }]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    desc: '(redundant test to mirror the previous one) arrow header without arrow would still be a valid group in most cases',
  });

  test('in a do while body no asi', {
    code: 'do x, y while (z)',
    throws: 'Unable to ASI',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    desc: 'ASI does not apply (would require a newline or curly close) so the whole thing fails.',
  });

  test('in a do while body semi', {
    code: 'do x, y; while (z)',
    ast: {type: 'Program', body: [{
      type: 'DoWhileStatement',
      body: {
        type: 'ExpressionStatement',
        expression: {
          type: 'SequenceExpression',
          expressions: [
            {type: 'Identifier', name: 'x'},
            {type: 'Identifier', name: 'y'},
          ],
        },
      },
      test: {type: 'Identifier', name: 'z'},
    }]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    desc: 'The semi is required because ASI does not apply here',
  });

  test('in a do while footer', {
    code: 'do x; while (y, z)',
    ast: {type: 'Program', body: [{
      type: 'DoWhileStatement',
      body: {
        type: 'ExpressionStatement',
        expression: {type: 'Identifier', name: 'x'},
      },
      test: {
        type: 'SequenceExpression',
        expressions: [
          {type: 'Identifier', name: 'y'},
          {type: 'Identifier', name: 'z'},
        ],
      },
    }]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('in a switch', {
    code: 'switch (a,b){}',
    ast: { type: 'Program',
      body: [{
        type: 'SwitchStatement',
        discriminant: {
          type: 'SequenceExpression',
          expressions: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
          ],
        },
        cases: [],
      }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('in a case condition', {
    code: 'switch (a){ case b, c: d}',
    ast: {type: 'Program', body: [{
      type: 'SwitchStatement',
      discriminant: {type: 'Identifier', name: 'a'},
      cases: [{
        type: 'SwitchCase', test: {
          type: 'SequenceExpression',
          expressions: [{type: 'Identifier', name: 'b'}, {type: 'Identifier', name: 'c'}],
        },
        consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'd'}}],
      }],
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
  });

  test('in a case body', {
    code: 'switch (a){ case b: c,d}',
    ast: {type: 'Program', body: [{
      type: 'SwitchStatement',
      discriminant: {type: 'Identifier', name: 'a'},
      cases: [{
        type: 'SwitchCase', test: {type: 'Identifier', name: 'b'},
        consequent: [{type: 'ExpressionStatement', expression: {
          type: 'SequenceExpression',
          expressions: [{type: 'Identifier', name: 'c'}, {type: 'Identifier', name: 'd'}],
        }}],
      }],
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
  });

  test('in a default body', {
    code: 'switch (a){ default: c,d}',
    ast: {type: 'Program', body: [{
      type: 'SwitchStatement',
      discriminant: {type: 'Identifier', name: 'a'},
      cases: [{
        type: 'SwitchCase', test: null,
        consequent: [{type: 'ExpressionStatement', expression: {
          type: 'SequenceExpression',
          expressions: [{type: 'Identifier', name: 'c'}, {type: 'Identifier', name: 'd'}],
        }}],
      }],
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
  });

  test('(not) in an arrow as is', {
    code: '_ => a,b',
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'SequenceExpression',
        expressions: [{
          type: 'ArrowFunctionExpression',
          params: [{type: 'Identifier', name: '_'}],
          id: null,
          generator: false,
          async: false,
          expression: true,
          body: {type: 'Identifier', name: 'a'},
        }, {
          type: 'Identifier', name: 'b'
        }],
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('(not) in an arrow as args', {
    code: 'func(_ => a,b)',
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {type: 'Identifier', name: 'func'},
        arguments: [{
          type: 'ArrowFunctionExpression',
          params: [{type: 'Identifier', name: '_'}],
          id: null,
          generator: false,
          async: false,
          expression: true,
          body: {type: 'Identifier', name: 'a'},
        }, {
          type: 'Identifier', name: 'b'
        }],
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('in a template', {
    code: '`x${a,b}y`',
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'SequenceExpression', expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]},
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`x${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}y`', cooked: '<TODO>'}},
        ],
      },
    }]},
    tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
  });

  test('in a template part 1', {
    code: '`x${a,b}y`',
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'SequenceExpression', expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]},
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`x${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}y`', cooked: '<TODO>'}},
        ],
      },
    }]},
    tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
  });

  test('in a template part 2', {
    code: '`x${z} ${a,b}y`',
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'TemplateLiteral',
        expressions: [
          {type: 'Identifier', name: 'z'},
          {type: 'SequenceExpression', expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]},
        ],
        quasis: [
          {type: 'TemplateElement', tail: false, value: {raw: '`x${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: false, value: {raw: '} ${', cooked: '<TODO>'}},
          {type: 'TemplateElement', tail: true, value: {raw: '}y`', cooked: '<TODO>'}},
        ],
      },
    }]},
    tokens: [$TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
  });

  test('in a ternary left', {
    code: 'a, b ? c : d',
    ast: { type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'SequenceExpression',
        expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'ConditionalExpression',
            test: {type: 'Identifier', name: 'b'},
            consequent: { type: 'Identifier', name: 'c'},
            alternate: { type: 'Identifier', name: 'd'},
          },
        ],
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    desc: 'comma is stronger than ternary'
  });

  test('in a ternary mid', {
    code: 'a ? b, c : d',
    throws: 'comma inside ternary',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    desc: 'not allowed'
  });

  test('in a ternary right', {
    code: 'a ? b : c, d',
    ast: { type: 'Program', body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'SequenceExpression',
        expressions: [
          {type: 'ConditionalExpression',
            test: {type: 'Identifier', name: 'a'},
            consequent: { type: 'Identifier', name: 'b'},
            alternate: { type: 'Identifier', name: 'c'},
          },
          {type: 'Identifier', name: 'd'},
        ],
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    desc: 'comma is stronger than ternary'
  });

  test('in a label', {
    code: 'a: b, c',
    ast: {type: 'Program', body: [{
      type: 'LabeledStatement',
      label: {type: 'Identifier', name: 'a'},
      body: {
        type: 'ExpressionStatement',
        expression: {
          type: 'SequenceExpression',
          expressions: [{type: 'Identifier', name: 'b'}, { type: 'Identifier', name: 'c'}],
        },
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    desc: 'comma is stronger than ternary'
  });

  test('in a throw', {
    code: 'throw a,b',
    ast: { type: 'Program', body: [{
      type: 'ThrowStatement',
      argument: {
        type: 'SequenceExpression',
        expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
      },
    }]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    desc: 'comma is stronger than ternary'
  });

  test('in a with', {
    code: 'with (a,b) c;',
    throws: 'strict mode',
    SLOPPY_SCRIPT: {
      ast: { type: 'Program', body: [{
        type: 'WithStatement',
        object: {
          type: 'SequenceExpression',
          expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
        },
        body: {
          type: 'ExpressionStatement',
          expression: {type: 'Identifier', name: 'c'},
        },
      }]},
    },
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    desc: 'comma is stronger than ternary'
  });
});
