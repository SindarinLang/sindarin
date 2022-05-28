const { performance } = require("perf_hooks");
const { execSync } = require("child_process");

const start = performance.now();
execSync("./benchmark/fibonacci/build/fib.c.bin");
const end = performance.now();

console.info(end - start);

const start2 = performance.now();
execSync("node ./benchmark/fibonacci/fib.js");
const end2 = performance.now();

console.info(end2 - start2);
