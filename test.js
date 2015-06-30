import assert from 'assert';
import P from './';

let eq = assert.deepEqual.bind(assert);

describe('isFunction', function () {
    it('should identify functions as functions', function () {
        eq(P.isFunction(function () {}), true);
        eq(P.isFunction(() => 0), true);
        eq(P.isFunction({}), false);
    });
});

describe('not', function () {
    it('should negate functions', function () {
        eq(P.not(function () { return false; })(), true);
        eq(P.not(function () { return 5; })(), false);
    });
});

describe('isDefined', function () {
    it('should identify defined values', function () {
        eq(P.isDefined(123), true);
        eq(P.isDefined([]), true);
        eq(P.isDefined(undefined), false);
    });
});

describe('isTruthy', function () {
    it('should identify truthy values', function () {
        eq(P.isTruthy(99), true);
        eq(P.isTruthy(true), true);
        eq(P.isTruthy(null), false);
    });
});

describe('isFalsy', function () {
    it('should identify falsy values', function () {
        eq(P.isFalsy(99), false);
        eq(P.isFalsy(true), false);
        eq(P.isFalsy(null), true);
    });
});

describe('length', function () {
    it('should return the length of arrays', function () {
        eq(P.length([1, 2, 3]), 3);
    });

    it('should return the fake-length of parliament functions', function () {
        eq(P.length(P.map(P.id)), 1);
    });
});

describe('curry', function () {
    it('should curry functions', function () {
        function f(a, b) { return a + b; }

        eq(P.length(P.curry(f)(1)), 1);
        eq(P.curry(f)(1)(2), 3);
    });
});

describe('if', function () {
    it('should', function () {
        function f(a, b) { return a + b; }

        eq(P.length(P.curry(f)(1)), 1);
        eq(P.curry(f)(1)(2), 3);
    });
});

describe('map', function () {
    let inc = P.map(x => x + 1);

    it('should map over arrays', function () {
        eq(inc([1, 2, 3]), [2, 3, 4]);
    });
});