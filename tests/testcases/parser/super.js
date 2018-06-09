let {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('super keyword', _ => {
    // (note: super can only appear in class constructor syntax)
    //test('as a statement', {
    //  code: 'super',
    //  ast: {},
    //  tokens: [],
    //});
    //
    //test('as an expression', {
    //  code: 'super',
    //  ast: {},
    //  tokens: [],
    //});
    //test('regex test bad', {
    //  code: 'super\n/foo/;',
    //  ast: {},
    //  desc: 'ASI cannot apply so this must be a division and it will fail',
    //  tokens: [],
    //});
    //
    //test('regex test good', {
    //  code: 'super\n/foo/g;',
    //  ast: {},
    //  desc: 'ASI cannot apply so this must be a division which passes because of the `g` "flag"; this is `(super/foo)/g`',
    //  tokens: [],
    //});
  });
