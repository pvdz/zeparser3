/** @format */
import {$PUNCTUATOR} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('empty statement', _ => {
    test('just a semi', {
      code: ';',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'EmptyStatement',
          },
        ],
      },
      tokens: [$PUNCTUATOR],
    });
    test('just a semi with an empty block', {
      code: '{};',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [],
          },
          {
            type: 'EmptyStatement',
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('just an empty block with a semi', {
      code: ';{}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'EmptyStatement',
          },
          {
            type: 'BlockStatement',
            body: [],
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
    test('just an empty statement inside a block', {
      code: '{;}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'EmptyStatement',
              },
            ],
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });
