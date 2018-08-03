let {$IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('debugger statement', _ => {
    test('debugger with semi', {
      code: 'foo: bar;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'LabeledStatement',
            label: {type: 'Identifier', name: 'foo'},
            body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('unicode escapes at the start of labels should not allow keywords', {
      code: 'async () => { \\u{61}wait: x }',
      throws: 'await',
    });

    test('unicode escapes in the middle of labels should not allow keywords', {
      code: 'async () => { aw\\u{61}it: x }',
      throws: 'await',
    });

    test('base case that passes without keyword', {
      code: 'foo: x;',
      ast: true,
      tokens: true,
    });

    [
      'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
      'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
      'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'true',
      'false', 'enum',
    ].forEach(keyword => {
      test('can not use keywords as label name [' + keyword + ']', {
        code: keyword + ': x;',
        throws: true,
      });
    });

      describe('regex edge cases', _ => {
      // foo:/bar/
      // foo:\n/bar/
      // foo:\n/bar/g
    });

    // TODO: label:functiondecl is explicitly considered a syntax error
    // TODO: labels must be "identifiers", which may not be reserved
    // await, yield, async, let, etc special keywords that once were valid labels (because sloppy mode)
  });
