/**
 * Creates an immutable dictionary. Internal method.
 */
let create = function (map, parent = null, keys = null) {
    map = map || Object.create(null);
    keys = keys || Object.keys(map || {});

    return Object.assign(Object.create(Dict), {
        map,
        parent,
        keys
    });
};

/**
 * Constructs an immutable dict from a JavaScript object.
 *
 * @param  {Object} map The blueprint object.
 * @return {Dict}       An immutable dict.
 */
let constructor = function (map) {
    return create(map);
};

/**
 * Returns a new dict with the specified `key` set to `value`.
 *
 * @param {String} key   The key to set
 * @param {Object} value The value to set the key to
 * @param {Dict} dict    A new immutable dict
 */
let set = function (key, value, dict) {
    if (has(key, dict)) {
        return create({ [key]: value }, dict, dict.keys);
    }

    dict.map[key] = value;

    return create(dict.map, dict.parent, dict.keys.concat(String(key)));
};

/**
 * Determines whether the given dict has `key` in it or not.
 *
 * @param  {String}  key  The key to query for.
 * @param  {Dict}  dict   The dict to query the key for.
 * @return {Boolean}
 */
let has = function (key, dict) {
    return dict.keys.includes(key);
};

/**
 * Retrieves the value of a dict at the given key.
 *
 * @param  {String} key  The key to retrieve
 * @param  {Dict} dict   The dict to query
 * @return {Object}      The value of the key
 */
let get = function (key, dict) {
    if (!dict || dict.keys.indexOf(key) === -1) {
        return undefined;
    }

    if (dict.map[key] !== undefined) {
        return dict.map[key];
    }

    return get(key, dict.parent);
};

/**
 * Returns a new immutable dict with `key` removed.
 *
 * @param  {String} key  The key to remove
 * @param  {Dict} dict   The key to base the new dict off
 * @return {Dict}        A new dict
 */
let del = function (key, dict) {
    let keys = dict.keys.slice();
    let index = keys.indexOf(String(key));

    if (index > -1) {
        keys.splice(index, 1);
        return create(dict.map, dict.parent, keys);
    }

    return dict;
};

/**
 * Converts the dict to a plain JavaScript object.
 *
 * @param  {dict} dict   The dict to convert
 * @return {Object}      An object representing the dict
 */
let toObject = function (dict) {
    let obj = {};

    for (let key of dict.keys) {
        obj[key] = dict.get(key);
    }

    return obj;
};

/**
 * Selects the keys in `keys` from `dict`. If a key in `keys` does not exist in
 * the dict, it is ignored.
 *
 * @param  {Array} keys  An array of keys to select.
 * @param  {Dict} dict   A dictionary to select from.
 * @return {Dict}        A dictionary with the selected keys.
 */
let selectKeys = function (keys, dict) {
    return create(
        dict.map,
        dict.parent,
        dict.keys.filter(k => keys.includes(k))
    );
};

/**
 * Omits the keys in `keys` from `dict`. If a key in `keys` does not exist in
 * the dict, it is ignored. Opposite of `selectKeys`.
 *
 * @param  {Array} keys  An array of keys to omit.
 * @param  {Dict} dict   A dictionary to omit from.
 * @return {Dict}        A dictionary with the selected keys.
 */
let omitKeys = function (keys, dict) {
    return create(
        dict.map,
        dict.parent,
        dict.keys.filter(k => !keys.includes(k))
    );
};

let Dict = {
    set(key, value) { return set(key, value, this); },
    has(key) { return has(key, this); },
    get(key) { return get(key, this); },
    delete(key) { return del(key, this); },
    toObject() { return toObject(this); },
    selectKeys(keys) { return selectKeys(keys, this); },
    omitKeys(keys) { return omitKeys(keys, this); }
};

export default constructor;
