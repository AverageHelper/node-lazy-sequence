# Lazy Sequence

> An implementation of lazy arrays in Node.js.

[![Tests](https://github.com/AverageHelper/node-lazy-sequence/actions/workflows/build.yml/badge.svg)](https://github.com/AverageHelper/node-lazy-sequence/actions/workflows/build.yml)

## Prerequisites

TODO: Check what Node version we should support.
This project requires NodeJS (version 10 or later) and NPM.
[Node](https://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command:

```sh
$ npm -v && node -v
6.14.11
v10.23.0
```

## Table of contents

- [Lazy Sequence](#lazy-sequence)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Install](#install)
  - [Usage](#usage)
    - [Running the tests](#running-the-tests)
    - [Linting the code](#linting-the-code)
    - [Building a distribution version](#building-a-distribution-version)
  - [API](#api)
    - [Overview](#overview)
    - [`lazy`](#lazy)
    - [`LazySequence`](#lazysequence)
    - [`toArray`](#toarray)
  - [Contributing](#contributing)
  - [Credits](#credits)
  - [Built With](#built-with)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)

## Install

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

```sh
$ npm install lazy-sequence
```

## Usage

### Running the tests

Start by cloning this repo on your local machine:

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

To run tests on files you've changed, and automatically rerun tests as changes occur, run:

```sh
$ npm run test:watch
```

### Linting the code

```sh
$ npm run lint
```

### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside a new local `dist/` folder.

## API

### Overview

```TypeScript
import { lazy } from "lazy-sequence";

const foo = ["some", "elements", "go", "here"];
const bar = lazy(foo)
  .map(str => ([str, str.length]))
  .filter((str, len) => len > 2)
  .map(str => str);

// None of these `map` and `filter` methods have done anything yet!

const baz = bar.toArray(); // Here is where the magic happens

console.log(baz); // ["some", "elements", "here"]
```

### `lazy`

The `lazy` function creates a new [`LazySequence`](#lazysequence) using the provided array.

```TypeScript
import { lazy } from "lazy-sequence";

const foo = ["some", "elements", "go", "here"];
const bar = lazy(foo);
```

### `LazySequence`

This class is the primary interface for all transformations or queries we might want to perform on our array.

You can create a `LazySequence` yourself using the `lazy` function described above, or bby using its constructor:

```TypeScript
import { LazySequence } from "lazy-sequence";

const foo = new LazySequence(["bar", "baz"]);
```

Calling `lazy` on an array is effectually identical to calling this constructor. The array is not explicitly copied, only referenced for when we need to access the data.

### `toArray`

Calling the `toArray` method on a `LazySequence` right after creating the sequence (i.e. no operations have been applied) returns a copy of the original array.

If any operations, such as `map` or `filter` have been registered on the sequence, then these operations are executed in order for each element in the sequence before returning a new array containing the newly-transformed elements. The original array is left unaltered.

Unlike with normal `Array` mutations, these operations are done at once on each element of the array at the first loop. Rather than iterating over the entirety of the array once for _each_ operation, `LazySequence` loops just _once_, and runs the registered operations in one go. This saves precious compute time for more important tasks, whatever you want your program to do!

TODO: Add map
TODO: Add filter

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Explanation

TODO: Something something Swift.LazySequence

## Built With

- [Visual Studio Code](https://code.visualstudio.com/)
- Love

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/AverageHelper/node-lazy-sequence/tags).

## Authors

- **James Robinson** - _Initial work_ - [AverageHelper](https://github.com/AverageHelper)

## License

[GNU General Public License v3.0](LICENSE)
