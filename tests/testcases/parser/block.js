let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  $REGEX,
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

  describe('regex edge case', _ => {

    test('sans flag', {
      code: '{}\n/foo/',
      ast: { type: 'Program',
        body:
          [ { type: 'BlockStatement', body: [] },
            { type: 'ExpressionStatement',
              expression: { type: 'Literal', value: '<TODO>', raw: '/foo/' } } ] },
      desc: 'no ASI is attempted because the block does not expect a semi so this is fine',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
    });

    test('sans flag', {
      code: '{}\n/foo/g',
      ast: { type: 'Program',
        body:
          [ { type: 'BlockStatement', body: [] },
            { type: 'ExpressionStatement',
              expression: { type: 'Literal', value: '<TODO>', raw: '/foo/g' } } ] },
      desc: 'no ASI is attempted because the block does not expect a semi so this is fine',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
    });
  });
});
