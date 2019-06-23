# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/functions/yield_and_await_keyword_cases/generator/body/global_x_x003cyield_awaitx003e_x_x003cregular_async_generator_async_genx003e_x_arg-default_x_decl/async_func_decl_await.md

> :: functions : yield and await keyword cases : generator : body : global x <yield, await> x <regular, async, generator, async gen> x arg-default x decl
>
> ::> async func decl await
>
> barring exceptions -- for all functions and methods goes:
>
> - name of the func keeps outer scope await/yield state. exception: function expressions clear it.
> - args and body explicitly set it according to the type of this function (so async sets await clears yield, etc)
>
> This means you can use `await` as a function name as long as you are not in strict mode and not already inside an async function and it's okay if the function whose name is being defined is actually async itself.
>
> the cases to test are a cross product of:
>
> - `<global, inside async, inside generator>` 
> - `x` 
> - `<yield, await>`
> - `x` 
> - `<regular, async, generator, async gen>`
> - `x` 
> - `<name, arg-name, arg-default, body>`
> - `x`
> - `<class method, obj method, decl, expr, default>`

## Input

`````js
function *as(){ async function f() { return await foo; } }
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 58 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 58 },
        source: ''
      },
      generator: true,
      async: false,
      id: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 10 },
          end: { line: 1, col: 10 },
          source: ''
        },
        name: 'as'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 14 },
          end: { line: 1, col: 58 },
          source: ''
        },
        body: [
          {
            type: 'FunctionDeclaration',
            loc: {
              start: { line: 1, col: 22 },
              end: { line: 1, col: 57 },
              source: ''
            },
            generator: false,
            async: true,
            id: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 31 },
                end: { line: 1, col: 31 },
                source: ''
              },
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              loc: {
                start: { line: 1, col: 35 },
                end: { line: 1, col: 57 },
                source: ''
              },
              body: [
                {
                  type: 'ReturnStatement',
                  loc: {
                    start: { line: 1, col: 37 },
                    end: { line: 1, col: 55 },
                    source: ''
                  },
                  argument: {
                    type: 'AwaitExpression',
                    loc: {
                      start: { line: 1, col: 44 },
                      end: { line: 1, col: 53 },
                      source: ''
                    },
                    argument: {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 50 },
                        end: { line: 1, col: 53 },
                        source: ''
                      },
                      name: 'foo'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

tokens (19x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR
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