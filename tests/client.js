var assert = require('assert');
describe('Basic Mocha String Test', function () {
 it('should return number of charachters in a string', function () {
        assert.equal("Hello".length, 5);
    });
 it('should return first charachter of the string', function () {
        assert.equal("Hello".charAt(0), 'H');
    });
});


var b1 = Buffer.from([1,2]);
var b2 = Buffer.from([3,4]);
var b3 = Buffer.concat([b1, b2], b1.length + b2.length)
console.log(b3.length)