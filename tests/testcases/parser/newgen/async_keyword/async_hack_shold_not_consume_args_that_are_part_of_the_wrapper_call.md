# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/async_keyword/async_hack_shold_not_consume_args_that_are_part_of_the_wrapper_call.md

> :: async keyword
>
> ::> async hack shold not consume args that are part of the wrapper call

## Input

`````js
foo(async(x,y,z), a, b)
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 23 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 23 },
        source: ''
      },
      expression: {
        type: 'CallExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 23 },
          source: ''
        },
        callee: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 3 },
            source: ''
          },
          name: 'foo'
        },
        arguments: [
          {
            type: 'CallExpression',
            loc: {
              start: { line: 1, col: 4 },
              end: { line: 1, col: 16 },
              source: ''
            },
            callee: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 4 },
                end: { line: 1, col: 16 },
                source: ''
              },
              name: 'async'
            },
            arguments: [
              {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 10 },
                  end: { line: 1, col: 11 },
                  source: ''
                },
                name: 'x'
              },
              {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 12 },
                  end: { line: 1, col: 13 },
                  source: ''
                },
                name: 'y'
              },
              {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 14 },
                  end: { line: 1, col: 15 },
                  source: ''
                },
                name: 'z'
              }
            ]
          },
          {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 18 },
              end: { line: 1, col: 19 },
              source: ''
            },
            name: 'a'
          },
          {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 21 },
              end: { line: 1, col: 22 },
              source: ''
            },
            name: 'b'
          }
        ]
      }
    }
  ]
}

tokens (17x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR ASI
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