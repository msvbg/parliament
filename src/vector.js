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
 * Maps over a vector with function f.
 *
 * @param  {Function} f      A mapping function.
 * @param  {Vector} vector   A vector to map over.
 * @return {Vector}          The mapped vector.
 */
let map = function (f, vector) {
    return create(vector.toArray().map(f));
};

constructor.of = function () {
    return constructor(Array.from(arguments));
};

constructor.push = curry(push);
constructor.pop = pop;
constructor.toArray = toArray;
constructor.concat = concat;
constructor.equal = equal;

let Vector = {
    push(elem) { return push(elem, this); },
    pop() { return pop(this); },
    toArray() { return toArray(this); },
    concat() { return concat(this, ...arguments); },
    equal(vec) { return equal(this, vec); },
    map(f) { return map(f, this); }
};

export default constructor;
