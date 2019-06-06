/**
 * @generated This file is auto-regenerated by the test runner, and auto-formatted by Prettier
 * @format
 **/
import {
  $ASI,
  $COMMENT,
  $COMMENT_HTML,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $CRLF,
  $EOF,
  $ERROR,
  $IDENT,
  $NL,
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
  $TICK_BAD_ESCAPE,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
  $WHITE,
} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('bitwise', _ => {
    test('bin or 1', {
      code: 'a|b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '|',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('bin &', {
      code: 'a&b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '&',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('bin or 2', {
      code: 'a^b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '^',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('una ~', {
      code: '~a',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '~',
              prefix: true,
              argument: {
                type: 'Identifier',
                name: 'a',
              },
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    });
    test('rel <<', {
      code: 'a<<b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '<<',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('rel >>', {
      code: 'a>>b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '>>',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('rel >>>', {
      code: 'a>>>b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '>>>',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });
