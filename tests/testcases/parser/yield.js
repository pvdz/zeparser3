let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $TICK_HEAD,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');

module.exports = (describe, test) => describe('yield', _ => {

  describe('as a statement', _ => {

    test('sans arg', {
      code: 'yield',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'YieldExpression',
          delegate: false,
          argument: null,
        }},
      ]},
      tokens: [$IDENT, $ASI],
    });

    test('with arg', {
      code: 'yield x',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'YieldExpression',
          delegate: false,
          argument: {type: 'Identifier', name: 'x'},
        }},
      ]},
      tokens: [$IDENT, $IDENT, $ASI],
    });

    test('complex arg', {
      code: 'yield x + y',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'YieldExpression',
          delegate: false,
          argument: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'x'},
            operator: '+',
            right: {type: 'Identifier', name: 'y'},
          },
        }},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });

  describe('in an expression', _ => {

    test('sans args', {
      code: '5 + yield',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Literal', value: '<TODO>', raw: '5'},
          operator: '+',
          right: {type: 'YieldExpression',
            delegate: false,
            argument: null,
          },
        }},
      ]},
      tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('with args', {
      code: '5 + yield x',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Literal', value: '<TODO>', raw: '5'},
          operator: '+',
          right: {type: 'YieldExpression',
            delegate: false,
            argument: {type: 'Identifier', name: 'x'},
          },
        }},
      ]},
      tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
    });

    test('with complex args', {
      code: '5 + yield x + y',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Literal', value: '<TODO>', raw: '5'},
          operator: '+',
          right: {type: 'YieldExpression',
            delegate: false,
            argument: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'x'},
              operator: '+',
              right: {type: 'Identifier', name: 'y'},
            },
          },
        }},
      ]},
      tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });

  describe('inside a call', _ => {

    test('sans args', {
      code: 'call(yield)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression',
          callee: {type: 'Identifier', name: 'call'},
          arguments: [{type: 'YieldExpression',
            delegate: false,
            argument: null,
          }],
        }},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('with args', {
      code: 'call(yield x)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression',
          callee: {type: 'Identifier', name: 'call'},
          arguments: [{type: 'YieldExpression',
            delegate: false,
            argument: {type: 'Identifier', name: 'x'},
          }],
        }},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('complex args', {
      code: 'call(yield x + y)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression',
          callee: {type: 'Identifier', name: 'call'},
          arguments: [{type: 'YieldExpression',
            delegate: false,
            argument: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'x'},
              operator: '+',
              right: {type: 'Identifier', name: 'y'},
            },
          }],
        }},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });
  });

  test('yield-star-sync-throw', {
    code: `

//- setup
var log = [];
var obj = {
    [Symbol.iterator]() {
        var throwCount = 0;
        return {
            name: "syncIterator",
        };
    }
};

//- body
log.push({ name: "before yield*" });
var v = yield* obj;
log.push({
    name: "after yield*",
    value: v
});
return "return-value";

//- assertions
assert.sameValue(log.length, 0, "log.length");

iter.next().then(v => {
    assert.sameValue(log[0].name, "before yield*");

assert.sameValue(log[1].name, "get next");

assert.sameValue(v.value, "next-value-1");
assert.sameValue(v.done, false);

assert.sameValue(log.length, 2, "log.length");

iter.throw("throw-arg-1").then(v => {
    assert.sameValue(log[2].name, "get throw");
assert.sameValue(log[2].thisValue.name, "syncIterator", "get throw thisValue");

assert.sameValue(log[3].name, "call throw");
assert.sameValue(log[3].thisValue.name, "syncIterator", "throw thisValue");
assert.sameValue(log[3].args.length, 1, "throw args.length");
assert.sameValue(log[3].args[0], "throw-arg-1", "throw args[0]");

assert.sameValue(log[4].name, "get throw done (1)");
assert.sameValue(log[4].thisValue.name, "throw-result-1", "get throw done thisValue");

assert.sameValue(log[5].name, "get throw value (1)");
assert.sameValue(log[5].thisValue.name, "throw-result-1", "get throw value thisValue");

assert.sameValue(v.value, "throw-value-1");
assert.sameValue(v.done, false);

assert.sameValue(log.length, 6, "log.length");

iter.throw("throw-arg-2").then(v => {
    assert.sameValue(log[6].name, "get throw");
assert.sameValue(log[6].thisValue.name, "syncIterator", "get throw thisValue");

assert.sameValue(log[7].name, "call throw");
assert.sameValue(log[7].thisValue.name, "syncIterator", "throw thisValue");
assert.sameValue(log[7].args.length, 1, "throw args.length");
assert.sameValue(log[7].args[0], "throw-arg-2", "throw args[0]");

assert.sameValue(log[8].name, "get throw done (2)");
assert.sameValue(log[8].thisValue.name, "throw-result-2", "get throw done thisValue");

assert.sameValue(log[9].name, "get throw value (2)");
assert.sameValue(log[9].thisValue.name, "throw-result-2", "get throw value thisValue");

assert.sameValue(log[10].name, "after yield*");
assert.sameValue(log[10].value, "throw-value-2");

assert.sameValue(v.value, "return-value");
assert.sameValue(v.done, true);

assert.sameValue(log.length, 11, "log.length");
}).then($DONE, $DONE);
}).catch($DONE);
}).catch($DONE);
    `,
    ast: true,
    tokens: true,
  });

  test('complex args', {
    code: 'call(yield x + y)',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression',
        callee: {type: 'Identifier', name: 'call'},
        arguments: [{
          type: 'YieldExpression',
          delegate: false,
          argument: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'x'},
            operator: '+',
            right: {type: 'Identifier', name: 'y'},
          },
        }],
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('proper test', {
    code: 'function *f(x){ return yield x; }',
    ast: {type: 'Program', body: [
      {
        type: 'FunctionDeclaration',
        generator: true,
        async: false,
        expression: false,
        id: {type: 'Identifier', name: 'f'},
        params: [{type: 'Identifier', name: 'x'}],
        body: {
          type: 'BlockStatement', body: [{
            type: 'ReturnStatement', argument: {
              type: 'YieldExpression',
              delegate: false,
              argument: {type: 'Identifier', name: 'x'},
            },
          }],
        },
      }
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR]
  });

});
