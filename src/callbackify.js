/*jshint node:true*/
module.exports = function callbackify(cb) {
    return function (err, data, next) {
        if(err) {
            return next && next(err);
        }
        try {
            cb(data);
        }
        catch (e) {
            err = e;
        }
        return next && next(err, data);
    };
};
