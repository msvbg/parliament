/**
 * parliament.js
 *
 * The funkiest functional JavaScipt library you've never heard of.
 */

const P$LENGTH = Symbol('length');

/**
 * Returns true if the passed argument is considered a function.
 *
 * @param {function}    f   The object to be tested.
 * @return {boolean}
 */
let isFunction = function (f) {
    return Boolean(f && f.constructor && f.call && f.apply);
};

/**
 * Determines whether an object implements the JavaScript iterator protocol.
 *
 * @param  {Object}  x The object to be tested.
 * @return {Boolean}   A boolean indicating if the object is iterable.
 */
let isIterable = function (x) {
    return Boolean(x && typeof x[Symbol.iterator] === 'function');
};

/**
 * Performs a Boolean not on the application of a function
 *
 * @param {function}    f   The function to be negated.
 * @return {function}
 */
let not = function (f) {
    return function () {
        return !f.apply(this, arguments);
    };
};

/**
 * Returns true if the passed argument is not undefined.
 *
 * @param  {object}  x  The object to be tested.
 * @return {boolean}
 */
let isDefined = function (x) {
    return x !== undefined;
};

/**
 * Returns true if the passed argument is considered truthy.
 *
 * @param {object}      The object to be tested.
 * @return {boolean}
 */
let isTruthy = Boolean;

/**
 * Returns true if the passed argument is considered falsy.
 *
 * @param {object}      The object to be tested.
 * @return {boolean}
 */
let isFalsy = not(isTruthy);

/**
 * If the passed argument is a function, returns either its fake length or its
 * real length, in that order. The fake length is a property set by the library
 * in order to handle bound functions of arbitrary arity, due to the
 * Function.length property being read-only. See bind for more details.
 *
 * Otherwise, returns the length property of the passed argument.
 *
 * @param {object}  x   The object to be queried for its length.
 * @return {number}      The length.
 */
let length = function (x) {
    if (isFunction(x)) {
        return x[P$LENGTH] || x.length;
    }

    return x.length;
};

/**
 * Returns a curried version of the function `f`.
 *
 * @param {function}    f   The function to be curried.
 * @return {function}       The curried function.
 */
let curry = function (f, arity) {
    arity = arity || length(f);

    function curried() {
        if (arity > 0 && arguments.length === 0) {
            return curried;
        } else if (arguments.length >= arity) {
            return f.apply(this, arguments);
        } else {
            let g = f.bind.call(f, this, ...arguments);
            g[P$LENGTH] = Math.max(0, arity - length(arguments));
            return curry(g);
        }
    }

    curried[P$LENGTH] = arity;
    return curried;
};

/**
 * Enforces a specific arity on a function, by setting the internal length
 * property on the function.
 *
 * @param  {number} n   The arity to enforce.
 * @param  {function} f The function whose arity is to be changed.
 * @return {function}   The new function with the new arity.
 */
let arity = curry(function (n, f) {
    let arity = (function () {
        return f.apply(this, arguments);
    }).bind(this);

    arity[P$LENGTH] = n;
    return curry(arity);
});

/**
 * Evalutes the function `expr`. If truthy, it invokes and returns `then`.
 * Otherwise, it invokes and returns `otherwise`.
 *
 * @param {function}    expr        The expression for testing truthiness.
 * @param {function}    then        The "then" branch.
 * @param {function}    otherwise   The "else" branch.
 * @return {any}
 */
let _if = function (expr, then, otherwise) {
    let args = Array.prototype.slice.call(arguments, 3);

    let conditional = curry(function () {
        if (expr.apply(this, arguments)) {
            return then.apply(this, arguments);
        } else if (otherwise !== undefined) {
            return otherwise.apply(this, arguments);
        }
    }, length(expr));

    return conditional.apply(this, args);
};

/**
 * Performs strict === equality on two arguments.
 *
 * @param  {object}   a
 * @param  {object}   b
 * @return {boolean}
 */
let equal = curry(function (a, b) {
    return a === b;
});

/**
 * Prints the argument passed in to the console, and then returns it. This
 * allows for tap-like functionality where you can add print to a composition
 * chain and have it act like the identity function.
 *
 * @param  {object} text The text to be printed to the console.
 * @return {object}      What was passed in to the function.
 */
let print = function (x) {
    console.log(x);
    return x;
};

/**
 * Returns the first item of a collection.
 *
 * @param  {array} collection The collection whose head is to be returned.
 * @return {object}           The element.
 */
let head = function (collection) {
    collection = Array.from(collection);
    return collection[0];
};

/**
 * Creates a function that returns a constant.
 *
 * @param  {object} x    The constant to base the function on.
 * @return {function}    A function that returns x.
 */
let _const = function (x) {
    return function () {
        return x;
    };
};

/**
 * The identity function. Returns what is passed in.
 *
 * @param  {object} x The object to be returned.
 * @return {object}
 */
let id = function (x) {
    return x;
};

/**
 * Creates a function which calls a function using an array containing the
 * arguments. Acts like the ... operator in JavaScript.
 *
 * @param  {function} f    The function to be called.
 * @param  {array} args    The argument list.
 * @return {function}      A function which takes an array of arguments.
 */
let spread = curry(function (f, args) {
    return f.apply(this, args);
});

/**
 * Composes a pipeline of functions, executing them in sequence and feeding
 * the result of the previous function as the arguments of the next.
 *
 * @param {...function} The functions to compose.
 * @return {function}   The pipeline function.
 */
let seq = function () {
    let fns = Array.from(arguments);
    return function () {
        let f = head(fns);

        // if (length(arguments) < length(f)) {
        //     return seq(f.apply(this, arguments), ...tail(fns));
        // }

        if (fns.length === 1) {
            return f.apply(this, arguments);
        }

        return seq(...tail(fns))(f.apply(this, arguments));
    };
};

/**
 * Returns all but the first element of a collection.
 *
 * @param  {array}    collection The collection take the tail of.
 * @return {array}               The tail of the collection.
 */
let tail = function (collection) {
    collection = Array.from(collection);
    return collection.slice(1);
};

/**
 * Returns a function based on `f` with any number of arguments bound. The
 * native Function.prototype.bind will accurately reflect the new
 * Function.length property in bound functions, but forces you to deal with
 * `this` arguments.
 *
 * Some libraries opt to create dummy methods that simply call the function for
 * all reasonable function arities, tricking the JavaScript engine into
 * thinking that the function has a specific arity. I think that is inelegant,
 * albeit practical. Instead, we set the length property on the function which
 * represents the internally stored length of the arguments in the function.
 *
 * @param {function} f The function to bind.
 * @param {...object}  The arguments to bind.
 * @return {function}  The bound function.
 */
let bind = function (f) {
    let g = f.call.bind(f, this, ...tail(arguments));

    // Function.prototype.length is read-only, so we'll have to make do.
    g[P$LENGTH] = Math.max(0, f.length - arguments.length + 1);

    return g;
};

/**
 * Returns true if `n` is greater than `limit`.
 *
 * @param  {number} limit The limit to test for.
 * @param  {number} n     The number to test.
 * @return {boolean}      The result of the comparison.
 */
let greaterThan = curry(function (limit, n) {
    return n > limit;
});

/**
 * Returns true if `n` is less than `limit`.
 *
 * @param  {number} limit The limit to test for.
 * @param  {number} n     The number to test.
 * @return {boolean}      The result of the comparison.
 */
let lessThan = curry(function (limit, n) {
    return n < limit;
});

/**
 * Returns true if both `a` and `b` are considered truthy.
 *
 * @param  {object} a
 * @param  {object} b
 * @return {boolean}    A boolean value representing the result.
 */
let and = curry(function (a, b) {
    return Boolean(a && b);
});

/**
 * Returns true if both `a` and `b` are considered truthy.
 *
 * @param  {object} a
 * @param  {object} b
 * @return {boolean}    A boolean value representing the result.
 */
let or = curry(function (a, b) {
    return Boolean(a || b);
});

/**
 * Pattern matching-like construct for JavaScript. Will evaluate every function
 * passed to it in sequence until one of them returns a defined value.
 *
 * @param {...function} Functions to be matched with.
 * @return {function}   A function performing the matching.
 */
let match = function () {
    let fns = arguments;
    return function () {
        let f = head(fns);
        let result = f.apply(this, arguments);

        if (isDefined(result)) {
            return result;
        } else {
            return match(...tail(fns)).apply(this, arguments);
        }
    };
};

/**
 * Maps over a collection with the function f. Unlike Array.prototype.map, this
 * function does not pass any index or the full collection with every call
 * to the map function.
 *
 * @param  {function} f           The mapping function.
 * @param  {array}    collection  The collection to be mapped over.
 * @return {array}                The mapped collection.
 */
let map = curry(function (f, collection) {
    if (collection.map) {
        return collection.map(i => f.call(this, i));
    }

    if (isIterable(collection)) {
        return (function *() {
            for (let elem of collection) {
                yield f(elem);
            }
        })();
    }
});

/**
 * Filters a collection with the function f. Unlike Array.prototype.filter, this
 * function does not pass any index or the full collection with every call
 * to the filter function.
 *
 * @param  {function} f           The filter function.
 * @param  {array}    collection  The collection to be filtered over.
 * @return {array}                The filtered collection.
 */
let filter = curry(function (f, collection) {
    if (collection.filter) {
        return collection.filter(i => f.call(this, i));
    }

    if (isIterable(collection)) {
        return (function *() {
            for (let elem of collection) {
                if (f(elem)) {
                    yield elem;
                }
            }
        })();
    }
});

/**
 * Filters all non-truthy elements away from a collection
 *
 * @param {array}  The collection to be filtered.
 * @type {array}   The filtered collection.
 */
let compact = filter(isTruthy);

/**
 * For every array element in `collection`, takes the elements of that array
 * and inserts them at the same location in the collection.
 *
 * @param  {array} collection The collection to be flattened.
 * @return {array}            The flattened collection.
 */
let flatten = function (collection) {
    let result = [];

    for (let element of collection) {
        if (Array.isArray(element)) {
            result.push.apply(result, element);
        } else {
            result.push(element);
        }
    }

    return result;
};

/**
 * Performs map and flatten in sequence. Useful for when map produces arrays
 * from non-arrays, and the result needs to be concatenated to a single array.
 *
 * @param {function}   The mapping function.
 * @param {array}      The collection to flat map over.
 * @type {array}       The flat mapped collection.
 */
let flatMap = seq(map, flatten);

/**
 * Reduces an array to a single object using a binary function `f` as the
 * reducing function.
 *
 * @param  {Function} f          The reducing function.
 * @param  {Object}   identity   The identity of the binary operation.
 * @param  {Array}    collection The collection to reduce.
 * @return {Object}              The reduction result.
 */
let reduce = curry(function (f, identity, collection) {
    if (collection.reduce) {
        return collection.reduce(f, identity);
    }

    if (isIterable(collection)) {
        let ret = identity;
        for (let elem of collection) {
            ret = f(ret, elem);
        }
        return ret;
    }
});

/**
 * Concatenates an arbitrary number of collections.
 *
 * @return {array} The concatenated collection.
 */
let concat = function () {
    return Array.prototype.concat.apply([], arguments);
};

/**
 * Computes the sum of an array of numbers.
 *
 * @param  {array}      The array to be summed.
 * @return {number}     The sum.
 */
let sum = reduce((a, b) => a + b, 0);

/**
 * Computes the product of an array of numbers.
 *
 * @param  {array}      The array whose numbers are to be multiplied.
 * @return {number}     The product.
 */
let product = reduce((a, b) => a * b, 1);

/**
 * Adds two numbers.
 *
 * @param  {number} a  The first number.
 * @param  {number} b  The second number.
 * @return {number}    The sum.
 */
let add = curry(function (a, b) {
    return b + a;
});

/**
 * Subtracts two numbers.
 *
 * @param  {number} a  The number to subtract.
 * @param  {number} b  The number to be subtracted from
 * @return {number}    The difference.
 */
let subtract = curry(function (a, b) {
    return b - a;
});

/**
 * Multiplies two numbers.
 *
 * @param  {number} a  The first number.
 * @param  {number} b  The second number.
 * @return {number}    The product.
 */
let multiply = curry(function (a, b) {
    return b * a;
});

/**
 * Divides two numbers.
 *
 * @param  {number} a  The denominator.
 * @param  {number} b  The numerator.
 * @return {number}    The quotient.
 */
let divide = curry(function (a, b) {
    return b / a;
});

let val = function (x) {
    if (isFunction(x)) {
        return x;
    }

    return _const(x);
};

/**
 * Computes the remainder of b / a.
 *
 * @param  {number} a  The divisor.
 * @param  {number} b  The divident.
 * @return {number}    The remainder.
 */
let mod = curry(function (a, b) {
    return val(b).call(this) % val(a).call(this);
});

/**
 * Returns a range of numbers from `min` to `max`, in intervals of `step`.
 *
 * @param  {number} min  The first number of the resulting range.
 * @param  {number} max  The (exclusive) upper limit.
 * @param  {number} step The interval between steps.
 * @return {array}       The range.
 */
let range = function (min, max, step = 1) {
    let ret = [];
    for (let i = min; i < max; i += step) {
        ret.push(i);
    }
    return ret;
};

let transduce = function (xform, combine, init, coll) {
    for (let elem of coll) {
        combine(init, xform(elem));
    }

    return init;
};

let into = function (init, xform, coll) {
    if (Array.isArray(init)) {
        let append = function (result, x) {
            result.push(x);
            return result;
        };

        return transduce(xform, append, init, coll);
    }
};

let sequence = function (xform, coll) {
    if (Array.isArray(coll)) {
        let append = function (result, x) {
            result.push(x);
            return result;
        };

        return transduce(xform, append, [], coll);
    }
};

/**
 * Takes a number `n` elements from the beginning of collection `coll`.
 *
 * @param  {Number} n         The number of elements to take.
 * @param  {Collection} coll  The collection.
 * @return {Collection}
 */
let take = curry(function (n, coll) {
    let i = 0;

    if (Array.isArray(coll)) {
        return coll.slice(0, n);
    }

    if (coll.of) {
        let ret = [];

        for (let value of coll) {
            if (i++ >= n) {
                break;
            }

            ret.push(value);
        }

        return coll.of(...ret);
    }

    return (function *() {
        for (let elem of coll) {
            if (i++ >= n) {
                break;
            }

            yield elem;
        }
    })();
});

/**
 * Drops a number `n` elements from the beginning of the collection `coll`.
 *
 * @param  {Number} n         The number of elements to drop.
 * @param  {Collection} coll  The collection.
 * @return {Collection}
 */
let drop = curry(function (n, coll) {
    let i = 0;

    if (Array.isArray(coll)) {
        return coll.slice(n);
    }

    if (coll.of) {
        let ret = [];

        for (let value of coll) {
            if (i++ < n) {
                continue;
            }

            ret.push(value);
        }

        return coll.of(...ret);
    }

    return (function *() {
        for (let i = 0; i < n; ++i) {
            coll.next();
        }
        yield *coll;
    })();
});

/**
 * Removes all duplicate elements in a collection.
 *
 * @param  {Collection} coll The collection
 * @return {[type]}      [description]
 */
let uniq = function (coll) {
    let ret;

    if (Array.isArray(coll)) {
        ret = [];
        for (let elem of coll) {
            if (!ret.includes(elem)) {
                ret.push(elem);
            }
        }
    } else {
        ret = coll.empty();
        for (let elem of coll) {
            if (!ret.includes(elem)) {
                ret = ret.push(elem);
            }
        }
    }

    return ret;
};

export default {
    isFunction,
    isIterable,
    not,
    isDefined,
    isTruthy,
    isFalsy,
    length,
    curry,
    if: _if,
    equal,
    eq: equal,
    print,
    head,
    const: _const,
    id,
    spread,
    seq,
    tail,
    bind,
    greaterThan,
    gt: greaterThan,
    lessThan,
    lt: lessThan,
    and,
    or,
    match,
    map,
    filter,
    compact,
    flatten,
    flatMap,
    arity,
    reduce,
    concat,
    sum,
    product,
    add,
    subtract,
    multiply,
    divide,
    mod,
    range,
    transduce,
    into,
    sequence,
    take,
    drop,
    uniq
};
