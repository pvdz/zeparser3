Error.stackTraceLimit = Infinity;
const clog = console.log;
const wlog = console.warn;
const elog = console.error;
let logs = [];
console.log = (...args) => {
  clog(...args);
  logs.push(args.join('LOG '));
};
console.warn= (...args) => {
  wlog(...args);
  logs.push(args.join('WRN '));
};
console.error= (...args) => {
  elog(...args);
  logs.push(args.join('ERR '));
};

import * as $ from '../../src/utils.mjs';
import ZeTokenizer, * as Tok from '../../src/zetokenizer.mjs';
import ZeParser, * as Par from '../../src/zeparser.mjs';

console.log('loaded...');
window.ZeTokenizer = ZeTokenizer;
window.ZeParser = ZeParser;
window.$ = $;

window.ta_input.onchange = window.ta_input.onkeyup = e => {
  console.clear();
  stderr.value = '';
  logs = [];
  let ast = {};
  let tokens = [];
  let color = '#EEC7C1';
  let out;
  try {
    console.log('crunching:', '\n```\n' + prettier.format(window.ta_input.value) + '\n```');
    out = ZeParser(window.ta_input.value, Tok.GOAL_MODULE, Tok.COLLECT_TOKENS_ALL, {
      // strictMode: startInStrictMode,
      // webCompat: !!WEB,
      // trailingArgComma: testDetails.options && testDetails.options.trailingArgComma,
      astRoot: ast,
      tokenStorage: tokens,
      // getTokenizer: tok => tokenizer = tok,
      // targetEsVersion: ES || Infinity,
    });
    color = '#e6ffe6';
  } catch (e) {
    logs.unshift(e.stack+'\n\n-------------\n\n');
    throw new Error(e);
  } finally {
    stderr.value = logs.map(s => 'LOG ' + s + '\n').join('');
    ta_input.style.backgroundColor = color;
  }

  // Note: shipping a very old version of Prettier. Not very important for the purpose of printing an AST.
  window.ta_ast.value = prettier.format('+'+JSON.stringify(ast.root), {parser: 'json'}).slice(1);
  window.ta_output.value = tokens.map(JSON.stringify).join('\n')
  console.log(['out:', out, 'ast:', ast])
};
window.ta_input.onchange();
