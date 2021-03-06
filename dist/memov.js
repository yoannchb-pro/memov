"use strict"

class memov {
    constructor(configuration = {}) {
        const {
            isEqual,
            maxCacheSize,
            maxCacheCall,
            argumentsLength,
            debug
        } = configuration;

        this.isEqual = isEqual ?? ((a, b) => JSON.stringify(a) === JSON.stringify(b));
        this.maxCacheCall = maxCacheCall;
        this.maxCacheSize = maxCacheSize;
        this.argumentsLength = argumentsLength;
        this.debug = debug;
    }


    useMemo(fn) {
        let cache = [];
        const obj = this;

        const findCacheIndex = function(args){
            return cache.findIndex(e => 
                obj.isEqual(
                    obj.argumentsLength ? e.arguments?.filter((_,i) => i < obj.argumentsLength) : e.arguments, 
                    obj.argumentsLength ? args?.filter((_,i) => i < obj.argumentsLength) : args
                    )
            );
        }

        const memo = function (...args) {
        
            const haveCacheIndex = findCacheIndex(args);

            let haveCache = haveCacheIndex !== -1 ? cache[haveCacheIndex] : null;

            //max cache call
            if (haveCache) {
                haveCache.callCount++;
                if (obj.maxCacheCall && haveCache.callCount > obj.maxCacheCall){
                    cache.splice(haveCacheIndex, 1);
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

                cache.push(actualCache);

                //max cache size
                if (obj.maxCacheSize && cache.length > obj.maxCacheSize) cache.shift();

                return obj.debug ? Object.assign({ type: "function" }, actualCache) : actualCache.response;
            }

            return obj.debug ? Object.assign({ type: "cache" }, haveCache) : haveCache.response;
        }

        memo.clearAll = function(){
            cache = [];
        }

        memo.clear = function(...args){
            const index = findCacheIndex(args);
            if(index !== -1) {
                cache.splice(index, 1);
            }
        }

        return memo;
    }
}

if (typeof exports == "object") module.exports = memov;