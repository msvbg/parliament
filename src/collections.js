import Vector from './vector';
import Dict from './dict';

/**
 * Converts a mutable collection of JavaScript arrays and objects into a
 * corresponding immutable version.
 *
 * @param  {Object} data   The data structure to be converted.
 * @return {Object}
 */
let immutable = function (data) {
    if (data === null || !(typeof data === 'object')) {
        return data;
    }

    if (Array.isArray(data)) {
        return Vector(data.map(immutable));
    }

    return Dict(data);
};

/**
 * Converts an immutable collection of JavaScript arrays and objects into a
 * corresponding mutable version.
 *
 * @param  {Object} data   The data structure to be converted.
 * @return {Object}
 */
let mutable = function (data) {
    if (!data) {
        return data;
    }

    if (data.toArray) {
        return data.map(mutable).toArray();
    } else if (data.toObject) {
        return data.toObject();
    }

    return data;
};

let Nat = function* () {
    let i = 0;
    while (true) {
        yield i++;
    }
};

export default {
    immutable,
    mutable,
    Nat
};