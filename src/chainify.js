/*jshint node:true*/
'use strict';
function isFunction(test) {
    return typeof test === 'function';
}

module.exports = function chainify(cb, dynamic) {
    var wrapper = dynamic === true ?
        function(cb) {
            return function() {
                var result = cb.apply(this, arguments);
                return result === undefined ? this : result;
            };
        }
        :
        function(cb) {
            return /\breturn\b/.test(cb) ? cb : function() {
                cb.apply(this, arguments);
                return this;
            };
        };

    if(isFunction(cb)) {
        return wrapper(cb);
    }

    Object.keys(cb).forEach(function(key) {
        var value = cb[key];
        if(isFunction(value) ) {
            cb[key] = wrapper(value);
        }
    });
    return cb;
};
