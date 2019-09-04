# ZeParser parser test case

- Path: zeparser3/tests/testcases/classes/method_names_can_be_x0060prototypex0060/string_unicode_escape_key.md

> :: classes : method names can be `prototype`
>
> ::> string new unicode escape key
>
> Checks whether es6 unicode escape sequences are properly canonized

TODO: this is not properly canonized yet
## SKIP

## Input

`````js
class x { "prot\u{6f}type"(){} }
`````
