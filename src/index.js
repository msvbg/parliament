import operations from './operations';
import Vector from './vector';
import Dict from './dict';
import collections from './collections';

export default Object.assign({},
    operations,
    collections,
    { Vector, Dict }
);