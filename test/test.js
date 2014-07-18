/*jshint node:true*/
/*globals describe, it*/
/*jshint -W030*/

var ify = require('../');
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

    describe('arrayify', function() {

        describe('sortify', function() {
            it('should be a function', function() {
                ify.sortify.should.be.a('function');
            });

            it('should return a function', function() {
                ify.sortify(function(a, b) {
                    return a - b;
                }).should.be.a('function');
            });

            it('should sort arrays', function() {
                var arr = [1, 2, 3];
                ify.sortify(function(a, b) {
                    return b - a;
                })(arr).should.be.deep.equal([3, 2, 1]);
            });
        });

        describe('filterify', function() {
            it('should be a function', function() {
                ify.filterify.should.be.a('function');
            });

            it('should return a function', function() {
                ify.filterify(Boolean).should.be.a('function');
            });

            it('should filter array', function() {
                ify.filterify(Boolean)([0, 1, 2]).should.be.deep.equal([1, 2]);
            });
        });

        describe('foreachify', function () {
           it('should be a function', function() {
                ify.foreachify.should.be.a('function');
            });

            it('should return a function', function() {
                ify.foreachify(function(){}).should.be.a('function');
            });

            it('should run callback for each array item', function() {
                var sum = 0;
                ify.foreachify(function(value) {
                    sum += value;
                })([10, 15, 20]);

                sum.should.be.equal(45);
            });
        });

        describe('everyify', function() {
            it('should be a function', function() {
                ify.everyify.should.be.a('function');
            });

            it('should return a function', function() {
                ify.everyify(function(){}).should.be.a('function');
            });

            it('should check condition for every item', function() {
                var positive = ify.everyify(function(value) {
                    return value > 0;
                });
                positive([10, 15, 20]).should.be.true;

                positive([-1, 1, 2]).should.be.false;
            });
        });

        describe('someify', function() {
            it('should be a function', function() {
                ify.someify.should.be.a('function');
            });

            it('should return a function', function() {
                ify.someify(function(){}).should.be.a('function');
            });

            it('should check condition for every item', function() {
                var positive = ify.someify(function(value) {
                    return value > 0;
                });
                positive([10, -1, 20]).should.be.true;

                positive([-1, -2, -3]).should.be.false;
            });
        });

        describe('reduceify', function() {
            it('should be a function', function() {
                ify.reduceify.should.be.a('function');
            });

            it('should return a function', function() {
                ify.reduceify(function(){}).should.be.a('function');
            });

            it('should reduce array with the value specified', function() {
                var toObj = ify.reduceify(function(acc, value) {
                    return acc[value] = value, acc;
                });

                toObj(['a', 'b'], {}).should.be.deep.equal({a: 'a', b: 'b'});
            });
        });

    });

    describe('factorify', function() {
        it('should be defined', function() {
            ify.factorify.should.be.a('function');
        });

        it('should return a function', function() {
            ify.factorify(function () {}).should.be.a('function');
        });

        function Person(name) {
            this.name = name;
        }

        var personFactory = ify.factorify(Person);

        it('should return a function', function() {
            personFactory.should.be.a('function');
        });

        var joe = personFactory('joe');
        it('should create instances', function() {
            joe.should.be.instanceof(Person);
            joe.name.should.be.equal('joe');
        });

        var inst = {};
        function Singleton() {
            return inst;
        }

        var singletonFactory = ify.factorify(Singleton);

        it('should return object returned by a constructor', function() {
            singletonFactory().should.be.equal(inst);
        });

        it('should provide many method', function() {
            personFactory.many.should.be.a('function');
        });

        it('should allow to create array of instances', function() {
            var people = personFactory.many('joe ann james basil'.split(' '));

            people.should.have.length(4);
            people.every(function(person) {
                person.should.be.instanceof(Person);
            });
        });

        function Person2(name, age) {
            this.name = name;
            this.age = age;
        }

        var personFactory2 = ify.factorify(Person2);

        it('should work with array of arrays', function() {
            var people = personFactory2.many([['joe', 27], ['ann', 43]]);
            people.should.have.length(2);
            people.every(function(person) {
                person.should.be.instanceof(Person2);
            });
        });
    });
});
