# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/operator_precedent/assignment_precedent_test_2x002f2_x0028should_all_chain_to_the_rightx0029.md

> :: operator precedent
>
> ::> assignment precedent test 2/2 (should all chain to the right)

## Input

`````js
a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 44 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 44 },
        source: ''
      },
      expression: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 44 },
          source: ''
        },
        left: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 1 },
            source: ''
          },
          name: 'a'
        },
        operator: '|=',
        right: {
          type: 'AssignmentExpression',
          loc: {
            start: { line: 1, col: 3 },
            end: { line: 1, col: 44 },
            source: ''
          },
          left: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 3 },
              end: { line: 1, col: 4 },
              source: ''
            },
            name: 'b'
          },
          operator: '^=',
          right: {
            type: 'AssignmentExpression',
            loc: {
              start: { line: 1, col: 6 },
              end: { line: 1, col: 44 },
              source: ''
            },
            left: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 6 },
                end: { line: 1, col: 7 },
                source: ''
              },
              name: 'c'
            },
            operator: '&=',
            right: {
              type: 'AssignmentExpression',
              loc: {
                start: { line: 1, col: 9 },
                end: { line: 1, col: 44 },
                source: ''
              },
              left: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 9 },
                  end: { line: 1, col: 10 },
                  source: ''
                },
                name: 'd'
              },
              operator: '>>>=',
              right: {
                type: 'AssignmentExpression',
                loc: {
                  start: { line: 1, col: 14 },
                  end: { line: 1, col: 44 },
                  source: ''
                },
                left: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 14 },
                    end: { line: 1, col: 15 },
                    source: ''
                  },
                  name: 'e'
                },
                operator: '>>=',
                right: {
                  type: 'AssignmentExpression',
                  loc: {
                    start: { line: 1, col: 18 },
                    end: { line: 1, col: 44 },
                    source: ''
                  },
                  left: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 18 },
                      end: { line: 1, col: 19 },
                      source: ''
                    },
                    name: 'f'
                  },
                  operator: '<<=',
                  right: {
                    type: 'AssignmentExpression',
                    loc: {
                      start: { line: 1, col: 22 },
                      end: { line: 1, col: 44 },
                      source: ''
                    },
                    left: {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 22 },
                        end: { line: 1, col: 23 },
                        source: ''
                      },
                      name: 'g'
                    },
                    operator: '%=',
                    right: {
                      type: 'AssignmentExpression',
                      loc: {
                        start: { line: 1, col: 25 },
                        end: { line: 1, col: 44 },
                        source: ''
                      },
                      left: {
                        type: 'Identifier',
                        loc: {
                          start: { line: 1, col: 25 },
                          end: { line: 1, col: 26 },
                          source: ''
                        },
                        name: 'h'
                      },
                      operator: '/=',
                      right: {
                        type: 'AssignmentExpression',
                        loc: {
                          start: { line: 1, col: 28 },
                          end: { line: 1, col: 44 },
                          source: ''
                        },
                        left: {
                          type: 'Identifier',
                          loc: {
                            start: { line: 1, col: 28 },
                            end: { line: 1, col: 29 },
                            source: ''
                          },
                          name: 'i'
                        },
                        operator: '*=',
                        right: {
                          type: 'AssignmentExpression',
                          loc: {
                            start: { line: 1, col: 31 },
                            end: { line: 1, col: 44 },
                            source: ''
                          },
                          left: {
                            type: 'Identifier',
                            loc: {
                              start: { line: 1, col: 31 },
                              end: { line: 1, col: 32 },
                              source: ''
                            },
                            name: 'j'
                          },
                          operator: '**=',
                          right: {
                            type: 'AssignmentExpression',
                            loc: {
                              start: { line: 1, col: 35 },
                              end: { line: 1, col: 44 },
                              source: ''
                            },
                            left: {
                              type: 'Identifier',
                              loc: {
                                start: { line: 1, col: 35 },
                                end: { line: 1, col: 36 },
                                source: ''
                              },
                              name: 'k'
                            },
                            operator: '-=',
                            right: {
                              type: 'AssignmentExpression',
                              loc: {
                                start: { line: 1, col: 38 },
                                end: { line: 1, col: 44 },
                                source: ''
                              },
                              left: {
                                type: 'Identifier',
                                loc: {
                                  start: { line: 1, col: 38 },
                                  end: { line: 1, col: 39 },
                                  source: ''
                                },
                                name: 'l'
                              },
                              operator: '+=',
                              right: {
                                type: 'AssignmentExpression',
                                loc: {
                                  start: { line: 1, col: 41 },
                                  end: { line: 1, col: 44 },
                                  source: ''
                                },
                                left: {
                                  type: 'Identifier',
                                  loc: {
                                    start: { line: 1, col: 41 },
                                    end: { line: 1, col: 42 },
                                    source: ''
                                  },
                                  name: 'm'
                                },
                                operator: '=',
                                right: {
                                  type: 'Identifier',
                                  loc: {
                                    start: { line: 1, col: 43 },
                                    end: { line: 1, col: 44 },
                                    source: ''
                                  },
                                  name: 'n'
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]
}

tokens (29x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._