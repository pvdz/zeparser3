# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/yield/arguments_checks/yield_without_generator_as_an_arrow_param_default.md

> :: yield : arguments checks
>
> ::> yield without generator as an arrow param default

## Input

`````js
({x} = yield) => {}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 19 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 19 },
        source: ''
      },
      expression: {
        type: 'ArrowFunctionExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 19 },
          source: ''
        },
        params: [
          {
            type: 'AssignmentPattern',
            loc: {
              start: { line: 1, col: 1 },
              end: { line: 1, col: 12 },
              source: ''
            },
            left: {
              type: 'ObjectPattern',
              loc: {
                start: { line: 1, col: 1 },
                end: { line: 1, col: 5 },
                source: ''
              },
              properties: [
                {
                  type: 'Property',
                  loc: {
                    start: { line: 1, col: 2 },
                    end: { line: 1, col: 3 },
                    source: ''
                  },
                  key: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 2 },
                      end: { line: 1, col: 3 },
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
                      start: { line: 1, col: 2 },
                      end: { line: 1, col: 3 },
                      source: ''
                    },
                    name: 'x'
                  },
                  shorthand: true
                }
              ]
            },
            right: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 7 },
                end: { line: 1, col: 12 },
                source: ''
              },
              name: 'yield'
            }
          }
        ],
        id: null,
        generator: false,
        async: false,
        expression: false,
        body: {
          type: 'BlockStatement',
          loc: {
            start: { line: 1, col: 17 },
            end: { line: 1, col: 19 },
            source: ''
          },
          body: []
        }
      }
    }
  ]
}

tokens (12x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use `yield` outside of generator functions when in strict mode

({x} = yield) => {}
            ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._