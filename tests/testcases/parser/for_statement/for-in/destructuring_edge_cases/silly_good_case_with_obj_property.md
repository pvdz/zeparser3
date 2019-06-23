# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/for_statement/for-in/destructuring_edge_cases/silly_good_case_with_obj_property.md

> :: for statement : for-in : destructuring edge cases
>
> ::> silly good case with obj property
> 
> https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors
> 
> > It is a Syntax Error if LeftHandSideExpression is either an ObjectLiteral or an ArrayLiteral and if LeftHandSideExpression is not covering an AssignmentPattern.

## Input

`````js
for ({}.bar in obj);
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 20 } },
  body: [
    {
      type: 'ForInStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 20 },
        source: ''
      },
      left: {
        type: 'MemberExpression',
        loc: {
          start: { line: 1, col: 5 },
          end: { line: 1, col: 12 },
          source: ''
        },
        object: {
          type: 'ObjectExpression',
          loc: {
            start: { line: 1, col: 5 },
            end: { line: 1, col: 7 },
            source: ''
          },
          properties: []
        },
        property: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 8 },
            end: { line: 1, col: 8 },
            source: ''
          },
          name: 'bar'
        },
        computed: false
      },
      right: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 15 },
          end: { line: 1, col: 18 },
          source: ''
        },
        name: 'obj'
      },
      body: {
        type: 'EmptyStatement',
        loc: {
          start: { line: 1, col: 19 },
          end: { line: 1, col: 20 },
          source: ''
        }
      }
    }
  ]
}

tokens (11x):
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       IDENT PUNCTUATOR PUNCTUATOR
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