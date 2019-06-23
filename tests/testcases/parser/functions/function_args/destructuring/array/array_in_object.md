# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/functions/function_args/destructuring/array/array_in_object.md

> :: functions : function args : destructuring : array
>
> ::> array in object

## Input

`````js
function fk({x: [a, {b: []}]}) {}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 33 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 33 },
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
        name: 'fk'
      },
      params: [
        {
          type: 'ObjectPattern',
          loc: {
            start: { line: 1, col: 12 },
            end: { line: 1, col: 29 },
            source: ''
          },
          properties: [
            {
              type: 'Property',
              loc: {
                start: { line: 1, col: 13 },
                end: { line: 1, col: 28 },
                source: ''
              },
              key: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 13 },
                  end: { line: 1, col: 16 },
                  source: ''
                },
                name: 'x'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'ArrayPattern',
                loc: {
                  start: { line: 1, col: 16 },
                  end: { line: 1, col: 28 },
                  source: ''
                },
                elements: [
                  {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 17 },
                      end: { line: 1, col: 18 },
                      source: ''
                    },
                    name: 'a'
                  },
                  {
                    type: 'ObjectPattern',
                    loc: {
                      start: { line: 1, col: 20 },
                      end: { line: 1, col: 27 },
                      source: ''
                    },
                    properties: [
                      {
                        type: 'Property',
                        loc: {
                          start: { line: 1, col: 21 },
                          end: { line: 1, col: 26 },
                          source: ''
                        },
                        key: {
                          type: 'Identifier',
                          loc: {
                            start: { line: 1, col: 21 },
                            end: { line: 1, col: 24 },
                            source: ''
                          },
                          name: 'b'
                        },
                        kind: 'init',
                        method: false,
                        computed: false,
                        value: {
                          type: 'ArrayPattern',
                          loc: {
                            start: { line: 1, col: 24 },
                            end: { line: 1, col: 26 },
                            source: ''
                          },
                          elements: []
                        },
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              shorthand: false
            }
          ]
        }
      ],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 31 },
          end: { line: 1, col: 33 },
          source: ''
        },
        body: []
      }
    }
  ]
}

tokens (21x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR
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