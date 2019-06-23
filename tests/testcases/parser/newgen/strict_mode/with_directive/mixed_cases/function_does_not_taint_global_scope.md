# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/strict_mode/with_directive/mixed_cases/function_does_not_taint_global_scope.md

> :: strict mode : with directive : mixed cases
>
> ::> function does not taint global scope

## Input

`````js
function f(){ "use strict"; foo; } with (x) y;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 46 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 35 },
        source: ''
      },
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 9 },
          end: { line: 1, col: 9 },
          source: ''
        },
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 12 },
          end: { line: 1, col: 35 },
          source: ''
        },
        body: [
          {
            type: 'ExpressionStatement',
            loc: {
              start: { line: 1, col: 14 },
              end: { line: 1, col: 28 },
              source: ''
            },
            expression: {
              type: 'Literal',
              loc: {
                start: { line: 1, col: 14 },
                end: { line: 1, col: 14 },
                source: ''
              },
              value: 'use strict',
              raw: '"use strict"'
            },
            directive: 'use strict'
          },
          {
            type: 'ExpressionStatement',
            loc: {
              start: { line: 1, col: 28 },
              end: { line: 1, col: 33 },
              source: ''
            },
            expression: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 28 },
                end: { line: 1, col: 31 },
                source: ''
              },
              name: 'foo'
            }
          }
        ]
      }
    },
    {
      type: 'WithStatement',
      loc: {
        start: { line: 1, col: 35 },
        end: { line: 1, col: 46 },
        source: ''
      },
      object: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 41 },
          end: { line: 1, col: 42 },
          source: ''
        },
        name: 'x'
      },
      body: {
        type: 'ExpressionStatement',
        loc: {
          start: { line: 1, col: 44 },
          end: { line: 1, col: 46 },
          source: ''
        },
        expression: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 44 },
            end: { line: 1, col: 45 },
            source: ''
          },
          name: 'y'
        }
      }
    }
  ]
}

tokens (17x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR STRING_DOUBLE
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  The `with` statement is not allowed in strict mode

function f(){ "use strict"; foo; } with (x) y;
                                   ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._