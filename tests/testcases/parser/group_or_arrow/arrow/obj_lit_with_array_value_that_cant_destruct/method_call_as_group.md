# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/parens/arrow/obj_lit_with_array_value_that_cant_destruct/method_call_as_group.md

> :: parens : arrow : obj lit with array value that cant destruct
>
> ::> method call as group

## Input

`````js
({ident: [foo, bar].join("")})
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 30 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 30 },
        source: ''
      },
      expression: {
        type: 'ObjectExpression',
        loc: {
          start: { line: 1, col: 1 },
          end: { line: 1, col: 29 },
          source: ''
        },
        properties: [
          {
            type: 'Property',
            loc: {
              start: { line: 1, col: 2 },
              end: { line: 1, col: 28 },
              source: ''
            },
            key: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 2 },
                end: { line: 1, col: 9 },
                source: ''
              },
              name: 'ident'
            },
            kind: 'init',
            method: false,
            computed: false,
            value: {
              type: 'CallExpression',
              loc: {
                start: { line: 1, col: 9 },
                end: { line: 1, col: 28 },
                source: ''
              },
              callee: {
                type: 'MemberExpression',
                loc: {
                  start: { line: 1, col: 9 },
                  end: { line: 1, col: 24 },
                  source: ''
                },
                object: {
                  type: 'ArrayExpression',
                  loc: {
                    start: { line: 1, col: 9 },
                    end: { line: 1, col: 19 },
                    source: ''
                  },
                  elements: [
                    {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 10 },
                        end: { line: 1, col: 13 },
                        source: ''
                      },
                      name: 'foo'
                    },
                    {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 15 },
                        end: { line: 1, col: 18 },
                        source: ''
                      },
                      name: 'bar'
                    }
                  ]
                },
                property: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 20 },
                    end: { line: 1, col: 20 },
                    source: ''
                  },
                  name: 'join'
                },
                computed: false
              },
              arguments: [
                {
                  type: 'Literal',
                  loc: {
                    start: { line: 1, col: 25 },
                    end: { line: 1, col: 25 },
                    source: ''
                  },
                  value: '',
                  raw: '""'
                }
              ]
            },
            shorthand: false
          }
        ]
      }
    }
  ]
}

tokens (18x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       STRING_DOUBLE PUNCTUATOR PUNCTUATOR PUNCTUATOR ASI
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