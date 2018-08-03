let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('whitespace', _ => {

    test('regression; space token not skipped', {
      code: 'x + y',
      ast: true,
      tokens: true,
    });

    test('regression; u0009 token not skipped', {
      code: 'x\u0009+\u0009y',
      ast: true,
      tokens: true,
    });

    test('regression; u000B token not skipped', {
      code: 'x\u000B+\u000By',
      ast: true,
      tokens: true,
    });

    test('regression; u000C token not skipped', {
      code: 'x\u000C+\u000Cy',
      ast: true,
      tokens: true,
    });

    test('regression; u0020 token not skipped', {
      code: 'x\u0020+\u0020y',
      ast: true,
      tokens: true,
    });

    test('regression; u00A0 token not skipped', {
      code: 'x\u00A0+\u00A0y',
      ast: true,
      tokens: true,
    });

    test('regression; u000D token not skipped', {
      code: 'x\u000D+\u000Dy',
      ast: true,
      tokens: true,
    });

    test('regression; u000A token not skipped', {
      code: 'x\u000A+\u000Ay',
      ast: true,
      tokens: true,
    });

    test('regression; u2028 token not skipped', {
      code: 'x\u2028+\u2028y',
      ast: true,
      tokens: true,
    });

    test('regression; u2029 token not skipped', {
      code: 'x\u2029+\u2029y',
      ast: true,
      tokens: true,
    });
  });
