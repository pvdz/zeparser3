let {
  $ASI,
  $ERROR,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('other, unclassified cases', _ => {

  test('bad whitespace should not be ignored',{
    desc: 'from test262 7.4_A2_T2',
    code: `/*CHECK#1/`,
    throws: 'Tokenizer error',
    tokens: [$ERROR],
  });
});
