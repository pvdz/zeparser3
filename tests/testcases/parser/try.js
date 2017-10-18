let {
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('try statement', _ => {

  test('empty try/catch',{
    code: 'try {} catch(e) {}',
    ast: {type: 'Program', body: [
      {type: 'TryStatement',
        block: {type: 'BlockStatement', body: []},
        handler: {type: 'CatchClause', param: {type: 'Identifier', name: 'e'}, body: {type: 'BlockStatement', body: []}},
        finalizer: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('empty try/finally',{
    code: 'try {} finally {}',
    ast: {type: 'Program', body: [
      {type: 'TryStatement',
        block: {type: 'BlockStatement', body: []},
        handler: null,
        finalizer: {type: 'BlockStatement', body: []},
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('empty try/catch/finally',{
    code: 'try {} catch(e) {} finally {}',
    ast: {type: 'Program', body: [
      {type: 'TryStatement',
        block: {type: 'BlockStatement', body: []},
        handler: {type: 'CatchClause', param: {type: 'Identifier', name: 'e'}, body: {type: 'BlockStatement', body: []}},
        finalizer: {type: 'BlockStatement', body: []},
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });
});
