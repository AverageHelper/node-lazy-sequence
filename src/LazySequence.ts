/**
 * An object that wraps an array of elements and allows the building and executing of lazy
 * operations on that array.
 */
export default class LazySequence<T> {
  private storage: Array<T>;

  constructor(array: Array<T> = []) {
    this.storage = array.slice();
  }

  get length(): number {
    return this.storage.length;
  }

  forEach(callback: (element: T, index: number) => void): void {
    return this.storage.forEach(callback);
  }

  toArray(): Array<T> {
    return this.storage.slice();
  }

  map<U>(transform: (element: T, index: number) => U): LazyMapSequence<this, T, U> {
    return new LazyMapSequence(this, transform);
  }
}

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
