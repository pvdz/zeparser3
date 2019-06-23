# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/objects/ident_key_with_yield_values/global/string_key_with_yield_divs.md

> :: objects : ident key with yield values : global
>
> ::> string key with yield divs

## Input

`````js
s = {foo: yield /x/g}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 21 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 21 },
        source: ''
      },
      expression: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 21 },
          source: ''
        },
        left: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 0 },
            end: { line: 1, col: 2 },
            source: ''
          },
          name: 's'
        },
        operator: '=',
        right: {
          type: 'ObjectExpression',
          loc: {
            start: { line: 1, col: 4 },
            end: { line: 1, col: 21 },
            source: ''
          },
          properties: [
            {
              type: 'Property',
              loc: {
                start: { line: 1, col: 5 },
                end: { line: 1, col: 20 },
                source: ''
              },
              key: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 5 },
                  end: { line: 1, col: 10 },
                  source: ''
                },
                name: 'foo'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'BinaryExpression',
                loc: {
                  start: { line: 1, col: 10 },
                  end: { line: 1, col: 20 },
                  source: ''
                },
                left: {
                  type: 'BinaryExpression',
                  loc: {
                    start: { line: 1, col: 10 },
                    end: { line: 1, col: 18 },
                    source: ''
                  },
                  left: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 10 },
                      end: { line: 1, col: 16 },
                      source: ''
                    },
                    name: 'yield'
                  },
                  operator: '/',
                  right: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 17 },
                      end: { line: 1, col: 18 },
                      source: ''
                    },
                    name: 'x'
                  }
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 19 },
                    end: { line: 1, col: 20 },
                    source: ''
                  },
                  name: 'g'
                }
              },
              shorthand: false
            }
          ]
        }
      }
    }
  ]
}

tokens (13x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR IDENT PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use `yield` outside of generator functions when in strict mode

s = {foo: yield /x/g}
                ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._