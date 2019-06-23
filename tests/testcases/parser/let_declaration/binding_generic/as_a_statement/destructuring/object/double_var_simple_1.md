# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/let_declaration/binding_generic/as_a_statement/destructuring/object/double_var_simple_1.md

> :: let declaration : binding generic : as a statement : destructuring : object
>
> ::> double var simple 1

## Input

`````js
let {x, y} = obj;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 17 } },
  body: [
    {
      type: 'VariableDeclaration',
      loc: {
        start: { line: 1, col: 4 },
        end: { line: 1, col: 16 },
        source: ''
      },
      kind: 'let',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc: {
            start: { line: 1, col: 4 },
            end: { line: 1, col: 16 },
            source: ''
          },
          id: {
            type: 'ObjectPattern',
            loc: {
              start: { line: 1, col: 4 },
              end: { line: 1, col: 11 },
              source: ''
            },
            properties: [
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 5 },
                  end: { line: 1, col: 6 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 5 },
                    end: { line: 1, col: 6 },
                    source: ''
                  },
                  name: 'x'
                },
                kind: 'init',
                method: false,
                computed: false,
                value: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 5 },
                    end: { line: 1, col: 6 },
                    source: ''
                  },
                  name: 'x'
                },
                shorthand: true
              },
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 8 },
                  end: { line: 1, col: 9 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 8 },
                    end: { line: 1, col: 9 },
                    source: ''
                  },
                  name: 'y'
                },
                kind: 'init',
                method: false,
                computed: false,
                value: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 8 },
                    end: { line: 1, col: 9 },
                    source: ''
                  },
                  name: 'y'
                },
                shorthand: true
              }
            ]
          },
          init: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 13 },
              end: { line: 1, col: 16 },
              source: ''
            },
            name: 'obj'
          }
        }
      ]
    }
  ]
}

tokens (10x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR
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