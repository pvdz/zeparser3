# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/destructuring/destruct_assignment_that_starts_with_string.md

> :: objects : destructuring
>
> ::> destruct assignment that starts with string

## Input

`````js
({s: "foo".foo} = x)
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 20 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 20 },
        source: ''
      },
      expression: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 1 },
          end: { line: 1, col: 19 },
          source: ''
        },
        left: {
          type: 'ObjectPattern',
          loc: {
            start: { line: 1, col: 1 },
            end: { line: 1, col: 16 },
            source: ''
          },
          properties: [
            {
              type: 'Property',
              loc: {
                start: { line: 1, col: 2 },
                end: { line: 1, col: 14 },
                source: ''
              },
              key: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 2 },
                  end: { line: 1, col: 5 },
                  source: ''
                },
                name: 's'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'MemberExpression',
                loc: {
                  start: { line: 1, col: 5 },
                  end: { line: 1, col: 14 },
                  source: ''
                },
                object: {
                  type: 'Literal',
                  loc: {
                    start: { line: 1, col: 5 },
                    end: { line: 1, col: 5 },
                    source: ''
                  },
                  value: 'foo',
                  raw: '"foo"'
                },
                property: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 11 },
                    end: { line: 1, col: 11 },
                    source: ''
                  },
                  name: 'foo'
                },
                computed: false
              },
              shorthand: false
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 18 },
            end: { line: 1, col: 19 },
            source: ''
          },
          name: 'x'
        }
      }
    }
  ]
}

tokens (13x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR STRING_DOUBLE PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR ASI
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