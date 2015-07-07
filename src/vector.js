import { curry } from './operations';

/**
 * Creates a vector based on a JavaScript array and another vector before it.
 * @private
 */
let create = function (elems = [], parent = null, segmentLength = null) {
    segmentLength = segmentLength !== null ? segmentLength : elems.length;

    // Discard if empty
    if (segmentLength === 0 && parent !== null) {
        return parent;
    }

    // Don't use empty parent segments
    while (parent && parent.segmentLength === 0) {
        parent = parent.parent || null;
    }

    let length = segmentLength + (parent !== null ? parent.length : 0);

    return Object.assign(Object.create(Vector), {
        elems,
        parent,
        length,
        segmentLength
    });
};

/**
 * Public interface for creating vectors based on a JavaScript array.
 *
 * @param  {Array} collection  The array to create the vector from.
 * @return {Vector}            The vector created from the array.
 */
let constructor = function (collection) {
    if (collection !== undefined && !Array.isArray(collection)) {
        throw new TypeError('Passed argument is not an array.');
    }

    return create(collection);
};

/**
 * Returns a vector with an additional element pushed onto the end of the source
 * vector.
 *
 * @param  {Object} elem   An element to be pushed.
 * @param  {Vector} vector The source vector.
 * @return {Vector}        The resulting vector.
 */
let push = curry(function (elem, vector) {
    if (vector.elems.length <= vector.segmentLength) {
        vector.elems.push(elem);
        return create(vector.elems, vector.parent);
    } else {
        return create([elem], vector);
    }
});

/**
 * Returns a vector containing all but the last element of the source vector.
 *
 * @param  {Vector} vector The vector to be popped off.
 * @return {Vector}        The resulting vector.
 */
let pop = function (vector) {
    if (!vector || vector.length === 0) {
        return create();
    }

    if (vector.segmentLength > 0) {
        return create(vector.elems, vector.parent, vector.segmentLength - 1);
    } else {
        if (!vector.parent) {
            return create();
        }

        return pop(vector.parent);
    }
};

/**
 * Converts the vector to a plain JavaScript array.
 *
 * @param  {Vector} vector The vector to be converted.
 * @return {Array}         The resulting array.
 */
let toArray = function (vector) {
    let arr = [];

    while (vector && vector.elems) {
        arr.unshift(...(vector.elems.slice(0, vector.segmentLength)));
        vector = vector.parent;
    }

    return arr;
};

/**
 * Concatenates any number of vectors.
 *
 * @return {Vector} The resulting concatenated vector.
 */
let concat = function () {
    let vecs = Array.from(arguments);
    let catted = vecs.reduce((elems, vec) =>
        elems.concat(vec.toArray()), []);

    return create(catted);
};

/**
 * Compares two vectors and returns true if all corresponding elements are
 * strictly (===) equal.
 *
 * @param  {Vector} a The first vector.
 * @param  {Vector} b The second vector.
 * @return {Boolean}}
 */
let equal = function (a, b) {
    if (a.length === b.length) {
        // Short-circuit if they have same length and same elements.
        // No need to compare parents as they have to be the same for
        // identical `elems`.
        if (a.elems === b.elems) {
            return true;
        }

        let arrA = a.toArray(),
            arrB = b.toArray();

        return arrA.every((elem, i) => elem === arrB[i]);
    } else {
        return false;
    }
};

/**
 * Analogous to `Array.prototype.includes`. Returns true if the vector contains
 * the specified element, by way of strict equality.
 *
 * @param  {Object} elem   The element to be checked for.
 * @param  {Vector} vector The vector to be searched.
 * @return {Boolean}       Whether the vector includes the element.
 */
let includes = function (elem, vector) {
    for (let x of vector) {
        if (x === elem) {
            return true;
        }
    }

    return false;
};

/**
 * Implements the JavaScript iterator protocol for the vectorr.
 *
 * @param  {Vector} vector The vector to be iterated.
 * @return {Iterator}
 */
let iterator = function (vector) {
    let arr = vector.toArray();

    return arr[Symbol.iterator]();
};

/**
 * Maps over a vector with function f.
 *
 * @param  {Function} f      A mapping function.
 * @param  {Vector} vector   A vector to map over.
 * @return {Vector}          The mapped vector.
 */
let map = function (f, vector) {
    let arr = vector.toArray();
    return create(arr.map(x => f(x)));
};

/**
 * Reduces a vector with function f.
 *
 * @param  {Function} f      A reducing function.
 * @param  {Vector} vector   A vector to reduce.
 * @return {Object}          The reduced value.
 */
let reduce = function (f, identity, vector) {
    let arr = vector.toArray();
    return arr.reduce((x, y) => f(x, y), identity);
};

/**
 * Filters a vector with function f.
 *
 * @param  {Function} f      A filtering function.
 * @param  {Vector} vector   A vector to filter.
 * @return {Vector}          The filtered vector.
 */
let filter = function (f, vector) {
    let arr = vector.toArray();
    return create(arr.filter(x => f(x)));
};

/**
 * Creates a vector containing a range of numbers [min, max), inclusive on the
 * lower bound and exclusive on the upper. If only one argument is specified,
 * the range is taken to be [0, arg).
 *
 * @param  {Number} min  The inclusive lower bound.
 * @param  {Number} max  The exclusive upper bound.
 * @param  {Number} step The interval between numbers.
 * @return {Vector}      The vector containing the range.
 */
let range = function (min, max, step = 1) {
    if (arguments.length === 1) {
        [min, max] = [0, min];
    }

    return create(
        Array.from({ length: Math.ceil((max - min) / step) })
             .map((n, i) => i * step + min));
};

/**
 * Returns true if the vector fulfills the predicate `f` for at least one
 * element.
 *
 * @param  {Function} f    The predicate.
 * @param  {Vector} vector The vector to check.
 * @return {Boolean}
 */
let some = function (f, vector) {
    let arr = vector.toArray();
    return arr.some(x => f(x));
};

/**
 * Returns true if the vector fulfills the predicate `f` for all elements.
 *
 * @param  {Function} f    The predicate.
 * @param  {Vector} vector The vector to check.
 * @return {Boolean}
 */
let every = function (f, vector) {
    let arr = vector.toArray();
    return arr.every(x => f(x));
};

/**
 * Returns an empty vector.
 *
 * @return {Vector} The empty vector.
 */
let empty = function () {
    return create();
};

/**
 * An alternative constructor syntax, where each vector element is specified
 * as an argument to the function.
 *
 * @return {Vector} The constructed vector.
 */
let of = function () {
    return constructor(Array.from(arguments));
};

constructor.of = of;
constructor.push = curry(push);
constructor.pop = pop;
constructor.toArray = toArray;
constructor.concat = concat;
constructor.equal = equal;
constructor.equals = equal;
constructor.range = range;
constructor.empty = empty;

let Vector = {
    of,
    push(elem) { return push(elem, this); },
    pop() { return pop(this); },
    toArray() { return toArray(this); },
    concat() { return concat(this, ...arguments); },
    equal(vec) { return equal(this, vec); },
    equals(vec) { return equal(this, vec); },
    includes(elem) { return includes(elem, this); },
    [Symbol.iterator]() { return iterator(this); },
    map(f) { return map(f, this); },
    reduce(f, id) { return reduce(f, id, this); },
    filter(f) { return filter(f, this); },
    some(f) { return some(f, this); },
    every(f) { return every(f, this); },
    empty
};

export default constructor;
