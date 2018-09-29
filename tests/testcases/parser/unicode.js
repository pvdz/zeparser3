let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>describe('unicode', _ => {

  describe('unicode escape canon checks', _ => {

    describe('start of ident', _ => {

      test.pass('quad letter with 2 digits', {
        code: '\\u0062PASS',
        callback(ast, tokens) {
          return JSON.stringify(tokens[0]).includes('bPASS');
        },
      });

      test.pass('quad letter with 3 digits', {
        code: '\\u0187PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+0187 (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('\u0187PASS');
        },
      });

      test.pass('quad letter with 4 digits', {
        code: '\\u13ACPASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+13AC (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('\u13ACPASS');
        },
      });

      test.fail('quad number with 2 digits', {
        code: '\\u0035PASS', // decimal number
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('5PASS');
        },
      });

      test.fail('quad number with 3 digits (auto-fails under node<10)', {
        code: '\\u0B6EPASS', // https://codepoints.net/U+0B6E (decimal number)
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('\u0B6EPASS');
        },
      });

      test.fail('quad number with 4 digits', {
        code: '\\u194APASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+194A (decimal number)
          return JSON.stringify(tokens[0]).includes('\u194APASS');
        },
      });

      test.pass('vary letter with 2 digits', {
        code: '\\u{62}PASS',
        callback(ast, tokens) {
          return JSON.stringify(tokens[0]).includes('bPASS');
        },
      });

      test.pass('vary letter with 3 digits', {
        code: '\\u{187}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+0187 (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('\u0187PASS');
        },
      });

      test.pass('vary letter with 4 digits', {
        code: '\\u{13AC}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+13AC (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('\u13ACPASS');
        },
      });

      test.pass('vary letter with 5 digits', {
        code: '\\u{1D481}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+1D481 (valid id start and continue)
          console.log(tokens[0])
          return JSON.stringify(tokens[0]).includes('\u{1D481}PASS');
        },
      });

      test.fail('vary number with 2 digits', {
        code: '\\u{35}PASS', // decimal number
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('5PASS');
        },
      });

      test.fail('vary number with 3 digits', {
        code: '\\u{B6E}PASS', // https://codepoints.net/U+0B6E (decimal number)
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('\u0B6EPASS');
        },
      });

      test.fail('vary number with 4 digits', {
        code: '\\u{194A}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+194A (decimal number)
          return JSON.stringify(tokens[0]).includes('\u194APASS');
        },
      });

      test.fail('vary number with 5 digits', {
        code: '\\u{16B55}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+16B55 (decimal number)
          return JSON.stringify(tokens[0]).includes('\u{16B55}PASS');
        },
      });



    });

    describe('middle of ident', _ => {

      test.pass('quad letter with 2 digits', {
        code: 'PASS\\u0062PASS',
        callback(ast, tokens) {
          return JSON.stringify(tokens[0]).includes('PASSbPASS');
        },
      });

      test.pass('quad letter with 3 digits', {
        code: 'PASS\\u0187PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+0187 (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('PASS\u0187PASS');
        },
      });

      test.pass('quad letter with 4 digits', {
        code: 'PASS\\u13ACPASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+13AC (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('PASS\u13ACPASS');
        },
      });

      test.pass('quad number with 2 digits', {
        code: 'PASS\\u0035PASS', // decimal number
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('PASS5PASS');
        },
      });

      test.pass('quad number with 3 digits (auto-fails under node<10)', {
        code: 'PASS\\u0B6EPASS', // https://codepoints.net/U+0B6E (decimal number)
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('PASS\u0B6EPASS');
        },
      });

      test.pass('quad number with 4 digits', {
        code: 'PASS\\u194APASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+194A (decimal number)
          return JSON.stringify(tokens[0]).includes('PASS\u194APASS');
        },
      });

      test.fail('quad math with 2 digits', {
        code: 'PASS\\u002BPASS', // decimal number
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('PASS+PASS');
        },
      });

      test.fail('quad math with 3 digits', {
        code: 'PASS\\u058DPASS', // https://codepoints.net/U+058D (math)
        callback(ast, tokens, astJson) {
          console.log('token = ', tokens[0])
          return JSON.stringify(tokens[0]).includes('PASS\u058DPASS');
        },
      });

      test.fail('quad math with 4 digits', {
        code: 'PASS\\u2213PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+2213 (math)
          return JSON.stringify(tokens[0]).includes('PASS\u2213PASS');
        },
      });

      test.fail('invalid ident escape should trigger error', {
        code:'var a\\u2E2F',
      });

      test.pass('vary letter with 2 digits', {
        code: 'PASS\\u{62}PASS',
        callback(ast, tokens) {
          return JSON.stringify(tokens[0]).includes('PASSbPASS');
        },
      });

      test.pass('vary letter with 3 digits', {
        code: 'PASS\\u{187}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+0187 (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('PASS\u0187PASS');
        },
      });

      test.pass('vary letter with 4 digits', {
        code: 'PASS\\u{13AC}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+13AC (valid id start and continue)
          return JSON.stringify(tokens[0]).includes('PASS\u13ACPASS');
        },
      });

      test.pass('vary letter with 5 digits', {
        code: 'PASS\\u{1D481}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+1D481 (valid id start and continue)
          console.log(tokens[0])
          return JSON.stringify(tokens[0]).includes('PASS\u{1D481}PASS');
        },
      });

      test.pass('vary number with 2 digits', {
        code: 'PASS\\u{35}PASS', // decimal number
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('PASS5PASS');
        },
      });

      test.pass('vary number with 3 digits', {
        code: 'PASS\\u{B6E}PASS', // https://codepoints.net/U+0B6E (decimal number)
        callback(ast, tokens, astJson) {
          return JSON.stringify(tokens[0]).includes('PASS\u0B6EPASS');
        },
      });

      test.pass('vary number with 4 digits', {
        code: 'PASS\\u{194A}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+194A (decimal number)
          return JSON.stringify(tokens[0]).includes('PASS\u194APASS');
        },
      });

      test.pass('vary number with 5 digits', {
        code: 'PASS\\u{16B55}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+16B55 (decimal number)
          return JSON.stringify(tokens[0]).includes('PASS\u{16B55}PASS');
        },
      });

      test.fail('vary math with 2 digits', {
        code: 'PASS\\u{2B}PASS',
        callback(ast, tokens) {
          return JSON.stringify(tokens[0]).includes('PASS+PASS');
        },
      });

      test.fail('vary math with 3 digits', {
        code: 'PASS\\u{58D}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+058D (math)
          return JSON.stringify(tokens[0]).includes('PASS\u058DPASS');
        },
      });

      test.fail('vary math with 4 digits', {
        code: 'PASS\\u{2213}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+2213 (math)
          return JSON.stringify(tokens[0]).includes('PASS\u2213PASS');
        },
      });

      test.fail('vary math with 5 digits', {
        code: 'PASS\\u{1D7A9}PASS',
        callback(ast, tokens, astJson) { // https://codepoints.net/U+1D7A9 (math)
          console.log(tokens[0])
          return JSON.stringify(tokens[0]).includes('PASS\u{1D7A9}PASS');
        },
      });
    });
  });

  describe('double byte chars', _ => {

    const SINGLE = '\u00AA'; // "FEMININE ORDINAL INDICATOR" https://codepoints.net/U+00AA

    test.pass('identifier that is a higher unicode char', {
      code: SINGLE + '();',
    });

    test.pass('identifier starting with a higher unicode char', {
      code: SINGLE + 'foo();',
    });

    test.pass('identifier that contains a higher unicode char', {
      code: 'fo' + SINGLE + 'o();',
    });

    test.pass('identifier that ends with a higher unicode char', {
      code: 'foo' + SINGLE + '();',
    });

    test.pass('named group with unicode escape', {
      code: 'f(/(?<\\u0041>.)/);',
    });

    test.pass('named group with unicode escape', {
      code: 'f(/(?<\\u00AA>.)/);',
    });
  });

  describe('double byte chars', _ => {

    const DOUBLE = '\u03B2'; // "GREEK SMALL LETTER BETA" https://codepoints.net/U+03B2

    test.pass('identifier that is a higher unicode char', {
      code: DOUBLE + '();',
    });

    test.pass('identifier starting with a higher unicode char', {
      code: DOUBLE + 'foo();',
    });

    test.pass('identifier that contains a higher unicode char', {
      code: 'fo' + DOUBLE + 'o();',
    });

    test.pass('identifier that ends with a higher unicode char', {
      code: 'foo' + DOUBLE + '();',
    });

    test.pass('named group with unicode escape', {
      code: 'f(/(?<\\u03B2>.)/);',
    });
  });

  describe('quad byte chars', _ => {

    const QUAD = '\uD801\uDD1E'; // "ELBASAN LETTER THE" https://codepoints.net/U+1051E

    test.pass('identifier that is a higher unicode char', {
      code: QUAD + '();',
    });

    test.pass('identifier starting with a higher unicode char', {
      code: QUAD + 'foo();',
    });

    test.pass('identifier that contains a higher unicode char', {
      code: 'fo' + QUAD + 'o();',
    });

    test.pass('identifier that ends with a higher unicode char', {
      code: 'foo' + QUAD + '();',
    });

    test.pass('named group with surrogate pair unicode escape', {
      code: 'f(/(?<\\uD801\\uDD1E>.)/u);',
      desc: 'this one is evil...',
    });

    test.fail('surrogate pair that is ID_Continue should fail at start', {
      code: 'f(/(?<\\uD801\\uDCA4>.)/u)',
    });

    test.pass('surrogate pair that is ID_Continue should pass in mid', {
      code: 'f(/(?<before\\uD801\\uDCA4>.)/u)',
    });

    test.pass('char class with surrogate pair unicode escape', {
      code: 'f(/[\\uD801\\uDD1E]/u);',
    });

    // assert.throws(SyntaxError, () => eval("/(?<a\\\\uD801>.)/u"), "\\\\u Lea");
    // assert.throws(SyntaxError, () => eval("/(?<a\\\\uDCA4>.)/u"), "\\\\u Trai");
    // assert(/(?<\\u0041>.)/u.test("a"), "\\\\u NonSurrogate");
    // assert(/(?<\\u{0041}>.)/u.test("a"), "\\\\u{ Non-surrogate }");
    // assert(/(?<a\\u{104A4}>.)/u.test("a"), "\\\\u{ Surrogate, ID_Continue }");
    // assert.throws(SyntaxError, () => eval("/(?<a\\\\u{110000}>.)/u"), "\\\\u{ Out-of-bounds ");
    // assert.throws(SyntaxError, () => eval("/(?<a\\uD801>.)/u"), "Lea");
    // assert.throws(SyntaxError, () => eval("/(?<a\\uDCA4>.)/u"), "Trai");
    // assert(RegExp("(?<\\u{0041}>.)", "u").test("a"), "Non-surrogate");
    // assert(RegExp("(?<a\\u{104A4}>.)", "u").test("a"), "Surrogate,ID_Continue");

// // Bracketed escapes are not allowed;
// // 4-char escapes must be the proper ID_Start/ID_Continue
//     assert.throws(SyntaxError, () => eval("/(?<a\\\\uD801>.)/u"), "Lead");
//     assert.throws(SyntaxError, () => eval("/(?<a\\\\uDCA4>.)/u"), "Trail");
//     assert((/(?<\\u{0041}>.)/u).test("a"), "Non-surrogate");
//     assert(/(?<a\\u{104A4}>.)/u.test("a"), "Surrogate, ID_Continue");
//     assert(RegExp("(?<\\\\u0041>.)", "u").test("a"), "Non-surrogate");
//
// // Backslash is not allowed as ID_Start and ID_Continue
//     assert.throws(SyntaxError, () => eval("/(?<\\\\>.)/u"), "'\\' misclassified as ID_Start");
//     assert.throws(SyntaxError, () => eval("/(?<a\\\\>.)/u"), "'\\' misclassified as ID_Continue");
  });
});
