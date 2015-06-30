/**
 * parliament.js
 *
 * The funkiest functional JavaScipt library you've never heard of.
 */

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
        return x.p$length || x.length;
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
        if (arguments.length === 0) {
            return curried;
        } else if (arguments.length >= arity) {
            return f.apply(this, arguments);
        } else {
            let g = f.bind.call(f, this, ...arguments);
            g.p$length = Math.max(0, arity - length(arguments));
            return curry(g, arity - 1);
        }
    }

    curried.p$length = arity;
    return curried;
};

/**
 * Evalutes the function `expr`. If truthy, it invokes and returns `then`.
 * Otherwise, it invokes and returns `otherwise`.
 *
 * @param {function}    expr        The expression for testing truthiness.
 * @param {function}    then        The "then" branch.
 * @param {function}    otherwise   The "else" branch.
 * @return {any}
 */
let _if = curry(function (expr, then, otherwise) {
    let args = Array.from(arguments.slice(3));
    let result;

    if (expr.apply(this, args)) {
        return then.apply(this, args);
    } else if (otherwise !== undefinde) {
        return otherwise.apply(this, args);
    }
}, 3);

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
    return arguments;
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
 * @param  {function} f The function to be called.
 * @return {function}   A function which takes an array of arguments.
 */
let spread = function (f) {
    return f.apply.bind(f, this);
};

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

        if (length(arguments) < length(f)) {
            return seq(f.apply(this, arguments), ...tail(fns));
        }

        if (fns.length === 1) {
            return f.apply(this, ...arguments);
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
    g.p$length = Math.max(0, f.length - arguments.length + 1);

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
        let result = f(...Array.from(arguments));

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
    return collection.map(i => f(i));
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
    return collection.filter(i => f(i));
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

    arity.p$length = n;
    return curry(arity);
});

/**
 * Reduces an array to a single object using a binary function `f` as the
 * reducing function.
 *
 * @param  {function} f          The reducing function.
 * @param  {object}   identity   The identity of the binary operation.
 * @param  {array}    collection The collection to reduce.
 * @return {object}              The reduction result.
 */
let reduce = curry(function (f, identity, collection) {
    collection = Array.isArray(collection) ? collection : [collection];
    return collection.reduce(f, identity, collection);
});

/**
 * Concatenates an arbitrary number of collections.
 *
 * @return {array} The concatenated collection.
 */
let concat = function () {
    return Array.prototype.concat.apply([], arguments);
};

let sum = reduce((a, b) => a + b, 0);
let difference = reduce((a, b) => a - b);
let product = reduce((a, b) => a * b, 1);
let quotient = reduce((a, b) => a / b, 1);

let add = curry(function (a, b) {
    return b + a;
});

let subtract = curry(function (a, b) {
    return b - a;
});

let multiply = curry(function (a, b) {
    return b * a;
});

let divide = curry(function (a, b) {
    return b / a;
});

seq(map(subtract(2)), compact, sum, print)
    ([-1, 2, 5, 6]);

export default {
    isFunction,
    not,
    isDefined,
    isTruthy,
    isFalsy,
    length,
    curry,
    if: _if,
    equal,
    print,
    head,
    const: _const,
    id,
    spread,
    seq,
    tail,
    bind,
    greaterThan,
    lessThan,
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
    difference,
    product,
    quotient,
    add,
    subtract,
    multiply,
    divide
};
