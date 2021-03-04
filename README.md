# Lazy Sequence

> An implementation of lazy arrays in Node.js.

[![Tests](https://github.com/AverageHelper/node-lazy-sequence/actions/workflows/build.yml/badge.svg)](https://github.com/AverageHelper/node-lazy-sequence/actions/workflows/build.yml)

I've long been fascinated by [Swift's `LazySequence` structures](https://developer.apple.com/documentation/swift/lazysequence). The idea of simplifying sequence operations by performing them at once, rather than in several iterations, seems a simple and very reasonable optimization for some circumstances.

Why not have the same in Node?

## Prerequisites

This project requires NodeJS (version 6 or later) and NPM.
[Node](https://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command:

```sh
$ npm -v && node -v
6.14.11
v10.23.0
```

## Install

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

```sh
$ npm install lazy-sequence
```

## Table of contents

- [Lazy Sequence](#lazy-sequence)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Table of contents](#table-of-contents)
  - [Usage](#usage)
    - [Running the tests](#running-the-tests)
    - [Building a distribution version](#building-a-distribution-version)
  - [Performance](#performance)
  - [API](#api)
    - [`lazy`](#lazy)
    - [`LazySequence`](#lazysequence)
    - [`toArray` and `forEach`](#toarray-and-foreach)
    - [`map`](#map)
    - [`filter`](#filter)
  - [Contributing](#contributing)
  - [Built With](#built-with)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)

## Usage

```TypeScript
import { lazy } from "lazy-sequence";

const foo = ["some", "elements", "go", "here"];
const bar = lazy(foo)
  .map(str => str.toLocaleUpperCase())
  .filter(str => str.length > 2)
  .map(str => str);

// None of these `map` and `filter` methods have done anything yet!

const baz = bar.toArray(); // Here is where the magic happens

console.log(baz); // ["SOME", "ELEMENTS", "HERE"]
```

### Running the tests

Start by cloning this repo to your local machine:

```sh
$ git clone https://github.com/AverageHelper/node-lazy-sequence.git
$ cd node-lazy-sequence
```

Install the necessary dependencies:

```sh
$ npm install
```

To run all tests with code coverage, run:

```sh
$ npm test
```

To run tests on files you've changed and automatically rerun tests as changes occur, run:

```sh
$ npm run test:watch
```

To run the style linter, run:

```sh
$ npm run lint
```

### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside a new local `dist/` folder.

## Performance

The core concept is a bit complicated. Unlike plain JavaScript `Array` mutations, `map` and `filter` operations occur at once, in order, on each element of the array at the first loop. Rather than iterating over the whole sequence once for _each_ operation, `LazySequence` loops exactly _once_ over the sequence, running the registered operations in one go. This behavior saves precious compute time for more important tasks, whatever you want your program to do!

A lazy sequence, as implemented here and on many computer systems, doesn't have much performance improvement over regular `Array`s until the array contains about 100,000 items. Algorithmically, the benefits are clear. Realistically, computers prefer repetitive tasks, like running lots of `map`s and then lots of `filter`s, to switching between `map` and `filter` operations quickly.

I'm not sure how to improve the performance of this package much further. Pull requests are welcome!

## API

### `lazy`

The `lazy` function creates a new [`LazySequence`](#lazysequence) using the provided array.

```TypeScript
import { lazy } from "lazy-sequence";

const foo = ["some", "elements", "go", "here"];
const bar = lazy(foo);
```

### `LazySequence`

This class is the primary interface for all transformations or queries we might want to perform on our array.

You can create a `LazySequence` yourself using the `lazy` function described above or by using its constructor:

```TypeScript
import { LazySequence } from "lazy-sequence";

const foo = new LazySequence(["bar", "baz"]);
```

Calling `lazy` on an array is effectually identical to calling this constructor. Neither `lazy` nor `LazySequence` copies that array explicitly. We only reference it later when the data needs to be accessed.

### `toArray` and `forEach`

Calling the `forEach` method on a `LazySequence` right after creating the sequence (i.e., when you've applied no operations) returns a copy of the original array. `forEach` works through the operation tree and ensures that only transformed and filtered elements are returned to the caller.

The `toArray` method works by constructing a new array from the results of `forEach`.

`forEach` executes any `map` or `filter` operations for each sequence element in turn before returning that element to the caller. The original array is left unaltered.

### `map`

```TypeScript
const foo: LazySequence<...>;
...
const bar = foo
  .map(a => transform(a));
```

The `map` method wraps the sequence in a `LazyMapSequence` object. When `forEach` is called on this object, the returned values will have been transformed using the function passed into `map`.

No immediate computations take place until `forEach` or `toArray` is called on the sequence.

### `filter`

```TypeScript
const foo: LazySequence<...>;
...
const bar = foo
  .filter(a => !!a);
```

The `filter` method wraps the sequence in a `LazyFilterSequence` object. When `forEach` is called on this object, the only returned values are those for which the function passed into `filter` returns `true`.

No immediate computations take place until `forEach` or `toArray` is called on the sequence.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests to us.

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Built With

- [Visual Studio Code](https://code.visualstudio.com/)
- Love

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/AverageHelper/node-lazy-sequence/tags).

## Authors

- **James Robinson** - _Initial work_ - [AverageHelper](https://github.com/AverageHelper)

## License

[GNU General Public License v3.0](LICENSE)
