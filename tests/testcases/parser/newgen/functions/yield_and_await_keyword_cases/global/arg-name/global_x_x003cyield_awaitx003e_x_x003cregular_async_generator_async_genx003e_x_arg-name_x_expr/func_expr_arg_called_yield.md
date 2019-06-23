# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/functions/yield_and_await_keyword_cases/global/arg-name/global_x_x003cyield_awaitx003e_x_x003cregular_async_generator_async_genx003e_x_arg-name_x_expr/func_expr_arg_called_yield.md

> :: functions : yield and await keyword cases : global : arg-name : global x <yield, await> x <regular, async, generator, async gen> x arg-name x expr
>
> ::> func expr arg called yield
>
> only illegal in strict mode

## Input

`````js
let f = function f(yield) {}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 28 } },
  body: [
    {
      type: 'VariableDeclaration',
      loc: {
        start: { line: 1, col: 4 },
        end: { line: 1, col: 28 },
        source: ''
      },
      kind: 'let',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc: {
            start: { line: 1, col: 4 },
            end: { line: 1, col: 28 },
            source: ''
          },
          id: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 4 },
              end: { line: 1, col: 4 },
              source: ''
            },
            name: 'f'
          },
          init: {
            type: 'FunctionExpression',
            loc: {
              start: { line: 1, col: 8 },
              end: { line: 1, col: 28 },
              source: ''
            },
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 17 },
                end: { line: 1, col: 17 },
                source: ''
              },
              name: 'f'
            },
            params: [
              {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 19 },
                  end: { line: 1, col: 19 },
                  source: ''
                },
                name: 'yield'
              }
            ],
            body: {
              type: 'BlockStatement',
              loc: {
                start: { line: 1, col: 26 },
                end: { line: 1, col: 28 },
                source: ''
              },
              body: []
            }
          }
        }
      ]
    }
  ]
}

tokens (12x):
       IDENT IDENT PUNCTUATOR IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use this name (yield) as a variable name because: Cannot use this reserved word as a variable name in strict mode

let f = function f(yield) {}
                   ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._