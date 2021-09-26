/*
* Q.js (包括 通用方法、原生对象扩展 等) for browser or Node.js
* https://github.com/devin87/Q.js
* author:devin87@qq.com  
* update:2021/09/24 11:04
*/
(function (undefined) {
    "use strict";

    //Node.js中闭包外部this并非global eg:(function(g){})(this); //this not global
    //严格模式下this不指向全局变量
    var GLOBAL = typeof global == "object" ? global : window,

        toString = Object.prototype.toString,
        has = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice;

    //严格模式与window识别检测
    //2018/10/10: uglify压缩会导致此检测函数失效
    //function detect_strict_mode() {
    //    var f = function (arg) {
    //        arguments[0] = 1;

    //        return arg != arguments[0];
    //    };

    //    return f(0);
    //}

    //默认严格模式,不再通过检测判断
    var is_strict_mode = true, //detect_strict_mode(),
        is_window_mode = GLOBAL == GLOBAL.window;

    /**
     * 获取数据类型(小写) undefined|null|string|number|array|function|date|regexp|window|node|list
     * @param {object} obj 要检测的数据
     */
    function getType(obj) {
        if (obj == undefined) return "" + obj;

        //内置函数,性能最好 (注意：safari querySelectorAll返回值类型为function)
        if (typeof obj !== "object" && typeof obj !== "function") return typeof obj;

        //非window模式(Node)下禁用以下检测
        if (is_window_mode) {
            if (typeof obj.nodeType === "number") return "node";

            if (typeof obj.length === "number") {
                //严格模式禁止使用 arguments.callee,调用会报错
                //IE9+等使用 toString.call 会返回 [object Arguments],此为兼容低版本IE
                //if (!is_strict_mode && obj.callee) return "arguments";

                //IE9+等使用 toString.call 会返回 [object Window],此为兼容低版本IE
                if (obj == obj.window) return "window";

                //document.getElementsByTagName("*") => HTMLCollection
                //document.querySelectorAll("*")     => NodeList
                //此处统一为 list
                if (obj.item) return "list";
            }
        }

        //在某些最新的浏览器中(IE11、Firefox、Chrome)性能与hash读取差不多 eg: return class2type[toString.call(obj)];
        return toString.call(obj).slice(8, -1).toLowerCase();
    }

    /**
     * 检测是否为函数
     * @param {object} fn 要检测的数据
     */
    function isFunc(fn) {
        //在IE11兼容模式（ie6-8）下存在bug,当调用次数过多时可能返回不正确的结果
        //return typeof fn == "function";

        return toString.call(fn) === "[object Function]" || toString.call(fn) === "[object AsyncFunction]";
    }

    /**
     * 检测是否为对象
     * @param {object} obj 要检测的数据
     */
    function isObject(obj) {
        //typeof null => object
        //toString.call(null) => [object Object]

        return obj && toString.call(obj) === "[object Object]";
    }

    /**
     * 检测是否为数组
     * @param {object} obj 要检测的数据
     */
    function isArray(obj) {
        return toString.call(obj) === "[object Array]";
    }

    /**
     * 检测是否为数组或类数组
     * @param {object} obj 要检测的数据
     */
    function isArrayLike(obj) {
        var type = getType(obj);

        return type == "array" || type == "list" || type == "arguments";
    }

    /**
     * 若value不为undefine,则返回value;否则返回defValue
     * @param {object} value 
     * @param {object} defValue value不存在时返回的值
     */
    function def(value, defValue) {
        return value !== undefined ? value : defValue;
    }

    /**
     * 检测是否是符合条件的数字(n必须为数字类型)
     * @param {number} n 数字
     * @param {number|undefined} min 允许的最小值
     * @param {number|undefined} max 允许的最大值
     * @param {number|undefined} max_decimal_len 最大小数位数
     */
    function isNum(n, min, max, max_decimal_len) {
        if (typeof n != "number" || isNaN(n)) return false;

        if (min != undefined && n < min) return false;
        if (max != undefined && n > max) return false;

        if (max_decimal_len) {
            var l = ((n + '').split('.')[1] || '').length;
            if (l > max_decimal_len) return false;
        }

        return true;
    }

    /**
     * 检测是否为大于0的数字(n必须为数字类型)
     * @param {number} n 数字
     */
    function isUNum(n) {
        return !isNaN(n) && n > 0;
    }

    /**
     * 检测是否为整数(n必须为数字类型)
     * @param {number} n 数字
     * @param {number|undefined} min 允许的最小值
     * @param {number|undefined} max 允许的最大值
     */
    function isInt(n, min, max) {
        return isNum(n, min, max) && n === Math.floor(n);
    }

    /**
     * 检测是否为大于0的整数
     * @param {number} n 数字
     */
    function isUInt(n) {
        return isInt(n, 1);
    }

    /**
     * 判断是否是符合条件的数字
     * @param {string|number} str 要检测的字符串或数字
     * @param {number|undefined} min 允许的最小值
     * @param {number|undefined} max 允许的最大值
     * @param {number|undefined} max_decimal_len 最大小数位数
     */
    function checkNum(str, min, max, max_decimal_len) {
        if (typeof str == "number") return isNum(str, min, max, max_decimal_len);
        if (typeof str == "string") {
            str = str.trim();
            return str && isNum(+str, min, max, max_decimal_len);
        }
        return false;
    }

    /**
     * 判断是否是符合条件的整数
     * @param {string|number} str 要检测的字符串或数字
     * @param {number|undefined} min 允许的最小值
     * @param {number|undefined} max 允许的最大值
     */
    function checkInt(str, min, max) {
        if (typeof str == "number") return isInt(str, min, max);
        if (typeof str == "string") {
            str = str.trim();
            return str && isInt(+str, min, max);
        }
        return false;
    }

    /**
     * 将字符串转为大写,若str不是字符串,则返回defValue
     * @param {string} str 字符串
     * @param {string} defValue str不是字符串时返回的值
     */
    function toUpper(str, defValue) {
        return typeof str == "string" ? str.toUpperCase() : defValue;
    }

    /**
     * 将字符串转为小写,若str不是字符串,则返回defValue
     * @param {string} str 字符串
     * @param {string} defValue str不是字符串时返回的值
     */
    function toLower(str, defValue) {
        return typeof str == "string" ? str.toLowerCase() : defValue;
    }

    /**
     * 转为数组
     * @param {Array|NodeList} obj 数组或类数组
     * @param {number} from 开始索引,默认为0
     */
    function toArray(obj, from) {
        var tmp = [];

        for (var i = from || 0, len = obj.length; i < len; i++) {
            tmp.push(obj[i]);
        }

        return tmp;
    }

    //将 NodeList 转为 Array
    var makeArrayNode = (function () {
        try {
            slice.call(document.documentElement.childNodes);

            return function (obj, from) {
                return slice.call(obj, from);
            }
        } catch (e) {
            return toArray;
        }
    })();

    /**
     * 将类数组对象转为数组,若对象不存在,则返回空数组
     * @param {Array|arguments|NodeList} obj 数组或类数组
     * @param {number} from 开始索引,默认为0
     */
    function makeArray(obj, from) {
        if (obj == undefined) return [];

        switch (getType(obj)) {
            case "array": return from ? obj.slice(from) : obj;
            case "list": return makeArrayNode(obj, from);
            case "arguments": return slice.call(obj, from);
        }

        return [obj];
    }

    /**
     * 按条件产生数组 arr(5,2,2) => [2,4,6,8,10]
     * eg:按1-10项产生斐波那契数列 =>arr(10, function (value, i, list) { return i > 1 ? list[i - 1] + list[i - 2] : 1; })
     * @param {number} length 要产生的数组长度
     * @param {number} value 数组项的初始值
     * @param {number} step 递增值或处理函数(当前值,索引,当前产生的数组)
     */
    function arr(length, value, step) {
        if (isFunc(value)) {
            step = value;
            value = 0;
        }
        if (value == undefined) value = 0;
        if (step == undefined) step = 1;

        var list = [], i = 0;

        if (isFunc(step)) {
            while (i < length) {
                value = step(value, i, list);
                list.push(value);
                i++;
            }
        } else {
            while (i < length) {
                list.push(value);
                value += step;
                i++;
            }
        }

        return list;
    }

    /**
     * 根据指定的键或索引抽取数组项的值
     * eg:vals([{id:1},{id:2}], "id")  =>  [1,2]
     * eg:vals([[1,"a"],[2,"b"]], 1)   =>  ["a","b"]
     * @param {Array} list 对象数组
     * @param {string} prop 要抽取的属性
     * @param {boolean} skipUndefined 是否跳过值不存在的项,默认为true
     */
    function vals(list, prop, skipUndefined) {
        if (!list) return [];

        skipUndefined = skipUndefined !== false;

        var len = list.length,
            i = 0,
            item,
            tmp = [];

        for (; i < len; i++) {
            item = list[i];
            if (item && item[prop] != undefined) {
                tmp.push(item[prop]);
            } else if (!skipUndefined) {
                tmp.push(undefined);
            }
        }

        return tmp;
    }

    /**
     * 给原型方法或属性添加别名 eg:alias(Array,"forEach","each");
     * @param {object} obj 对象
     * @param {string|object} name 属性名称或对象 eg: 'forEach' | {forEach:'each'}
     * @param {string} aliasName 别名
     */
    function alias(obj, name, aliasName) {
        if (!obj || !obj.prototype) return;

        var prototype = obj.prototype;

        if (typeof name == "string") {
            prototype[aliasName] = prototype[name];
        } else {
            for (var key in name) {
                if (has.call(name, key) && has.call(prototype, key)) prototype[name[key]] = prototype[key];
            }
        }

        return obj;
    }

    /**
     * 将源对象(source)的所有可枚举且目标对象(target)不存在的属性, 复制到目标对象
     * @param {object} target 目标对象
     * @param {object} source 源对象
     * @param {boolean} forced 是否强制复制, 为true时将会覆盖目标对象同名属性, 默认为false
     */
    function extend(target, source, forced) {
        if (!target || !source) return target;

        for (var key in source) {
            if (key == undefined || !has.call(source, key)) continue;

            if (forced || target[key] === undefined) target[key] = source[key];
        }
        return target;
    }

    /**
     * 数据克隆(深拷贝)
     * @param {object} data 要克隆的对象
     */
    function clone(data) {
        if (!data) return data;

        switch (typeof data) {
            case "string":
            case "number":
            case "boolean":
                return data;
        }

        var result;

        if (isArray(data)) {
            result = [];
            for (var i = 0, len = data.length; i < len; i++) {
                result[i] = clone(data[i]);
            }
        } else if (isObject(data)) {
            result = {};
            for (var key in data) {
                if (has.call(data, key)) result[key] = clone(data[key]);
            }
        }

        return result;
    }

    /**
     * 将数组或类数组转换为键值对 eg: ['a','b'] => {a:0,b:1}
     * @param {Array} list 要转换的数组
     * @param {object|function} fv 默认值或处理函数(value,i) => [key,value]
     * @param {boolean} ignoreCase 是否忽略大小写, 为true时将统一使用小写, 默认为false
     */
    function toMap(list, fv, ignoreCase) {
        if (!list) return;

        var map = {},
            isFn = isFunc(fv),
            hasValue = fv !== undefined;

        for (var i = 0, len = list.length; i < len; i++) {
            var key = list[i], value;
            if (key == undefined) continue;

            if (isFn) {
                var kv = fv.call(list, key, i);
                if (!kv) continue;

                key = kv[0];
                value = kv[1];
            } else {
                value = hasValue ? fv : i;
            }

            map[ignoreCase ? key.toLowerCase() : key] = value;
        }

        return map;
    }

    /**
     * 将对象数组转换为键值对 eg: [{name:'a',value:1},{name:'b',value:2}] => {a:1,b:2}
     * @param {Array.<object>} list 要转换的对象数组
     * @param {string} propKey 对象中作为键的属性 eg: name
     * @param {string|boolean} propValue 对象中作为值的属性, 为true时将给对象增加index属性, 为空时将整个对象作为值
     */
    function toObjectMap(list, propKey, propValue) {
        if (!list) return;

        var map = {}, isBuildIndex = false;

        if (propValue === true) {
            isBuildIndex = propValue;
            propValue = undefined;
        }

        for (var i = 0, len = list.length; i < len; i++) {
            var obj = list[i];
            if (!obj || typeof obj != "object") continue;

            if (isBuildIndex) obj.index = i;

            map[obj[propKey]] = propValue ? obj[propValue] : obj;
        }

        return map;
    }

    /**
     * 将目标对象中和源对象值不同的数据作为键值对返回
     * @param {object} target 目标对象
     * @param {object} source 源对象
     * @param {Array.<string>} skipProps 要忽略比较的属性数组
     * @param {string} skipPrefix 要忽略的属性前缀
     */
    function getChangedData(target, source, skipProps, skipPrefix) {
        if (!target) return undefined;
        if (!source) return target;

        var map_skip_prop = skipProps ? toMap(skipProps, true) : {},
            data_changed = {},
            has_changed = false;

        for (var key in target) {
            if (!key || !has.call(target, key) || map_skip_prop[key] || (skipPrefix && key.indexOf(skipPrefix) == 0) || target[key] == source[key]) continue;
            data_changed[key] = target[key];
            has_changed = true;
        }

        return has_changed ? data_changed : undefined;
    }

    /**
     * 转为字符串(用于排序)
     * undefined|null  => ""
     * true|false      => "true" | "false"
     * 0               => "0"
     * @param {object} v 
     */
    function to_string(v) {
        return v == undefined ? "" : v + "";
    }

    /**
     * 将对象数组按字符串排序
     * @param {Array.<object>} list 对象数组 eg: [{k:'a'},{k:'b'}]
     * @param {string} prop 用于排序的属性
     * @param {boolean} desc 是否倒序,默认为false
     */
    function sortString(list, prop, desc) {
        if (desc) list.sort(function (a, b) { return -to_string(a[prop]).localeCompare(to_string(b[prop])); });
        else list.sort(function (a, b) { return to_string(a[prop]).localeCompare(to_string(b[prop])); });
    }

    /**
     * 将对象数组按数字排序
     * @param {Array.<object>} list 对象数组 eg: [{k:10},{k:20}]
     * @param {string} prop 用于排序的属性
     * @param {boolean} desc 是否倒序,默认为false
     */
    function sortNumber(list, prop, desc) {
        if (desc) list.sort(function (a, b) { return (+b[prop] || 0) - (+a[prop] || 0); });
        else list.sort(function (a, b) { return (+a[prop] || 0) - (+b[prop] || 0); });
    }

    /**
     * 将对象数组按字符串排序
     * @param {Array.<object>} list 对象数组 eg: [{k:'2019/09/18 13:20'},{k:'2019/10/18 13:20'}]
     * @param {string} prop 用于排序的属性
     * @param {boolean} desc 是否倒序,默认为false
     */
    function sortDate(list, prop, desc) {
        list.sort(function (a, b) {
            var v1 = a[prop], v2 = b[prop];
            if (v1 == v2) return 0;

            var d1 = Date.from(v1), d2 = Date.from(v2), rv = 0;

            if (d1 != INVALID_DATE && d2 != INVALID_DATE) rv = d1 - d2;
            else if (d1 == INVALID_DATE && d2 != INVALID_DATE) rv = -1;
            else if (d1 != INVALID_DATE && d2 == INVALID_DATE) rv = 1;

            return desc ? -rv : rv;
        });
    }

    /**
     * 将IP转为数字(用于排序)
     * @param {string} ip 
     */
    function ip2int(ip) {
        var ips = ip.split('.');

        return (+ips[0] || 0) * 256 * 256 * 256 + (+ips[1] || 0) * 256 * 256 + (+ips[2] || 0) * 256 + (+ips[3] || 0);
    }

    /**
     * 将对象数组按IP排序
     * @param {Array.<object>} list 对象数组 eg: [{k:'192.168.2.10'},{k:'192.168.3.1'}]
     * @param {string} prop 用于排序的属性
     * @param {boolean} desc 是否倒序,默认为false
     */
    function sortIP(list, prop, desc) {
        list.sort(function (a, b) {
            var v1 = a[prop] || "", v2 = b[prop] || "";
            if (v1 == v2) return 0;

            var rv = ip2int(v1) - ip2int(v2);

            return desc ? -rv : rv;
        });
    }

    /**
     * 对象数组排序
     * @param {Array.<object>} list 对象数组
     * @param {number} type 排序类型 0:字符串排序|1:数字排序|2:日期排序|3:IP排序
     * @param {string} prop 用于排序的属性
     * @param {boolean} desc 是否倒序,默认为false
     */
    function sortList(list, type, prop, desc) {
        switch (type) {
            case 1: sortNumber(list, prop, desc); break;
            case 2: sortDate(list, prop, desc); break;
            case 3: sortIP(list, prop, desc); break;
            default: sortString(list, prop, desc); break;
        }
    }

    /**
     * 返回一个绑定到指定作用域的新函数
     * @param {function} fn 
     * @param {object} bind 要绑定的作用域
     */
    function proxy(fn, bind) {
        if (isObject(fn)) {
            var name = bind;
            bind = fn;
            fn = bind[name];
        }

        return function () {
            fn.apply(bind, arguments);
        }
    }

    /**
     * 触发指定函数,如果函数不存在,则不触发 eg:fire(fn,this,arg1,arg2)
     * @param {function} fn 
     * @param {object} bind 要绑定的作用域
     */
    function fire(fn, bind) {
        if (fn != undefined) return fn.apply(bind, slice.call(arguments, 2));
    }

    /**
     * 函数延迟执行,若fn未定义,则忽略 eg:delay(fn,this,10,[arg1,arg2])
     * @param {function} fn 
     * @param {object} bind 要绑定的作用域
     * @param {number} time 要延迟的毫秒数
     * @param {Array.<object>} args 传给fn的参数
     */
    function delay(fn, bind, time, args) {
        if (fn == undefined) return;

        return setTimeout(function () {
            //ie6-7,apply第二个参数不能为空,否则报错
            fn.apply(bind, args || []);
        }, def(time, 20));
    }

    /**
     * 异步执行,相当于setTimeout,但会检查fn是否可用 eg:async(fn,10,arg1,arg2)
     * @param {function} fn 
     * @param {number} time 要延迟的毫秒数
     */
    function async(fn, time) {
        return isFunc(fn) && delay(fn, undefined, time, slice.call(arguments, 2));
    }

    //等待达到条件或超时时,执行一个回调函数 callback(ops,timedout)
    function _waitFor(ops) {
        var now_time = +new Date,

            timeout = ops.timeout,  //超时时间
            timedout = timeout && now_time - ops.startTime > timeout;  //是否超时

        //若未超时且未达到条件,则继续等待
        if (!timedout && !ops.check(ops)) {
            ops.count++;

            return async(_waitFor, ops.sleep, ops);
        }

        ops.endTime = now_time;
        ops.callback(ops, timedout);
    }

    /**
     * 等待达到条件或超时时,执行一个回调函数 callback(ops,timedout)
     * @param {function} check 检测函数,若返回true则立即执行回调函数
     * @param {function} callback 回调函数(ops,timedout)
     * @param {number} timeout 超时时间(单位:ms),默认10000ms
     * @param {number} sleep 休眠间隔(单位:ms),默认20ms
     */
    function waitFor(check, callback, timeout, sleep) {
        _waitFor({
            check: check,
            callback: callback,
            timeout: timeout,
            sleep: sleep,

            count: 0,
            startTime: +new Date
        });
    }

    /**
     * 遍历数组或类数组,与浏览器实现保持一致(忽略未初始化的项,注意:ie8及以下会忽略数组中 undefined 项)
     * @param {Array} list 
     * @param {function} fn 处理函数(value,i,list)
     * @param {object} bind fn绑定的作用域对象
     */
    function each_array(list, fn, bind) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (i in list) fn.call(bind, list[i], i, list);
        }
    }

    /**
     * 函数节流,返回一个在指定时间内最多执行一次的函数,第一次或超过指定时间则立即执行函数
     * @param {number} time 指定时间(单位:ms)
     * @param {function} fn 处理函数(arg1,...)
     * @param {object} bind fn绑定的作用域对象
     */
    function throttle(time, fn, bind) {
        var last_exec_time;

        return function () {
            var now = Date.now();
            if (last_exec_time && now - last_exec_time < time) return;

            last_exec_time = now;
            fn.apply(bind, arguments);
        };
    }

    /**
     * 函数防抖,返回一个延迟指定时间且仅执行最后一次触发的函数,若以小于指定时间的频率一直调用,则函数不会执行
     * @param {number} time 指定时间(单位:ms)
     * @param {function} fn 处理函数(arg1,...)
     * @param {object} bind fn绑定的作用域对象
     */
    function debounce(time, fn, bind) {
        var timer;

        return function () {
            if (timer) clearTimeout(timer);

            var args = arguments;
            timer = setTimeout(function () {
                fn.apply(bind, args);
            }, time);
        }
    }

    /**
     * 简单通用工厂
     * @param {function} init 初始化函数
     * @param {function} Super 超类
     */
    function factory(init, Super) {
        if (Super && isFunc(Super)) {
            var F = function () { };
            F.prototype = Super.prototype;

            init.prototype = new F();
        }

        var obj = init;

        obj.constructor = factory;
        obj.prototype.constructor = obj;

        //prototype扩展
        obj.extend = function (source, forced) {
            extend(this.prototype, source, forced);
        };

        //函数别名
        obj.alias = function (name, aliasName) {
            alias(this, name, aliasName);
        };

        return obj;
    };

    /*
    * extend.js:JavaScript核心对象扩展
    */
    each_array([String, Array, Number, Boolean, Function, Date, RegExp], factory);

    //----------------------------- Object extend -----------------------------

    //扩展Object
    extend(Object, {
        //创建一个拥有指定原型的对象,未实现第二个参数
        create: function (o) {
            var F = function () { };
            F.prototype = o;
            return new F();
        },

        //遍历对象
        forEach: function (obj, fn, bind) {
            for (var key in obj) {
                if (has.call(obj, key)) fn.call(bind, key, obj[key], obj);
            }
        },

        //获取对象所有键
        keys: function (obj) {
            var tmp = [];

            //注意:for in 在ie6下无法枚举 propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor 等属性
            //尽量不要使用上述属性作为键
            for (var key in obj) {
                if (has.call(obj, key)) tmp.push(key);
            }

            return tmp;
        },
        //获取对象所有值
        values: function (obj) {
            var tmp = [];

            for (var key in obj) {
                if (has.call(obj, key)) tmp.push(obj[key]);
            }

            return tmp;
        },

        //获取项数量
        size: function (obj) {
            var count = 0;

            for (var key in obj) {
                if (has.call(obj, key)) count++;
            }

            return count;
        },

        //对象是否拥有子项
        hasItem: function (obj) {
            for (var key in obj) {
                if (has.call(obj, key)) return true;
            }

            return false;
        }
    });

    //----------------------------- String extend -----------------------------

    //String原型扩展(已标准化,此为兼容浏览器原生方法)
    String.extend({
        //去掉首尾空格
        trim: function () {
            //return this.replace(/^\s+|\s+$/g, "");

            var str = "" + this,
                str = str.replace(/^\s\s*/, ""),
                ws = /\s/,
                i = str.length;

            while (ws.test(str.charAt(--i))) { };

            return str.slice(0, i + 1);
        },
        //返回将本身重复n次的字符串 eg:"abc".repeat(2) => "abcabc"
        repeat: function (n) {
            //if (n < 1) return "";

            //return new Array(n + 1).join(this);

            //二分法,性能大大提升
            var str = "" + this,
                total = "";

            while (n > 0) {
                if (n % 2 == 1) total += str;
                if (n == 1) break;

                str += str;
                n >>= 1;
            }

            return total;
        },
        //是否以指定字符串开头
        startsWith: function (str, index) {
            var s = "" + this;

            return s.substr(index || 0, str.length) === str;
        },
        //是否以指定字符串结尾
        endsWith: function (str, index) {
            var s = "" + this,
                end = index == undefined || index > s.length ? s.length : index;

            return s.substr(end - str.length, str.length) === str;
        },
        //是否包含指定字符串
        contains: function (str, index) {
            return this.indexOf(str, index) != -1;
        }
    });

    //String原型扩展
    String.extend({
        //删除指定字符串
        //pattern:要删除的字符串或正则表达式
        //flags:正则表达式标记,默认为g
        drop: function (pattern, flags) {
            var regexp = typeof pattern == "string" ? new RegExp(pattern, flags || "g") : pattern;
            return this.replace(regexp, "");
        },
        //字符串反转
        reverse: function () {
            return this.split("").reverse().join("");
        },
        //html编码 eg:\n => <br/>
        htmlEncode: function () {
            return this.replace(/\x26/g, "&amp;").replace(/\x3c/g, "&lt;").replace(/\x3e/g, "&gt;").replace(/\r?\n|\r/g, "<br/>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;");
        },
        //html解码 eg:<br/> => \n
        htmlDecode: function () {
            return this.replace(/<br[^>]*>/ig, "\n").replace(/<script[^>]*>([^~]|~)+?<\/script>/gi, "").replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
        }
    });

    //----------------------------- Number extend -----------------------------

    //Number原型扩展
    Number.extend({
        //将数字按长度和进制转换为一个长度不低于自身的字符串 eg:(13).format(4) ->'0013'
        //(13).format(1) -> '13'   (13).format(4, 16)->'000d'   (13).format(4, 2) ->'1101'
        format: function (length, radix) {
            var str = this.toString(radix || 10), fix = length - str.length;
            return (fix > 0 ? "0".repeat(fix) : "") + str;
        },
        //数字转为保留指定的小数位数，整数不受影响 eg: (0.2394).maxDecimal(2) => 0.24
        maxDecimal: function (length) {
            if (this === Math.floor(this)) return this;

            if (length === 0) return Math.floor(Math.round(this * 100) / 100);

            var fix = Math.pow(10, +length || 8);
            return Math.round(this * fix) / fix;
        }
    });

    //----------------------------- Array extend -----------------------------

    //Array原型扩展(已标准化,此为兼容浏览器原生方法)
    //与浏览器实现保持一致(忽略未初始化的项,注意:ie8及以下会忽略数组中 undefined 项)
    //部分函数未做参数有效性检测,传参时需注意
    Array.extend({
        //迭代器:用函数(fn)处理数组的每一项
        forEach: function (fn, bind) {
            var self = this;
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self) fn.call(bind, self[i], i, self);
            }
        },
        //迭代器:返回经过函数(fn)处理后的新数组
        map: function (fn, bind) {
            var self = this, tmp = [];
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self) tmp.push(fn.call(bind, self[i], i, self));
            }
            return tmp;
        },
        //查找方法(顺序)
        indexOf: function (item, index) {
            var self = this, len = self.length, i;
            if (len == 0) return -1;

            if (index == undefined) i = 0;
            else {
                i = Number(index);
                if (i < 0) i = Math.max(i + len, 0);
            }

            for (; i < len; i++) {
                if (i in self && self[i] === item) return i;
            }
            return -1;
        },
        //查找方法(倒序)
        lastIndexOf: function (item, index) {
            var self = this, len = self.length, i;
            if (len == 0) return -1;

            if (index == undefined) i = len - 1;
            else {
                i = Number(index);
                i = i >= 0 ? Math.min(i, len - 1) : i + len;
            }

            for (; i >= 0; i--) {
                if (i in self && self[i] === item) return i;
            }
            return -1;
        },
        //将所有在给定过滤函数中过滤通过的数组项创建一个新数组
        filter: function (fn, bind) {
            var self = this, tmp = [];
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self) {
                    var val = self[i];
                    if (fn.call(bind, val, i, self)) tmp.push(val);
                }
            }
            return tmp;
        },
        //如果数组中的每一项都通过给定函数的测试,则返回true
        every: function (fn, bind) {
            var self = this;
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self && !fn.call(bind, self[i], i, self)) return false;
            }
            return true;
        },
        //如果数组中至少有一个项通过了给出的函数的测试,则返回true
        some: function (fn, bind) {
            var self = this;
            for (var i = 0, len = self.length; i < len; i++) {
                if (i in self && fn.call(bind, self[i], i, self)) return true;
            }
            return false;
        }
    });

    //Array原型扩展
    Array.extend({
        //数组中是否存在指定的项
        contains: function (item, index) {
            return this.indexOf(item, index) !== -1;
        },
        //获取数组项
        //若index小于0,则从右往左获取
        get: function (index) {
            if (index >= 0) return this[index];

            index += this.length;
            return index >= 0 ? this[index] : undefined;
        },
        //获取数组第一项
        first: function () {
            return this.get(0);
        },
        //获取数组最后一项
        last: function () {
            return this.get(-1);
        },
        //根据索引删除数组中的项
        del: function (index, n) {
            return this.splice(index, n || 1);
        },
        //去掉数组中的重复项 eg:[0,"0",false,null,undefined] 不支持的特殊情况:[ new String(1), new Number(1) ]
        //如果是对象数组,可以指定对象的键 eg:[{id:1},{id:2}] -> ret.unique("id")
        unique: function (prop) {
            var ret = this, tmp = [], hash = {};

            for (var i = 0, len = ret.length; i < len; i++) {
                var item = ret[i],
                    value = prop ? item[prop] : item,
                    key = typeof (value) + value;  //typeof -> toString.call,性能略有下降

                if (!hash[key]) {
                    tmp.push(item);
                    hash[key] = true;
                }
            }

            return tmp;
        },
        //去掉空的项,并返回一个新数组
        clean: function () {
            var ret = this, tmp = [];

            for (var i = 0, len = ret.length; i < len; i++) {
                if (ret[i] != undefined) tmp.push(ret[i]);
            }

            return tmp;
        },
        //根据指定的键或索引抽取数组项的值 
        //eg:[{id:1},{id:2}]    ->  ret.items("id") => [1,2]
        //eg:[[1,"a"],[2,"b"]]  ->  ret.items(1)    => ["a","b"]
        items: function (prop, skipUndefined) {
            return vals(this, prop, skipUndefined);
        },
        //将数组转换为键值对
        //value:若为空,则使用数组索引;为处理函数,需返回包含键值的数组 eg: value(item,i) => [key,value]
        toMap: function (value, ignoreCase) {
            return toMap(this, value, ignoreCase);
        },
        //将对象数组转换为键值对
        //propKey:对象中作为键的属性
        //propValue:对象中作为值的属性,若为空,则值为对象本身;若为true,则给对象添加index属性,值为对象在数组中的索引
        toObjectMap: function (propKey, propValue) {
            return toObjectMap(this, propKey, propValue);
        }
    });

    //Array静态方法扩展(已标准化,此为兼容浏览器原生方法)
    extend(Array, {
        forEach: each_array,

        isArray: isArray
    });

    //----------------------------- Date extend -----------------------------

    var DATE_REPLACEMENTS = [/y{2,4}/, /M{1,2}/, /d{1,2}/, /H{1,2}|h{1,2}/, /m{1,2}/, /s{1,2}/, /S/, /W/, /AP/],
        FIX_TIMEZONEOFFSET = new Date().getTimezoneOffset(),

        WEEKS = "日一二三四五六".split(""),
        APS = ["上午", "下午"],

        INVALID_DATE = new Date(""),

        DATE_FNS = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds", "getMilliseconds", "getDay", "getHours"];

    //获取指定part形式表示的日期
    function format_date(part, t) {
        switch (part) {
            case "d": case "day": return t / 86400000;
            case "h": case "hour": return t / 3600000;
            case "m": case "minute": return t / 60000;
            case "s": case "second": return t / 1000;
        }
        return t;
    }

    //Date原型扩展
    Date.extend({
        //是否有效日期
        isValid: function () {
            return !isNaN(this.valueOf());
        },
        //格式化日期显示 eg:(new Date()).format("yyyy-MM-dd HH:mm:ss");
        format: function (format, ops) {
            ops = ops || {};

            if (!this.isValid()) return ops.invalid || "--";

            var months = ops.months,
                weeks = ops.weeks || WEEKS,
                aps = ops.aps || APS,

                len = DATE_REPLACEMENTS.length,
                i = 0;

            for (; i < len; i++) {
                var re_date = DATE_REPLACEMENTS[i], n = this[DATE_FNS[i]]();

                format = format.replace(re_date, function (match) {
                    var length = match.length;

                    //上午|下午
                    if (i == 8) return aps[n > 12 ? 1 : 0];

                    //星期
                    if (i == 7) return weeks[n];

                    //月份
                    if (i == 1) {
                        if (months) return months[n];

                        //月份索引从0开始,此处加1
                        n++;
                    }

                    //12小时制
                    if (i == 3 && match.charAt(0) == "h" && n > 12) n -= 12;

                    //匹配的长度为1时,直接转为字符串输出 H -> 9|19
                    if (length == 1) return "" + n;

                    //按照指定的长度输出字符串(从右往左截取)
                    return ("00" + n).slice(-length);
                });
            }

            return format;
        },
        //按照part(y|M|d|h|m|s|ms)添加时间间隔
        add: function (part, n) {
            var date = this;
            switch (part) {
                case "y": case "year": date.setFullYear(date.getFullYear() + n); break;
                case "M": case "month": date.setMonth(date.getMonth() + n); break;
                case "d": case "day": date.setDate(date.getDate() + n); break;
                case "h": case "hour": date.setHours(date.getHours() + n); break;
                case "m": case "minute": date.setMinutes(date.getMinutes() + n); break;
                case "s": case "second": date.setSeconds(date.getSeconds() + n); break;
                case "ms": case "millisecond": date.setMilliseconds(date.getMilliseconds() + n); break;
            }
            return date;
        },
        //返回两个指定日期之间所跨的日期或时间 part 边界的数目
        diff: function (part, date) {
            return format_date(part, this - date);
        },
        //从UTC时间转为本地时间
        fromUTC: function () {
            this.setMinutes(this.getMinutes() - FIX_TIMEZONEOFFSET);
            return this;
        },
        //转为UTC时间
        toUTC: function () {
            this.setMinutes(this.getMinutes() + FIX_TIMEZONEOFFSET);
            return this;
        },
        //返回一个日期副本,对该副本所做的修改,不会同步到原日期
        clone: function () {
            return new Date(this.getTime());
        }
    });

    //Date静态方法扩展(已标准化,此为兼容浏览器原生方法)
    extend(Date, {
        //获取当前日期和时间所代表的毫秒数
        now: function () {
            return +new Date;
        }
    });

    //Date静态方法扩展
    extend(Date, {
        //将字符串解析为Date对象
        from: function (s) {
            if (typeof s == "number") return new Date(s);
            if (typeof s == "string") {
                if (!s) return INVALID_DATE;

                if (!isNaN(s) && s.length > 6) return new Date(+s);

                //将年、月、横线(-)替换为斜线(/),将时、分替换为冒号(:),去掉日、号、秒
                //var ds = s.replace(/[-\u5e74\u6708]/g, "/").replace(/[\u65f6\u5206\u70b9]/g, ":").replace(/[T\u65e5\u53f7\u79d2]/g, ""), date = new Date(ds);
                var isUTC = s.slice(s.length - 1) == "Z",
                    ds = s.replace(/[-\u5e74\u6708]/g, "/").replace(/[\u65f6\u5206\u70b9]/g, ":").replace("T", " ").replace(/[Z\u65e5\u53f7\u79d2]/g, ""),
                    //毫秒检测
                    index = ds.lastIndexOf("."),
                    date,
                    ms;

                if (index != -1) {
                    ms = +ds.slice(index + 1, index + 4);
                    ds = ds.slice(0, index);
                }

                date = new Date(ds);

                //兼容只有年月的情况 eg:2014/11
                if (!date.isValid() && ds.indexOf("/") > 0) {
                    var ps = ds.split(' '),
                        s_date = (ps[0] + (ps[0].endsWith("/") ? "" : "/") + "1/1").split('/').slice(0, 3).join("/");

                    date = new Date(s_date + ' ' + (ps[1] || ""));
                }

                //设置毫秒
                if (ms) date.setMilliseconds(ms);

                return date.isValid() ? (isUTC ? date.fromUTC() : date) : INVALID_DATE;
            }

            return toString.call(s) == "[object Date]" ? s : INVALID_DATE;
        },

        //获取秒转化的时间部分
        parts: function (t) {
            var days = 0, hours = 0, minutes = 0;

            days = Math.floor(t / 86400);
            if (days > 0) t -= days * 86400;

            hours = Math.floor(t / 3600);
            if (hours > 0) t -= hours * 3600;

            minutes = Math.floor(t / 60);
            if (minutes > 0) t -= minutes * 60;

            //mintues: 之前拼写错误，此为兼容之前的调用
            return { days: days, hours: hours, minutes: minutes, mintues: minutes, seconds: t };
        },

        //计算时间t所代表的总数
        total: format_date
    });

    //---------------------- 事件监听器 ----------------------

    /**
     * 自定义事件监听器
     * @param {Array.<string>} types 自定义事件列表
     * @param {object} bind 事件函数绑定的上下文 eg:fn.call(bind)
     */
    function Listener(types, bind) {
        var self = this;

        self.map = {};
        self.bind = bind;

        types.forEach(function (type) {
            self.map[type] = [];
        });
    }

    Listener.prototype = {
        constructor: Listener,

        //添加自定义事件 eg:listener.add("start",fn);
        add: function (type, fn) {
            var map = this.map;

            if (typeof type == "string") {
                if (isFunc(fn)) map[type].push(fn);
            } else if (isObject(type)) {
                Object.forEach(type, function (k, v) {
                    if (map[k] && isFunc(v)) map[k].push(v);
                });
            }

            return this;
        },
        //移除自定义事件,若fn为空,则移除该类型下的所有事件
        remove: function (type, fn) {
            if (fn != undefined) {
                var list = this.map[type], i = list.length;
                while (--i >= 0) {
                    if (list[i] == fn) list = list.splice(i, 1);
                }
            } else {
                this.map[type] = [];
            }

            return this;
        },
        //触发自定义事件 eg:listener.trigger("click",args);
        trigger: function (type, args) {
            var self = this,
                list = self.map[type],
                len = list.length,
                i = 0;

            for (; i < len; i++) {
                if (list[i].apply(self.bind, [].concat(args)) === false) break;
            }

            return self;
        }
    };

    //-------------------------- 搜索 --------------------------

    var SE = {
        //获取搜索对象
        get: function (words) {
            var pattern = words.replace(/\\(?!d|B|w|W|s|S)/g, "\\\\").replace(/\./g, "\\.").replace(/[\[\]\(\)]/g, "\\$&").replace(/\*/, ".*");

            return new RegExp(pattern, "i");
        },

        //在列表内搜索
        //props:要搜索的属性数组
        //keywords:搜索关键字
        //highlight:是否记录高亮信息
        search: function (list, props, keywords, highlight) {
            if (!list || list.length <= 0) return [];

            if (!keywords) {
                list.forEach(function (u) {
                    u.__match = undefined;
                });

                return list;
            }

            var tester = SE.get(keywords);

            var tmp = list.filter(function (data) {
                var matched = false;

                var map_match = {};

                props.forEach(function (prop) {
                    var text = data[prop];
                    if (!text || !tester.test(text)) return;

                    if (highlight) map_match[prop] = (text + "").replace(tester, '`#`{$&}`#`');

                    matched = true;
                });

                data.__match = matched && highlight ? map_match : undefined;

                return matched;
            });

            return tmp;
        },

        //读取数据,若搜索时启用了高亮,则返回高亮字符串
        read: function (data, prop) {
            var match = data.__match;
            if (match && match[prop]) {
                return match[prop].htmlEncode().replace(/`#`{(.+?)}`#`/g, function (m, m1) {
                    return '<span class="light">' + m1 + '</span>';
                });
            }

            return ((data[prop] || "") + "").htmlEncode();
        }
    };

    //---------------------- 其它 ----------------------

    //正则验证
    var RE_MAIL = /^[\w\.-]+@[\w-]+(\.[\w-]+)*\.[\w-]+$/,           //验证邮箱
        RE_PHONE = /^(1\d{10}|(\d{3,4}-?)?\d{7,8}(-\d{1,4})?)$/,    //验证电话号码(手机号码、带区号或不带区号、带分机号或不带分机号)
        RE_TEL = /^1\d{10}$/,                                       //验证手机号码
        RE_MAC = /^[a-fA-F0-9]{2}([:-][a-fA-F0-9]{2}){5}$/,         //验证MAC地址
        RE_HTTP = /^https?:\/\//i;

    /**
     * 判断是否为可用IP格式(IPv4)
     * @param {string} ip eg: 192.168.1.1
     */
    function isIP(ip) {
        var parts = ip.split("."), length = parts.length;
        if (length != 4) return false;

        for (var i = 0; i < length; i++) {
            var part = +parts[i];
            if (!parts[i] || isNaN(part) || part < 0 || part > 255) return false;
        }

        return true;
    }

    /**
     * 判断是否为可用邮箱格式
     * @param {string} str eg: test@my.com
     */
    function isMail(str) {
        return RE_MAIL.test(str);
    }

    /**
     * 判断是否符合电话号码格式
     * @param {string} str eg: 18688889999 | 027-88889999-3912
     */
    function isPhone(str) {
        return RE_PHONE.test(str);
    }

    /**
     * 判断是否符合手机号码格式
     * @param {string} str eg: 18688889999
     */
    function isTel(str) {
        return RE_TEL.test(str);
    }

    /**
     * 判断是否符合MAC地址格式
     * @param {string} str eg: 00:11:22:33:44:ff
     */
    function isMAC(str) {
        return RE_MAC.test(str);
    }

    /**
     * 判断是否http路径(以 http:// 或 https:// 开头)
     * @param {string} url 
     */
    function isHttpURL(url) {
        return RE_HTTP.test(url);
    }

    /**
     * 按照进制解析数字的层级 eg:时间转化 -> parseLevel(86400,[60,60,24]) => { value=1, level=3 }
     * @param {number} size 要解析的数字
     * @param {number|Array.<number>} steps 步进,可以是固定的数字(eg:1024),也可以是具有层次关系的数组(eg:[60,60,24])
     * @param {number} limit 限制解析的层级,正整数,默认为100
     */
    function parseLevel(size, steps, limit) {
        size = +size;
        steps = steps || 1024;

        var level = 0,
            isNum = typeof steps == "number",
            stepNow = 1,
            count = isUInt(limit) ? limit : (isNum ? 100 : steps.length);

        while (size >= stepNow && level < count) {
            stepNow *= (isNum ? steps : steps[level]);
            level++;
        }

        if (level && size < stepNow) {
            level--;
            stepNow /= (isNum ? steps : steps[level]);
        }

        return { value: level ? size / stepNow : size, level: level };
    }

    var UNITS_FILE_SIZE = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];

    /**
     * 格式化数字输出,将数字转为合适的单位输出,默认按照1024层级转为文件单位输出
     * @param {number} size 要解析的数字
     * @param {object} ops 配置对象 {all:false,steps:1024,limit:100,trim:true,join:'',units:['B','KB','MB','GB'],digit:2,start:0,defValue:'--'}
     */
    function formatSize(size, ops) {
        ops = ops === true ? { all: true } : ops || {};

        if (isNaN(size) || size == undefined || size < 0) {
            var defValue = ops.defValue || "--";

            return ops.all ? { text: defValue } : defValue;
        }

        var pl = parseLevel(size, ops.steps, ops.limit),

            value = pl.value,
            text = value.toFixed(def(ops.digit, 2));

        if (ops.trim !== false && text.lastIndexOf(".") != -1) text = text.replace(/\.?0+$/, "");

        pl.text = text + (ops.join || "") + (ops.units || UNITS_FILE_SIZE)[pl.level + (ops.start || 0)];

        return ops.all ? pl : pl.text;
    }

    var encodeUrlParam = encodeURIComponent;

    /**
     * 解码url参数值 eg:%E6%B5%8B%E8%AF%95 => 测试
     * @param {string} param 要解码的字符串 eg:%E6%B5%8B%E8%AF%95
     */
    function decodeUrlParam(param) {
        try {
            return decodeURIComponent(param);
        } catch (e) {
            return param;
        }
    }

    /**
     * 将参数对象转为查询字符串 eg: {a:1,b:2} => a=1&b=2
     * @param {object} obj 参数对象 eg: {a:1,b:2}
     */
    function joinUrlParams(obj) {
        if (!obj) return "";
        if (typeof obj == "string") return obj;

        var tmp = [];

        Object.forEach(obj, function (k, v) {
            if (v != undefined && typeof v != "function") tmp.push(encodeUrlParam(k) + "=" + encodeUrlParam(v));
        });

        return tmp.join("&");
    }

    /**
     * 连接url和查询字符串(支持传入对象)
     * @param {string} url URL地址
     */
    function joinUrl(url) {
        var params = [], args = arguments;
        for (var i = 1, len = args.length; i < len; i++) {
            var param = args[i];
            if (param) params.push(joinUrlParams(param));
        }

        var index = url.indexOf("#"), hash = "";
        if (index != -1) {
            hash = url.slice(index).trim();
            url = url.slice(0, index);
        }

        url = url.trim().replace(/\?&$|\?$|\&$/, '');

        var str_params = params.join("&");
        if (str_params) url += (url.contains("?") ? "&" : "?") + str_params;

        return url + hash;
    }

    /**
     * 解析url参数 eg:url?id=1
     * @param {string} search 查询字符串 eg: ?id=1
     */
    function parseUrlParams(search) {
        if (!search) return {};

        var i = search.indexOf("?");
        if (i != -1) search = search.slice(i + 1);

        var j = search.indexOf("#");
        if (j != -1) search = search.slice(0, j);

        if (!search) return {};

        var list = search.split("&"), map = {};

        for (var i = 0, len = list.length; i < len; i++) {
            //跳过空字符串
            if (!list[i]) continue;

            var kv = list[i].split("="),
                key = kv[0],
                value = kv[1];

            if (key) map[decodeUrlParam(key)] = value ? decodeUrlParam(value) : "";
        }

        return map;
    }

    /**
     * 转换或解析查询字符串
     * @param {string|object} obj 为string类型时将解析为参数对象，否则将转换为查询字符串
     */
    function processUrlParam(obj) {
        if (obj == undefined) return;

        return typeof obj == "string" ? parseUrlParams(obj) : joinUrlParams(obj);
    }

    var DEF_LOC = GLOBAL.location || { protocol: "", hash: "", pathname: "" };

    /**
     * 解析URL路径 => {href,origin,protocol,host,hostname,port,pathname,search,hash}
     * @param {string} url URL地址
     */
    function parseUrl(url) {
        //return new URL(url);

        var m = url.match(/(^[^:]*:)?\/\/([^:\/]+)(:\d+)?(.*)$/),
            protocol = m[1] || DEF_LOC.protocol,
            hostname = m[2],
            port = (m[3] || "").slice(1),
            host = hostname + (port ? ":" + port : ""),

            pathname = m[4] || "",
            search = "",
            hash = "",

            i = pathname.indexOf("#");

        if (i != -1) {
            hash = pathname.slice(i);
            pathname = pathname.slice(0, i);
        }

        i = pathname.indexOf("?");
        if (i != -1) {
            search = pathname.slice(i);
            pathname = pathname.slice(0, i);
        }

        return { href: protocol + "//" + host + pathname + search + hash, origin: protocol + "//" + host, protocol: protocol, host: host, hostname: hostname, port: port, pathname: pathname || "/", search: search, hash: hash };
    }

    /**
     * 解析 URL hash值 eg:#net/config!/wan  => {nav:"#net/config",param:"wan"}
     * @param {string} hash eg:#net/config!/wan
     */
    function parseUrlHash(hash) {
        if (!hash) hash = DEF_LOC.hash;
        //可能对后续处理造成影响,比如 param 中有/等转码字符
        //if(hash) hash = decode_url_param(hash);

        var nav = hash, param;

        if (hash) {
            var index = hash.indexOf("!/");
            if (index != -1) {
                nav = hash.slice(0, index);
                param = hash.slice(index + 2);
            }
        }

        return { nav: nav, param: param };
    }

    /**
     * 获取当前页名称 eg: /app.html?id=1#aa => app.html
     * @param {string} path eg: /app.html?id=1#aa
     * @param {boolean} keepQueryHash 是否保留查询字符串和Hash字符串,默认为false
     */
    function getPageName(path, keepQueryHash) {
        var pathname = (path || DEF_LOC.pathname).replace(/\\/g, "/"),
            start = pathname.lastIndexOf("/") + 1;

        if (keepQueryHash) return pathname.slice(start);

        var end = pathname.indexOf("?", start);
        if (end == -1) end = pathname.indexOf("#", start);

        return end != -1 ? pathname.slice(start, end) : pathname.slice(start);
    }

    /**
     * 解析JSON，解析失败时返回undefined
     * @param {string} text 要解析的JSON字符串
     */
    function parseJSON(text) {
        if (!text || typeof text !== 'string') return text;

        try {
            return JSON.parse(text);
        } catch (err) { }
    }

    //---------------------- export ----------------------

    var Q = {
        version: "1.2.2",
        G: GLOBAL,

        strict: is_strict_mode,

        type: getType,

        isFunc: isFunc,
        isObject: isObject,
        isArray: Array.isArray,
        isArrayLike: isArrayLike,

        def: def,
        isNum: isNum,
        isUNum: isUNum,
        isInt: isInt,
        isUInt: isUInt,
        checkNum: checkNum,
        checkInt: checkInt,

        toUpper: toUpper,
        toLower: toLower,

        toArray: toArray,
        makeArray: makeArray,

        arr: arr,
        vals: vals,

        alias: alias,
        extend: extend,
        clone: clone,

        toMap: toMap,
        toObjectMap: toObjectMap,
        getChangedData: getChangedData,

        ip2int: ip2int,

        sortNumber: sortNumber,
        sortString: sortString,
        sortDate: sortDate,
        sort: sortList,

        proxy: proxy,
        fire: fire,
        delay: delay,
        async: async,
        waitFor: waitFor,

        throttle: throttle,
        debounce: debounce,

        factory: factory,

        isIP: isIP,
        isMail: isMail,
        isPhone: isPhone,
        isTel: isTel,
        isMAC: isMAC,
        isHttpURL: isHttpURL,

        parseLevel: parseLevel,
        formatSize: formatSize,

        parseUrlParams: parseUrlParams,
        joinUrlParams: joinUrlParams,
        param: processUrlParam,
        join: joinUrl,

        parseUrl: parseUrl,
        parseHash: parseUrlHash,
        getPageName: getPageName,

        parseJSON: parseJSON,

        Listener: Listener,
        SE: SE
    };

    GLOBAL.Q = Q;

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = Q;
    }

})();

/*
* Q.Queue.js 队列 for browser or Node.js
* author:devin87@qq.com
* update:2021/06/23 12:53
*/
(function (undefined) {
    "use strict";

    var delay = Q.delay,
        extend = Q.extend,
        fire = Q.fire,

        isFunc = Q.isFunc,
        isObject = Q.isObject,
        isArrayLike = Q.isArrayLike,
        isUInt = Q.isUInt,

        getType = Q.type,
        makeArray = Q.makeArray,
        factory = Q.factory,

        Listener = Q.Listener;

    var QUEUE_TASK_TIMEDOUT = -1,    //任务已超时
        QUEUE_TASK_READY = 0,        //任务已就绪，准备执行
        QUEUE_TASK_PROCESSING = 1,   //任务执行中
        QUEUE_TASK_OK = 2,           //任务已完成

        //自定义事件
        LIST_CUSTOM_EVENT = ["add", "start", "end", "stop", "complete", "limit"];

    /**
     * 异步队列
     * @param {object} ops 配置对象 eg: {tasks:[],count:10000,limitMode:1,auto:true,workerThread:1,timeout:0,injectIndex:1,injectCallback:'complete',exec:function(task,next){},process:function(task,next){},processResult:function(tasks){}}
     */
    function Queue(ops) {
        ops = ops || {};

        var self = this,
            tasks = ops.tasks;

        //队列自定义事件
        self._listener = new Listener(LIST_CUSTOM_EVENT, self);

        self.count = +ops.count || 10000;               //队列长度,超过后将清理已完成的任务
        self.limitMode = ops.limitMode || 1;            //队列在超出长度后的限制模式(1:禁止添加|2:清理早期的任务)
        self.auto = ops.auto !== false;                 //是否自动开始
        self.workerThread = ops.workerThread || 1;      //工作线程
        self.timeout = ops.timeout;                     //超时时间(毫秒)

        self.id = 0;

        if (ops.rtype == "auto") self.rtype = getType(tasks);

        LIST_CUSTOM_EVENT.forEach(function (type) {
            var fn = ops[type];
            if (fn) self.on(type, fn);
        });

        if (ops.inject) self.inject = ops.inject;
        if (ops.process) self.process = ops.process;
        if (ops.processResult) self.processResult = ops.processResult;

        self.ops = ops;

        self.reset();

        self.addList(tasks);
    }

    factory(Queue).extend({
        //添加自定义事件
        on: function (type, fn) {
            this._listener.add(type, fn);
            return this;
        },
        //触发自定义事件
        trigger: function (type, args) {
            this._listener.trigger(type, args);
            return this;
        },

        //重置队列
        reset: function () {
            var self = this;

            self.tasks = [];
            self.index = 0;
            self.id = 0;

            self.workerIdle = self.workerThread;

            return self;
        },

        //添加任务
        _add: function (args, key, auto) {
            var self = this,
                tasks = self.tasks,
                count = self.count,
                is_add = true;

            var task = { id: ++self.id, args: makeArray(args), state: QUEUE_TASK_READY };

            if (key != undefined) task.key = key;

            if (tasks.length >= count) {
                if (self.index) {
                    tasks = tasks.slice(self.index);
                    self.index = 0;
                }

                if (tasks.length >= count) {
                    var is_dropped = self.limitMode == 2, dropped_tasks;

                    if (is_dropped) {
                        dropped_tasks = tasks.slice(0, tasks.length - count + 1);
                        tasks = tasks.slice(-count + 1);
                        self.index = 0;
                    } else {
                        is_add = false;
                    }

                    self.trigger("limit", is_dropped ? dropped_tasks : task);
                }

                self.tasks = tasks;
            }

            if (is_add) {
                tasks.push(task);
                self.trigger("add", task);
            }

            if (auto) self.start();

            return self;
        },

        //添加任务
        add: function () {
            return this._add(arguments, undefined, this.auto);
        },

        //批量添加任务
        addList: function (tasks) {
            var self = this;
            if (!tasks) return self;

            if (isArrayLike(tasks)) {
                Array.forEach(tasks, function (v, i) {
                    self._add(v, i, false);
                });
            } else {
                Object.forEach(tasks, function (k, v) {
                    self._add(v, k, false);
                });
            }

            if (self.auto) self.start();

            return self;
        },

        //返回队列长度,可指定任务状态
        size: function (state) {
            return state != undefined ? this.tasks.filter(function (task) { return task.state == state; }).length : this.tasks.length;
        },

        //运行队列
        _run: function () {
            var self = this;

            if (self.stopped || self.workerIdle <= 0 || self.index >= self.tasks.length) return self;

            var task = self.tasks[self.index++],
                timeout = self.timeout;

            self.workerIdle--;

            self.trigger("start", task);

            //跳过任务
            if (task.state != QUEUE_TASK_READY) return self.ok(task);

            task.state = QUEUE_TASK_PROCESSING;

            //超时检测
            if (isUInt(timeout)) task._timer = delay(self.ok, self, timeout, [task, QUEUE_TASK_TIMEDOUT]);

            //处理任务
            self.process(task, function () {
                self.ok(task, QUEUE_TASK_OK);
            });

            return self.workerIdle ? self._run() : self;
        },

        //启动队列,默认延迟10ms
        start: function () {
            var self = this;
            self.stopped = false;
            if (!self.auto) self.auto = true;

            delay(self._run, self, 10);

            return self;
        },

        //暂停队列,可以调用start方法重新启动队列
        //time:可选,暂停的毫秒数
        stop: function (time) {
            var self = this;
            self.stopped = true;

            if (isUInt(time)) delay(self.start, self, time);

            return self;
        },

        //回调函数注入(支持2级注入)
        inject: function (task, callback) {
            var self = this,
                ops = self.ops,

                injectIndex = ops.injectIndex || 0,     //执行函数中回调函数所在参数索引
                injectCallback = ops.injectCallback,    //如果该参数是一个对象,需指定参数名称,可选

                args = (task.args || []).slice(0);

            //自执行函数
            if (!ops.exec && isFunc(args[0])) injectIndex++;

            //task.args 克隆,避免对原数据的影响
            var data = args[injectIndex],
                originalCallback;

            //注入回调函数
            var inject = function (result) {
                //注入结果仅取第一个返回值,有多个结果的请使用数组或对象传递
                task.result = result;

                //执行原回调函数(如果有)
                if (isFunc(originalCallback)) originalCallback.apply(this, arguments);

                //触发任务完成回调,并执行下一个任务 
                callback();
            };

            if (injectCallback != undefined) {
                if (!data) data = {};

                //避免重复注入
                var qcallback = data.__qcallback;
                originalCallback = qcallback || data[injectCallback];
                if (!qcallback && originalCallback) data.__qcallback = originalCallback;

                data[injectCallback] = inject;
                args[injectIndex] = data;
            } else {
                originalCallback = data;

                args[injectIndex] = inject;
            }

            return args;
        },

        //处理队列任务
        process: function (task, callback) {
            var self = this,
                ops = self.ops,

                exec = ops.exec,    //执行函数
                bind = ops.bind,    //执行函数绑定的上下文,可选

                args = self.inject(task, callback);

            if (exec) return exec.apply(bind, args);

            var fn = args[0];
            if (!fn) return;

            if (fn instanceof Queue) fn.start();
            else if (Q.isFunc(fn)) fn.apply(bind, args.slice(1));
        },

        //队列完成时,任务结果处理,用于complete事件参数
        processResult: function (tasks) {
            switch (this.rtype) {
                case "array":
                case "list":
                case "arguments":
                    return tasks.items("result");

                case "object": return tasks.toObjectMap("key", "result");
            }

            return [tasks];
        },

        //所有任务是否已完成
        isCompleted: function (tasks) {
            return (tasks || this.tasks).every(function (task) {
                return task.state == QUEUE_TASK_OK || task.state == QUEUE_TASK_TIMEDOUT;
            });
        },

        //设置任务执行状态为完成并开始新的任务
        ok: function (task, state) {
            var self = this;
            if (task.state != QUEUE_TASK_PROCESSING) return self._run();

            if (++self.workerIdle > self.workerThread) self.workerIdle = self.workerThread;

            if (task._timer) clearTimeout(task._timer);

            if (state != undefined) task.state = state;

            //触发任务完成事件
            self.trigger("end", task);

            if (self.stopped) {
                //任务已停止且完成时触发任务停止事件
                if (self.isCompleted(self.tasks.slice(0, self.index))) self.trigger("stop", self.processResult(self.tasks));
            } else {
                //当前队列任务已完成
                if (self.isCompleted()) {
                    self.trigger("complete", self.processResult(self.tasks));

                    //队列完成事件,此为提供注入接口
                    fire(self.complete, self);
                }
            }

            return self._run();
        }
    });

    //队列任务状态
    Queue.TASK = {
        TIMEDOUT: QUEUE_TASK_TIMEDOUT,
        READY: QUEUE_TASK_READY,
        PROCESSING: QUEUE_TASK_PROCESSING,
        OK: QUEUE_TASK_OK
    };

    /**
     * 函数排队执行
     * @param {Array} tasks 任务数组
     * @param {function} complete 队列完成处理函数
     * @param {object} ops 配置对象 eg: {tasks:[],count:10000,limitMode:1,auto:true,workerThread:1,timeout:0,injectIndex:1,injectCallback:'complete',exec:function(task,next){},process:function(task,next){},processResult:function(tasks){}}
     * @param {number} workerThread 同时执行的任务数量
     */
    function series(tasks, complete, ops, workerThread) {
        if (isObject(complete)) {
            ops = complete;
            complete = undefined;
        }

        return new Queue(extend(ops || {}, {
            rtype: "auto",
            workerThread: workerThread,

            tasks: tasks,
            complete: complete
        }));
    }

    /**
     * 函数并行执行
     * @param {Array} tasks 任务数组
     * @param {function} complete 队列完成处理函数
     * @param {object} ops 配置对象 eg: {tasks:[],count:10000,limitMode:1,auto:true,workerThread:1,timeout:0,injectIndex:1,injectCallback:'complete',exec:function(task,next){},process:function(task,next){},processResult:function(tasks){}}
     * @param {number} workerThread 同时执行的任务数量
     */
    function parallel(tasks, complete, ops, workerThread) {
        return series(tasks, complete, ops, workerThread || (isArrayLike(tasks) ? tasks.length : Object.size(tasks)));
    }

    var jslib = (Q.G || {}).$ || {};

    /**
     * ajax队列
     * @param {object} ops 配置对象 eg: {tasks:[],count:10000,limitMode:1,auto:true,workerThread:1,timeout:0,injectIndex:1,injectCallback:'complete',exec:function(task,next){},process:function(task,next){},processResult:function(tasks){}}
     */
    function ajaxQueue(ops) {
        ops = ops || {};

        return new Queue(extend(ops, {
            exec: ops.ajax || Q.ajax || Q.http || jslib.ajax,
            injectIndex: 1,
            injectCallback: "complete"
        }));
    }

    //------------------------- export -------------------------

    extend(Q, {
        Queue: Queue,

        series: series,
        parallel: parallel,

        ajaxQueue: ajaxQueue
    });

})();

/*
* Q.node.core.js 通用处理
* author:devin87@qq.com
* update:2021/09/26 16:53
*/
(function () {
    var fs = require('fs'),
        path = require('path'),
        crypto = require('crypto'),

        extend = Q.extend;

    function mkdirSync(url, mode) {
        if (url == '..' || url == './') return;

        var fullname = path.resolve(url), dirs = [];
        while (!fs.existsSync(fullname)) {
            dirs.push(fullname);
            fullname = path.dirname(fullname);
        }
        if (dirs.length <= 0) return;

        mode = mode || 511;  //0777

        for (var i = dirs.length - 1; i >= 0; i--) {
            fs.mkdirSync(dirs[i], mode);
        }
    }

    /**
     * 递归创建文件夹，若文件夹存在，则忽略
     * @param {string} dir 文件夹路径
     */
    function mkdir(dir) {
        if (!fs.existsSync(dir)) mkdirSync(dir);
    }

    //创建文件夹优先使用 fs-extra 方法
    try {
        var fse = require('fs-extra');
        if (fse) {
            mkdir = function mkdir(dir) {
                if (!fs.existsSync(dir)) fse.mkdirsSync(dir);
            };
        }
    } catch (e) { }

    /**
     * 计算文本md5值
     * @param {string} text
     */
    function computeMd5(text) {
        return crypto.createHash('md5').update(text, 'utf8').digest('hex');
    }

    extend(Q, {
        mkdir: mkdir,
        md5: computeMd5
    });
})();

/*
* Q.node.store.js 读写本地JSON文件
* author:devin87@qq.com
* update:2020/09/11 17:27
*/
(function () {
    var fs = require('fs'),
        path = require('path'),

        extend = Q.extend,
        fire = Q.fire,
        isFunc = Q.isFunc,
        isObject = Q.isObject,
        mkdir = Q.mkdir;

    //自定义存储对象
    function Storage(path) {
        this.path = path;
        this.data = {};
        this.isOK = false;
    }

    Q.factory(Storage).extend({
        //初始化自定义存储数据
        init: function (cb) {
            var self = this;
            self.isOK = false;

            if (!self.path) return fire(cb, undefined, new Error("File Path Not Found"));

            if (!fs.existsSync(self.path)) {
                self.isOK = true;
                return fire(cb, undefined, undefined, self.data);
            }

            fs.readFile(self.path, function (err, data) {
                if (err) return fire(cb, undefined, err);

                try {
                    var text = data + '';
                    if (text) {
                        var data = JSON.parse(text);
                        if (data && isObject(data)) self.data = data;
                    }

                    self.isOK = true;
                    return fire(cb, undefined, undefined, self.data);
                } catch (e) {
                    return fire(cb, undefined, e);
                }
            });
        },

        //获取自定义存储数据
        get: function (key) {
            return this.data[key];
        },
        //设置自定义存储数据
        set: function (key, value) {
            this.data[key] = value;
            return this;
        },
        //移除自定义存储数据
        remove: function (key) {
            this.data[key] = undefined;
            return this;
        },
        //清空自定义存储数据
        clear: function (key) {
            this.data = {};
            return this;
        },
        //保存自定义存储数据
        save: function (cb) {
            if (!this.isOK) return fire(cb, undefined, new Error('Data Initialization Failed'));

            try {
                mkdir(path.dirname(this.path));

                fs.writeFile(this.path, JSON.stringify(this.data), 'utf-8', cb || function () { });
            } catch (err) {
                fire(cb, undefined, err);
            }
        }
    });

    extend(Q, {
        Storage: Storage
    });
})();

/*
* Q.node.http.js http请求(支持https)
* author:devin87@qq.com
* update:2021/09/22 16:18
*/
(function () {
    var Url = require('url'),
        querystring = require('querystring'),
        http = require('http'),
        https = require('https'),
        fs = require('fs'),
        zlib = require('zlib'),

        extend = Q.extend,
        fire = Q.fire,
        isFunc = Q.isFunc,
        isObject = Q.isObject;

    var ErrorCode = {
        HttpError: 1,
        JSONError: 2,
        Timedout: 3,
        FileError: 4
    };

    var config = {
        timeout: 20000,
        timeout_download: 600000
    };

    /**
     * http设置
     * @param {object} settings {ErrorCode:{},config:{}}
     */
    function setup(settings) {
        if (settings.ErrorCode) extend(ErrorCode, settings.ErrorCode, true);
        if (settings.config) extend(config, settings.config, true);
    }

    //http发送之前
    function fire_http_beforeSend(req, ops) {
        ops._begin = Date.now();

        return fire(ops.beforeSend || config.beforeSend, undefined, req, ops);
    }

    /**
     * 触发http完成事件
     * @param {string|object} result 返回结果
     * @param {number} errCode 错误代码
     * @param {object} ops 请求配置项
     * @param {Response} res Response对象
     * @param {Error} err 错误对象
     */
    function fire_http_complete(result, errCode, ops, res, err) {
        //避免某些情况（eg:超时）重复触发回调函数
        if (ops._end) return;

        ops._end = Date.now();
        ops.time = ops._end - ops._begin;

        if (errCode && err && !isObject(errCode)) errCode = { code: errCode, msg: err.message };

        fire(ops.complete, undefined, result, errCode, ops, res, err);
        fire(ops.afterSend || config.afterSend, undefined, result, errCode, ops, res, err);

        if (ops.res) ops.res.end(err ? 'Error: ' + err.message : ops.response);
    }

    /**
     * 发送http请求
     * @param {string} url 请求地址
     * @param {object} ops 请求配置项 {queue,type,headers,timeout,dataType,data,opts,agent,retryCount,proxy,res,autoHeader,complete}
     * @param {number} count 当前请求次数，默认为0
     */
    function sendHttp(url, ops, count) {
        ops = ops || {};
        count = +count || 0;

        //队列接口
        if (ops.queue) {
            ops.queue.add(url, ops);
            ops.queue = undefined;
            return;
        }

        if (isFunc(ops)) ops = { complete: ops };

        ops.url = url;

        var method = ops.type || ops.method || 'GET',
            headers = ops.headers || {},
            timeout = ops.timeout || config.timeout,

            is_http_post = method == 'POST',
            is_json = ops.dataType == 'JSON',
            data = ops.data,
            post_data = '';

        if (is_http_post) {
            if (data) post_data = typeof data == 'string' ? data : querystring.stringify(data);

            extend(headers, {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data, 'utf8')
            });
        } else {
            if (data) url = Q.join(url, data);
        }

        if (config.headers) extend(headers, config.headers);

        var myURL = Url.parse(url);

        var options = {
            hostname: myURL.hostname,
            path: myURL.path,
            port: myURL.port,
            method: method,
            headers: headers
        };

        if (ops.opts) extend(options, ops.opts);

        if (ops.agent) options.agent = ops.agent;
        if (options.agent === true) options.agent = new web.Agent();

        if (config.options) extend(options, config.options);

        ops.options = options;

        ops._end = undefined;

        var web = url.startsWith('https') ? https : http,
            req;

        var fire_timeout = function (err) {
            if (ops._end) return;

            if (req) req.abort();

            var retryCount = +ops.retryCount || 0;
            if (retryCount > 0 && ++count <= retryCount) return sendHttp(url, ops, count);

            fire_http_complete(undefined, ErrorCode.Timedout, ops, undefined, err);
        };

        req = web.request(options, function (res) {
            var buffers = [];

            var is_http_proxy = Q.def(ops.proxy, ops.res ? true : false),
                is_auto_header = Q.def(ops.autoHeader, is_http_proxy ? true : false),
                _res = ops.res;

            if (_res && !res._ended) {
                try {
                    if (is_auto_header) {
                        Object.forEach(res.headers, function (k, v) {
                            if (res.headers[k] != undefined) _res.setHeader(k, v);
                        });
                    } else {
                        var content_type = res.headers['content-type'] || 'text/html';
                        if (content_type.indexOf('charset') == -1) content_type += (content_type.endsWith(';') ? '' : ';') + 'charset=utf-8';
                        _res.setHeader('Content-Type', content_type);
                    }
                } catch (err) {
                    throw new Error(err.message + '\n' + url);
                }
            }

            var encoding = res.headers['content-encoding'];

            //代理请求
            if (is_http_proxy) {
                res.pipe(_res);
            } else {
                res.on('data', function (chunk) {
                    buffers.push(chunk);
                });
            }

            res.on('end', function () {
                var next = function (err, text) {
                    if (err) return fire_http_complete(undefined, ErrorCode.HttpError, ops, res, err);

                    ops.response = text;
                    if (!is_json) return fire_http_complete(text, undefined, ops, res);

                    var data;

                    try {
                        data = JSON.parse(text);
                    } catch (err) {
                        return fire_http_complete(undefined, ErrorCode.JSONError, ops, res, err);
                    }

                    fire_http_complete(data, undefined, ops, res);
                };

                var buffer = Buffer.concat(buffers);

                switch (encoding) {
                    case 'gzip': return zlib.gunzip(buffer, next);
                    case 'deflate': return zlib.inflate(buffer, next);
                    default: return next(undefined, buffer.toString('utf8'));
                }
            });
        }).on('timeout', function () {
            fire_timeout(new Error('Socket Timedout'));
        }).on('error', function (err) {
            //避免重复触发(超时后调用 req.abort 会触发此处 error 事件且 err.code 为 ECONNRESET) 
            if (ops._end) return;

            if (err.code === 'ECONNRESET' || err.code === 'EPROTO') {
                var retryCount = ops.retryCount != undefined ? +ops.retryCount || 0 : 1;
                if (++count <= retryCount) return sendHttp(url, ops, count);
            }

            fire(ops.error || config.error, this, err);
            fire_http_complete(undefined, ErrorCode.HttpError, ops, undefined, err);
        });

        if (fire_http_beforeSend(req, ops) === false) return;

        if (timeout && timeout != -1) {
            // req.setTimeout在某些环境需要双倍时间才触发超时回调
            // req.setTimeout(timeout, function () {
            //     fire_timeout(new Error('HTTP Timedout'));
            // });
            setTimeout(function () {
                fire_timeout(new Error('HTTP Timedout'));
            }, timeout);
        }

        req.write(post_data);
        req.end();

        return req;
    }

    /**
     * http请求,简化调用
     * @param {string} url 请求地址
     * @param {object} data 要提交的参数对象
     * @param {function} cb 回调函数(data, errCode, ops, res, err)
     * @param {object} settings http设置
     */
    function http_send_simplpe(url, data, cb, settings) {
        var ops;

        if (isFunc(data)) {
            ops = { complete: data };
            if (cb && isObject(cb)) extend(ops, cb);
        } else if (isObject(cb)) {
            ops = cb;
            ops.data = data;
        } else {
            ops = { data: data, complete: cb };
        }

        //优先设置
        if (settings) extend(ops, settings, true);

        try {
            return sendHttp(url, ops);
        } catch (e) {
            fire_http_complete(undefined, ErrorCode.HttpError, ops, undefined, e);
        }
    }

    /**
     * http GET 请求
     * @param {string} url 请求路径,支持http和https
     * @param {object} data 要提交的参数对象
     * @param {function} cb 回调函数(data,errCode)
     */
    function getHttp(url, data, cb) {
        return http_send_simplpe(url, data, cb);
    }

    /**
     * http POST 请求
     * @param {string} url 请求路径,支持http和https
     * @param {object} data 要提交的参数对象
     * @param {function} cb 回调函数(data,errCode)
     */
    function postHttp(url, data, cb) {
        return http_send_simplpe(url, data, cb, { type: 'POST' });
    }

    /**
     * http GET 请求,并将返回结果解析为JSON对象
     * @param {string} url 请求路径,支持http和https
     * @param {object} data 要提交的参数对象
     * @param {function} cb 回调函数(data,errCode)
     */
    function getJSON(url, data, cb) {
        return http_send_simplpe(url, data, cb, { dataType: 'JSON' });
    }

    /**
     * http POST 请求,并将返回结果解析为JSON对象
     * @param {string} url 请求路径,支持http和https
     * @param {object} data 要提交的参数对象
     * @param {function} cb 回调函数(data,errCode)
     */
    function postJSON(url, data, cb) {
        return http_send_simplpe(url, data, cb, { type: 'POST', dataType: 'JSON' });
    }

    /**
     * 下载文件
     * @param {string} url 下载地址
     * @param {string} dest 保存路径
     * @param {function} cb 回调函数(data, errCode)
     * @param {object} ops 其它配置项 { timeout: 600000, progress: function(total,loaded){} }
     * @param {number} count 当前请求次数，默认为0
     */
    function downloadFile(url, dest, cb, ops, count) {
        ops = ops || {};
        count = +count || 0;

        if (isObject(cb)) {
            ops = cb;
            cb = undefined;
        } else {
            ops.complete = cb;
        }

        try {
            //格式化url
            url = encodeURI(decodeURI(url));
        } catch (err) { }

        var headers = ops.headers || {},
            timeout = ops.timeout || config.timeout_download;

        if (config.headers) extend(headers, config.headers);

        var myURL = Url.parse(url);

        var options = {
            hostname: myURL.hostname,
            path: myURL.path,
            port: myURL.port,
            headers: headers
        };

        if (ops.opts) extend(options, ops.opts);

        if (ops.agent) options.agent = ops.agent;
        if (options.agent === true) options.agent = new web.Agent();

        if (config.options) extend(options, config.options);

        ops.options = options;

        var web = url.startsWith('https') ? https : http,
            total = 0,
            loaded = 0,
            req;

        var fire_timeout = function (err) {
            if (ops._end) return;

            if (req) req.abort();

            var retryCount = +ops.retryCount || 0;
            if (retryCount > 0 && ++count <= retryCount) return sendHttp(url, ops, count);

            fire_http_complete(undefined, ErrorCode.Timedout, ops, undefined, err);
        };

        req = web.get(options, function (res) {
            if (res.statusCode !== 200) return fire_http_complete(undefined, ErrorCode.HttpError, ops, res, new Error('Http code: ' + res.statusCode));

            var file = fs.createWriteStream(dest);
            res.pipe(file);

            file.on('finish', function () {
                file.close(function () {
                    fire_http_complete(undefined, undefined, ops, res);
                });
            });

            file.on('error', function (err) {
                if (fs.existsSync(dest)) fs.unlinkSync(dest);
                fire_http_complete(undefined, ErrorCode.FileError, ops, res, err);
            });

            if (ops.progress) {
                //获取文件长度
                total = +res.headers['content-length'] || 0;
                fire(ops.progress, res, total, loaded);

                //下载进度
                res.on('data', function (chunk) {
                    loaded += chunk.length;
                    fire(ops.progress, res, total, loaded);
                });
            }
        }).on('timeout', function () {
            fire_timeout(new Error('Socket Timedout'));
        }).on('error', function (err) {
            //避免重复触发(超时后调用 req.abort 会触发此处 error 事件且 err.code 为 ECONNRESET) 
            if (ops._end) return;

            if (fs.existsSync(dest)) fs.unlinkSync(dest);

            if (err.code === 'ECONNRESET' || err.code === 'EPROTO') {
                var retryCount = ops.retryCount != undefined ? +ops.retryCount || 0 : 1;
                if (++count <= retryCount) return downloadFile(url, dest, cb, ops, count);
            }

            fire(ops.error || config.error, this, err);
            fire_http_complete(undefined, ErrorCode.HttpError, ops, undefined, err);
        });

        if (fire_http_beforeSend(req, ops) === false) return;

        if (timeout && timeout != -1) {
            // req.setTimeout(timeout, function () {
            //     fire_timeout(new Error('HTTP Timedout'));
            // });
            setTimeout(function () {
                fire_timeout(new Error('HTTP Timedout'));
            }, timeout);
        }

        return req;
    }

    /**
     * 将 http 请求转为 curl命令
     * @param {string} url 
     * @param {object} ops 请求配置项 {type,headers,timeout,data,ua,auth,cookie,keepalive,enableRedirect,maxRedirects,iface,proxy}
     * @returns {string}
     */
    function http2curl(url, ops) {
        ops = ops || {};

        var method = ops.type || ops.method || 'GET',
            headers = ops.headers || {},
            timeout = ops.timeout || config.timeout,

            is_http_get = method == 'GET',
            is_http_post = method == 'POST',

            data = ops.data,
            post_data = '';

        if (is_http_post) {
            if (data) post_data = typeof data == 'string' ? data : querystring.stringify(data);
        } else {
            if (data) url = Q.join(url, data);
        }

        if (config.headers) extend(headers, config.headers);

        var curl = ['curl -X ' + method];

        //启用服务器重定向
        if (ops.enableRedirect && is_http_get) {
            curl.push('-L');

            //最大重定向次数
            var maxRedirects = +ops.maxRedirects || 3;
            curl.push('--max-redirs ' + maxRedirects);
        }

        //跳过 ssl 检测
        if (ops.skipSSL) curl.push('-k');

        var dataAuth = ops.auth;
        if (dataAuth && dataAuth.user) curl.push('--user ' + dataAuth.user.replace(/"/g, '\\"') + ':' + (dataAuth.passwd || '').replace(/"/g, '\\"'));

        if (is_http_post) curl.push('-d "' + post_data + '"');
        else curl.push('"' + url + '"');

        //设置 UserAgent eg: curl -A 'myua' url
        if (ops.ua) curl.push('-A "' + ops.ua.replace(/"/g, '\\"') + '"');

        //设置 Cookie eg: curl -b 'a=1;b=2' url
        if (ops.cookie && typeof ops.cookie == 'string') curl.push('-b "' + ops.cookie.replace(/"/g, '\\"') + '"');

        //设置网卡
        if (ops.iface) curl.push('--interface "' + ops.iface + '"');

        //设置代理
        if (ops.proxy) curl.push('--proxy "' + ops.proxy + '"');

        //静默输出（不显示进度信息）
        if (ops.silent !== false) curl.push('--silent');

        if (timeout) curl.push('--max-time ' + Math.round(timeout / 1000));
        if (ops.keepalive === false) curl.push('--no-keepalive');

        //curl 其它参数，多个之间用空格分开
        if (ops.curlArgs) curl.push(ops.curlArgs);

        Object.forEach(headers, function (k, v) {
            curl.push('-H "' + k + ':' + v + '"');
        });

        return curl.join(' ');
    }

    extend(Q, {
        httpSetup: setup,

        http: sendHttp,
        getHttp: getHttp,
        postHttp: postHttp,
        getJSON: getJSON,
        postJSON: postJSON,

        downloadFile: downloadFile,
        http2curl: http2curl
    });
})();