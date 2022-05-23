"use strict"

class memov {
    constructor(configuration = {}) {
        const {
            createKey,
            maxCacheSize,
            maxCacheCall,
            argumentsLength,
            debug
        } = configuration;

        this.createKey = createKey ?? ((args) => JSON.stringify(args));
        this.maxCacheCall = maxCacheCall;
        this.maxCacheSize = maxCacheSize;
        this.argumentsLength = argumentsLength;
        this.debug = debug;
    }


    useMemo(fn) {
        let cache = {};
        const obj = this;

        const memo = function (...args) {
        
            const key = obj.createKey(obj.argumentsLength ? args.splice(0, obj.argumentsLength) : args);
            const hasKey = cache[key];

            let haveCache = hasKey ? hasKey : null;

            //max cache call
            if (haveCache) {
                haveCache.callCount++;
                if (obj.maxCacheCall && haveCache.callCount > obj.maxCacheCall){
                    delete cache[key];
                    haveCache = false;
                }
            }

            //calling function
            if (!haveCache) {
                const actualCache = {
                    callCount: 0,
                    arguments: args,
                    response: fn(...args)
                }

                cache[key] = actualCache;

                //max cache size
                const keys = Object.keys(cache);
                if (obj.maxCacheSize && keys.length > obj.maxCacheSize) delete cache[keys[0]];

                return obj.debug ? Object.assign({ type: "function" }, actualCache) : actualCache.response;
            }

            return obj.debug ? Object.assign({ type: "cache" }, haveCache) : haveCache.response;
        }

        memo.clearAll = function(){
            cache = {};
        }

        memo.clear = function(...args){
            const key = obj.createKey(obj.argumentsLength ? args.splice(0, obj.argumentsLength) : args);;
            if(key in cache) delete cache[key];
        }

        return memo;
    }
}

if (typeof exports == "object") module.exports = memov;