# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/objects/literals/identifier_properties/object_destructuring_with_a_classic_property_and_a_shorthand.md

> :: objects : literals : identifier properties
>
> ::> object destructuring with a classic property and a shorthand

## Input

`````js
wrap({a:b, c} = x);
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 19 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 19 },
        source: ''
      },
      expression: {
        type: 'CallExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 18 },
          source: ''
        },
        callee: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 4 },
            source: ''
          },
          name: 'wrap'
        },
        arguments: [
          {
            type: 'AssignmentExpression',
            loc: {
              start: { line: 1, col: 5 },
              end: { line: 1, col: 17 },
              source: ''
            },
            left: {
              type: 'ObjectPattern',
              loc: {
                start: { line: 1, col: 5 },
                end: { line: 1, col: 14 },
                source: ''
              },
              properties: [
                {
                  type: 'Property',
                  loc: {
                    start: { line: 1, col: 6 },
                    end: { line: 1, col: 9 },
                    source: ''
                  },
                  key: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 6 },
                      end: { line: 1, col: 8 },
                      source: ''
                    },
                    name: 'a'
                  },
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 8 },
                      end: { line: 1, col: 9 },
                      source: ''
                    },
                    name: 'b'
                  },
                  shorthand: false
                },
                {
                  type: 'Property',
                  loc: {
                    start: { line: 1, col: 11 },
                    end: { line: 1, col: 12 },
                    source: ''
                  },
                  key: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 11 },
                      end: { line: 1, col: 12 },
                      source: ''
                    },
                    name: 'c'
                  },
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 11 },
                      end: { line: 1, col: 12 },
                      source: ''
                    },
                    name: 'c'
                  },
                  shorthand: true
                }
              ]
            },
            operator: '=',
            right: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 16 },
                end: { line: 1, col: 17 },
                source: ''
              },
              name: 'x'
            }
          }
        ]
      }
    }
  ]
}

tokens (14x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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