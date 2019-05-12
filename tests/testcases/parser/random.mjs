import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) =>

  describe('random stuff', _ => {

    describe('#18', _ => {

      // Just putting the tests here

      `
        ({...{eval}.x} = {});
        ({...{b: 0}.x} = {});
        a[foo].c = () => { throw Error(); };
        ({...[0].x} = {});
        async function foo(a = () => { "use strict"; return eval("x"); }) {}
        async function foo(a = () => { "use strict"; return eval("x") }) { var x; return a(); }
      `
      .split('\n').map(s => s.trim().replace(/\\n/g, '\n')).filter(Boolean).forEach((code, i) => {

        test.pass('/' + i, {
          code,
        });
      });


      `
        async (a = b => await (0)) => {}
        /**/ --> comment
        while(true) let[a] = 0
      `
      .split('\n').map(s => s.trim().replace(/\\n/g, '\n')).filter(Boolean).forEach((code, i) => {

        test.fail_strict('/' + i, {
          code,
        });
      });

      // one test per line. they all fail
      `
        
        async function foo(a = () => { "use strict"; return eval =>("x"); }) {}
        async function foo(a = (eval) => { "use strict"; funeval("x"); }) {}
        let [o.x=1]=[]
        let {x:o.f=1}={x:1}
        var [((((a)))), b] = [];
        var [(a)] = 0
        const [(x)] = []
        let [(x().foo)] = x
        let [(x) = y] = [];
        let [(x)] = [];
        ['++([])
        ['(++[])
        this.foo[foo].bar(this)(bar)[foo]()--
        ((x,x)) = 5
        (((x,x))) = 5
        async ({a = b})
        new Date++;
        for(let.a of 0);
        for (let x in {}) { var x; }
        [...{a = 0}.x] = [];
        ({...{b = 0}.x} = {});
        ({a: {b = 0}.x} = {});
        [[(x, y)]] = x;
        [...[(x, y)]] = x;
        (async function*() { } = 1);
        ([(x().foo)]) => x
        let [(x) = y] = [];
        ({a: {b = 0}.x} = {});
        [...{a = 0}.x] = [];
        [[(x, y)]] = x;
        [...[(x, y)]] = x;
        [...(a,b)] = [],
        [...{ a }] = b,
        for (+i in {});
        /x\\ny/
        true:oops;
        for(let.a of 0);
        var\\u1680x;
        for([] = 0 of {});
        for([,] = 0 of {});
        for([a] = 0 of {});
        for([a = 0] = 0 of {});
        for([...a] = 0 of {});
        for([...[]] = 0 of {});
        for([...[a]] = 0 of {});
        for({} = 0 of {});
        for({p: x} = 0 of {});
        for({p: x = 0} = 0 of {});
        for({x} = 0 of {});
        for({x = 0} = 0 of {});
        async function f() { for await ({0: a = 1} = 1 of []) ; }
        async function * f() { for await({a: a = 1} = 1 of []){ } }
        async function * f() { for await({a} = 1 of []){ } }
        async function f() { for await ([a] = 1 of []) ; }
        async function f() { for await ({[Symbol.iterator]: a = 1} = 1 of []) ; }
        for ((a?b:c) in y)z;
        for ((a,b) in c);
        for (((a,b)) in c);
        for ({}.x);
        for ([...[a]] = 0 in {});
      `.split('\n').map(s => s.trim().replace(/\\n/g, '\n')).filter(Boolean).forEach((code, i) => {

        test.fail('/' + i, {
          code,
        });
      });
    });

//
//     test('for header instancoef', {
//       code: 'for ((2935) instanceof ((2e308));;) debugger',
//     });
//
//     test('interface declared twice', {
//       code: `
// throw new 'zx\r"';
// function* interface(d = /[--]|>?|(?:q\xab)/my, s = (package), [], {}, n = (false), ...{}) {
//   "WEx";
//   "xxxV";
//   ;
// }
// do if ("dx") break; while (({}));
// const interface = m;
//
// `,
//     });
//
//     test('dupe const binding', {
//       code: `
// "";
// "xx"
// "use strict";
// while (((this))) switch (2785116224220380) {
//   default:
// }
// for (;; 2e308) if ((null)) debugger
// try {} finally {}
// function* csyearfw(turvyki, vanysjsavoonlwss, jmmyvr, eh) {
//   "use strict"
//   "x&xi0"
//   return;
//   for (let c in "xxx2") continue
//   throw yield
//   const n = 2e3088)
// }
// ^------- error
//
// `,
//     })

  });

