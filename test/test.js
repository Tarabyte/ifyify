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
                return data;
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

        it('should pass function result to next', function() {
            ify.callbackify(function add(a, b) {
                return a + b;
            })(false, 4, 5, function(err, res) {
                err.should.be.false;
                res.should.be.equal(9)
            })
        })
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

    describe('chainify', function() {
        it('should be defined', function() {
            ify.chainify.should.be.a('function');
        });

        it('should return a function', function() {
            ify.chainify(function() {}).should.be.a('function');
        });

        it('function should return context', function() {
            var ctx = {},
                arg = {},
                func = function(data) {
                    data.should.be.equal(arg);
                    this.should.be.equal(ctx);
                };

            ify.chainify(func).call(ctx, arg).should.be.equal(ctx);
        });

        it('should work with objects', function() {
            var obj = {
                a: function() {
                    var a = 1;
                    return a;
                },
                b: function(val) {
                    this.val = val;
                },
                c: 'not a function',
                d: function() {
                    var returnSmth = 1;
                }
            };
            ify.chainify(obj).should.be.equal(obj);

            obj.c.should.be.equal('not a function');
            obj.a().should.be.equal(1);
            obj.b(3).should.be.equal(obj);
            obj.val.should.be.equal(3);
            obj.d().should.be.equal(obj);
        });

        it('should allow to use dynamic chaining', function() {
            var obj = {
                val: 1,
                hybrid: function(val) {
                    if(val === undefined) {
                        return this.val;
                    }
                    else {
                        this.val = val;
                    }
                }
            };

            ify.chainify(obj).hybrid().should.be.equal(1);
            t(ify.chainify(obj).hybrid(7)).to.be.undefined;

            ify.chainify(obj, true);

            obj.hybrid().should.be.equal(7);
            obj.hybrid(9).should.be.equal(obj);
        });

        it('should provide dynamic chaining for function', function() {
            var hybrid = function (val) {
                if(val === undefined) {
                    return this.val;
                }
                else {
                    this.val = val;
                }
            }, ctx = {val: 1};

            hybrid = ify.chainify(hybrid, true);

            hybrid.call(ctx).should.be.equal(1);
            hybrid.call(ctx, 7).should.be.equal(ctx);
            ctx.val.should.be.equal(7);
        });
    });
});
