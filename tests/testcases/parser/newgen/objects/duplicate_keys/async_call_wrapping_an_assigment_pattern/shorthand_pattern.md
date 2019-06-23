# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/duplicate_keys/async_call_wrapping_an_assigment_pattern/shorthand_pattern.md

> :: objects : duplicate keys : async call wrapping an assigment pattern
>
> ::> shorthand pattern

## Input

`````js
async({x, x} = obj)
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
          end: { line: 1, col: 19 },
          source: ''
        },
        callee: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 19 },
            source: ''
          },
          name: 'async'
        },
        arguments: [
          {
            type: 'AssignmentExpression',
            loc: {
              start: { line: 1, col: 6 },
              end: { line: 1, col: 18 },
              source: ''
            },
            left: {
              type: 'ObjectPattern',
              loc: {
                start: { line: 1, col: 6 },
                end: { line: 1, col: 13 },
                source: ''
              },
              properties: [
                {
                  type: 'Property',
                  loc: {
                    start: { line: 1, col: 7 },
                    end: { line: 1, col: 8 },
                    source: ''
                  },
                  key: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 7 },
                      end: { line: 1, col: 8 },
                      source: ''
                    },
                    name: 'x'
                  },
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 7 },
                      end: { line: 1, col: 8 },
                      source: ''
                    },
                    name: 'x'
                  },
                  shorthand: true
                },
                {
                  type: 'Property',
                  loc: {
                    start: { line: 1, col: 10 },
                    end: { line: 1, col: 11 },
                    source: ''
                  },
                  key: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 10 },
                      end: { line: 1, col: 11 },
                      source: ''
                    },
                    name: 'x'
                  },
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 10 },
                      end: { line: 1, col: 11 },
                      source: ''
                    },
                    name: 'x'
                  },
                  shorthand: true
                }
              ]
            },
            operator: '=',
            right: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 15 },
                end: { line: 1, col: 18 },
                source: ''
              },
              name: 'obj'
            }
          }
        ]
      }
    }
  ]
}

tokens (12x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR ASI
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