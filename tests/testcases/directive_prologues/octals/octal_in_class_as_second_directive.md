# ZeParser parser test case

- Path: zeparser3/tests/testcases/todo/octal_in_class.md

> :: todo
>
> ::> octal in class
>
> Regression was not flagging octal escape inside a class method when it appeared in the second (not first) directive

## FAIL

## Input

`````js
class x {
  y(){
    "";
    "\5";
  }
}
`````


