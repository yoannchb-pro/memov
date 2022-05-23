const Benchmarkify = require("benchmarkify");
const memov = require("../dist/memov-obj")
const memovArray = require("../dist/memov")

const benchmark = new Benchmarkify("Benchmark to compare differents versions of memov").printHeader();

const bench1 = benchmark.createSuite("Speed test");

const _m = new memov();
const _m2 = new memovArray();

const fn = (a,b) => {
    return a*b*596;
}

const add = _m.useMemo(fn);
const add2 = _m2.useMemo(fn);

bench1.add("Test cache array", () => {
    add(13,115);
});

bench1.ref("Test cache object", () => {
	add2(13,115);
});

bench1.run();