![parliament.js](https://github.com/msvbg/parliament/raw/master/parliament.png)

> parliament.js is a functional programming utility belt in the vein of
Underscore, Lodash, Ramda, Highland and similar libraries. It is contained in
one tiny and tidy ES6 file.

## Install
```
npm install parliament
```

## Examples
One of the strengths of functional programming easily it composes. For instance, this is how you would define `flatMap`:

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