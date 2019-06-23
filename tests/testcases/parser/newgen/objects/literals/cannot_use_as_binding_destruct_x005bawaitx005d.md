# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/literals/cannot_use_as_binding_destruct_x005bawaitx005d.md

> :: objects : literals
>
> ::> cannot use as binding destruct [await]

## Input

`````js
const {await} = x;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 18 } },
  body: [
    {
      type: 'VariableDeclaration',
      loc: {
        start: { line: 1, col: 6 },
        end: { line: 1, col: 17 },
        source: ''
      },
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc: {
            start: { line: 1, col: 6 },
            end: { line: 1, col: 17 },
            source: ''
          },
          id: {
            type: 'ObjectPattern',
            loc: {
              start: { line: 1, col: 6 },
              end: { line: 1, col: 14 },
              source: ''
            },
            properties: [
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 7 },
                  end: { line: 1, col: 12 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 7 },
                    end: { line: 1, col: 12 },
                    source: ''
                  },
                  name: 'await'
                },
                kind: 'init',
                method: false,
                computed: false,
                value: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 7 },
                    end: { line: 1, col: 12 },
                    source: ''
                  },
                  name: 'await'
                },
                shorthand: true
              }
            ]
          },
          init: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 16 },
              end: { line: 1, col: 17 },
              source: ''
            },
            name: 'x'
          }
        }
      ]
    }
  ]
}

tokens (8x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Cannot use this name (await) as a variable name because: Await is illegal outside of async body with module goal

const {await} = x;
            ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._