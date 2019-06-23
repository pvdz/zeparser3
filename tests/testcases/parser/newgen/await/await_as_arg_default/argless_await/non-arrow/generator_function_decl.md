# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/await/await_as_arg_default/argless_await/non-arrow/generator_function_decl.md

> :: await : await as arg default : argless await : non-arrow
>
> ::> generator function decl

## Input

`````js
function *f(foo = await){}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 26 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 26 },
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
        name: 'f'
      },
      params: [
        {
          type: 'AssignmentPattern',
          loc: {
            start: { line: 1, col: 12 },
            end: { line: 1, col: 23 },
            source: ''
          },
          left: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 12 },
              end: { line: 1, col: 12 },
              source: ''
            },
            name: 'foo'
          },
          right: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 18 },
              end: { line: 1, col: 23 },
              source: ''
            },
            name: 'await'
          }
        }
      ],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 24 },
          end: { line: 1, col: 26 },
          source: ''
        },
        body: []
      }
    }
  ]
}

tokens (11x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Cannot use `await` as var when goal=module but found `await` outside an async function

function *f(foo = await){}
                       ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._