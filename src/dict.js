let create = function (map, parent = null, keys = null) {
    map = map || Object.create(null);
    keys = keys || Object.keys(map || {});

    return Object.assign(Object.create(Dict), {
        map,
        parent,
        keys
    });
};

let constructor = function (map) {
    return create(map);
};

let set = function (key, value, dict) {
    if (has(key, dict)) {
        return create({ [key]: value }, dict, dict.keys);
    }

    dict.map[key] = value;

    return create(dict.map);
};

let has = function (key, dict) {
    return dict.keys.includes(key);
};

let get = function (key, dict) {
    if (!dict || dict.keys.indexOf(key) === -1) {
        return undefined;
    }

    if (dict.map[key]) {
        return dict.map[key];
    }

    return get(key, dict.parent);
};

let del = function (key, dict) {
    let keys = dict.keys.slice();
    let index = keys.indexOf(key);

    if (index > -1) {
        keys.splice(index, 1);
        return create(dict.map, dict.parent, keys);
    }

    return dict;
};

let Dict = {
    set(key, value) { return set(key, value, this); },
    has(key) { return has(key, this); },
    get(key) { return get(key, this); },
    delete(key) { return del(key, this); }
};

export default constructor;
