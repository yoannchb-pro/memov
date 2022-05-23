function isCache(obj){
    if(obj.type === "cache"){
        return true
    }
    throw new Error("isCache failed");
}

function isNotCache(obj){
    if(obj.type === "cache"){
        throw new Error("isNotCache failed");
    }
    return true;
}

function isFunctionCall(obj){
    if(obj.type === "function"){
        return true
    }
    throw new Error("isFunctionCall failed");
}

function isTrueDebug(obj, val){
    if(obj.response === val){
        return true;
    }
    throw new Error("isTrueDebug failed");
}

function isTrue(obj, val){
    if(obj === val){
        return true;
    }
    throw new Error("isTrue failed");
}

module.exports = { isCache, isFunctionCall, isTrueDebug, isTrue, isNotCache }