# ZeParser parser test case

- Path: zeparser3/tests/testcases/parser/objects/duplicate_keys/obj_expr/dunderproto___proto__/ident_string.md

> :: objects : duplicate keys : obj expr : dunderproto   proto  
>
> ::> ident string
>
> Regression caught by test262/test/annexB/language/expressions/object/__proto__-duplicate.js
>
> The test claims it should fail because string keys are not exempted from the double `__proto__` rule
>
> I think the test is incorrect because the spec says to ignore early errors while parsing a cover grammer, which we are.

TODO: report error in test262

## SKIP
## PASS

## Input

`````js
({
  __proto__: null,
  other: null,
  '__proto__': null
});
`````
