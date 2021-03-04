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
      const mapped = lazyArray.map(v => v.toString());
      expect(mapped.length).toBe(archetype.length);
      expect(mapped.toArray().length).toBe(archetype.length);
    });

    test("returns an identical array when the map is empty", () => {
      expect(lazyArray.map(v => v).toArray()).toStrictEqual(archetype);
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

    test("maps to new values", () => {
      const mapping = (v: number) => v.toString();
      const expected = archetype.map(mapping);
      expect(lazyArray.map(mapping).toArray()).toStrictEqual(expected);
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

  describe("filter", () => {
    test("has a length when filtered for all", () => {
      const filtered = lazyArray.filter(() => true);
      expect(filtered.length).toBe(archetype.length);
      expect(filtered.toArray().length).toBe(archetype.length);
    });

    test("has zero length when filtered for none", () => {
      const filtered = lazyArray.filter(() => false);
      expect(filtered.length).toBe(0);
      expect(filtered.toArray().length).toBe(0);
    });

    test("is iterable over filtered values", () => {
      const oddOnly = (v: number) => v % 2 === 1;
      expect.assertions(archetype.filter(oddOnly).length * 3);
      lazyArray //
        .filter(oddOnly)
        .forEach(element => {
          expect(element).toBeNumber();
          expect(element).toBeOdd();
          expect(oddOnly(element)).toBeTrue();
        });
    });

    test("is filterable multiple times", () => {
      const moreThanTwo = (v: number) => v > 2;
      const lessThanFive = (v: number) => v < 5;
      const expected = archetype //
        .filter(moreThanTwo)
        .filter(lessThanFive);
      const actual = lazyArray //
        .filter(moreThanTwo)
        .filter(lessThanFive)
        .toArray();
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("combined", () => {
    test("can map then filter", () => {
      const toString = (v: number) => v.toString();
      const longerThanZero = (v: string) => v.length > 0;
      const expected = archetype //
        .map(toString)
        .filter(longerThanZero);
      const actual = lazyArray //
        .map(toString)
        .filter(longerThanZero)
        .toArray();
      expect(actual).toStrictEqual(expected);
    });

    test("can filter then map", () => {
      const moreThanTwo = (v: number) => v > 2;
      const toString = (v: number) => v.toString();
      const expected = archetype //
        .filter(moreThanTwo)
        .map(toString);
      const actual = lazyArray //
        .filter(moreThanTwo)
        .map(toString)
        .toArray();
      expect(actual).toStrictEqual(expected);
    });

    test("can filter, map, then filter", () => {
      const moreThanTwo = (v: number) => v > 2;
      const toString = (v: number) => v.toString();
      const notEmpty = (v: string) => v.length > 0;
      const expected = archetype //
        .filter(moreThanTwo)
        .map(toString)
        .filter(notEmpty);
      const actual = lazyArray //
        .filter(moreThanTwo)
        .map(toString)
        .filter(notEmpty)
        .toArray();
      expect(actual).toStrictEqual(expected);
    });

    test("can map, filter, then map", () => {
      const toString = (v: number) => v.toString();
      const lessThanTwo = (v: string) => v.length < 2;
      const expected = archetype //
        .map(toString)
        .filter(lessThanTwo)
        .map(parseInt);
      const actual = lazyArray //
        .map(toString)
        .filter(lessThanTwo)
        .map(parseInt)
        .toArray();
      expect(actual).toStrictEqual(expected);
    });

    test("can map, filter, map, then filter", () => {
      const toString = (v: number) => v.toString();
      const lessThanTwo = (v: string) => v.length < 2;
      const moreThanOne = (v: number) => v > 1;
      const expected = archetype //
        .map(toString)
        .filter(lessThanTwo)
        .map(parseInt)
        .filter(moreThanOne);
      const actual = lazyArray //
        .map(toString)
        .filter(lessThanTwo)
        .map(parseInt)
        .filter(moreThanOne)
        .toArray();
      expect(actual).toStrictEqual(expected);
    });
  });
});
