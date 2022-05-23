const memov = require("../dist/memov");
const { isCache, isFunctionCall, isTrueDebug, isNotCache, isTrue } = require('./test-requirements');

const _m = new memov({debug: true});
const _m2 = new memov({ debug: true, isEqual: (a,b) => a[0].type === b[0].type });
const _m3 = new memov({ debug: true, maxCacheSize: 3 });
const _m4 = new memov({ debug: true, maxCacheCall: 3 });
const _m5 = new memov();
const _m6 = new memov({ debug: true, argumentsLength: 2 });
const _m7 = new memov({ debug: true });
const useMemo = _m.useMemo.bind(_m);
const useMemoType = _m2.useMemo.bind(_m2);
const useMemoCall = _m4.useMemo.bind(_m4);
const useMemoSimple = _m5.useMemo.bind(_m5);
const useMemoArgs = _m6.useMemo.bind(_m6);

const addition = useMemo(function(a, b){
    return a + b;
});

//simple teest without bind
const additionSize = _m3.useMemo(function(a, b){
    return a + b;
});

const additionAsync = _m7.useMemo(async function(a, b){
    return a + b;
});

const additionSimple = useMemoSimple(function(a, b){
    return a + b;
});

const additionArgs = useMemoArgs(function(a, b){
    return a + b;
});


const additionCall = useMemoCall(function(a, b){
    return a + b;
});


const findHello = useMemoType(function(a){
    if(a.type == "user"){
        return "hello user";
    } else {
        return "hello unknow";
    }
})

console.log("[TEST] Addition cache");
isFunctionCall(addition(5,5));
isCache(addition(5,5));
isCache(addition(5,5));
isFunctionCall(addition(5,6));
isCache(addition(5,6));
isCache(addition(5,5));
isFunctionCall(addition());
isCache(addition());
console.log("Done.")

console.log("\n");

console.log("[TEST] Addition arguments length");
isFunctionCall(additionArgs(5,5));
isCache(additionArgs(5,5));
isCache(additionArgs(5,5));
isFunctionCall(additionArgs(5,6));
isCache(additionArgs(5,6));
isCache(additionArgs(5,5));
isFunctionCall(additionArgs());
isCache(additionArgs());
isFunctionCall(additionArgs(5,8,6));
isCache(additionArgs(5,8,7));
isCache(additionArgs(5,8));
isFunctionCall(additionArgs(5,9));
console.log("Done.")

console.log("\n");

console.log("[TEST] Addition value");
isTrueDebug(addition(5,5), 10);
isTrueDebug(addition(5,5), 10);
isTrueDebug(addition(5,6), 11);
isTrueDebug(addition(5,6), 11);
isTrueDebug(addition(5,5), 10);
console.log("Done.")

console.log("\n");

console.log("[TEST] isEqual type");
isFunctionCall(findHello({type: "user"}));
isCache(findHello({type: "user", name: "yoann"}));
isCache(findHello({type: "user", name: "yoann"}));
isFunctionCall(findHello({name: "yoann"}));
isCache(findHello({name: "yoann"}));
isCache(findHello({type: "user", name: "yoann"}));
console.log("Done.")

console.log("\n");

console.log("[TEST] maxCacheSize");
isFunctionCall(additionSize(5,5));
isCache(additionSize(5,5));
isFunctionCall(additionSize(5,6));
isCache(additionSize(5,6));
isFunctionCall(additionSize(5,7));
isCache(additionSize(5,7));
isFunctionCall(additionSize(5,8));
isCache(additionSize(5,8));
isNotCache(additionSize(5,5));
console.log("Done.")

console.log("\n");

console.log("[TEST] maxCacheCall");
isFunctionCall(additionCall(5,5));
isCache(additionCall(5,5));
isCache(additionCall(5,5));
isCache(additionCall(5,5));
isNotCache(additionCall(5,5));
console.log("Done.")

console.log("\n");

console.log("[TEST] No debug mode");
isTrue(additionSimple(5,5), 10);
isTrue(additionSimple(5,5), 10);
isTrue(additionSimple(5,6), 11);
console.log("Done.")

console.log("\n");

console.log("[TEST] Clear cache all");
isFunctionCall(addition(8,8));
isFunctionCall(addition(8,9));
isCache(addition(8,8));
isCache(addition(8,9));
addition.clearAll();
isFunctionCall(addition(8,8));
isFunctionCall(addition(8,9));
console.log("Done.")

console.log("\n");

console.log("[TEST] Clear cache arguments");
isFunctionCall(additionArgs(8,8));
isFunctionCall(additionArgs(8,9));
isCache(additionArgs(8,8,7));
isCache(additionArgs(8,9,8,8));
additionArgs.clear(8,8,10);
isFunctionCall(additionArgs(8,8));
isCache(additionArgs(8,9));
console.log("Done.")

console.log("\n");

(async function(){
    console.log("[TEST] Async");
    const t1 = await additionAsync(5,5);
    const t2 = await additionAsync(5,5);
    const t3 = await (additionAsync(5,5).response)
    isFunctionCall(t1);
    isCache(t2);
    isTrue(t3, 10);
    console.log("Done.")
})();