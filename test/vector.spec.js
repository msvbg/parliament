import assert from 'assert';
import { Vector, default as ops } from '../src';

let eq = assert.deepEqual.bind(assert);

describe('vector', function () {
    it('should be constructed with an array as an argument', function () {
        eq(Vector().length, 0);
        eq(Vector([1, 2, 3, 4]).length, 4);
    });

    it('should be created from a list of numbers', function () {
        let vec = Vector.of(1, 2, 3, 4);

        eq(vec.length, 4);
    });

    it('should grow and shrink without mutation', function () {
        let vec1 = Vector();
        let vec2 = vec1.push(1);
        let vec3 = vec2.pop();

        eq(vec1.length, 0);
        eq(vec2.length, 1);
        eq(vec3.length, 0);
    });

    it('should pop elements off the end', function () {
        let vec = Vector.of(1, 2, 3);

        eq(vec.push(4).push(5).push(6).pop().length, 5);
        eq(vec.pop().pop().pop().pop().length, 0);
    });
});
