# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/duplicate_keys/obj_expr/dunderproto___proto__/without_webcompat/exceptions/not_async/obj_plain_group.md

> :: objects : duplicate keys : obj expr : dunderproto __proto__ : without webcompat : exceptions : not async
>
> ::> obj plain group

## Input

`````js
({web: false, __proto__: a, __proto__: b});
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 43 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 43 },
        source: ''
      },
      expression: {
        type: 'ObjectExpression',
        loc: {
          start: { line: 1, col: 1 },
          end: { line: 1, col: 41 },
          source: ''
        },
        properties: [
          {
            type: 'Property',
            loc: {
              start: { line: 1, col: 2 },
              end: { line: 1, col: 12 },
              source: ''
            },
            key: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 2 },
                end: { line: 1, col: 7 },
                source: ''
              },
              name: 'web'
            },
            kind: 'init',
            method: false,
            computed: false,
            value: {
              type: 'Literal',
              loc: {
                start: { line: 1, col: 7 },
                end: { line: 1, col: 12 },
                source: ''
              },
              value: false,
              raw: 'false'
            },
            shorthand: false
          },
          {
            type: 'Property',
            loc: {
              start: { line: 1, col: 14 },
              end: { line: 1, col: 26 },
              source: ''
            },
            key: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 14 },
                end: { line: 1, col: 25 },
                source: ''
              },
              name: '__proto__'
            },
            kind: 'init',
            method: false,
            computed: false,
            value: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 25 },
                end: { line: 1, col: 26 },
                source: ''
              },
              name: 'a'
            },
            shorthand: false
          },
          {
            type: 'Property',
            loc: {
              start: { line: 1, col: 28 },
              end: { line: 1, col: 40 },
              source: ''
            },
            key: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 28 },
                end: { line: 1, col: 39 },
                source: ''
              },
              name: '__proto__'
            },
            kind: 'init',
            method: false,
            computed: false,
            value: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 39 },
                end: { line: 1, col: 40 },
                source: ''
              },
              name: 'b'
            },
            shorthand: false
          }
        ]
      }
    }
  ]
}

tokens (17x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
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