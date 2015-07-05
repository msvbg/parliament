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

## Why not X instead?
When in doubt, use Lodash :)

## License
MIT © Martin Svanberg

[travis-image]: https://img.shields.io/travis/msvbg/parliament.svg?style=flat
[travis-url]: https://travis-ci.org/msvbg/parliament