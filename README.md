![parliament.js](https://github.com/msvbg/parliament/raw/master/parliament.png)

> parliament.js is a functional programming utility belt in the vein of
Underscore, Lodash, Ramda, Highland and similar libraries. It is contained in
one tiny and tidy ES6 file.

[![Build status][travis-image]][travis-url]

## Install
```
npm install parliament
```

## Examples
One of the strengths of functional programming is how easily it composes. For instance, this is how you would define `flatMap` with parliament.js:

```js
let flatMap = seq(map, flatten);
```

Similarly, this is how the Underscore function `compact` is implemented:

```js
let compact = filter(isTruthy);
```

## Why not X instead?
When in doubt, use Lodash. But that doesn't stop me from writing this :)

## License
MIT © Martin Svanberg

[travis-image]: https://img.shields.io/travis/msvbg/parliament.svg?style=flat
[travis-url]: https://travis-ci.org/msvbg/parliament