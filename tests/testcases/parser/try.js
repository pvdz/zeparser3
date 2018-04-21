let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  $REGEX,
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

  describe('catch arg', _ => {

    test('no arg', {
      code: 'try {} catch(){}',
      throws: 'Missing catch clause',
      tokens: [],
    });

    test('plain ident', {
      code: 'try {} catch(e){}',
      ast: { type: 'Program',
        body:
          [ { type: 'TryStatement',
            block: { type: 'BlockStatement', body: [] },
            handler:
            { type: 'CatchClause',
              param: { type: 'Identifier', name: 'e' },
              body: { type: 'BlockStatement', body: [] } },
            finalizer: null } ] },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('dobule arg', {
      code: 'try {} catch(e, f){}',
      throws: 'exactly one parameter',
      tokens: [],
    });

    test('simple object destruct', {
      code: 'try {} catch({e}){}',
      ast: { type: 'Program',
        body:
          [ { type: 'TryStatement',
            block: { type: 'BlockStatement', body: [] },
            handler:
            { type: 'CatchClause',
              param:
              { type: 'ObjectPattern',
                properties:
                  [ { type: 'Property',
                    computed: false,
                    kind: 'init',
                    method: false,
                    shorthand: false,
                    key: { type: 'Identifier', name: 'e' },
                    value: { type: 'Identifier', name: 'e' } } ] },
              body: { type: 'BlockStatement', body: [] } },
            finalizer: null } ] },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('simple array destruct', {
      code: 'try {} catch([e]){}',
      ast: { type: 'Program',
        body:
          [ { type: 'TryStatement',
            block: { type: 'BlockStatement', body: [] },
            handler:
            { type: 'CatchClause',
              param:
              { type: 'ArrayPattern',
                elements: [ { type: 'Identifier', name: 'e' } ] },
              body: { type: 'BlockStatement', body: [] } },
            finalizer: null } ] },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('ident with trailing comma', {
      code: 'try {} catch(e,){}',
      throws: 'exactly one parameter',
      tokens: [],
    });

    test('object with trailing comma', {
      code: 'try {} catch({e},){}',
      throws: 'exactly one parameter',
      tokens: [],
    });

    test('array with trailing comma', {
      code: 'try {} catch([e],){}',
      throws: 'exactly one parameter',
      tokens: [],
    });

    test('ident with default', {
      code: 'try {} catch(e=x){}',
      throws: 'not support default',
      tokens: [],
    });

    test('object with default', {
      code: 'try {} catch({e}=x){}',
      throws: 'not support default',
      tokens: [],
    });

    test('array with default', {
      code: 'try {} catch([e]=x){}',
      throws: 'not support default',
      tokens: [],
    });
  });

  describe('regex edge case', _ => {

    describe('catch', _ => {

      test('division', {
        code: 'try {} catch (e) {}\n/foo',
        throws: 'Unexpected token: ERROR',
        desc: 'try (/catch/finally) is a statement (not a value) so division is illegal',
        tokens: [],
      });

      test('sans flag', {
        code: 'try {} catch (e) {}\n/foo/',
        ast: { type: 'Program',
          body:
            [ { type: 'TryStatement',
              block: { type: 'BlockStatement', body: [] },
              handler:
              { type: 'CatchClause',
                param: { type: 'Identifier', name: 'e' },
                body: { type: 'BlockStatement', body: [] } },
              finalizer: null },
              { type: 'ExpressionStatement',
                expression: { type: 'Literal', value: '<TODO>', raw: '/foo/' } } ] },
        desc: 'no ASI is attempted because the catch does not expect a semi so this is fine',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
      });

      test('sans flag', {
        code: 'try {} catch (e) {}\n/foo/g',
        ast: { type: 'Program',
          body:
            [ { type: 'TryStatement',
              block: { type: 'BlockStatement', body: [] },
              handler:
              { type: 'CatchClause',
                param: { type: 'Identifier', name: 'e' },
                body: { type: 'BlockStatement', body: [] } },
              finalizer: null },
              { type: 'ExpressionStatement',
                expression: { type: 'Literal', value: '<TODO>', raw: '/foo/g' } } ] },
        desc: 'no ASI is attempted because the catch does not expect a semi so this is fine',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
      });
    });

    describe('finally', _ => {

      test('sans flag', {
        code: 'try {} finally {}\n/foo',
        throws: 'Unexpected token: ERROR',
        desc: 'no ASI is attempted because the finally does not expect a semi so this is fine',
        tokens: [],
      });

      test('sans flag', {
        code: 'try {} finally {}\n/foo/',
        ast: { type: 'Program',
          body:
            [ { type: 'TryStatement',
              block: { type: 'BlockStatement', body: [] },
              handler: null,
              finalizer: { type: 'BlockStatement', body: [] } },
              { type: 'ExpressionStatement',
                expression: { type: 'Literal', value: '<TODO>', raw: '/foo/' } } ] },
        desc: 'no ASI is attempted because the finally does not expect a semi so this is fine',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
      });

      test('sans flag', {
        code: 'try {} finally {}\n/foo/g',
        ast: { type: 'Program',
          body:
            [ { type: 'TryStatement',
              block: { type: 'BlockStatement', body: [] },
              handler: null,
              finalizer: { type: 'BlockStatement', body: [] } },
              { type: 'ExpressionStatement',
                expression: { type: 'Literal', value: '<TODO>', raw: '/foo/g' } } ] },
        desc: 'no ASI is attempted because the finally does not expect a semi so this is fine',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
      });
    });
  })
});

// catch clause var(s) cannot already be bound
