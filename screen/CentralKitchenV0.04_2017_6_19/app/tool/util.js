define(function() {
    // 用于处理merge时无法遍历Date等对象的问题
    var BUILTIN_OBJECT = {
        '[object Function]': 1,
        '[object RegExp]': 1,
        '[object Date]': 1,
        '[object Error]': 1,
        '[object CanvasGradient]': 1
    };
    var objToString = Object.prototype.toString;

    function isDom(obj) {
        return obj && obj.nodeType === 1 && typeof(obj.nodeName) === 'string';
    }
    /**
     * 对一个object进行深度拷贝
     * @memberOf module:zrender/tool/util
     * @param {*} source 需要进行拷贝的对象
     * @return {*} 拷贝后的新对象
     */
    function clone(source) {
        if(typeof source === 'object' && source !== null) {
            var result = source;
            if(source instanceof Array) {
                result = [];
                for(var i = 0, len = source.length; i < len; i++) {
                    result[i] = clone(source[i]);
                }
            } else if(!BUILTIN_OBJECT[objToString.call(source)] && !isDom(source)) {
                result = {};
                for(var key in source) {
                    if(source.hasOwnProperty(key)) {
                        result[key] = clone(source[key]);
                    }
                }
            }
            return result;
        }
        return source;
    }

    function mergeItem(target, source, key, overwrite) {
        if(source.hasOwnProperty(key)) {
            var targetProp = target[key];
            if(key !== 'series' && typeof targetProp === 'object' && !BUILTIN_OBJECT[objToString.call(targetProp)] && !isDom(targetProp) && source[key]) {
                // 如果需要递归覆盖，就递归调用merge
                merge(
                    target[key],
                    source[key],
                    overwrite
                );
            } else if(overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                target[key] = source[key];
            }
        }
    }
    /**
     * 合并源对象的属性到目标对象
     * @memberOf module:zrender/tool/util
     * @param {*} target 目标对象
     * @param {*} source 源对象
     * @param {boolean} overwrite 是否覆盖
     */
    function merge(target, source, overwrite) {
        for(var i in source) {
            mergeItem(target, source, i, overwrite);
        }
        return target;
    }

    function sliceNumber(value, segments) {
        var step = Math.max(Math.ceil(value / segments), 1);
        var result = [];
        while(value > 0) {
            if(value >= step) {
                result.push(step);
                value -= step;
            } else {
                result.push(value);
                value -= value
            }
        }
        return result;
    }

    return {
        clone: clone,
        merge: merge,
        sliceNumber: sliceNumber
    };
})