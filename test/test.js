/*jshint node:true*/
/*globals describe, it*/
/*jshint -W030*/

var ify = require('../index.js');
var chai = require('chai');

chai.should();
var t = chai.expect;


describe('ifyify', function() {
    it('should be defined', function() {
        ify.should.be.a('object');
    });

    describe('callbackify', function() {
        it('should be defined', function() {
            ify.callbackify.should.be.a('function');
        });

        var arg = {}, wrapped = ify.callbackify(test);
        function test(data) {
            data.should.be.equal(arg);
        }

        it('should return wrapped function', function() {
            wrapped.should.be.a('function');
        });

        it('should run wrapped function with argument specified', function() {
            wrapped(false, arg);
        });

        it('should not call function when error is specified', function() {
            ify.callbackify(function() {
                t(false).to.be.ok;
            })({}, {}, function() {
                t(true).to.be.ok;
            });
        });

        it('should call next', function() {
            var data = {}, i = 0;
            ify.callbackify(function() {
                i++;
                t(true).to.be.true;
            })(false, data, function (err, arg) {
                i++;
                err.should.be.false;
                arg.should.be.equal(data);
            });

            i.should.be.equal(2);
        });

        it('should pass error if function throws', function() {
            ify.callbackify(function() {
                throw new Error('Should be passed');
            })(false, {}, function(err) {
                err.should.be.ok;
            });
        });
    });
});
