/*jshint node:true*/
var slice = [].slice;
module.exports = function callbackify(cb) {
    return function (err/*, [data1, [data2]...], next*/) {
        var args = slice.call(arguments, 1),
            next = args.pop();
        if(typeof next !== 'function') { //no next callback
            args.push(next);
            next = null;
        }
        if(err) {
            return next && next(err);
        }
        try {
            args = cb.apply(this, args);
            args = Array.isArray(args) ? args : [args];
        }
        catch (e) {
            err = e;
        }
        args.unshift(err);

        return next && next.apply(this, args);
    };
};
