# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/yield/arguments_checks/more_arg_checks/yield_as_arg_inside_a_generator.md

> :: const statement : binding generic : yield : arguments checks : more arg checks
>
> ::> yield as arg inside a generator
>
> the inner function resets the state

## Input

`````js
function *f({x: x}) { function f({x: yield}) {} }
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 49 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 49 },
        source: ''
      },
      generator: true,
      async: false,
      id: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 10 },
          end: { line: 1, col: 10 },
          source: ''
        },
        name: 'f'
      },
      params: [
        {
          type: 'ObjectPattern',
          loc: {
            start: { line: 1, col: 12 },
            end: { line: 1, col: 18 },
            source: ''
          },
          properties: [
            {
              type: 'Property',
              loc: {
                start: { line: 1, col: 13 },
                end: { line: 1, col: 17 },
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
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 16 },
                  end: { line: 1, col: 17 },
                  source: ''
                },
                name: 'x'
              },
              shorthand: false
            }
          ]
        }
      ],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 20 },
          end: { line: 1, col: 49 },
          source: ''
        },
        body: [
          {
            type: 'FunctionDeclaration',
            loc: {
              start: { line: 1, col: 22 },
              end: { line: 1, col: 48 },
              source: ''
            },
            generator: false,
            async: false,
            id: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 31 },
                end: { line: 1, col: 31 },
                source: ''
              },
              name: 'f'
            },
            params: [
              {
                type: 'ObjectPattern',
                loc: {
                  start: { line: 1, col: 33 },
                  end: { line: 1, col: 43 },
                  source: ''
                },
                properties: [
                  {
                    type: 'Property',
                    loc: {
                      start: { line: 1, col: 34 },
                      end: { line: 1, col: 42 },
                      source: ''
                    },
                    key: {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 34 },
                        end: { line: 1, col: 37 },
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
                        start: { line: 1, col: 37 },
                        end: { line: 1, col: 42 },
                        source: ''
                      },
                      name: 'yield'
                    },
                    shorthand: false
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              loc: {
                start: { line: 1, col: 45 },
                end: { line: 1, col: 48 },
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

tokens (24x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use `yield` outside of generator functions when in strict mode

function *f({x: x}) { function f({x: yield}) {} }
                                          ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._