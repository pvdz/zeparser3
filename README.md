# ZeParser 3

A JavaScript parser written in JavaScript, parsing ES6+.

This is very much a WIP (work in progress) pushed as a "proof of state" before further adventures start :)

The parser is overaccepting and will parse most but not all JS yet. Many edge cases yet to be covered. All in due time.

Tokenizer has about 2 weeks of work, parser about 3 weeks of work in it.

```
# Tokenizer tests:
./tests/zetokenizer.spec.js

# Tokenizer fuzz testing (broken atm)
./tests/fuzz_tokens.js

# Parser tests
./tests/zeparser.spec.js

# Generated combinator non-crash tests
./tests/generated
```

# TODO

Well finish it, of course. Besides that;

- Post processing to remove inline asserts
- Tigher integration between parser and tokenizer of pre-known tokens
- Optionally strip the AST part to produce only tokens
