/**
 * An object that wraps an array of elements and permits iterating over the elements of the array
 * (for example, to perform transformation or filtering tasks on each element). This object also
 * provides an interface for applying lazy operations which are only executed when accessing the
 * object's elements.
 */
export default class LazySequence<T> {
  private readonly storage: Array<T>;

  constructor(array: Array<T> = []) {
    this.storage = array;
  }

  /**
   * The number of elements contained in the sequence.
   */
  get length(): number {
    return this.toArray().length;
  }

  /**
   * Creates a JavaScript `Array` from the sequence, applying any transformations previously
   * registered.
   */
  toArray(): Array<T> {
    // DON'T try to use `map` or `filter` here. These are lazy operations.
    const result: Array<T> = [];

    this.forEach(element => {
      result.push(element);
    });

    return result;
  }

  /**
   * Calls a callback function for every element in the sequence.
   *
   * @param callback A function that receives an element of the sequence.
   */
  forEach(callback: (element: T) => void): void {
    return this.storage.forEach(callback);
  }

  /**
   * Registers a `map` transformation to be applied to every element in the sequence as a new
   * array is generated.
   *
   * When an array is generated, the new array's elements will have been transformed by the given
   * `transform` function.
   *
   * No calculations are performed until the sequence's elements are iterated
   * over or a new array is generated from the sequence by calling the `toArray` method.
   *
   * @param transform A function that receives an element and returns a new value. The element's index in the sequence
   * should not be assumed to be consistent, as some elements may be skipped by filters.
   */
  map<U>(transform: (element: T) => U): LazyMapSequence<this, T, U> {
    return new LazyMapSequence(this, transform);
  }

  /**
   * Registers a `filter` operation to be applied to the sequence as a new array is generated.
   *
   * When an array is generated, only elements matching the given `predicate` will be part of the
   * new array.
   *
   * No calculations are performed until the sequence's elements are iterated
   * over or a new array is generated from the sequence by calling the `toArray` method.
   *
   * @param predicate A function that receives an element and returns `true` if the element should be in the final
   * sequence. The element's index in the sequence should not be assumed to be consistent, as some elements may be
   * skipped by filters.
   */
  filter(predicate: (element: T) => boolean): LazyFilterSequence<this, T> {
    return new LazyFilterSequence(this, predicate);
  }
}

/**
 * An object that wraps a sequence and a transformation function. When converted to an array, this
 * sequence iterates over the elements of the base sequence and applies the transformation to each
 * element before returning a newly transformed array.
 */
class LazyMapSequence<Base extends LazySequence<T>, T, U> extends LazySequence<U> {
  readonly base: Base;
  readonly transform: (element: T) => U;

  constructor(base: Base, transform: (element: T) => U) {
    super();
    this.base = base;
    this.transform = transform;
  }

  forEach(callback: (element: U) => void): void {
    // This is where the magic happens
    return this.base.forEach(element => {
      // I've considered using the element's index and transforming `undefined` on an array to avoid dynamic resizing costs, but with `filter` calls in the chain, there's a chance that `this.transform` would return `undefined`. Better to just push.
      const newElement = this.transform(element);
      callback(newElement);
    });
  }
}

/**
 * An object that wraps a sequence and a predicate. When converted to an array, this
 * sequence iterates over the elements of the base sequence and conditionally adds each one to a
 * new array, depending on the result of the predicate.
 */
class LazyFilterSequence<Base extends LazySequence<T>, T> extends LazySequence<T> {
  readonly base: Base;
  readonly shouldInclude: (element: T) => boolean;

  constructor(base: Base, predicate: (element: T) => boolean) {
    super();
    this.base = base;
    this.shouldInclude = predicate;
  }

  forEach(callback: (element: T) => void): void {
    // This is where the magic happens
    return this.base.forEach(element => {
      if (this.shouldInclude(element)) {
        callback(element);
      }
    });
  }
}
