import {reduceErrorInput} from "../test_case_reducer.mjs";
import {
  dumpFuzzOutput,
  warnOsd,
} from './fuzzutils.mjs'

const VERBOSE = false;
const buffer = [];

function fuzzAgainstNode(input, zefailed, counts, injectionMode, parseZeParser) {
  let parsedInput = input;

  let nodefailed = false;
  let errorMessage = zefailed;
  try {
    Function(input);
    if (!injectionMode) ++counts.nodePassedFuzz;
  } catch (e) {
    if (!zefailed) errorMessage = e.message;
    nodefailed = e.message;
  }

  if (!nodefailed !== !zefailed) {
    if (nodefailed && (undefined
      || nodefailed.includes('has already been declared') // `switch(y){case y:function*d(){}function*d(){}}`
      || nodefailed.includes('Unexpected eval or arguments in strict mode') // (eval = a => { "use strict"})
      || nodefailed.includes('Unexpected strict mode reserved word') // (interface = a => { "use strict"})
    )) {
      if (VERBOSE) buffer.push('Skipping case that is likely a false positive (error in node that was not an error in zeparser)');
    }
    else if (zefailed && (undefined
      // Regexes
      // v8 is lazy parsing regexes
      || zefailed.includes('Tokenizer error! Regex:')

      // Delete
      // v8 doesn't seem to statically detect the delete-on-ident case
      || zefailed.includes('Bad delete case')

      // No lexical validation for occurrence of `break` or `continue`
      || zefailed.includes('inside a `switch` or loop')

      // `let \n keyword` case is not covered by v8, I guess (`let \n while (x);`)
      || zefailed.includes('must be a declaration in strict mode but the next ident is a reserved keyword')

      // Octals
      // Too many false positives over octals in classes
      || zefailed.includes('octal escape in strict mode')
      // Pretty sure this is a bug in v8
      || zefailed.includes('exponent is not allowed after a legacy octal')

      // Classes
      // v8 allows members that aren't methods (I guess stage<4 stuff?) or is just lazy
      || zefailed.includes('current modifier is unknown') // `class x extends y{c}`
      // This is in the same boat, it's just that zeparser throws an explicit message
      || zefailed.includes('Async methods are a restricted production')

      // Break Continue
      // It seems v8 is not thoroughly checking their scope at parse time
      || zefailed.includes('only `continue` inside a loop')

      // Assignments to crap
      // Getting too many false positives for something like `y()=x` so going to disable the whole range :(
      || zefailed.includes('because it is not a valid assignment target')
    )) {
      // ignore (based on original input)
      if (VERBOSE) buffer.push('Skipping case that is likely a false positive (error in zeparser that was not an error in node)');
    }
    else {
      let beforeLen = input.length;
      let checker = zefailed
        ? input => parseZeParser(input, counts, true)
        : input => {try { return {e: undefined, n: Function(input)}; } catch (e) { return {e} }};

      if (VERBOSE) buffer.push(['Trimming input (len was ' + input.length +')']);
      input = reduceErrorInput(input, checker, undefined, true);
      ++counts.reduced;
      if (VERBOSE) buffer.push(['Finished trimming (len now ' + input.length +', down from ' + beforeLen + ')']);

      if (0
        // Post minification code is easier to grep for but comes at a cost (-> the minification process is expensive)

        // Class methods:
        // Node is allowing `class x {y}` which leads to a bunch of false positives in the fuzzer
        | /class\s*[\w\d$_]*(?:\s*extends\s*[\w\d$_]*)?\s*\{\s*\[?[\w\d$_]*\]?\s*([;}]|$)/.test(input)
        // Node/v8 seems to accept legacy octals that end in 8 or 9 and have an exponent or dot-fraction
        // I don't think that's a possible goal with the grammar
        || /\b0\d+[.eE]/.test(input) // 03.12  04e1  03E9
        || /[\w$_]+\.\d/.test(input) // Stems from octal with dot tail
        // This may be legacy but node/v8 will accept `y()=x` even though that's a parse error now (wasn't in es5...)
        || /\(\)(?:=[^>]|\s*of|\s*in)/.test(input)
        // Same for ++y() and other updates
        || /[-+]{2}\w+\(\)/.test(input)
        || /\w+\(\)[-+]{2}/.test(input)
      ) {
        // ignore (based on trimmed input)
        if (VERBOSE) buffer.push('Ignoring outcome after trimming because it probably is a false positive');
      } else {
        // We will exit in this branch

        console.log('');
        if (nodefailed) {
          console.log('Thrown by v8');
        } else {
          console.log('Not thrown by v8');
        }

        if (zefailed) {
          console.log('Thrown by zeparser');
        } else {
          console.log('Not thrown by zeparser');
        }

        if (zefailed) {
          dumpFuzzOutput(input, parsedInput, errorMessage, 'zeparser failed but node did not');
          warnOsd('zeparser');
        } else if (nodefailed) {
          dumpFuzzOutput(input, parsedInput, errorMessage, 'node failed but zeparser did not');
          warnOsd('zeparser');
        }

        process.exit();
      }
    }
  }
}

export {
  fuzzAgainstNode,
};
