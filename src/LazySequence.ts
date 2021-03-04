/**
 * An object that wraps an array of elements and permits iterating over the elements of the array
 * (for example, to perform transformation or filtering tasks on each element). This object also
 * provides an interface for applying lazy operations which are only executed when accessing the
 * object's elements.
 */
export default class LazySequence<T> {
  private storage: Array<T>;

  constructor(array: Array<T> = []) {
    this.storage = array.slice();
  }

  /**
   * The number of elements contained in the sequence.
   */
  get length(): number {
    return this.storage.length;
  }

  /**
   * Calls a callback function for every element in the sequence.
   *
   * @param callback A function that receives an element and that element's index in the sequence.
   */
  forEach(callback: (element: T, index: number) => void): void {
    return this.storage.forEach(callback);
  }

  /**
   * Creates a JavaScript `Array` from the sequence, applying any transformations previously
   * registered.
   */
  toArray(): Array<T> {
    return this.storage.slice();
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
   * @param transform A function that receives an element and its index in the sequence, and returns a new value.
   */
  map<U>(transform: (element: T, index: number) => U): LazyMapSequence<this, T, U> {
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
   * @param predicate
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
  readonly transform: (element: T, index: number) => U;

  constructor(base: Base, transform: (element: T, index: number) => U) {
    super();
    this.base = base;
    this.transform = transform;
  }

  get length(): number {
    return this.base.length;
  }

  forEach(callback: (element: U, index: number) => void): void {
    return this.base.forEach((element, index) => {
      const newElement = this.transform(element, index);
      callback(newElement, index);
    });
  }

  toArray(): Array<U> {
    const result = Array<U>(this.base.length);

    this.base.forEach((element, index) => {
      result[index] = this.transform(element, index);
    });

    return result;
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

  get length(): number {
    return this.toArray().length;
  }

  forEach(callback: (element: T, index: number) => void): void {
    return this.base.forEach((element, index) => {
      if (this.shouldInclude(element)) {
        callback(element, index);
      }
    });
  }

  toArray(): Array<T> {
    const result: Array<T> = [];

    this.base.forEach(element => {
      if (this.shouldInclude(element)) {
        result.push(element);
      }
    });

    return result;
  }
}
