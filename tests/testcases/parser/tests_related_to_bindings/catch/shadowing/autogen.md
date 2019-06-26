# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/var_statement/binding_generic/reserved_words/autogen.md

> :: var statement : binding generic
>
> ::> reserved words
>
> https://tc39.github.io/ecma262/#sec-variablestatements-in-catch-blocks
> 
> > It is a Syntax Error if any element of the BoundNames of CatchParameter also occurs in the VarDeclaredNames of Block
> 
> unless CatchParameter is CatchParameter:BindingIdentifier and that element is only bound by
> - a VariableStatement,
> - the VariableDeclarationList of a for statement,
> - the ForBinding of a for-in statement, or
> - the BindingIdentifier of a for-in statement.
> 
> (explicitly not for-of, which makes sense as its only for backwards compat and for-of is too new)
> 
> https://tc39.github.io/ecma262/#sec-try-statement-static-semantics-early-errors
> 
> > It is a Syntax Error if any element of the BoundNames of CatchParameter also occurs in the LexicallyDeclaredNames of Block.
> > 
> > It is a Syntax Error if any element of the BoundNames of CatchParameter also occurs in the VarDeclaredNames of Block.
> 
> (catch var, also has an annex B case)
> 
> TODO: ES2020 will straighten that out and include for-of here
>
> https://twitter.com/Ghost1240145716/status/1139486701754077186
> https://github.com/tc39/ecma262/pull/1393

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> var
> `````

> `````js
> let
> `````

> `````js
> const
> `````

### Templates

#### Binding declaration shadowing catch var

`````js
try {} catch (e) { # e = x; }
`````

#### Block scoped binding declaration shadowing catch var

`````js
try {} catch (e) { { # e = x; } }
`````

#### Binding in for-header shadowing catch var

`````js
try {} catch (e) { for (# e = 1;;) {} }
`````

#### Binding in for-in-header shadowing catch var

`````js
try {} catch (e) { for (# e in y) {} }
`````

#### Binding in for-of-header shadowing catch var

`````js
try {} catch (e) { for (# e of y) {} }
`````
