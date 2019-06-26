# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/let_declaration/binding_pattern/bindingTypex003dx0060letx0060/shorthand_that_is_a_member_expression.md

> :: let declaration : binding pattern : bindingType=`let`
>
> ::> shorthand that is a member expression

## Input

`````js
let {a.b} = v;
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Unexpected character after object literal property name {# PUNCTUATOR : nl=N ws=N 6:7 curc=46 `.`#}

let {a.b} = v;
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