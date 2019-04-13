import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX, $STRING_DOUBLE, $TICK_HEAD, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) => describe('parens', _ => {
  describe('group', _ => {
    test('silly group', {
      code: '(x);',
      ast: {
        type: 'Program',
        body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}}],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('silly double group', {
      code: '((x));',
      ast: {
        type: 'Program',
        body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}}],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('oh come on', {
      code: '((((((((((x))))))))));',
      ast: {
        type: 'Program',
        body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}}],
      },
      tokens: [
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('group of two vars', {
      code: '(a, b);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('group of some simple values', {
      code: '(a, 1, "c", d, e, f);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {type: 'Identifier', name: 'a'},
                {type: 'Literal', value: '<TODO>', raw: '1'},
                {type: 'Literal', value: '<TODO>', raw: '"c"'},
                {type: 'Identifier', name: 'd'},
                {type: 'Identifier', name: 'e'},
                {type: 'Identifier', name: 'f'},
              ],
            },
          },
        ],
      },
      tokens: [
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $NUMBER_DEC,
        $PUNCTUATOR,
        $STRING_DOUBLE,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('group of some two assignments', {
      code: '(a = 1, b = 2);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'a'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '1'}},
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'b'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '2'}},
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    describe('regular assignment to group', _ => {
      test('assignment to a wrapped identifier, silly but valid', {
        // https://tc39.github.io/ecma262/#sec-semantics-static-semantics-isvalidsimpleassignmenttarget
        code: '(a) = 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped property, silly but valid', {
        code: '(a.b) = 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped property, silly but valid', {
        code: '(a[b]) = 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped complex value that ends in a property, silly but valid', {
        code: '(a.b().c().d) = 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'a'},
                          property: {type: 'Identifier', name: 'b'},
                          computed: false,
                        },
                        arguments: [],
                      },
                      property: {type: 'Identifier', name: 'c'},
                      computed: false,
                    },
                    arguments: [],
                  },
                  property: {type: 'Identifier', name: 'd'},
                  computed: false,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $NUMBER_DEC,
          $PUNCTUATOR,
        ],
      });

      test('assignment to a wrapped super property, silly but valid', {
        code: 'class x{ constructor(){  (super.a) = 1;  }}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'constructor'},
                    static: false,
                    computed: false,
                    kind: 'constructor',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'MemberExpression',
                                object: {type: 'Super'},
                                property: {type: 'Identifier', name: 'a'},
                                computed: false,
                              },
                              operator: '=',
                              right: {type: 'Literal', value: '<TODO>', raw: '1'},
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('assignment to a wrapped super property, silly but valid', {
        code: 'class x{ constructor(){  (super[a]) = 1;  }}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'constructor'},
                    static: false,
                    computed: false,
                    kind: 'constructor',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'MemberExpression',
                                object: {type: 'Super'},
                                property: {type: 'Identifier', name: 'a'},
                                computed: true,
                              },
                              operator: '=',
                              right: {type: 'Literal', value: '<TODO>', raw: '1'},
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('assignment to a wrapped this property, silly but valid', {
        code: '(this.a) = 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {type: 'ThisExpression'},
                  property: {type: 'Identifier', name: 'a'},
                  computed: false,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped this property, silly but valid', {
        code: '(this[b]) = 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {type: 'ThisExpression'},
                  property: {type: 'Identifier', name: 'b'},
                  computed: true,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to array is destructuring', {
        code: '[x, y] = z;',
        desc: 'while not a prod, the assignment to array/object is an explicit exception (search for `assignmentpattern`)',
        // https://tc39.github.io/ecma262/#_ref_10683
        //   AssignmentExpression: LeftHandSideExpression = AssignmentExpression
        //     It is a Syntax Error if LeftHandSideExpression is either an ObjectLiteral or an ArrayLiteral and LeftHandSideExpression is not covering an AssignmentPattern.
        //     It is an early Reference Error if LeftHandSideExpression is neither an ObjectLiteral nor an ArrayLiteral and IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
        //   AssignmentExpression: LeftHandSideExpression AssignmentOperator AssignmentExpression
        //     It is an early Reference Error if IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'z'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('assignment to grouped array is not okay', {
        code: '([x, y]) = z;',
        desc: 'while not a prod, the assignment to array/object is an explicit exception (search for `assignmentpattern`)',
        throws: 'Invalid assignment',
      });

      test('assignment to array grouped is destructuring', {
        code: '([x, y] = z);',
        desc: 'the group is fine otherwise',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'z'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('assignment to array grouped can be arrow', {
        code: '([x, y] = z) => x;',
        desc: 'the group is fine otherwise',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                    },
                    right: {type: 'Identifier', name: 'z'},
                  },
                ],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('assignment to array in array can have no arrow', {
        code: '([[x, y] = z]);',
        desc: 'the group is fine otherwise',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                    },
                    operator: '=',
                    right: {type: 'Identifier', name: 'z'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('assignment to array in array can have arrow', {
        code: '([[x, y] = z]) => x;',
        desc: 'the group is fine otherwise',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                        },
                        right: {type: 'Identifier', name: 'z'},
                      },
                    ],
                  },
                ],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
        ],
      });

      test('assignment to array in array must destructuring', {
        code: '([[x, y] = z]) => x;',
        desc: 'the group is fine otherwise',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                        },
                        right: {type: 'Identifier', name: 'z'},
                      },
                    ],
                  },
                ],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
        ],
      });

      test('assignment to object as statmeent is error', {
        code: '{x, y} = z;',
        desc: 'top level object is parsed as a block',
        throws: 'can not start with object destructuring',
      });

      test('assignment to object as expression is destructuring', {
        code: '({x, y} = z);',
        desc: 'while not a prod, the assignment to array/object is an explicit exception (search for `assignmentpattern`)',
        // https://tc39.github.io/ecma262/#_ref_10683
        //   AssignmentExpression: LeftHandSideExpression = AssignmentExpression
        //     It is a Syntax Error if LeftHandSideExpression is either an ObjectLiteral or an ArrayLiteral and LeftHandSideExpression is not covering an AssignmentPattern.
        //     It is an early Reference Error if LeftHandSideExpression is neither an ObjectLiteral nor an ArrayLiteral and IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
        //   AssignmentExpression: LeftHandSideExpression AssignmentOperator AssignmentExpression
        //     It is an early Reference Error if IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'x'},
                      shorthand: true,
                    },
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'y'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'y'},
                      shorthand: true,
                    },
                  ],
                },
                operator: '=',
                right: {type: 'Identifier', name: 'z'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('assignment to grouped array is not okay', {
        code: '({x, y}) = z;',
        desc: 'while not a prod, the assignment to array/object is an explicit exception (search for `assignmentpattern`)',
        throws: 'Invalid assignment',
      });
    });

    describe('compound assignment to group', _ => {
      test('assignment to a wrapped identifier, silly but valid', {
        // https://tc39.github.io/ecma262/#sec-semantics-static-semantics-isvalidsimpleassignmenttarget
        code: '(a) += 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped property, silly but valid', {
        code: '(a.b) += 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
                operator: '+=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped property, silly but valid', {
        code: '(a[b]) += 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
                operator: '+=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped complex value that ends in a property, silly but valid', {
        code: '(a.b().c().d) += 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'a'},
                          property: {type: 'Identifier', name: 'b'},
                          computed: false,
                        },
                        arguments: [],
                      },
                      property: {type: 'Identifier', name: 'c'},
                      computed: false,
                    },
                    arguments: [],
                  },
                  property: {type: 'Identifier', name: 'd'},
                  computed: false,
                },
                operator: '+=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $NUMBER_DEC,
          $PUNCTUATOR,
        ],
      });

      test('assignment to a wrapped super property, silly but valid', {
        code: 'class x{ constructor(){  (super.a) += 1;  }}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'constructor'},
                    static: false,
                    computed: false,
                    kind: 'constructor',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'MemberExpression',
                                object: {type: 'Super'},
                                property: {type: 'Identifier', name: 'a'},
                                computed: false,
                              },
                              operator: '+=',
                              right: {type: 'Literal', value: '<TODO>', raw: '1'},
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('assignment to a wrapped super property, silly but valid', {
        code: 'class x{ constructor(){  (super[a]) += 1;  }}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {type: 'Identifier', name: 'constructor'},
                    static: false,
                    computed: false,
                    kind: 'constructor',
                    value: {
                      type: 'FunctionExpression',
                      generator: false,
                      async: false,
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'AssignmentExpression',
                              left: {
                                type: 'MemberExpression',
                                object: {type: 'Super'},
                                property: {type: 'Identifier', name: 'a'},
                                computed: true,
                              },
                              operator: '+=',
                              right: {type: 'Literal', value: '<TODO>', raw: '1'},
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('assignment to a wrapped this property, silly but valid', {
        code: '(this.a) += 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {type: 'ThisExpression'},
                  property: {type: 'Identifier', name: 'a'},
                  computed: false,
                },
                operator: '+=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('assignment to a wrapped this property, silly but valid', {
        code: '(this[b]) += 1;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {type: 'ThisExpression'},
                  property: {type: 'Identifier', name: 'b'},
                  computed: true,
                },
                operator: '+=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });
    });

    describe('sans arr', _ => {
      test('new inside array', {
        code: '(new x);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NewExpression',
                arguments: [],
                callee: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('delete inside array', {
        code: '(delete foo.bar);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'delete',
                prefix: true,
                argument: {
                  type: 'MemberExpression',
                  object: {type: 'Identifier', name: 'foo'},
                  property: {type: 'Identifier', name: 'bar'},
                  computed: false,
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('objlit inside array', {
        code: '({});',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {type: 'ObjectExpression', properties: []},
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('division inside array', {
        code: '(a / b);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '/',
                right: {type: 'Identifier', name: 'b'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('div newline inside array', {
        code: '(a \n/b/g);',
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
                  operator: '/',
                  right: {type: 'Identifier', name: 'b'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('div newline 2 inside array', {
        code: '(a \n/b/);',
        throws: 'Expected to parse a value',
      });

      test('regex case 1', {
        code: '(delete /a/.x);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'delete',
                prefix: true,
                argument: {
                  type: 'MemberExpression',
                  object: {type: 'Literal', value: '<TODO>', raw: '/a/'},
                  property: {type: 'Identifier', name: 'x'},
                  computed: false,
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('regex case 2', {
        code: '(delete /a/g.x);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'delete',
                prefix: true,
                argument: {
                  type: 'MemberExpression',
                  object: {type: 'Literal', value: '<TODO>', raw: '/a/g'},
                  property: {type: 'Identifier', name: 'x'},
                  computed: false,
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('first char after ident is unsufficient 1', {
        code: '(foo /=g/m.x);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'foo'},
                operator: '/=',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'g'},
                  operator: '/',
                  right: {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'm'},
                    property: {type: 'Identifier', name: 'x'},
                    computed: false,
                  },
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('first char after ident is unsufficient 2', {
        code: '(void /=g/m.x);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'void',
                prefix: true,
                argument: {
                  type: 'MemberExpression',
                  object: {type: 'Literal', value: '<TODO>', raw: '/=g/m'},
                  property: {type: 'Identifier', name: 'x'},
                  computed: false,
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('first char after ident is unsufficient 3', {
        code: '(void /=/g/m.x);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: 'void',
                  prefix: true,
                  argument: {type: 'Literal', value: '<TODO>', raw: '/=/g'},
                },
                operator: '/',
                right: {
                  type: 'MemberExpression',
                  object: {type: 'Identifier', name: 'm'},
                  property: {type: 'Identifier', name: 'x'},
                  computed: false,
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('with arr', _ => {
      test('new inside array', {
        code: '([new x]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'NewExpression',
                    arguments: [],
                    callee: {type: 'Identifier', name: 'x'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('delete inside array', {
        code: '([delete foo.bar]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'foo'},
                      property: {type: 'Identifier', name: 'bar'},
                      computed: false,
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('objlit inside array', {
        code: '([{}]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [{type: 'ObjectExpression', properties: []}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('division inside array', {
        code: '([a / b]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '/',
                    right: {type: 'Identifier', name: 'b'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('div newline inside array', {
        code: '([a \n/b/g]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: 'a'},
                      operator: '/',
                      right: {type: 'Identifier', name: 'b'},
                    },
                    operator: '/',
                    right: {type: 'Identifier', name: 'g'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('div newline 2 inside array', {
        code: '([a \n/b/]);',
        throws: 'Expected to parse a value',
      });

      test('regex case 1', {
        code: '([delete /a/.x]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: '<TODO>', raw: '/a/'},
                      property: {type: 'Identifier', name: 'x'},
                      computed: false,
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('regex case 2', {
        code: '([delete /a/g.x]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: '<TODO>', raw: '/a/g'},
                      property: {type: 'Identifier', name: 'x'},
                      computed: false,
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('first char after ident is unsufficient 1', {
        code: '([foo /=g/m.x]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'foo'},
                    operator: '/=',
                    right: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: 'g'},
                      operator: '/',
                      right: {
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: 'm'},
                        property: {type: 'Identifier', name: 'x'},
                        computed: false,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('first char after ident is unsufficient 2', {
        code: '([void /=g/m.x]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'UnaryExpression',
                    operator: 'void',
                    prefix: true,
                    argument: {
                      type: 'MemberExpression',
                      object: {type: 'Literal', value: '<TODO>', raw: '/=g/m'},
                      property: {type: 'Identifier', name: 'x'},
                      computed: false,
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('first char after ident is unsufficient 3', {
        code: '([void /=/g/m.x]);',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'BinaryExpression',
                    left: {
                      type: 'UnaryExpression',
                      operator: 'void',
                      prefix: true,
                      argument: {type: 'Literal', value: '<TODO>', raw: '/=/g'},
                    },
                    operator: '/',
                    right: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'm'},
                      property: {type: 'Identifier', name: 'x'},
                      computed: false,
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    test('unary ++ prefix', {
      code: '(++x);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              operator: '++',
              prefix: true,
              argument: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('sequence of unary ++ prefix', {
      code: '(++x, y);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                {type: 'Identifier', name: 'y'},
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('unary -- suffix', {
      code: '(x--);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {type: 'Identifier', name: 'x'},
              operator: '--',
              prefix: false,
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('sequence of unary -- suffix', {
      code: '(x--, y);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '--',
                  prefix: false,
                },
                {type: 'Identifier', name: 'y'},
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('missing spread/rest arg', {
      code: '(...);',
      throws: 'missing an argument',
    });

    test('invalid spread/rest', {
      code: '(...x);',
      throws: 'followed by an arrow',
    });

    test('empty group at eof', {
      code: '()',
      throws: 'Empty group',
    });

    test('empty group with semi', {
      code: '();',
      throws: 'Empty group',
    });

    test('grouped assignment is _not_ a valid assignment target', {
      code: '(a=1)=2',
      desc: 'https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-isvalidsimpleassignmenttarget',
      throws: 'Invalid assignment',
    });

    test('grouped compound assignment is _not_ a valid assignment target', {
      code: '(a=1)+=2',
      desc: 'nope: https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-isvalidsimpleassignmenttarget',
      throws: true,
    });

    test('cannot assign to group with comma', {
      code: '(a,b)=2',
      throws: 'Cannot assign',
    });

    test('cannot compound assign to group with comma', {
      code: '(a,b)+=2',
      throws: 'Cannot assign',
    });

    // TODO: confirm that `async` is not a reserved word in any case
    // TODO: confirm `let` is assignable even in strict mode

    // keywords
    [
      'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
      'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
      'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'true',
      'false', 'enum',
    ].forEach(keyword => {
      test('cannot assign to group with keyword: `' + keyword + '`', {
        code: '('+keyword+')=2',
        // Cannot use this name (break) as a variable name because: Cannot never use this reserved word as a variable name
        // Invalid assignment because group does not wrap just a var name or just a property access
        throws: true,
      });
    });

    // strict-mode only keywords
    [
      'eval', 'arguments', 'implements', 'package',
      'protected', 'interface', 'private', 'public', 'await', 'yield',
      'static', // Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is
      'let', // Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is
    ].forEach(keyword => {
      test('cannot assign to group with reserved word in strict mode: `' + keyword + '`', {
        code: '('+keyword+')=2',
        throws: true,
        SLOPPY_SCRIPT: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: keyword},
                  operator: '=',
                  right: {type: 'Literal', value: '<TODO>', raw: '2'},
                },
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $ASI],
        },
      });
    });

    // non-keywords
    [
      'async',     // not an actual keyword
    ].forEach(keyword => {
      test('cannot assign to group with keyword: `' + keyword + '`', {
        code: '('+keyword+')=2',
        // Cannot use this name (break) as a variable name because: Cannot never use this reserved word as a variable name
        // Invalid assignment because group does not wrap just a var name or just a property access
        ast: true,
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $ASI],
      });
    });

    test('non-destructible should throw when attempted anyways', {
      code: '([a + b] = x);',
      throws: 'not destructible',
    });

    test('arr with tail', {
      code: '([].x);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {type: 'ArrayExpression', elements: []},
              property: {type: 'Identifier', name: 'x'},
              computed: false,
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async call arr with tail', {
      code: 'async([].x);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'async'},
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {type: 'ArrayExpression', elements: []},
                  property: {type: 'Identifier', name: 'x'},
                  computed: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async arrow with arr with tail is bad', {
      code: 'async([].x) => x;',
      throws: true,
    });

    test('obj with tail', {
      code: '({} + 1);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'ObjectExpression', properties: []},
              operator: '+',
              right: {type: 'Literal', value: '<TODO>', raw: '1'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async call with obj with tail', {
      code: 'async ({} + 1);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'async'},
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {type: 'ObjectExpression', properties: []},
                  operator: '+',
                  right: {type: 'Literal', value: '<TODO>', raw: '1'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async call with obj with tail', {
      code: 'async ({} + 1) => x;',
      throws: true,
    });

    test('do not consider `>=` a compound assignment', {
      code: '(x + y) >= z',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
              operator: '>=',
              right: {type: 'Identifier', name: 'z'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('do not consider `<=` a compound assignment', {
      code: '(x + y) <= z',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
              operator: '<=',
              right: {type: 'Identifier', name: 'z'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('do not consider `!=` a compound assignment', {
      code: '(x + y) != z',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
              operator: '!=',
              right: {type: 'Identifier', name: 'z'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('do not consider `==` a compound assignment', {
      code: '(x + y) == z',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
              operator: '==',
              right: {type: 'Identifier', name: 'z'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    describe('regex cases', _ => {

      test('regex sans flag in group start', {
        code: '(/x/)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '/x/'},
            },
          ],
        },
        tokens: [$PUNCTUATOR, $REGEX, $PUNCTUATOR, $ASI],
      });

      test('regex with flag in group start', {
        code: '(/x/g)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {type: 'Literal', value: '<TODO>', raw: '/x/g'},
            },
          ],
        },
        tokens: [$PUNCTUATOR, $REGEX, $PUNCTUATOR, $ASI],
      });

      test('regex sans flag in group second', {
        code: '(x, /x/)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [{type: 'Identifier', name: 'x'}, {type: 'Literal', value: '<TODO>', raw: '/x/'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $ASI],
      });

      test('regex with flag in group second', {
        code: '(x, /x/g)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [{type: 'Identifier', name: 'x'}, {type: 'Literal', value: '<TODO>', raw: '/x/g'}],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $ASI],
      });

      test('group division', {
        code: '(x) / y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '/',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    test('regression1', {
      code: '([a.b] = x);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'a'},
                    property: {type: 'Identifier', name: 'b'},
                    computed: false,
                  },
                ],
              },
              operator: '=',
              right: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('regression full', {
      code: '([target()[targetKey()]] = x);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'target'},
                      arguments: [],
                    },
                    property: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'targetKey'},
                      arguments: [],
                    },
                    computed: true,
                  },
                ],
              },
              operator: '=',
              right: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('assignment inside pattern', {
      code: '([target()[targetKey(a=b)]] = x);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'target'},
                      arguments: [],
                    },
                    property: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'targetKey'},
                      arguments: [
                        {
                          type: 'AssignmentExpression', // THIS IS IMPORTANT! Not a pattern
                          left: {type: 'Identifier', name: 'a'},
                          operator: '=',
                          right: {type: 'Identifier', name: 'b'},
                        },
                      ],
                    },
                    computed: true,
                  },
                ],
              },
              operator: '=',
              right: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('empty array literal that is a property is assignable', {
      code: '([].length) = y',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {type: 'ArrayExpression', elements: []},
                property: {type: 'Identifier', name: 'length'},
                computed: false,
              },
              operator: '=',
              right: {type: 'Identifier', name: 'y'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('array literal that is a property is assignable', {
      code: '([x].length) = y',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: [{type: 'Identifier', name: 'x'}],
                },
                property: {type: 'Identifier', name: 'length'},
                computed: false,
              },
              operator: '=',
              right: {type: 'Identifier', name: 'y'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('empty object literal that is a property is assignable', {
      code: '({}.length) = z',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {type: 'ObjectExpression', properties: []},
                property: {type: 'Identifier', name: 'length'},
                computed: false,
              },
              operator: '=',
              right: {type: 'Identifier', name: 'z'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('object literal that is a property is assignable', {
      code: '({x: y}.length) = z',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'x'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {type: 'Identifier', name: 'y'},
                      shorthand: false,
                    },
                  ],
                },
                property: {type: 'Identifier', name: 'length'},
                computed: false,
              },
              operator: '=',
              right: {type: 'Identifier', name: 'z'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('true should be a literal (base case)', {
      code: 'true',
      desc: '(just to proof this is a group specific regression)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {type: 'Literal', value: true, raw: 'true'},
          },
        ],
      },
      tokens: [$IDENT, $ASI],
    });

    test('true in group should yield a literal, not ident', {
      code: '(true)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {type: 'Literal', value: true, raw: 'true'},
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('false in group should yield a literal, not ident', {
      code: '(false)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {type: 'Literal', value: false, raw: 'false'},
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('null in group should yield a literal, not ident', {
      code: '(null)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {type: 'Literal', value: null, raw: 'null'},
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('this in group should not yield an ident', {
      code: '(this)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {type: 'ThisExpression'},
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    describe('invalid arrow header things that are valid in a group', _ => {

      // see counter-test in arrow where this stuff is disallowed
      [
        'arguments',
        'async ()=>x',
        'class{}',
        'delete x.y',
        'eval',
        'false',
        'function(){}',
        'new x',
        'null',
        // 'super', // setup too annoying, simply assuming this works too
        'true',
        'this',
        'typeof x',
        'void x',
        'x + y',
        '[].length',
        '[x].length',
        '{}.length',
        '{x: y}.length',
      ].forEach(str => {
        test.pass('[' + str + '] in group', {
          code: '('+str+');',
        });

        if (str !== 'arguments' && str !== 'eval') { // tested elsewhere
          test.fail('[' + str + '] in arrow', {
            code: '('+str+') => x;',
          });
        }
      });

      // soe things are special
      [
        'await',
        'let',
        'yield',
      ].forEach(str => {
        test('[' + str + '] in group', {
          code: '('+str+');',
          throws: true,
          SLOPPY_SCRIPT: {
            ast: true,
            tokens: true,
          },
        });
      });
    });

    test('comma in a group should make the group non-assignable', {
      code: '(a, b) = c',
      throws: 'not assign',
    });

    describe('trailing comma without arrow', _ => {

      describe('non-assign', _ => {

        // trailing comma in just a group is always an error
        [undefined, 6, 7, 8, 9, Infinity].forEach(ES => {
          test.fail('must have args to trail', {
            code: '(,)',
            ES,
          });

          test.fail('just commas is error', {
            code: '(,,)',
            ES,
          });

          test.fail('one arg', {
            code: '(a,)',
            ES,
          });

          test.fail('two args', {
            code: '(a,b,)',
            ES,
          });

          test.fail('cannot elide', {
            code: '(a,,)',
            ES,
          });

          test.fail('after default', {
            code: '(a = b,)',
            ES,
          });

          test.fail('not allowed after rest', {
            code: '(...a,)',
            ES,
          });

          test.fail('after array destruct', {
            code: '([x],)',
            ES,
          });

          test.fail('after object destruct', {
            code: '({a},)',
            ES,
          });

          test.fail('rest cant even have an default', {
            code: '(...a = x,)',
            ES,
          });

          test.fail('after array destruct with default', {
            code: '([x] = y,)',
            ES,
          });

          test.fail('after object destruct with default', {
            code: '({a} = b,)',
            ES,
          });
        });
      });

      describe('assigned', _ => {

        [undefined, 6, 7, 8, 9, Infinity].forEach(ES => {
          test.fail('must have args to trail', {
            code: '(,) = x',
            ES,
          });

          test.fail('just commas is error', {
            code: '(,,) = x',
            ES,
          });

          test.fail('one arg', {
            code: '(a,) = x',
            ES,
          });

          test.fail('two args', {
            code: '(a,b,) = x',
            ES,
          });

          test.fail('cannot elide', {
            code: '(a,,) = x',
            ES,
          });

          test.fail('after default', {
            code: '(a = b,) = x',
            ES,
          });

          test.fail('not allowed after rest', {
            code: '(...a,) = x',
            ES,
          });

          test.fail('after array destruct', {
            code: '([x],) = x',
            ES,
          });

          test.fail('after object destruct', {
            code: '({a},) = x',
            ES,
          });

          test.fail('rest cant even have an default', {
            code: '(...a = x,) = x',
            ES,
          });

          test.fail('after array destruct with default', {
            code: '([x] = y,) = x',
            ES,
          });

          test.fail('after object destruct with default', {
            code: '({a} = b,) = x',
            ES,
          });
        });
      });
    });
  });

  describe('arrow', _ => {
    test('arrow, one arg without parens, expr', {
      code: 'x=>x;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: 'x'}],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow, no args, expr', {
      code: '()=>x;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow, one arg, expr', {
      code: '(x)=>x;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: 'x'}],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow, one arg, block', {
      code: '(x)=>{x}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: 'x'}],
              id: null,
              generator: false,
              async: false,
              expression: false,
              body: {type: 'BlockStatement', body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}}]},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $ASI],
    });

    test('arrow, one arg, block with a regex literal', {
      code: '(x)=>{/x/}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: 'x'}],
              id: null,
              generator: false,
              async: false,
              expression: false,
              body: {
                type: 'BlockStatement',
                body: [{type: 'ExpressionStatement', expression: {type: 'Literal', value: '<TODO>', raw: '/x/'}}],
              },
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI, $PUNCTUATOR, $ASI],
    });

    test('arrow, one arg, expr', {
      code: '(x, y)=>x;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    //{ error
    //  code: '((x)) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
    //  ]},
    //  desc: 'silly double group',
    //  tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    //},
    //{ error
    //  code: '(a, 1, "c", d, e, f) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
    //      {type: 'Identifier', name: 'a'},
    //      {type: 'Literal', value: '<TODO>', raw: '1'},
    //      {type: 'Literal', value: '<TODO>', raw: '"c"'},
    //      {type: 'Identifier', name: 'd'},
    //      {type: 'Identifier', name: 'e'},
    //      {type: 'Identifier', name: 'f'},
    //    ]}},
    //  ]},
    //  desc: 'group of some simple values',
    //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    //});

    test('group of some two assignments', {
      code: '(a = 1, b = 2) => x;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {type: 'Identifier', name: 'a'},
                  right: {type: 'Literal', value: '<TODO>', raw: '1'},
                },
                {
                  type: 'AssignmentPattern',
                  left: {type: 'Identifier', name: 'b'},
                  right: {type: 'Literal', value: '<TODO>', raw: '2'},
                },
              ],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    //{ error
    //  code: '(a.b) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
    //      left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
    //      operator: '=',
    //      right: {type: 'Literal', value: '<TODO>', raw: '1'},
    //    }},
    //  ]},
    //  desc: 'assignment to a wrapped property, silly but valid',
    //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    //},
    //{ error
    //  code: '(a[b]) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
    //      left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
    //      operator: '=',
    //      right: {type: 'Literal', value: '<TODO>', raw: '1'},
    //    }},
    //  ]},
    //  desc: 'assignment to a wrapped property, silly but valid',
    //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    //},
    //{ error
    //  code: '/i/ * ()=>j',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
    //      left: {type: 'Literal', value: '<TODO>', raw: '/i/'},
    //      operator: '*',
    //      right: {type: 'ArrowFunctionExpression',
    //        params: [],
    //        id: null,
    //      }
    //    }},
    //  ]},
    //  desc: 'this is invalid because you cannot match an arrow (in the grammar) on the rhs of a non-assignment operator',
    //  tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    //}

    test('group of some two assignments', {
      code: 'var a = (b) => c;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'a'},
                init: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'b'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {type: 'Identifier', name: 'c'},
                },
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow inside template disambiguation test 1', {
      code: '`X${a => b}Y`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'a'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {type: 'Identifier', name: 'b'},
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`X${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '}Y`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
    });

    test('arrow inside template disambiguation test 1', {
      code: '`X${a => b + c}Y`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'a'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {type: 'BinaryExpression', left: {type: 'Identifier', name: 'b'}, operator: '+', right: {type: 'Identifier', name: 'c'}},
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`X${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '}Y`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
    });

    test('arrow inside template disambiguation test 2; regular curlies in the arrow', {
      code: '`X${a => b + {}}Y`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'a'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'b'},
                    operator: '+',
                    right: {type: 'ObjectExpression', properties: []},
                  },
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`X${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '}Y`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    test('unary ++ prefix', {
      code: '(++x) => x;',
      throws: 'Unable to ASI',
    });

    test('sequence of unary ++ prefix', {
      code: '(++x, y) => x;',
      throws: 'Unable to ASI',
    });

    test('unary -- suffix', {
      code: '(x--) => x;',
      throws: 'not destructible',
    });

    test('sequence of unary -- suffix', {
      code: '(x--, y) => x;',
      throws: 'not destructible',
    });

    describe('regex edge case', _ => {
      describe('with expr', _ => {
        test('sans flag', {
          code: '_ => _\n/foo/',
          throws: 'Expected to parse a value',
          desc: 'the expression becomes a division which fails to parse properly in this case',
          tokens: [],
        });

        test('sans flag', {
          code: '_ => _\n/foo/g',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: '_'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: '_'},
                      operator: '/',
                      right: {type: 'Identifier', name: 'foo'},
                    },
                    operator: '/',
                    right: {type: 'Identifier', name: 'g'},
                  },
                },
              },
            ],
          },
          desc: 'the expression becomes a division which is fine ((_/foo)/g) (make sure tree is correct)',
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });
      });

      describe('with block', _ => {

        test.fail('cannot divide an arrow and cannot asi with forward slash at start of next line (div)', {
          code: '_ => {}\n/foo',
          HAS_AST: true,
        });

        test.fail('cannot divide an arrow and cannot asi with forward slash at start of next line (regex no flag)', {
          code: '_ => {}\n/foo/',
          HAS_AST: true,
        });

        test.fail('cannot divide an arrow and cannot asi with forward slash at start of next line (regex + flag)', {
          code: '_ => {}\n/foo/g',
          HAS_AST: true,
        });
      });
    });

    test('empty parens, newline', {
      code: '()\n=>x',
      throws: 'restricted production',
    });

    describe('keywords ok in group not allowed in arrow header', _ => {
      ['true', 'false', 'null', 'this'].forEach(keyword => {
        test('arrow; keyword=' + keyword, {
          code: '(' + keyword +') => x',
          throws: 'not destructible',
        });

        test.pass('group; keyword=' + keyword, {
          code: '(' + keyword +');',
        });
      });
    });

    test('object in group with shorthand', {
      code: '({x});',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'x'},
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {type: 'Identifier', name: 'x'},
                  shorthand: true,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('destruct assign in group', {
      code: '({x} = y);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'x'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {type: 'Identifier', name: 'x'},
                    shorthand: true,
                  },
                ],
              },
              operator: '=',
              right: {type: 'Identifier', name: 'y'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('dynamic property object in group', {
      code: '({[x]:y});',
      desc: 'the dynamic property makes the object non-destructible',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'x'},
                  kind: 'init',
                  method: false,
                  computed: true,
                  value: {type: 'Identifier', name: 'y'},
                  shorthand: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('assign to non-destructible dynamic prop object in group', {
      code: '({[x]:y} = z);',
      desc: 'the dynamic property is destructible',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'x'},
                    kind: 'init',
                    method: false,
                    computed: true,
                    value: {type: 'Identifier', name: 'y'},
                    shorthand: false,
                  },
                ],
              },
              operator: '=',
              right: {type: 'Identifier', name: 'z'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('dynamic method object in group', {
      code: '({[x](){}});',
      desc: 'the dynamic property makes the object non-destructible',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'x'},
                  kind: 'init',
                  method: true,
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    id: null,
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                  shorthand: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('assign to non-destructible dynamic method object in group', {
      code: '({[x](){}} = z);',
      desc: 'the dynamic property makes the object non-destructible',
      throws: 'not destructible',
    });

    describe('spread', _ => {
      // TODO: copy to group tests as well, with and without assignments

      test('only', {
        code: '(...x) => x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [
                  {
                    type: 'RestElement',
                    argument: {type: 'Identifier', name: 'x'},
                  },
                ],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('cannot start any statement', {
        code: '...x => x',
        throws: 'Unexpected spread/rest dots',
      });

      test('cannot start any expression', {
        code: 'y, ...x => x',
        throws: 'Unexpected spread/rest dots',
      });

      test('last', {
        code: '(x, ...y) => x',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [
                  {type: 'Identifier', name: 'x'},
                  {
                    type: 'RestElement',
                    argument: {type: 'Identifier', name: 'y'},
                  },
                ],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'x'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('middle is bad', {
        code: '(x, ...y, z) => x',
        throws: 'destructible',
      });

      test('first but not last is bad', {
        code: '(...x, y) => x',
        throws: 'destructible',
      });

      test('cannot have init', {
        code: '(...x = y) => x',
        throws: 'destructible',
      });

      test('can not spread member', {
        code: '([...x.y]) => z',
        desc: 'would be valid in group; `[...x.y];`',
        throws: 'illegal',
      });

      [
        '({...(obj)}) => {}',
        '({...(a,b)}) => {}',
        '({...{a,b}}) => {}',
        '({...[a,b]}) => {}',
      ].forEach((tcase,i) => {
        test.fail('bad arrow destruct of obj case ' + i, {
          code: tcase,
        });
      });
      [
        '({a:b,...obj}) => {}',
        '({...obj} = {}) => {}',
        '({...(a,b),c})',
        '({...a,b,c})',
      ].forEach((tcase,i) => {
        test.pass('bad arrow destruct of obj case ' + i, {
          code: tcase,
        });
      });
    });

    test('non-destructible should throw when attempted anyways', {
      code: '([a + b] = x) => a;',
      throws: 'not destructible',
    });

    describe('obj lit with array value that cant destruct', _ => {

      test('method call as group', {
        code: '({ident: [foo, bar].join("")})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'ident'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ArrayExpression',
                          elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                        },
                        property: {type: 'Identifier', name: 'join'},
                        computed: false,
                      },
                      arguments: [{type: 'Literal', value: '<TODO>', raw: '""'}],
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('division as group', {
        code: '({ident: [foo, bar]/x})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'ident'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'ArrayExpression',
                        elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                      },
                      operator: '/',
                      right: {type: 'Identifier', name: 'x'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('regex-like division as group', {
        code: '({ident: [foo, bar]/x/g})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'ident'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'ArrayExpression',
                          elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                        },
                        operator: '/',
                        right: {type: 'Identifier', name: 'x'},
                      },
                      operator: '/',
                      right: {type: 'Identifier', name: 'g'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test.pass('bin op should pass as prop value', {
        code: '({ident: [foo, bar] + x})',
      });

      test.fail('compound assignment should fail when assigning to an array', {
        code: '({ident: [foo, bar] += x})',
      });

      test.fail('bin op should fail as assign destruct', {
        code: '({ident: [foo, bar] + x} = y)',
      });

      test.fail('compound assignment should fail as assign destruct', {
        code: '({ident: [foo, bar] += x} = y)',
      });

      test('method call as arrow', {
        code: '({ident: [foo, bar].join("")}) => x',
        throws: 'not destructible',
      });

      test('division as arrow', {
        code: '({ident: [foo, bar]/x}) => x',
        throws: 'not destructible',
      });

      test('regex-like division as arrow', {
        code: '({ident: [foo, bar]/x/g}) => x',
        throws: 'not destructible',
      });

      test.fail('arr with numbers', {
        code: '([0])=>0;',
      });

      test.fail('arr with numbers', {
        code: '([0])=>0;',
      });

      test.fail('property is not arrowable', {
        code: '({a:b[0]}) => x',
      });

      test.fail('property wrapped in arrs is still not arrowable', {
        code: '([[[[[[[[[[[[[[[[[[[[{a:b[0]}]]]]]]]]]]]]]]]]]]]])=>0;',
      });
    });

    test('nested objects', {
      code: '({ident: {x: y}})',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'ident'},
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 'x'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Identifier', name: 'y'},
                        shorthand: false,
                      },
                    ],
                  },
                  shorthand: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('nested object can use shorthand', {
      code: '({ident: {x}})',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'ident'},
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {type: 'Identifier', name: 'x'},
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {type: 'Identifier', name: 'x'},
                        shorthand: true,
                      },
                    ],
                  },
                  shorthand: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('nested destructuring arrow', {
      code: '({ident: {x: y}}) => x',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'ident'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'x'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'y'},
                            shorthand: false,
                          },
                        ],
                      },
                      shorthand: false,
                    },
                  ],
                },
              ],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('nested object with shorthand and arrow', {
      code: '({ident: {x}}) => x',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {type: 'Identifier', name: 'ident'},
                      kind: 'init',
                      method: false,
                      computed: false,
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'x'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'x'},
                            shorthand: true,
                          },
                        ],
                      },
                      shorthand: false,
                    },
                  ],
                },
              ],
              id: null,
              generator: false,
              async: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    describe('obj lit with obj value that cant destruct', _ => {

      test('method call as group', {
        code: '({ident: {x: y}.join("")})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'ident'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'x'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: false,
                            },
                          ],
                        },
                        property: {type: 'Identifier', name: 'join'},
                        computed: false,
                      },
                      arguments: [{type: 'Literal', value: '<TODO>', raw: '""'}],
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('division as group', {
        code: '({ident: {x:y}/x})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'ident'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'x'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'y'},
                            shorthand: false,
                          },
                        ],
                      },
                      operator: '/',
                      right: {type: 'Identifier', name: 'x'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('regex-like division as group', {
        code: '({ident: {x:y}/x/g})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {type: 'Identifier', name: 'ident'},
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'x'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'y'},
                              shorthand: false,
                            },
                          ],
                        },
                        operator: '/',
                        right: {type: 'Identifier', name: 'x'},
                      },
                      operator: '/',
                      right: {type: 'Identifier', name: 'g'},
                    },
                    shorthand: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test.fail('compound assignment should fail when assigning to an object', {
        code: '({ident: {x:y} += x})',
      });

      test.fail('compound assignment should fail as destruct assign', {
        code: '({ident: {x:y} += x} = y)',
      });

      test('method call as arrow', {
        code: '({ident: {x}.join("")}) => x',
        throws: 'not destructible',
      });

      test('division as arrow', {
        code: '({ident: {x}/x}) => x',
        throws: 'not destructible',
      });

      test('regex-like division as arrow', {
        code: '({ident: {x}/x/g}) => x',
        throws: 'not destructible',
      });
    });

    describe('regex cases', _ => {

      test('regex sans flag in group start', {
        code: '(/x/) => x',
        throws: true,
      });

      test('regex with flag in group start', {
        code: '(/x/) => x',
        throws: true,
      });

      test('regex sans flag in group second', {
        code: '(x, /x/g) => x',
        throws: true,
      });

      test('regex with flag in group second', {
        code: '(x, /x/g) => x',
        throws: true,
      });
    });

    test('arrow with one arg inside an arg list', {
      code: 'f(((a) => a + b)(1, 4), 5);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'f'},
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'ArrowFunctionExpression',
                    params: [{type: 'Identifier', name: 'a'}],
                    id: null,
                    generator: false,
                    async: false,
                    expression: true,
                    body: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: 'a'},
                      operator: '+',
                      right: {type: 'Identifier', name: 'b'},
                    },
                  },
                  arguments: [{type: 'Literal', value: '<TODO>', raw: '1'}, {type: 'Literal', value: '<TODO>', raw: '4'}],
                },
                {type: 'Literal', value: '<TODO>', raw: '5'},
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('arrow with two args inside an arg list', {
      code: 'f(((a, b) => a + b));',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'f'},
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '+',
                    right: {type: 'Identifier', name: 'b'},
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('cannot assign to group with assignment', {
      code: '(a=/i/) = /i/',
      throws: 'Invalid assignment',
    });

    describe('invalid arrow header things', _ => {

      // always:
      [
        'async ()=>x',
        // 'await foo',
        'class{}',
        'delete x.x',
        'false',
        'function(){}',
        // 'let',
        'new x',
        'null',
        // 'super',
        'true',
        'this',
        'typeof x',
        'void x',
        // 'yield x',
        'x + y',
        '[].length',
        '[x].length',
        '{}.length',
        '{x: y}.length',
      ].forEach(str => {
        test('[' + str + '] in arrow params', {
          code: '('+str+') => y',
          throws: 'destructible',
        });
      });

      // only in strict mode:
      [
        'arguments',
        'eval',
        'static',
      ].forEach(str => {
        test('[' + str + '] in arrow params', {
          code: '('+str+') => y',
          throws: true,
          SLOPPY_SCRIPT: {
            ast: true,
            tokens: true,
          },
        });
      });
    });

    describe('trailing comma', _ => {

      describe('enabled', _ => {

        [undefined, 8, 9, Infinity].forEach(ES => {
          test.fail('must have args to trail', {
            code: '(,) => {}',
            ES,
          });

          test.fail('just commas is error', {
            code: '(,,) => {}',
            ES,
          });

          test('one arg', {
            code: '(a,) => {}',
            ES,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [{type: 'Identifier', name: 'a'}],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('two args', {
            code: '(a,b,) => {}',
            ES,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test.fail('cannot elide', {
            code: '(a,,) => {}',
            ES,
          });

          test('after default', {
            code: '(a = b,) => {}',
            ES,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {type: 'Identifier', name: 'a'},
                        right: {type: 'Identifier', name: 'b'},
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test.fail('not allowed after rest', {
            code: '(...a,) => {}',
            ES,
          });

          test('after array destruct', {
            code: '([x],) => {}',
            ES,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'x'}],
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('after object destruct', {
            code: '({a},) => {}',
            ES,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                        ],
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test.fail('rest cant even have an default', {
            code: '(...a = x,) => {}',
            ES,
          });

          test('after array destruct with default', {
            code: '([x] = y,) => {}',
            ES,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'x'}],
                        },
                        right: {type: 'Identifier', name: 'y'},
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });

          test('after object destruct with default', {
            code: '({a} = b,) => {}',
            ES,
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrowFunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'a'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'a'},
                              shorthand: true,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'b'},
                      },
                    ],
                    id: null,
                    generator: false,
                    async: false,
                    expression: false,
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
            tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
          });
        });
      });

      describe('disabled', _ => {

        [6, 7].forEach(ES => {
          test.fail('must have args to trail', {
            code: '(,) => {}',
            ES,
          });

          test.fail('just commas is error', {
            code: '(,,) => {}',
            ES,
          });

          test.fail('one arg', {
            code: '(a,) => {}',
            ES,
          });

          test.fail('two args', {
            code: '(a,b,) => {}',
            ES,
          });

          test.fail('cannot elide', {
            code: '(a,,) => {}',
            ES,
          });

          test.fail('after default', {
            code: '(a = b,) => {}',
            ES,
          });

          test.fail('not allowed after rest', {
            code: '(...a,) => {}',
            ES,
          });

          test.fail('after array destruct', {
            code: '([x],) => {}',
            ES,
          });

          test.fail('after object destruct', {
            code: '({a},) => {}',
            ES,
          });

          test.fail('rest cant even have an default', {
            code: '(...a = x,) => {}',
            ES,
          });

          test.fail('after array destruct with default', {
            code: '([x] = y,) => {}',
            ES,
          });

          test.fail('after object destruct with default', {
            code: '({a} = b,) => {}',
            ES,
          });
        });
      });
    });

    describe('arrow param destructuring should not do the same as assignment destructuring', _ => {

      test.fail('obj with alias to property sans init', {
        code: '({x: y.z}) => b',
      });

      test.pass('confirm destructuring assignment still works', {
        code: '({x: y.z} = b)',
      });

      test.fail('obj with alias to property with init', {
        code: '({x: y.z} = a) => b',
      });

      test.fail('obj wrapped in array with alias to property sans init', {
        code: '([{x: y.z}]) => b',
      });

      test.fail('obj wrapped in array with alias to property array init', {
        code: '([{x: y.z}] = a) => b',
      });

      test.fail('obj wrapped in array with alias to property obj init', {
        code: '([{x: y.z} = a]) => b',
      });

      test.fail('obj destructuring rest with complex obj arg', {
        code: '({...{x} }) => {}',
      });

      test.fail('obj destructuring rest with paren wrapped arg', {
        // Arrow cover grammar is not determined by "AssignmentTargetType" so these parens are not "okay"
        code: '({...(x) }) => {}',
      });

      test.fail('obj destructuring rest with complex arr arg', {
        code: '({...[x] }) => {}',
      });
    });

    describe('arrows is not a normal expression value', _ => {

      test.pass('expr; lhs of addition', {
        code: 'a => a + x',
      });

      test.fail('body; lhs of addition', {
        code: 'a => {} + x',
        HAS_AST: true,
      });

      test.fail('expr; rhs of addition', {
        code: 'x + a => a',
      });

      test.fail('body; rhs of addition', {
        code: 'x + a => {}',
      });

      test.pass('expr; division', {
        code: 'a => a / x',
      });

      test.fail('body; division', {
        code: 'a => {} / x',
        HAS_AST: true,
      });

      test.fail('arrow regex requires semi', {
        code: 'a => {} /x/',
        HAS_AST: true,
      });

      test.fail('arrow regex with newline', {
        code: 'a => {}\n/x/',
        HAS_AST: true,
      });

      test.pass('expr; arrow dot', {
        code: 'a => x.foo',
      });

      test.fail('body; arrow dot', {
        code: 'a => {}.foo',
        HAS_AST: true,
      });

      test.pass('expr; dynamic prop', {
        code: 'a => x[foo]',
      });

      test.fail('body; dynamic prop', {
        code: 'a => {}[foo]',
        HAS_AST: true,
      });

      test.pass('expr; call', {
        code: 'a => x()',
      });

      test.fail('body; call', {
        code: 'a => {}()',
        HAS_AST: true,
      });

      test.pass('asi and the + is a unary operator', {
        code: '() => {}\n+function(){}',
      });

      test.fail('newest victim of asi', {
        code: '() => {}\n/function(){}',
        HAS_AST: true,
      });
    });

    describe('regressions #12', _ => {

      test.pass('object pattern alias can be pattern too', {
        code: '({a,b=b,a:c,[a]:[d]})=>0;',
      });

      test.pass('object pattern alias can be property too', {
        code: '({a, a:a, a:a=a, [a]:{a}, a:some_call()[a], a:this.a} = 0);',
      });
    });
  });
});

// arrow params and arrow can not have newline (asi breaks an arrow into group and syntax error)
// cannot have yield or await in the params
// cannot destructure when body contains "use strict"
// cant redeclare existing vars
// TODO: let not allowed in `let`, `const`, `for`-binding of any kind, and class name. But others are fine in sloppy
// `(foo + (bar + boo) + ding)` propagating the lhs-paren state
