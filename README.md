![parliament.js](https://github.com/msvbg/parliament/raw/master/parliament.png)

> parliament.js is a functional programming utility belt in the vein of
Underscore, Lodash, Ramda and Highland, with first-class
support for immutable data structures.

[![Build status][travis-image]][travis-url]

## Install
```
npm install parliament
```

## Examples
One of the strengths of functional programming is how it takes full advantage of composition. For instance, this is how you would define `flatMap` with parliament.js:

```js
let flatMap = seq(map, flatten);
```

Similarly, this is how the Underscore function `compact` is implemented:

```js
let compact = filter(isTruthy);
```

The library works seamlessly with the included immutable data structures,
`Vector` and `Dict`, mapping to JavaScript's `Array` and `Object` respectively.

```js
let vec = Vector.of(1, 2, 3, 4, 5, 6, 7);
let f = filter(mod(2));
let odd = f(vec);

odd.toArray(); // [1, 3, 5, 7]
vec.toArray(); // [1, 2, 3, 4, 5, 6, 7]
```

There is also experimental support for lazy data structures, by making use of
ES6 generators. `Nat` is an included sequence representing the numbers
`[0, Infinity)`.

```js
let fives = map(multiply(5), take(5, Nat()));

fives.toArray() // [0, 5, 10, 15, 20]
```

## Why not X instead?
When in doubt, use Lodash :)

## License
MIT © Martin Svanberg

[travis-image]: https://img.shields.io/travis/msvbg/parliament.svg?style=flat
[travis-url]: https://travis-ci.org/msvbg/parliament