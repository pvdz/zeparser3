# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/tests_related_to_bindings/catch/for-in_edge_case/without_webcompat/catch_var_as_for-of_let.md

> :: tests related to bindings : catch : for-in edge case : without webcompat
>
> ::> catch var as for-of let
>
> lexical binding does not live in same scope as catch var

## Input

`````js
try {} catch (e) { for (let e of y) {} }
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 40 } },
  body: [
    {
      type: 'TryStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 40 },
        source: ''
      },
      block: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 4 },
          end: { line: 1, col: 7 },
          source: ''
        },
        body: []
      },
      handler: {
        type: 'CatchClause',
        loc: {
          start: { line: 1, col: 7 },
          end: { line: 1, col: 40 },
          source: ''
        },
        param: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 14 },
            end: { line: 1, col: 14 },
            source: ''
          },
          name: 'e'
        },
        body: {
          type: 'BlockStatement',
          loc: {
            start: { line: 1, col: 17 },
            end: { line: 1, col: 40 },
            source: ''
          },
          body: [
            {
              type: 'ForOfStatement',
              loc: {
                start: { line: 1, col: 19 },
                end: { line: 1, col: 39 },
                source: ''
              },
              left: {
                type: 'VariableDeclaration',
                loc: {
                  start: { line: 1, col: 28 },
                  end: { line: 1, col: 30 },
                  source: ''
                },
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    loc: {
                      start: { line: 1, col: 28 },
                      end: { line: 1, col: 30 },
                      source: ''
                    },
                    id: {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 28 },
                        end: { line: 1, col: 28 },
                        source: ''
                      },
                      name: 'e'
                    },
                    init: null
                  }
                ]
              },
              right: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 33 },
                  end: { line: 1, col: 34 },
                  source: ''
                },
                name: 'y'
              },
              await: false,
              body: {
                type: 'BlockStatement',
                loc: {
                  start: { line: 1, col: 36 },
                  end: { line: 1, col: 39 },
                  source: ''
                },
                body: []
              }
            }
          ]
        }
      },
      finalizer: null
    }
  ]
}

tokens (19x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR IDENT IDENT IDENT IDENT PUNCTUATOR
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