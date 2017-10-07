# ZeParser 3

A JavaScript parser written in JavaScript, parsing ES6+.

This is very much a WIP (work in progress).

The parser is over-accepting and will parse most but not all JS yet. Many edge cases yet to be covered. All in due time.

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

# Building

While the parser runs perfectly fine in dev mode it will be a bit slow. To generate a build (stored in `build/build.js`) run this in the project root:

```
mkdir build
./cli/build.js
```

The [build script](cli/build.js):

- will remove non-assert dev artifacts
- can remove inline asserts (lines that start with `ASSERT`)
- can remove all the AST generation from the build (lines that start with `AST`)

You can toggle asserts and AST at the top of the build file.

# Perf testing

Still setting up a more rigid way of perf testing but for now;

See [`tests/perf/parser/run.js`](tests/perf/parser/run.js) and update the location of the input file. I'm currently using [a 20mb webkit.js file](https://github.com/trevorlinton/webkit.js/blob/master/bin/webkit.bin.js) that is not part of this repo. You'll need to download it and update the link in the runner. Then you can build and run. 

```
./cli/build.js && ./tests/perf/parser/run.js
```

See above for configuring the build script. In the perf script you can adjust the call to the parser to tell it to retain tokens or not. Generating AST and retaining tokens will affect the parse times at large inputs.

# TODO

Well, finish it, of course. Besides that;

- Tighter integration between parser and tokenizer of pre-known tokens
  - This ties into enforcing reserved keyword checks
- Make build dir automatically
- Sync `class` with the exotic ways of building an object literal (already supported for objlits)
- Find more things that I've overlooked. Clamp down on the over-accepting.
