Error.stackTraceLimit = Infinity;

import * as $ from '../../src/utils.mjs';
import ZeTokenizer, * as Tok from '../../src/zetokenizer.mjs';
import ZeParser, * as Par from '../../src/zeparser.mjs';

console.log('loaded...');
window.ZeTokenizer = ZeTokenizer;
window.ZeParser = ZeParser;
window.$ = $;

window.ta_input.onchange = window.ta_input.onkeyup = e => {
  console.log('crunching', window.ta_input.value);
  let ast = {};
  let out = ZeParser(window.ta_input.value, $.MODE_MODULE, $.COLLECT_TOKENS_SOLID, {
    // strictMode: startInStrictMode,
    // webCompat: !!WEB,
    // trailingArgComma: testDetails.options && testDetails.options.trailingArgComma,
    astRoot: ast,
    // tokenStorage: tokens,
    // getTokenizer: tok => tokenizer = tok,
    // targetEsVersion: ES || Infinity,
  });
  window.ta_ast.value = JSON.stringify(ast.root);
  window.ta_output.value = JSON.stringify(out);
  console.log(['out:', out, 'ast:', ast])
};
window.ta_input.onchange();
