import lazy from "./lazy";
import LazySequence from "./LazySequence";

describe("Array lazifier", () => {
  test("creates a LazySequence from an array", () => {
    const array = ["1", "2", "3", "4", "5"];
    const lazyArray = lazy(array);
    expect(lazyArray).toBeInstanceOf(LazySequence);
    expect(lazyArray).toHaveProperty("length", array.length);
  });

  test("runs as described in README.md", () => {
    const foo = ["some", "elements", "go", "here"];
    const bar = lazy(foo)
      .map(str => str.toLocaleUpperCase())
      .filter(str => str.length > 2)
      .map(str => str);

    const baz = bar.toArray();

    const expected = ["SOME", "ELEMENTS", "HERE"];
    expect(baz).toStrictEqual(expected);
  });
});
