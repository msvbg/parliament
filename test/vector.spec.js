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
        eq(Vector().pop().push(1).length, 1);
    });

    it('should be convertible to a JS array', function () {
        let vec = Vector([5, 23, 4, 9]).push(12);

        eq(vec.toArray(), [5, 23, 4, 9, 12]);
        eq(Vector([1, 2]).push(5).pop().pop().push(1).toArray(), [1, 1]);
        eq(Vector().pop().push(1).toArray(), [1]);
    });

    it('should concatenate with other vectors', function () {
        let v1 = Vector([1, 2]).push(3);
        let v2 = Vector.of(4).push(5).push(6);
        let v3 = v1.push(7);

        eq(Vector().concat(Vector()).toArray(), []);
        eq(Vector.concat(v1, v2).toArray(), [1, 2, 3, 4, 5, 6]);
        eq(Vector.concat(v1, v2, v3).toArray(), [1, 2, 3, 4, 5, 6, 1, 2, 3, 7]);
    });

    it('should be equal to identical versions of itself', function () {
        assert(Vector.of(1, 2).equal(Vector([1, 2])));
        assert(!Vector.of(1, 2).push(9).equal(Vector([1, 2])));
        assert(Vector.of(1, 2).push(9).pop().equal(Vector([1, 2])));
        assert(!Vector.of({}).equal(Vector([{}])));
    });

    it('should be mappable', function () {
        let v = Vector.of(1, 2, 3);
        let f = x => x + 1;

        assert(v.map(f).equal(Vector([2, 3, 4])));
    });
});
