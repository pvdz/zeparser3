# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/tests_related_to_bindings/functions/rebinding_func_name/plain_function/double_decl_in_function_scope.md

> :: tests related to bindings : functions : rebinding func name : plain function
>
> ::> double decl in function scope
> 
> the func name is lexical but in its own scope, even for func exprs, however;
> 
> https://tc39.github.io/ecma262/#sec-block-static-semantics-toplevellexicallydeclarednames
> 
> > At the top level of a function, or script, function declarations are treated like var declarations rather than like lexical declarations.

## Input

`````js
function g() {  function f(){} function f(){} }
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 47 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 47 },
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
        name: 'g'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 13 },
          end: { line: 1, col: 47 },
          source: ''
        },
        body: [
          {
            type: 'FunctionDeclaration',
            loc: {
              start: { line: 1, col: 16 },
              end: { line: 1, col: 31 },
              source: ''
            },
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 25 },
                end: { line: 1, col: 25 },
                source: ''
              },
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              loc: {
                start: { line: 1, col: 28 },
                end: { line: 1, col: 31 },
                source: ''
              },
              body: []
            }
          },
          {
            type: 'FunctionDeclaration',
            loc: {
              start: { line: 1, col: 31 },
              end: { line: 1, col: 46 },
              source: ''
            },
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 40 },
                end: { line: 1, col: 40 },
                source: ''
              },
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              loc: {
                start: { line: 1, col: 43 },
                end: { line: 1, col: 46 },
                source: ''
              },
              body: []
            }
          }
        ]
      }
    }
  ]
}

tokens (19x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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