let {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('tests related to bindings', _ => {
    // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
    // can not have bindings in args that also appear in LexicallyDeclaredNames
    // > The LexicallyDeclaredNames of a FunctionBody does not include identifiers bound using var or function declarations.

    // > Multiple occurrences of the same BindingIdentifier in a FormalParameterList is only allowed for functions which have simple parameter lists and which are not defined in strict mode code.

    // > It is a Syntax Error if PrototypePropertyNameList of ClassElementList contains more than one occurrence of "constructor".
  });


