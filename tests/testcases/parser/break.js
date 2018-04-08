let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');

module.exports = (describe, test) => describe('break statement', _ => {

  test('break at eof (without label, with semi)',{
    code: 'break;',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: null}]},
    tokens: [$IDENT, $PUNCTUATOR],
  });

  test('break at eof (without label, without semi)',{
    code: 'break',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: null}]},
    tokens: [$IDENT, $ASI],
  });

  test('break at eof (with label, with semi)',{
    code: 'break foo;',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}}]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  });

  test('break at eof (with label, without semi)',{
    code: 'break foo',
    ast: {type: 'Program', body: [{type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}}]},
    tokens: [$IDENT, $IDENT, $ASI],
  });

  test('double break',{
    code: 'break; break;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: null},
      {type: 'BreakStatement', label: null},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('double break with asi',{
    code: 'break\nbreak;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: null},
      {type: 'BreakStatement', label: null},
    ]},
    tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
  });

  test('double break with label and semi',{
    code: 'break foo;break;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'BreakStatement', label: null},
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  test('double break with label and asi',{
    code: 'break foo\nbreak;',
    ast: {type: 'Program', body: [
      {type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}},
      {type: 'BreakStatement', label: null},
    ]},
    tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR],
  });
});

// break sans loop (with label)
