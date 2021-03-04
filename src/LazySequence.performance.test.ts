import lazy from "./lazy";
import type LazySequence from "./LazySequence";

describe("LazySequence performance", () => {
  test("lazy map is no slower than normal map", () => {
    const arraySize = 70000;
    const mapping = (n: number) => n * n;

    const prepareNormalArray = () => randomArray(arraySize);
    const normalMap = (arr: Array<number>) => arr.map(mapping);

    const prepareLazyArray = () => lazy(randomArray(arraySize)).map(mapping);
    const lazyMap = (arr: LazySequence<number>) => arr.toArray();

    const normalTime = bench(prepareNormalArray, normalMap);
    const lazyTime = bench(prepareLazyArray, lazyMap);
    expect(lazyTime).toBeLessThanOrEqual(normalTime);
  });

  test("lazy map and filter is no slower than normal map and filter", () => {
    const arraySize = 70000;
    const mapping = (n: number) => n * n;
    const evens = (n: number) => n % 2 === 0;
    const toString = (n: number) => n.toString();

    const prepareNormalArray = () => randomArray(arraySize);
    const normalOp = (arr: Array<number>) =>
      arr //
        .map(mapping)
        .filter(evens)
        .map(toString);

    const prepareLazyArray = () =>
      lazy(randomArray(arraySize)) //
        .map(mapping)
        .filter(evens)
        .map(toString);
    const lazyOp = (arr: LazySequence<string>) => arr.toArray();

    const normalTime = bench(prepareNormalArray, normalOp);
    const lazyTime = bench(prepareLazyArray, lazyOp);
    expect(lazyTime).toBeLessThanOrEqual(normalTime);
  });
});

/**
 * Runs an operation a given number of times, and returns the average runtime of the operation.
 *
 * @param input A function that receives the current iteration number and returns a value to input to the operation. The runtime of this function is not timed.
 * @param func A function that receives an imput. Its output is ignored. The runtime of this function is timed.
 * @param iterations The number of iterations to perform. The default is `10`.
 */
function bench<T>(input: (num: number) => T, func: (arg: T) => unknown, iterations = 10): number {
  const times: Array<number> = [];

  for (let i = 0; i < iterations; i += 1) {
    // Get time for each iteration
    const inp = input(i);
    const start = new Date();
    func(inp);
    const finish = new Date();
    times.push(finish.getTime() - start.getTime());
  }

  // Return average time
  let sum = 0;
  times.forEach(time => (sum += time));
  return sum / times.length;
}

/**
 * Generates a random array of numbers.
 *
 * @param length The length of the resulting array.
 */
function randomArray(length: number): Array<number> {
  // http://stackoverflow.com/questions/962802#962890
  let result: Array<number> = [];
  for (let i = 0; i < length; ++i) result[i] = i;

  function shuffle<T>(array: Array<T>): Array<T> {
    let tmp,
      current,
      top = array.length;
    if (top)
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    return array;
  }

  result = shuffle(result);
  return result;
}
