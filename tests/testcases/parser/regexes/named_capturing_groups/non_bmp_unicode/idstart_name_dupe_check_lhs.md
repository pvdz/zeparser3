# ZeParser parser test case

- Path: zeparser3/tests/testcases/parser/regexes/named_capturing_groups/non_bmp_unicode/idstart_name_dupe_check_lhs.md

> :: regexes : named capturing groups : non bmp unicode
>
> ::> idstart name dupe check lhs
>
> Capturing group whole name is one non-bmp unicode ID_START
>
> This confirms whether the left hand of surrogate pair `\u{2F9DF}` / `\ud87e\udddf`, which is `\ud87e`, is correctly reported as not being declared as a group name
>
> The backreference should fail to match the group because it's only half of the surrogate pair
>
> However, 

## Input

`````js
/(?<@{x2f9df}@>foo)met\k<@{xfffd}@>/
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Wanted to parse an unescaped group name specifier but it had a bad start: [`@{xfffd}@`, 65533]

/(?<@{x2f9df}@>foo)met\k<@{xfffd}@>/
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
  loc:{start:{line:1,col:0},end:{line:1,col:20},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:20},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:1,col:0},end:{line:1,col:20},source:''},
        value: null,
        regex: { pattern: '(?<@{x2f9df}@>foo)met\\k<@{xfffd}@>', flags: '' },
        raw: '/(?<@{x2f9df}@>foo)met\\k<@{xfffd}@>/'
      }
    }
  ]
}

tokens (3x):
       REGEX ASI
`````
