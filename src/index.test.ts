import "jest-extended";
import { lazy, LazySequence } from "./index";

describe("Package", () => {
  test("exports `lazy` function", () => {
    expect(lazy).toBeFunction();
  });

  test("exports `LazySequence` class", () => {
    expect(LazySequence).toBeFunction();
  });
});
