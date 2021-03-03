import LazySequence from "./LazySequence";

/**
 * Wraps the provided sequence in a `LazySequence` so that lazy operations may be performed on it.
 * @param array The sequence on which lazy operations should be performed.
 */
export default function lazy<T>(array: Array<T>): LazySequence<T> {
  return new LazySequence(array);
}
