/*jshint node:true*/
'use strict';
var slice = [].slice;

module.exports = function factorify(cb) {
    function factory() {
        var args = slice.call(arguments),
            ctx = Object.create(cb.prototype),
            out = cb.apply(ctx, args);

        return out instanceof Object ? out : ctx;
    }


    factory.many = function(arr) {
        return arr.map(function(args) {
            return factory.apply(null, Array.isArray(args) ? args: [args]);
        });
    };

    return factory;
};
