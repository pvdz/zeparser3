# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/literals/identifier_properties/object_with_two_classic_properties.md

> :: objects : literals : identifier properties
>
> ::> object with two classic properties

## Input

`````js
wrap({a:b, c:d});
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
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 17 },
        source: ''
      },
      expression: {
        type: 'CallExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 16 },
          source: ''
        },
        callee: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 4 },
            source: ''
          },
          name: 'wrap'
        },
        arguments: [
          {
            type: 'ObjectExpression',
            loc: {
              start: { line: 1, col: 5 },
              end: { line: 1, col: 15 },
              source: ''
            },
            properties: [
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 6 },
                  end: { line: 1, col: 9 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 6 },
                    end: { line: 1, col: 8 },
                    source: ''
                  },
                  name: 'a'
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
                  name: 'b'
                },
                shorthand: false
              },
              {
                type: 'Property',
                loc: {
                  start: { line: 1, col: 11 },
                  end: { line: 1, col: 14 },
                  source: ''
                },
                key: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 11 },
                    end: { line: 1, col: 13 },
                    source: ''
                  },
                  name: 'c'
                },
                kind: 'init',
                method: false,
                computed: false,
                value: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 13 },
                    end: { line: 1, col: 14 },
                    source: ''
                  },
                  name: 'd'
                },
                shorthand: false
              }
            ]
          }
        ]
      }
    }
  ]
}

tokens (14x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
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