import { curry } from './operations';

let l = function (x) { console.log(x); return x; };

let create = function (elems = [], parent = null) {
    let v = Object.create(Vector);
    return Object.assign(v, { elems, parent });
};

let constructor = function (collection) {
    return create(collection);
};

let length = function (vector) {
    if (!vector.parent) {
        return vector.elems.length;
    }

    return vector.elems.length + vector.parent.length;
};

let push = function (elem, vector) {
    if (arguments.length === 0) {
        return vector;
    }

    return create([elem], vector);
};

let pop = function (vector) {
    if (vector.elems.length === 1) {
        return vector.parent || create();
    } else if (vector.elems.length === 0) {
        return create();
    }

    return vector.push.apply(vector.parent, vector.elems.slice(0, -1));
};

let toArray = function (vector) {
    let arr = [];

    while (vector && vector.elems) {
        Array.prototype.unshift.apply(arr, vector.elems);
        vector = vector.parent;
    }

    return arr;
};

constructor.of = function () {
    return constructor(Array.from(arguments));
};

constructor.push = curry(push);
constructor.pop = pop;
constructor.toArray = toArray;

let Vector = {
    push(elem) {
        return push(elem, this);
    },

    pop() {
        return pop(this);
    },

    toArray() {
        return toArray(this);
    },

    get length() {
        return length(this);
    }
};

export default constructor;