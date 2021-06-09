import { test, expect } from "@jest/globals";
import { resolveExact } from "../../../source/phases/resolver/strategies/exact";

test("exact", () => {
  const result = resolveExact("/absolute/exact.si");
  expect(result.value).toEqual([
    "/absolute/exact.si"
  ]);
});

test("exact index", () => {
  const result = resolveExact("/absolute/index.si");
  expect(result.value).toEqual([
    "/absolute/index.si"
  ]);
});

test("exact relative", () => {
  const result = resolveExact("absolute/exact.si");
  expect(result.value).toEqual([]);
});

test("exact no extension", () => {
  const result = resolveExact("/absolute/exact");
  expect(result.value).toEqual([]);
});

