import assert from 'assert';
import P from '../src';

let eq = assert.deepEqual.bind(assert);

describe('immutable', function () {
    it('should act as the identity function for simple types', function () {
        eq(P.immutable(null), null);
        eq(P.immutable(undefined), undefined);
        eq(P.immutable('a'), 'a');
        eq(P.immutable(4), 4);
        eq(P.immutable(false), false);
    });

    it('should create immutable versions of arrays and objects', function () {
        eq(P.immutable([1, 2, 3]), P.Vector([1, 2, 3]));
    });
});

describe('mutable', function () {
    it('should return a mutable copy of an immutable type', function () {
        let v = [1, 2, 3];
        let vImm = P.immutable(v);
        let vMut = P.mutable(vImm);
        vMut.push(4);

        eq(v.length, 3);
        eq(vMut.length, 4);
    });

    it('should act as the identity function for simple types', function () {
        eq(P.mutable(null), null);
        eq(P.mutable(undefined), undefined);
        eq(P.mutable('a'), 'a');
        eq(P.mutable(4), 4);
        eq(P.mutable(false), false);
    });

    it('should create mutable versions of arrays and objects', function () {
        eq(P.mutable(P.immutable([{ a: 5 }])), [{ a: 5 }]);
    });
});