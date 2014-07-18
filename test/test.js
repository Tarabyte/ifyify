/*jshint node:true*/
/*globals describe, it*/

var t = require('assert');
var ify = require('../index.js');

describe('ifyify', function() {
    it('should be defined', function() {
        t.ok(ify);
    });

    describe('callbackify', function() {
        it('should be defined', function() {
            t.equal(typeof ify.callbackify, 'function');
        });
    });
});
