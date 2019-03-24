import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('operator precedent', _ => {
    test('same level +', {
      code: 'a + b + c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '+',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('* is higher than +', {
      code: 'a + b * c * d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('* is higher than +', {
      code: 'a * b + c * d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('parenthesis override regular precedent (AST doesnt reflect them explicitly)', {
      code: '(a * b + c) * d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '+',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '*',
              right: {type: 'Identifier', name: 'd'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('assignment precedent test 1/2 (should all chain to the right)', {
      code: 'a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '+=',
                right: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '-=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'd'},
                    operator: '**=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'e'},
                      operator: '*=',
                      right: {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'f'},
                        operator: '/=',
                        right: {
                          type: 'AssignmentExpression',
                          left: {type: 'Identifier', name: 'g'},
                          operator: '%=',
                          right: {
                            type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'h'},
                            operator: '<<=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {type: 'Identifier', name: 'i'},
                              operator: '>>=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {type: 'Identifier', name: 'j'},
                                operator: '>>>=',
                                right: {
                                  type: 'AssignmentExpression',
                                  left: {type: 'Identifier', name: 'k'},
                                  operator: '&=',
                                  right: {
                                    type: 'AssignmentExpression',
                                    left: {type: 'Identifier', name: 'l'},
                                    operator: '^=',
                                    right: {
                                      type: 'AssignmentExpression',
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
            },
          },
        ],
      },
      tokens: [
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $ASI,
      ],
    });

    test('assignment precedent test 2/2 (should all chain to the right)', {
      code: 'a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '|=',
              right: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '^=',
                right: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '&=',
                  right: {
                    type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'd'},
                    operator: '>>>=',
                    right: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'e'},
                      operator: '>>=',
                      right: {
                        type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'f'},
                        operator: '<<=',
                        right: {
                          type: 'AssignmentExpression',
                          left: {type: 'Identifier', name: 'g'},
                          operator: '%=',
                          right: {
                            type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'h'},
                            operator: '/=',
                            right: {
                              type: 'AssignmentExpression',
                              left: {type: 'Identifier', name: 'i'},
                              operator: '*=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {type: 'Identifier', name: 'j'},
                                operator: '**=',
                                right: {
                                  type: 'AssignmentExpression',
                                  left: {type: 'Identifier', name: 'k'},
                                  operator: '-=',
                                  right: {
                                    type: 'AssignmentExpression',
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
            },
          },
        ],
      },
      tokens: [
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $ASI,
      ],
    });

    test('|| should veer to the left', {
      code: 'a || b || c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'LogicalExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '||',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '||',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('&& should veer to the left', {
      code: 'a && b && c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'LogicalExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '&&',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '&&',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('&& || precedent test 1/2', {
      code: 'a && b || c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'LogicalExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '&&',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '||',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('&& || precedent test 2/2', {
      code: 'a || b && c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '||',
              right: {
                type: 'LogicalExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '&&',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('&& | precedent test 1/2', {
      code: 'a | b && c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '|',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '&&',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('&& | precedent test 2/2', {
      code: 'a && b | c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '&&',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '|',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('| ^ precedent test 1/2', {
      code: 'a ^ b | c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '^',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '|',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('| ^ precedent test 2/2', {
      code: 'a | b ^ c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '|',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '^',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('^ & precedent test 1/2', {
      code: 'a & b ^ c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '&',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '^',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('^ & precedent test 2/2', {
      code: 'a ^ b & c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '^',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '&',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('& == precedent test 1/2', {
      code: 'a == b & c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '==',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '&',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('& == precedent test 2/2', {
      code: 'a & b == c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '&',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '==',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('equality precedent test 1/2', {
      code: 'a == b != c === d !== e',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
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
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('equality precedent test 2/2', {
      code: 'a !== b === c != d == e',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
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
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('& == precedent test 1/2', {
      code: 'a == b & c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '==',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '&',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('& == precedent test 2/2', {
      code: 'a & b == c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '&',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '==',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('== < precedent test 1/2', {
      code: 'a < b == c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '<',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '==',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('== < precedent test 2/2', {
      code: 'a == b < c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '==',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '<',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('comparison precedent test 1/2', {
      code: 'a < b <= c > d >= e in f instanceof g',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
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
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $ASI],
    });

    test('comparison precedent test 2/2', {
      code: 'a instanceof b in c >= d > e <= f < g',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
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
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('< << precedent test 1/2', {
      code: 'a << b < c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '<<',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '<',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('< << precedent test 2/2', {
      code: 'a < b << c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '<',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '<<',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bit shift precedent test 1/2', {
      code: 'a << b >> c >>> d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '<<',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '>>',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '>>>',
              right: {type: 'Identifier', name: 'd'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('comparison precedent test 2/2', {
      code: 'a >>> b >> c << d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '>>>',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '>>',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '<<',
              right: {type: 'Identifier', name: 'd'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('<< + precedent test 1/2', {
      code: 'a + b << c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '<<',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('<< + precedent test 2/2', {
      code: 'a << b + c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '<<',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '+',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('addition/subtraction precedent test 2/2', {
      code: 'a + b - c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '-',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('addition/subtraction precedent test 2/2', {
      code: 'a - b + c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '-',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '+',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('+ * precedent test 1/2', {
      code: 'a * b + c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '*',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '+',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('+ * precedent test 2/2', {
      code: 'a + b * c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '+',
              right: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '*',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('mul precedent test 1/2', {
      code: 'a * b / c % d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '%',
              right: {type: 'Identifier', name: 'd'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('mul precedent test 2/2', {
      code: 'a % b / c * d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '%',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '*',
              right: {type: 'Identifier', name: 'd'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    describe('** is right associative', _ => {

      test('* ** precedent test 1/2', {
        code: 'a ** b * c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '*',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('* ** precedent test 2/2', {
        code: 'a * b ** c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '*',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'c'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on double double star', {
        code: 'a ** b ** c',
        desc: 'b and c should be the inner node then a applied to that node, so (a**(b**c)) and not ((a**b)**c)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '**',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'c'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on plus double star', {
        code: 'a + b ** c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'c'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on double star plus', {
        code: 'a ** b + c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '+',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on ** ** +', {
        code: 'a ** b ** c + d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'b'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'c'},
                  },
                },
                operator: '+',
                right: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on ** + **', {
        code: 'a ** b + c ** d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on + ** **', {
        code: 'a + b ** c ** d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '**',
                  right: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'c'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'd'},
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on + + **', {
        code: 'a ** b ** c + d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'b'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'c'},
                  },
                },
                operator: '+',
                right: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on + ** +', {
        code: 'a ** b + c ** d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('on ** + +', {
        code: 'a + b ** c ** d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '**',
                  right: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'c'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'd'},
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('exp with tern ** ?', {
        code: 'a ** b ? c : d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'b'},
                },
                consequent: {type: 'Identifier', name: 'c'},
                alternate: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('exp with tern ?**:', {
        code: 'a ? b ** c : d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'c'},
                },
                alternate: {type: 'Identifier', name: 'd'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('exp with tern ?:**', {
        code: 'a ? b : c ** d',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('comma is right associative', _ => {

      // desc but because its prio is so low (the lowest!) there is no real risk of ambiguation.
      // additionally they don't create a nested tree of nodes but rather end up in an array of expressions

      test('simple', {
        code: 'a, b, c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}, {
                  type: 'Identifier',
                  name: 'c'
                }],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('grouped', {
        code: '(a, b), c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'SequenceExpression',
                    expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                  },
                  {type: 'Identifier', name: 'c'},
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('grouped', {
        code: 'a, (b, c)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [
                  {type: 'Identifier', name: 'a'},
                  {
                    type: 'SequenceExpression',
                    expressions: [{type: 'Identifier', name: 'b'}, {type: 'Identifier', name: 'c'}],
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });
    });

    describe('ternary is right associative', _ => {

      test('simple ?:?:', {
        code: 'a ? b : c ? d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple *?:?:', {
        code: 'a * x ? b : c ? d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'x'},
                },
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple **?:?:', {
        code: 'a ** x ? b : c ? d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'x'},
                },
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?*:?:', {
        code: 'a ? b * x : c ? d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'x'},
                },
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?**:?:', {
        code: 'a ? b ** x : c ? d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'x'},
                },
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?:*?:', {
        code: 'a ? b : c * x ? d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'c'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?:**?:', {
        code: 'a ? b : c ** x ? d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'c'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?:?*:', {
        code: 'a ? b : c ? d * x : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'd'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?:?**:', {
        code: 'a ? b : c ? d ** x : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'd'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  alternate: {type: 'Identifier', name: 'e'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?:?:*', {
        code: 'a ? b : c ? d : e * x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'e'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'x'},
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?:?:**', {
        code: 'a ? b : c ? d : e ** x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {type: 'Identifier', name: 'b'},
                alternate: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'c'},
                  consequent: {type: 'Identifier', name: 'd'},
                  alternate: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'e'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'x'},
                  },
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ??::', {
        code: 'a ? b ? c : d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple *??::', {
        code: 'a * x ? b ? c : d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'x'},
                },
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple **??::', {
        code: 'a ** x ? b ? c : d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'a'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'x'},
                },
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?*?::', {
        code: 'a ? b * x ? c : d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'b'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ?**?::', {
        code: 'a ? b ** x ? c : d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'b'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ??*::', {
        code: 'a ? b ? c * x : d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'c'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ??**::', {
        code: 'a ? b ? c ** x : d : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'c'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'x'},
                  },
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ??:*:', {
        code: 'a ? b ? c : d * x : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'd'},
                    operator: '*',
                    right: {type: 'Identifier', name: 'x'},
                  },
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ??:**:', {
        code: 'a ? b ? c : d ** x : e',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'd'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'x'},
                  },
                },
                alternate: {type: 'Identifier', name: 'e'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ??::*', {
        code: 'a ? b ? c : d : e * x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'e'},
                  operator: '*',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('simple ??::**', {
        code: 'a ? b ? c : d : e ** x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ConditionalExpression',
                test: {type: 'Identifier', name: 'a'},
                consequent: {
                  type: 'ConditionalExpression',
                  test: {type: 'Identifier', name: 'b'},
                  consequent: {type: 'Identifier', name: 'c'},
                  alternate: {type: 'Identifier', name: 'd'},
                },
                alternate: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'e'},
                  operator: '**',
                  right: {type: 'Identifier', name: 'x'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    describe('various priority checks GENERATED', _ => {

      test('regression 1', {
        code: 'b && c == d',
        desc: '--> b && (c == d)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'LogicalExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '&&',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'c'},
                  operator: '==',
                  right: {type: 'Identifier', name: 'd'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test.pass('regression 2', {
        code: 'a || b && c == d',
        desc: '--> a || (b && (c == d))',
      });

      ['**'].forEach(t15 => {
        ['*', '/', '%'].forEach(t14 => {
          ['+', '-'].forEach(t13 => {
            ['<<', '>>', '>>>'].forEach(t12 => {
              ['<', '<=', '>', '>=', 'in', 'instanceof'].forEach(t11 => {
                ['==', '!=', '===', '!=='].forEach(t10 => {
                  ['&'].forEach(t9 => {
                    ['^'].forEach(t8 => {
                      ['|'].forEach(t7 => {
                        ['&&'].forEach(t6 => {
                          ['||'].forEach(t5 => {

                            // This checks all binary ops per level so this generates a lot of cases..
                            // Randomly throw together some orders and their reverse and yolo it.
                            // (This test is confirmed by comparing to other parsers that hopefully do this right ;)

                            let order1 = [t15, t7, t10, t6, t5, t13, t11, t8, t12, t9, t14];
                            let order2 = [...order1].reverse();
                            let order3 = [t13, t10, t7, t15, t14, t8, t5, t6, t11, t9, t12];
                            let order4 = [...order3].reverse();

                            test.pass('order 1 (generated)', {
                              code: 'a @ b @ c @ d @ e @ f @ g @ h @ i @ j @ k'.replace(/@/g, () => order1.pop()),
                            });

                            test.pass('order 2 (generated)', {
                              code: 'a @ b @ c @ d @ e @ f @ g @ h @ i @ j @ k'.replace(/@/g, () => order2.pop()),
                            });

                            test.pass('order 3 (generated)', {
                              code: 'a @ b @ c @ d @ e @ f @ g @ h @ i @ j @ k'.replace(/@/g, () => order3.pop()),
                            });

                            test.pass('order 4 (generated)', {
                              code: 'a @ b @ c @ d @ e @ f @ g @ h @ i @ j @ k'.replace(/@/g, () => order4.pop()),
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });