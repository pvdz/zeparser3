# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bletx005d/class_method/assigned_to_in_param_default_w_directive.md

> :: strict mode : header requirements for directive in body : ident = [let] : class method
>
> ::> assigned to in param default w directive
>
> the default (always) causes the error, not the usage, but whatever

## Input


`````js
class c {foo(x=let=y){ "use strict"; }}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Can not use `let` as variable name in strict mode

class c {foo(x=let=y){ "use strict"; }}
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