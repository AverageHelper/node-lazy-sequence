import lazy from "./lazy";
import LazySequence from "./LazySequence";

describe("Array lazifier", () => {
  test("creates a LazySequence from an array", () => {
    const array = ["1", "2", "3", "4", "5"];
    const lazyArray = lazy(array);
    expect(lazyArray).toBeInstanceOf(LazySequence);
    expect(lazyArray).toHaveProperty("length", array.length);
  });
});
