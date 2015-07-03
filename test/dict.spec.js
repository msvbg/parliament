import assert from 'assert';
import { Dict } from '../src';

let eq = assert.deepEqual.bind(assert);

describe('Dict', function () {
    it('should be constructed with an object as an argument', function () {
        eq(Dict().keys, []);
        eq(Dict({ a: 1, b: 2 }).keys, ['a', 'b']);
    });

    it('should add keys without mutation', function () {
        let d1 = Dict();
        let d2 = d1.set('a', 1);
        let d3 = d1.set('b', 2).set('a', 3);

        eq(d1.has('a'), false);
        eq(d2.has('a'), true);
    });

    it('should get keys from dicts', function () {
        let d1 = Dict({ a: 1, b: 2 });
        let d2 = d1.set('a', 9);

        eq(d1.get('a'), 1);
        eq(d1.get('b'), 2);
        eq(d2.get('a'), 9);
        eq(d2.get('b'), 2);
    });

    it('should delete keys from dicts without mutation', function () {
        let d1 = Dict({ a: 1, b: 2 });
        let d2 = d1.set('a', 9);

        eq(d1.delete('b').get('b'), undefined);
        eq(d1.delete('b').get('a'), 1);
        eq(d1.delete('b').delete('a').get('a'), undefined);
        eq(d2.delete('a').get('a'), undefined);
        eq(d2.delete('b').get('b'), undefined);
    });
});