ifyify [![Build Status](https://travis-ci.org/Tarabyte/ifyify.svg?branch=master)](https://travis-ci.org/Tarabyte/ifyify.svg?branch=master)
======
> transitive verb; derivation

> To create a new word by adding the suffix "-ify" to another word

Collection of non-standard functional utils. You won't find `curry`, `bind` and their friends here. Seeking for those take a look at [Lo Dash](http://lodash.com/) or [Underscore](http://underscorejs.org/).

## How to install
```
$ npm install ifyify --save
```

## Usage
```javascript
var ify = require('ifyify');
```

### Callbackify
Converts a function to continuation style. `function(err, arg1, arg2, ..., next)`

- The first argument: error flag;
- The last argument: next callback (if is of type function);
- Everything in between is considered to be the function arguments.

```javascript
function add(a, b) {
    return a + b;
}

var wrapped = ify.callbackify(add);

wrapped(false, 1, 2, function(err, res) {
    console.log(res);
}); //logs 3

```

### Factorify
Converts a constructor to a factory that can be called w/o the `new` operator. Also provides `many` method that allows to create multiple instances from a given array of arguments.

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayHi = function() {
    console.log('Hi ' + this.name);
};

//lets ditch the 'new' keyword
var personFactory = ify.factorify(Person);

//now we can create instances without new
var joe = personFactory('Joe', 27);
joe.sayHi(); //logs "Hi Joe"

//and even more
//now we can create an array of instances using .many
var people = personFactory.many([['Joe', 27], ['Ann', 31], ['Nicola', 100]]);
people[2].sayHi(); //logs "Hi Nicola"

```

### Chainify
Converts a function or an object to chainable style. Given function or object's methods will return the context it was called with.

```javascript
var config = {
    setA: function(a) {
        this.a = a;
    },
    
    setB: function(b) {
        this.b = b;
    }
},
    configurable = ify.chainify(config);
    
configurable.setA(10).setB('B');
```

`Chainify` checks a function source code for having `return` statements in it. If there is any the given function would remain untouched.

```javascript
var config = {
    getA: function() {
        return 'a';
    }
}, 
    configurable = ify.chainify(config);

configurable.getA(); //'a'
```

If you have hybrid functions i.e. acting as a getter or setter `chainify` allows to use runtime checking if a function has returned anything (non undefined).

```javascript
var config = {
    a: function(a) {
        if(a === undefined) { //getter mode
            return this._a;
        }
        
        this._a = a; //setter mode
    }
}, 
    configurable = ify.chainify(config, true); //dynamic checking

configurable.a(10).a(); //10
```

###Arrayify
A small collection of wrappers for array methods:

- `sortify` sorts a given array
- `filterify` filters a given array
- `foreachify` applies function to every element
- `everyify` checks if a predicate holds for every element
- `someify` checks if a predicate holds for any element
- `reduceify` reduces a given array
- `mapify` maps a given array

```javascript
//sorting
var sortNumerically = ify.sortify(function(a, b) {
    return a - b;
});

var sorted = sortNumerically([1.1, 2, 1, 0.7, 1.5, 3]); //[0.7, 1, 1.1, 1.5, 2, 3]

//filtering
var clean = ify.filterify(Boolean);

var cleaned = clean([1, 0, false, "2", undefined]); //[1, "2"]

//maping
var square = ify.mapify(function(x) {
    return x * x;
});

var squared = square([1, 2, 3]); // [1, 4, 9]

```