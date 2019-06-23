# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/group_or_arrow/group/groupx002farrow_with_trailing_comma/in_arrow/autogen.md
- Path: zeparser3/tests/testcases/parser/group_or_arrow/group/groupx002farrow_with_trailing_comma/in_arrow/gen/two_args

> :: test: two args
> :: case: Infinity

## Input

- `es = Infinity`

`````js
(a,b,) => x
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 11 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 11 },
        source: ''
      },
      expression: {
        type: 'ArrowFunctionExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 11 },
          source: ''
        },
        params: [
          {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 1 },
              end: { line: 1, col: 2 },
              source: ''
            },
            name: 'a'
          },
          {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 3 },
              end: { line: 1, col: 4 },
              source: ''
            },
            name: 'b'
          }
        ],
        id: null,
        generator: false,
        async: false,
        expression: true,
        body: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 10 },
            end: { line: 1, col: 11 },
            source: ''
          },
          name: 'x'
        }
      }
    }
  ]
}

tokens (10x):
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT ASI
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