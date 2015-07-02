import assert from 'assert';
import P from '../src';

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
        function f(a, b, c) { return a + b + c; }

        eq(P.length(P.curry(f)(1)), 2);
        eq(P.curry(f)(1)(2)(3), 6);
        eq(P.curry(f)(1, 2)(3), 6);
        eq(P.curry(f)(1, 2, 3), 6);
    });
});

describe('arity', function () {
    it('should change the arity of a function', function () {
        function f(a, b, c) {}

        eq(P.length(P.arity(2, f)), 2);
        eq(P.length(P.arity(0, f)), 0);
    });
});

describe('if', function () {
    it('should conditionally evaluate its arguments', function () {
        eq(P.if(P.const(true), P.const(5), P.const(0)), 5);
        eq(P.if(P.const(false), P.const(5), P.const(0)), 0);
    });

    it('should auto-curry with the arity of the conditional', function () {
        let f = P.if(P.greaterThan(5), P.const(true), P.const(false));

        eq(f(6), true);
        eq(f(4), false);
    });
});

describe('equal', function () {
    it('should evaluate strict equality', function () {
        eq(P.equal(5, 5), true);
        eq(P.equal(5, '5'), false);
    });
});

describe('print', function () {
    it('should log to the console', function () {
        let temp = console.log;

        let hasLogged = false;
        console.log = () => hasLogged = true;
        P.print('');

        eq(hasLogged, true);

        console.log = temp;
    });
});

describe('head', function () {
    it('should return the first item of an array', function () {
        eq(P.head([]), undefined);
        eq(P.head([1, 2, 3]), 1);
    });
});

describe('const', function () {
    it('should return a constant value', function () {
        eq(P.const(5)(), 5);
    });
});

describe('id', function () {
    it('should return what gets passed into it', function () {
        eq(P.id(5), 5);
    });
});

describe('spread', function () {
    it('should call a function with an array of arguments', function () {
        eq(P.spread(P.equal, [1, 1]), true);
    });
});

describe('seq', function () {
    it('should execute functions in sequence', function () {
        let inc = a => a + 1;
        let double = a => a * 2;

        eq(P.seq(inc, double)(10), 22);
    });
});

describe('tail', function () {
    it('should return all but the first element of an array', function () {
        eq(P.tail([]), []);
        eq(P.tail([1, 2, 3]), [2, 3]);
    });
});

describe('bind', function () {
    it('should bind arguments to functions', function () {
        let add = (a, b) => a + b;

        eq(P.bind(add, 1)(5), 6);
    });
});

describe('greaterThan', function () {
    it('should evaluate whether a number is greater than another', function () {
        eq(P.gt(5, 10), true);
    });
});

describe('lessThan', function () {
    it('should evaluate whether a number is less than another', function () {
        eq(P.lt(5, 10), false);
    });
});

describe('and', function () {
    it('should evaluate to true if both arguments are true', function () {
        eq(P.and(true, true), true);
        eq(P.and(true, false), false);
    });
});

describe('or', function () {
    it('should evaluate to true if either argument is true', function () {
        eq(P.or(true, true), true);
        eq(P.or(true, false), true);
    });
});

describe('match', function () {
    it('should return the first defined return value', function () {
        let m = P.match(
            P.if(P.gt(10), P.const(1234)),
            P.if(P.gt(6), P.add(321)),
            P.if(P.equal(5), P.multiply(2))
        )(5);

        eq(m, 10);
    });
});

describe('map', function () {
    let inc = P.map(x => x + 1);

    it('should map over arrays', function () {
        eq(inc([1, 2, 3]), [2, 3, 4]);
    });
});

describe('filter', function () {
    it('should filter an array', function () {
        eq(P.filter(P.equal(4), [3, 4, 5, 4, 3]), [4, 4]);
    });
});

describe('compact', function () {
    it('should remove non-truthy elements from an array', function () {
        eq(P.compact([1, undefined, 0, '', 9]), [1, 9]);
    });
});

describe('flatten', function () {
    it('should flatten an array', function () {
        eq(P.flatten([[1, 2], [3, 4], [5, 6]]), [1, 2, 3, 4, 5 ,6]);
    });
});

describe('flatMap', function () {
    it('should map over and then flatten an array', function () {
        eq(P.flatMap(n => [n, n + 1], [0, 2, 4]), [0, 1, 2, 3, 4, 5]);
    });
})

describe('reduce', function () {
    it('should reduce an array to a single value', function () {
        eq(P.reduce((a, b) => a + b, 0, [1, 2, 3, 4]), 10);
    });
});

describe('concat', function () {
    it('should concatenate any number of arrays', function () {
        eq(P.concat([1], [2], [3, 4]), [1, 2, 3, 4]);
    });
});

describe('sum', function () {
    it('should sum an array of numbers', function () {
        eq(P.sum([1, 2, 3, 4]), 10);
    });
});

describe('product', function () {
    it('should compute the product of an array of numbers', function () {
        eq(P.product([1, 2, 3, 4]), 24);
    });
});

describe('add', function () {
    it('should add two numbers', function () {
        eq(P.add(5, 4), 9);
    });
});

describe('subtract', function () {
    it('should subtract two numbers', function () {
        eq(P.subtract(5, 4), -1);
    });
});

describe('multiply', function () {
    it('should multiply two numbers', function () {
        eq(P.multiply(5, 4), 20);
    });
});

describe('divide', function () {
    it('should divide two numbers', function () {
        eq(P.divide(5, 20), 4);
    });
});

describe('mod', function () {
    it('should compute the remainder', function () {
        eq(P.mod(8, 99), 3);
    });
});

describe('range', function () {
    it('should produce a range of numbers', function () {
        eq(P.range(2, 10, 2), [2, 4, 6, 8]);
    });
});

describe('transduce', function () {
    it('should transform and reduce a collection', function () {
        let append = function (result, x) {
            result.push(x);
            return result;
        };

        eq(
            P.transduce(P.add(1), append, [], [1, 2, 3]),
            [2, 3, 4]
        );
    });
});

describe('into', function () {
    it('should transform and reduce a collection', function () {
        eq(
            P.into([], P.add(1), [1, 2, 3]),
            [2, 3, 4]
        );
    });
});

describe('sequence', function () {
    it('should transform and reduce a collection', function () {
        eq(
            P.sequence(P.add(1), [1, 2, 3]),
            [2, 3, 4]
        );
    });
});