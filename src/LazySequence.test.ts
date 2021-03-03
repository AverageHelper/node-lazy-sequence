import "jest-extended";
import LazySequence from "./LazySequence";

describe("LazySequence", () => {
  let archetype: Array<number>;
  let lazyArray: LazySequence<number>;

  beforeEach(() => {
    archetype = [5, 4, 3, 2, 1];
    lazyArray = new LazySequence(archetype);
  });

  test("has a length", () => {
    expect(lazyArray.length).toBe(archetype.length);
  });

  test("returns an identical array", () => {
    expect(lazyArray.toArray()).toStrictEqual(archetype);
  });

  test("is iterable with the same order as a plain array", () => {
    expect.assertions(lazyArray.length * 3);
    lazyArray.forEach((element, index) => {
      expect(element).toBeNumber();
      expect(index).toBeNumber();
      expect(archetype[index]).toStrictEqual(element);
    });
  });

  describe("map", () => {
    test("has a length when mapped", () => {
      expect(lazyArray.map(v => v.toString()).length).toBe(archetype.length);
    });

    test("returns an identical array when the map is empty", () => {
      expect(lazyArray.map(v => v).toArray()).toStrictEqual(archetype);
    });

    test("maps to new values", () => {
      const mapping = (v: number) => v.toString();
      const expected = archetype.map(mapping);
      expect(lazyArray.map(mapping).toArray()).toStrictEqual(expected);
    });

    test("is iterable over mapped values", () => {
      const mapping = (v: number) => v.toString();
      expect.assertions(lazyArray.length);
      lazyArray //
        .map(mapping)
        .forEach(element => {
          expect(element).toBeString();
        });
    });

    test("is mappable multiple times", () => {
      const mapping1 = (v: number) => v.toString();
      const mapping2 = (v: string) => v.length;
      const expected = archetype //
        .map(mapping1)
        .map(mapping2);
      const actual = lazyArray //
        .map(mapping1)
        .map(mapping2)
        .toArray();
      expect(actual).toStrictEqual(expected);
    });
  });
});
