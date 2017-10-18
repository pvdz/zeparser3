let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('continue statement', _ => {

  test('continue at eof (without label, with semi)',{
    code: 'continue;',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: null}]},
    tokens: [$IDENT, $PUNCTUATOR],
  });

  test('continue at eof (without label, without semi)',{
    code: 'continue',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: null}]},
    tokens: [$IDENT, $ASI],
  });

  test('continue at eof (with label, with semi)',{
    code: 'continue foo;',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}}]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  });

  test('continue at eof (with label, without semi)',{
    code: 'continue foo',
    ast: {type: 'Program', body: [{type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}}]},
    tokens: [$IDENT, $IDENT, $ASI],
  });

  test('double continue',{
    code: 'continue; continue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: null},
      {type: 'ContinueStatement', label: null},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('double continue with asi',{
    code: 'continue\ncontinue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: null},
      {type: 'ContinueStatement', label: null},
    ]},
    tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
  });

  test('double continue with label and semi',{
    code: 'continue foo;continue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'ContinueStatement', label: null},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('double continue with label and asi',{
    code: 'continue foo\ncontinue;',
    ast: {type: 'Program', body: [
      {type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'ContinueStatement', label: null},
    ]},
    tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR],
  });
});
