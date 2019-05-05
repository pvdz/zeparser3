Error.stackTraceLimit = Infinity;
const clog = console.log;
const wlog = console.warn;
const elog = console.error;
let logs = [];
console.log = (...args) => {
  clog(...args);
  logs.push('LOG '+args.join(' '));
};
console.warn= (...args) => {
  wlog(...args);
  logs.push('WRN '+args.join(' '));
};
console.error= (...args) => {
  elog(...args);
  logs.push('ERR ' + args.join('ERR '));
};

import * as $ from '../../src/utils.mjs';
import ZeTokenizer, * as Tok from '../../src/zetokenizer.mjs';
import ZeParser, * as Par from '../../src/zeparser.mjs';

console.log('loaded...');
window.ZeTokenizer = ZeTokenizer;
window.ZeParser = ZeParser;
window.$ = $;

window.onerror = (msg, url, lineNo, columnNo, error) => {
  stderr.value = error.stack+'\n\n-------------\n\n' + stderr.value + '\n\n' + msg;
};

ta_input.value = localStorage.getItem('ZeParser3.repl.input') || ta_input.value;

if (localStorage.getItem('ZeParser3.repl.options')) {
  try {
    localStorage.getItem('ZeParser3.repl.options')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.split(' '))
      .map(([q, checked]) => console.log(q, checked) || (checked === 'true') && (document.querySelector(q).checked = true));
  } catch (e) {
    localStorage.removeItem('ZeParser3.repl.options');
  }
}


function pret(s, isjson) {
  // Note: this is prettier 0.4 or something... it's good enough for our purpose
  try {
    let r = prettier.format(isjson ? '+' + s : s, {
      tabWidth: 2,
      printWidth: 100,
      singleQuote: true,
      trailingComma: true,
      bracketSpacing: false,
      quoteProps: 'as-needed',
    });
    if (isjson) r = r.slice(1, -1);
    return r;
  } catch (e) {
    return s;
  }
}

function reflectPass() {
  reflectResult('#e6ffe6', 'initial', 'initial', 'initial');
}
function reflectFail() {
  reflectResult('#EEC7C1', 'initial', '#eee', '#555');
}
function reflectResult(inpBgColor, inpColor, otherBgColor, otherColor) {
  ta_input.style.backgroundColor = inpBgColor;
  ta_ast.style.backgroundColor = otherBgColor;
  ta_ast.style.color = otherColor;
  ta_output.style.backgroundColor = otherBgColor;
  ta_output.style.color = otherColor;
}

const update = e => {
  console.clear();
  stderr.value = '';
  reflectFail(); // should not be visible (?)

  let input = ta_input.value;

  logs = [];
  let ast = {};
  let tokens = [];

  if (input) localStorage.setItem('ZeParser3.repl.input', input);
  else localStorage.removeItem('ZeParser3.repl.input');

  // Store the settings in an easy to thaw way
  localStorage.setItem(
    'ZeParser3.repl.options',
    [
      ...document.querySelectorAll('.box.top-left input')
    ]
      .map(e => `[name="${e.name}"][value="${e.value}" ${!!e.checked}`)
      .join(',')
  );

  let out;
  let threw = 'unknown';
  try {
    console.log('crunching:', '\n```\n' + pret(input) + '\n```');

    let mode = document.querySelector('input[name=mode]:checked').value === 'module' ? Tok.GOAL_MODULE : Tok.GOAL_SCRIPT;

    out = ZeParser(window.ta_input.value, mode, Tok.COLLECT_TOKENS_ALL, {
      strictMode: document.querySelector('input[name=mode]:checked').value === 'strict',
      webCompat: !!document.querySelector('input[name=webcompat]:checked'),
      astRoot: ast,
      tokenStorage: tokens,
      // getTokenizer: tok => tokenizer = tok,
      targetEsVersion: +document.querySelector('input[name=version]:checked').value,
    });
    threw = false;
  } finally {
    // not try/catching here means you can properly debug it...
    if (threw) console.error('An error was thrown. Expecting window.onerror to catch it and amend the trace');
    stderr.value = logs.map(s => s + '\n').join('');
  }
  reflectPass();

  // Note: shipping a very old version of Prettier. Not very important for the purpose of printing an AST.
  window.ta_ast.value = pret(JSON.stringify(ast.root), true);
  window.ta_output.value = tokens.map(JSON.stringify).join('\n')
  console.log(['out:', out, 'ast:', ast]);



};

[
  window.ta_input,
  ...document.querySelectorAll('.box.top-left input')
].forEach(e => e.onchange = e.onkeyup = update);


update();
