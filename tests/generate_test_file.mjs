import fs from 'fs';
import path from 'path';

import {
  ASSERT,
  INPUT_HEADER,
  OUTPUT_QUINTICK,
  OUTPUT_QUINTICKJS,
} from "./utils.mjs";

export function generateTestFile(tob) {
  // This should be a new test that still has to be generated
  // Its format basically starts with an @ for easy parsing here
  //
  // ```
  // @ some more information here, optional because the file name / path forms the description
  // ###
  // the rest is the test case, as is. only trailing whitespace (if any) is trimmed from each line and the start/end
  // ```
  ASSERT(tob);
  let data = tob.oldData;
  let file = tob.file;
  ASSERT(data.includes('\n###\n'), 'expected format', file);

  console.log('Generating test case from', file);

  let [comment, ...code] = data.slice(1).split('###\n');
  comment = comment.trim().split(/\n/g).map(s => s.toLowerCase() === '## fail' ? '\n## FAIL' : s.toLowerCase() === '## pass' ? '\n## PASS' : ('>\n> ' + s)).join('\n');
  code = code.join('###'); // unlikely
  code = code.trim().split(/\n+/g).map(s => s.trimRight()).join('\n');

  let relfile = file.slice(file.indexOf('zeparser3'));

  let descPath = path
    .dirname(relfile.slice(relfile.indexOf('tests/testcases/parser/') + 'tests/testcases/parser/'.length))
    .split('/')
    .map(s =>
      s
      .replace(/_/g, ' ')
      .replace(/x([a-z\d]{4})/g, (_, s) => String.fromCharCode(parseInt(s, 16)))
    )
    .join(' : ');
  let descFile = path.basename(relfile)
    .slice(0, -3)
    .replace(/_/g, ' ')
    .replace(/x([a-z\d]{4})/g, (_, s) => String.fromCharCode(parseInt(s, 16)));

  let newData = tob.oldData = `# ZeParser parser test case

- Path: ${relfile}

> :: ${descPath}
>
> ::> ${descFile}${comment ? '\n' + comment : ''}
${INPUT_HEADER}${OUTPUT_QUINTICKJS}${code}${OUTPUT_QUINTICK}
`;
  fs.writeFileSync(file, newData);

  return newData;
}
