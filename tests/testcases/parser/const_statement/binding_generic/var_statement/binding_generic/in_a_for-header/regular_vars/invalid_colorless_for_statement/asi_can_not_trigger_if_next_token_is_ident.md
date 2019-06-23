# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/var_statement/binding_generic/in_a_for-header/regular_vars/invalid_colorless_for_statement/asi_can_not_trigger_if_next_token_is_ident.md

> :: const statement : binding generic : var statement : binding generic : in a for-header : regular vars : invalid colorless for statement
>
> ::> asi can not trigger if next token is ident
>
> expecting for-header semi

## Input

`````js
for (var
foo());
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Next ord should be 59 (`;`) but was 40 (curc: `(`, token: `(`)

for (var
foo());
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

_Output same as sloppy mode._