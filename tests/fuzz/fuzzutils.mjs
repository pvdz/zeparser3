let chars = ['/', '\n/', '[', ']', '(', ')', '{', '}', ';', ',', '.', '\n', '=', '|='].map(s => ()=>s);

function errorify(s, r=5) {
  for (let i=0; i<3; ++i) {
    // Inject characters at random positions which very likely to trip up the parser
    if (Math.random() < 0.01) {
      let i = rng(s.length);
      s = s.slice(0, i) + pick(...chars) + s.slice(i);
    }
  }

  return s;
}

function rng(max) {
  return Math.floor(max * Math.random());
}
function oi(n, m = 1) {
  return (Math.random() * n) < m;
}
function maybe() {
  return Math.random() < 0.5;
}

function pick() {
  let s = arguments[rng(arguments.length)];
  if (typeof s !== 'string') return s();
  return s;
}

function pickMaybe(...args) {
  let a = args.filter(a => !!a);
  let s = a[rng(a.length)];
  if (typeof s !== 'string') return s();
  return s;
}

function repeat(times, func, joiner = ',') {
  let s = func();
  for (let i=0; i<times; ++i) {
    s += joiner + func();
  }
  return s;
}
function rngpeat(upto, func, joiner = ',') {
  return repeat(rng(upto), func, joiner);
}

export {
  maybe,
  oi,
  pick,
  pickMaybe,
  repeat,
  rng,
  rngpeat,
  errorify,
};
