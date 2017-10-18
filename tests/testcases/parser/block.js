let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('block statement', _ => {

  test('empty block', {
    code: '{}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: []}]},
    tokens: [$PUNCTUATOR, $PUNCTUATOR],
  });

  test('block with debugger and semi', {
    code: '{debugger;}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
      {type: 'DebuggerStatement'},
    ]}]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('block with debugger and semi with newlines', {
    code: '{\n  debugger;\n}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
      {type: 'DebuggerStatement'},
    ]}]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('block with debugger and asi', {
    code: '{debugger}',
    ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
      {type: 'DebuggerStatement'},
    ]}]},
    tokens: [$PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
  });
});
