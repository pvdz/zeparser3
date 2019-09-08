# ZeParser parser test case

- Path: tests/testcases/regexes/some_annexb_stuff/incomplete_unicode_escape/u_and_one_char_without_web_compat.md

> :: regexes : some annexb stuff : incomplete unicode escape
>
> ::> u and one char without web compat

## Input

`````js
/\ua/
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Regex: Encountered early EOF while parsing a unicode escape quad

/\ua/
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
ast: {
  type: 'Program',
  loc:{start:{line:1,column:0},end:{line:1,column:5},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:5},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:1,column:0},end:{line:1,column:5},source:''},
        value: null,
        regex: { pattern: '\\ua', flags: '' },
        raw: '/\\ua/'
      }
    }
  ]
}

tokens (3x):
       REGEX ASI
`````
