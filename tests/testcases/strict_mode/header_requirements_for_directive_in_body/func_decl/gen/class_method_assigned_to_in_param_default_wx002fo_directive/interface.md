# ZeParser parser autogenerated test case

- From: tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/autogen.md
- Path: tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_assigned_to_in_param_default_wx002fo_directive/interface.md

> :: strict mode : header requirements for directive in body : func decl : gen : class method assigned to in param default wx002fo directive
>
> ::> interface

## Input


`````js
class A {
  e(x=interface=10){ }
}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Illegal keyword encountered; is not a value [interface]

class A {
  e(x=interface=10){ }
               ^------- error

}
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