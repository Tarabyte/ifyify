/*jshint node:true*/

var customNames = {
    forEach: 'foreach'
},
    slice = Array.prototype.slice;

module.exports = 'sort|filter|forEach|every|some|reduce|map'.split('|').reduce(function(module, name) {
    module[(customNames[name] || name) + 'ify'] = function(cb) {
        return function(arr, arg1, arg2 /*rest*/) {
            var args,
                argCount = arguments.length;
            switch (argCount) { //fast fallback
                    case 1: return arr[name](cb);
                    case 2: return arr[name](cb, arg1);
                    case 3: return arr[name](cb, arg1, arg2);
            }
            args = slice.call(arguments);
            return arr[name].apply(arr, args);
        };
    };
    return module;
}, {});
