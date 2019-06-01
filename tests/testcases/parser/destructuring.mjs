// Note: most of the destructuring tests will belong to arrays, objects, or grouparrow test files
import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} from '../../../src/zetokenizer.mjs';

export default (describe, test) => describe('destructuring', _ => {

  describe('destructuring assignments of groups', _ => {

    test.pass('base case', {
      code: '[x] = obj',
    });

    describe('noop parens', _ => {

      test('base case', {
        code: '[(x)] = obj',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [{type: 'Identifier', name: 'x'}],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test.fail('assignability itself is not enough', {
        code: '[(x = y)] = obj',
        desc: 'a grouped assignment is not a "simple assignment target"'
      });

      test('properties are simple assignments', {
        code: '[(x.y)] = obj',
        desc: 'a grouped property is a "simple assignment target"',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'x'},
                      property: {type: 'Identifier', name: 'y'},
                      computed: false,
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('many paren base case', {
        code: '[((((((x))))))] = obj',
        desc: 'the number of parens is irrelevant',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [{type: 'Identifier', name: 'x'}],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test.fail('many paren assignability itself is not enough', {
        code: '[((((((x = y))))))] = obj',
      });

      test('many paren properties are simple assignments', {
        code: '[((((((x.y))))))] = obj',
        desc: 'this is why we cant use the "delete hack"',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'x'},
                      property: {type: 'Identifier', name: 'y'},
                      computed: false,
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });
    });
  });
});
