let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../../src/zetokenizer');


module.exports = (describe, test) => describe('operator precedent', _ => {

  test('same level +',{
    code: 'a + b + c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '+',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('* is higher than +',{
    code: 'a + b * c * d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '+',
        right: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '*',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '*',
          right: {type: 'Identifier', name: 'd'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('* is higher than +',{
    code: 'a * b + c * d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '*',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '+',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'c'},
          operator: '*',
          right: {type: 'Identifier', name: 'd'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('parenthesis override regular precedent (AST doesnt reflect them explicitly)',{
    code: '(a * b + c) * d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '*',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '+',
          right: {type: 'Identifier', name: 'c'},
        },
        operator: '*',
        right: {type: 'Identifier', name: 'd'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('assignment precedent test 1/2 (should all chain to the right)',{
    code: 'a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n',
    ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
      type: 'AssignmentExpression',
      left: {type: 'Identifier', name: 'a'},
      operator: '=',
      right: {type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'b'},
        operator: '+=',
        right: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'c'},
          operator: '-=',
          right: {type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'd'},
            operator: '**=',
            right: {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'e'},
              operator: '*=',
              right: {type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'f'},
                operator: '/=',
                right: {type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'g'},
                  operator: '%=',
                  right: {type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'h'},
                    operator: '<<=',
                    right: {type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'i'},
                      operator: '>>=',
                      right: {type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'j'},
                        operator: '>>>=',
                        right: {type: 'AssignmentExpression',
                          left: {type: 'Identifier', name: 'k'},
                          operator: '&=',
                          right: {type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'l'},
                            operator: '^=',
                            right: {type: 'AssignmentExpression',
                              left: {type: 'Identifier', name: 'm'},
                              operator: '|=',
                              right: {type: 'Identifier', name: 'n'},
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }}]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('assignment precedent test 2/2 (should all chain to the right)',{
    code: 'a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n',
    ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
      left: {type: 'Identifier', name: 'a'},
      operator: '|=',
      right: {type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'b'},
        operator: '^=',
        right: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'c'},
          operator: '&=',
          right: {type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'd'},
            operator: '>>>=',
            right: {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'e'},
              operator: '>>=',
              right: {type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'f'},
                operator: '<<=',
                right: {type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'g'},
                  operator: '%=',
                  right: {type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'h'},
                    operator: '/=',
                    right: {type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'i'},
                      operator: '*=',
                      right: {type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'j'},
                        operator: '**=',
                        right: {type: 'AssignmentExpression',
                          left: {type: 'Identifier', name: 'k'},
                          operator: '-=',
                          right: {type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'l'},
                            operator: '+=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {type: 'Identifier', name: 'm'},
                              operator: '=',
                              right: {type: 'Identifier', name: 'n'},
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }}]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('|| should veer to the left',{
    code: 'a || b || c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'LogicalExpression',
        left: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '||',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '||',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('&& should veer to the left',{
    code: 'a && b && c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'LogicalExpression',
        left: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&&',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '&&',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('&& || precedent test 1/2',{
    code: 'a && b || c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'LogicalExpression',
        left: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&&',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '||',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('&& || precedent test 2/2',{
    code: 'a || b && c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'LogicalExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '||',
        right: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '&&',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('&& | precedent test 1/2',{
    code: 'a | b && c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'LogicalExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '|',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '&&',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('&& | precedent test 2/2',{
    code: 'a && b | c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'LogicalExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '&&',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '|',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('| ^ precedent test 1/2',{
    code: 'a ^ b | c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '^',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '|',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('| ^ precedent test 2/2',{
    code: 'a | b ^ c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '|',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '^',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('^ & precedent test 1/2',{
    code: 'a & b ^ c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '^',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('^ & precedent test 2/2',{
    code: 'a ^ b & c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '^',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '&',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('& == precedent test 1/2',{
    code: 'a == b & c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '==',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '&',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('& == precedent test 2/2',{
    code: 'a & b == c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '&',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '==',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('equality precedent test 1/2',{
    code: 'a == b != c === d !== e',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '==',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '!=',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '===',
          right: {type: 'Identifier', name: 'd'},
        },
        operator: '!==',
        right: {type: 'Identifier', name: 'e'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('equality precedent test 2/2',{
    code: 'a !== b === c != d == e',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '!==',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '===',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '!=',
          right: {type: 'Identifier', name: 'd'},
        },
        operator: '==',
        right: {type: 'Identifier', name: 'e'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('& == precedent test 1/2',{
    code: 'a == b & c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '==',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '&',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('& == precedent test 2/2',{
    code: 'a & b == c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '&',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '==',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('== < precedent test 1/2',{
    code: 'a < b == c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '==',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('== < precedent test 2/2',{
    code: 'a == b < c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '==',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '<',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('comparison precedent test 1/2',{
    code: 'a < b <= c > d >= e in f instanceof g',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '<',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '<=',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '>',
              right: {type: 'Identifier', name: 'd'},
            },
            operator: '>=',
            right: {type: 'Identifier', name: 'e'},
          },
          operator: 'in',
          right: {type: 'Identifier', name: 'f'},
        },
        operator: 'instanceof',
        right: {type: 'Identifier', name: 'g'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $ASI],
  });
  
  test('comparison precedent test 2/2',{
    code: 'a instanceof b in c >= d > e <= f < g',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: 'instanceof',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: 'in',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '>=',
              right: {type: 'Identifier', name: 'd'},
            },
            operator: '>',
            right: {type: 'Identifier', name: 'e'},
          },
          operator: '<=',
          right: {type: 'Identifier', name: 'f'},
        },
        operator: '<',
        right: {type: 'Identifier', name: 'g'},
      }},
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('< << precedent test 1/2',{
    code: 'a << b < c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<<',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '<',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('< << precedent test 2/2',{
    code: 'a < b << c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '<',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '<<',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('bit shift precedent test 1/2',{
    code: 'a << b >> c >>> d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '<<',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '>>',
          right: {type: 'Identifier', name: 'c'},
        },
        operator: '>>>',
        right: {type: 'Identifier', name: 'd'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('comparison precedent test 2/2',{
    code: 'a >>> b >> c << d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '>>>',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '>>',
          right: {type: 'Identifier', name: 'c'},
        },
        operator: '<<',
        right: {type: 'Identifier', name: 'd'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('<< + precedent test 1/2',{
    code: 'a + b << c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '<<',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('<< + precedent test 2/2',{
    code: 'a << b + c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '<<',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '+',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('addition/subtraction precedent test 2/2',{
    code: 'a + b - c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '-',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('addition/subtraction precedent test 2/2',{
    code: 'a - b + c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '-',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '+',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('+ * precedent test 1/2',{
    code: 'a * b + c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '*',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '+',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('+ * precedent test 2/2',{
    code: 'a + b * c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '+',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '*',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('mul precedent test 1/2',{
    code: 'a * b / c % d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '*',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '/',
          right: {type: 'Identifier', name: 'c'},
        },
        operator: '%',
        right: {type: 'Identifier', name: 'd'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('mul precedent test 2/2',{
    code: 'a % b / c * d',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
        left: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '%',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '/',
          right: {type: 'Identifier', name: 'c'},
        },
        operator: '*',
        right: {type: 'Identifier', name: 'd'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('* ** precedent test 1/2',{
    code: 'a ** b * c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '**',
          right: {type: 'Identifier', name: 'b'},
        },
        operator: '*',
        right: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('* ** precedent test 2/2',{
    code: 'a * b ** c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '*',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '**',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('** right-associative',{
    code: 'a ** b ** c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '**',
        right: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '**',
          right: {type: 'Identifier', name: 'c'},
        },
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
});
