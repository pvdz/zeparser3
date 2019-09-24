import {zeprinter} from "../src/tools/zeprinter.mjs";
import {COLLECT_TOKENS_SOLID, GOAL_MODULE, GOAL_SCRIPT} from "../src/zetokenizer.mjs";
import {astToString, encodeUnicode} from "./utils.mjs";
import ZeParser from "../src/zeparser.mjs";
import {execSync} from 'child_process';
import {reduceErrorInput} from "./test_case_reducer.mjs";
import {ASSERT} from "../src/utils.mjs";
import fs from 'fs';

const BOLD = '\x1b[;1;1m';
const OVER = '\x1b[32;53m';
const DIM = '\x1b[30;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const TEST_SLOPPY = 'sloppy';
const TEST_STRICT = 'strict';
const TEST_MODULE = 'module';
const TEST_WEB = 'web';

function sameFunc(testVariant, forTestFile, code) {
  // Get updated AST for new input (it might crash. In fact, is very likely to be illegal)
  let inputAst;
  try {
    inputAst = zepSpecial(code, testVariant, TEST_MODULE, COLLECT_TOKENS_SOLID)
  } catch (e) {
    return {e: {message: '(zeparser rejected input)'}};
  }
  // Now confirm this with the printed output of this ast.
  let [printerStatus, msg] = _testZePrinter(code, testVariant, inputAst.ast, forTestFile);
  if (printerStatus === 'fail-crash') {
    console.log('status was fail :\'(');
    console.log(msg);
    process.exit()
  }
  return {e: {message: printerStatus}, printerStatus};
}

function testZePrinter(code, testVariant, ast, forTestFile, reducePrinterError, ignoreProblems) {
  let [printerStatus, msg] = _testZePrinter(code, testVariant, ast, forTestFile);

  if (!ignoreProblems && printerStatus !== 'same' && printerStatus !== 'diff-same') {
    let reducedInput;
    let outFileBase = 'tests/testcases/todo/_fuzz-zeprinter-fail';
    let outFile = outFileBase + '.md';
    let n = 0;
    while (fs.existsSync(outFile)) {
      outFile = outFileBase + '.' + (++n) + '.md';
    }
    if (reducePrinterError) {
      console.log('ZePrinter caused a problem (status = ' + printerStatus + ')');
      console.log(msg);
      console.log('Original input:');
      console.log('`````');
      console.log(code);
      console.log('`````');
      reducedInput = reduceErrorInput(code, sameFunc.bind(undefined, testVariant, forTestFile));
      console.log('Reduced!');
      console.log('-->', [reducedInput]);

      if (code !== reducedInput) {
        msg += '\n\nAfter reducing the test case, it is the following:\n\n`````\n'+reducedInput+'\n`````\n\n';
        fs.writeFileSync(outFile, '@This input broke zeprinter [' + printerStatus + ']\n\nOriginal input:\n\n```\n'+code+'\n```\n\n###\n'+reducedInput+'\n');
      } else {
        fs.writeFileSync(outFile, '@This input broke zeprinter [' + printerStatus + ']\n\n###\n'+code+'\n');
      }
    } else {
      fs.writeFileSync(outFile, '@By fuzzer; input broke zeprinter [' + printerStatus + ']\n\n###\n'+code+'\n');
    }

    console.log(msg);
    console.log('Written to', BOLD + outFile + RESET);

    console.log('Now force exiting (inside run_zeprinter)')
    process.exit()
  }

  ASSERT(['fail-crash', 'same', 'diff-fail', 'diff-same', 'diff-ast'].includes(printerStatus), 'zeprinter should return enum in codes');
  ASSERT(ignoreProblems || printerStatus !== 'fail-crash', 'zeprinter should never throw', msg);
  ASSERT(ignoreProblems || printerStatus !== 'diff-ast', 'zeprinter should not change the ast', msg);
  ASSERT(ignoreProblems || printerStatus !== 'diff-fail', 'zeprinter output should not fail zeparser if it passed before', msg);

  ASSERT(ignoreProblems || printerStatus === 'same' || printerStatus === 'diff-same', '(redundant, but) ast should at least be same', msg);

  return [code, msg, printerStatus];
}

function _testZePrinter(code, testVariant, ast, forTestFile) {
  // Test the ast printer
  // We only really need to test it once for whatever run passes
  let printedCode;
  let printedFail;
  try {
    printedCode = zeprinter(ast);
  } catch (e) {
    printedFail = e.stack;
  }
  if (printedFail) {
    return ['fail-crash', '\n## AST Printer\n\n'+'Printer failed ['+testVariant+'][fail-crash]:'+'\n\n' + printedFail + '\n\n Input:\n\n'+code];
  } else if (printedCode === code) {
    return ['same', '\n## AST Printer\n\nPrinter output was same as input ['+testVariant+']'];
  } else {
    // Parse the input again, check whether the AST equal to before (it ought to be)

    let printedAst;
    try {
      printedAst = zepSpecial(printedCode, testVariant, TEST_MODULE, COLLECT_TOKENS_SOLID)
    } catch (e) {}

    if (!printedAst) {
      return ['diff-fail', `
## AST Printer

Printer output different from input [${testVariant}][diff-fail]:

Original input:
\`\`\`\`js
${code}
\`\`\`\`
Printed code with different AST:
\`\`\`\`js
${printedCode}
\`\`\`\`

ZeParser failed to parse printed code (with same parameters as original)
`];
    } else {
      let templateFriendlyInputAst = zepSpecial(printedCode, testVariant, TEST_MODULE, COLLECT_TOKENS_SOLID);

      let A = astToString(templateFriendlyInputAst.ast).replace(/^\s*loc:.*$\n/gm, '');
      let B = astToString(printedAst.ast).replace(/^\s*loc:.*$\n/gm, '');

      if (A === B) {
        return ['diff-same', `
## AST Printer

Printer output different from input [${testVariant}]:

\`\`\`\`js
${printedCode}
\`\`\`\`

Produces same AST
`];
      } else {
        let d = execSync(
          // Use sub-shell `<(...)` to prevent temporary file management.
          // Use base64 to prevent shell interpretation of input.
          // Final `true` is to suppress `diff`'s non-zero exit code when input differs.
          // `colordiff -a -y -w -W200 <(
          `diff -U 0 --text -d --suppress-blank-empty --ignore-blank-lines --ignore-all-space <(
              echo '${Buffer.from(encodeUnicode(A)).toString('base64')}' | base64 -d -
            ) <(
              echo '${Buffer.from(encodeUnicode(B)).toString('base64')}' | base64 -d -
            ) || true`
          , {
            shell: '/bin/bash',
            encoding: 'utf8',
          }
        )
        // .replace(/^(?:\+\+\+ \/|--- \/|@@ ).*$/gm, '')
        .replace(/\n+/g, '\n');

        return ['diff-ast', `
## AST Printer

Printer output different from input [${testVariant}][diff-diff]:

Original input:
\`\`\`\`js
${code}
\`\`\`\`
Printed code with different AST:
\`\`\`\`js
${printedCode}
\`\`\`\`

${forTestFile ? '' : RED}Produces different AST:${RESET}

${d}
`];
      }
    }
  }
  throw new Error('unreachable');
}

function zepSpecial(code, testVariant, TEST_MODULE, COLLECT_TOKENS_SOLID) {
  return ZeParser(
    code,
    testVariant === TEST_MODULE ? GOAL_MODULE : GOAL_SCRIPT,
    COLLECT_TOKENS_SOLID,
    {
      strictMode: testVariant === TEST_STRICT,
      webCompat: testVariant === TEST_WEB,

      templateNewlineNormalization: false, // (!!)

      $log: () => {},
      $warn: () => {},
      $error: () => {},
    },
  );
}

export {
  testZePrinter,
};
