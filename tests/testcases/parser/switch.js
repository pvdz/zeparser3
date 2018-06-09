let {$IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('return statement', _ => {
    test('empty switch', {
      code: 'switch (foo) {}',
      ast: {
        type: 'Program',
        body: [{type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'foo'}, cases: []}],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('switch with a simple case', {
      code: 'switch (A) {case B: C;}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {type: 'Identifier', name: 'A'},
            cases: [
              {
                type: 'SwitchCase',
                test: {type: 'Identifier', name: 'B'},
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}}],
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('switch with a simple default', {
      code: 'switch (A) {default: B;}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {type: 'Identifier', name: 'A'},
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'B'}}],
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('switch with a simple case and default', {
      code: 'switch (A) {case B: C; default: D;}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {type: 'Identifier', name: 'A'},
            cases: [
              {
                type: 'SwitchCase',
                test: {type: 'Identifier', name: 'B'},
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}}],
              },
              {
                type: 'SwitchCase',
                test: null,
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'D'}}],
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('switch with a simple default and case', {
      code: 'switch (A) {default: D; case B: C; }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {type: 'Identifier', name: 'A'},
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'D'}}],
              },
              {
                type: 'SwitchCase',
                test: {type: 'Identifier', name: 'B'},
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}}],
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('switch with a two cases', {
      code: 'switch (A) {case B: C; case D: E;}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {type: 'Identifier', name: 'A'},
            cases: [
              {
                type: 'SwitchCase',
                test: {type: 'Identifier', name: 'B'},
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}}],
              },
              {
                type: 'SwitchCase',
                test: {type: 'Identifier', name: 'D'},
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'E'}}],
              },
            ],
          },
        ],
      },
      tokens: [
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('switch with a two cases', {
      code: 'switch (A) {case B: C; break; case D: E; break;}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {type: 'Identifier', name: 'A'},
            cases: [
              {
                type: 'SwitchCase',
                test: {type: 'Identifier', name: 'B'},
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}}, {type: 'BreakStatement', label: null}],
              },
              {
                type: 'SwitchCase',
                test: {type: 'Identifier', name: 'D'},
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'E'}}, {type: 'BreakStatement', label: null}],
              },
            ],
          },
        ],
      },
      tokens: [
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('switch with a simple default and break', {
      code: 'switch (A) {default: B; break;}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {type: 'Identifier', name: 'A'},
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'B'}}, {type: 'BreakStatement', label: null}],
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
  });
