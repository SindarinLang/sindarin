import { test, expect } from "@jest/globals";
import { join } from "path";
import { resolve } from "../../source/compile/phases/resolver";

test("exact", () => {
  const result = resolve("/absolute/exact.si");
  expect(result.value).toEqual([
    "/absolute/exact.si"
  ]);
});

test("exact index", async () => {
  const result = resolve("/absolute/index.si");
  expect(result.value).toEqual([
    "/absolute/index.si"
  ]);
});

test("index", async () => {
  const result = resolve("relative");
  expect(result.value).toEqual([
    join(process.cwd(), "relative.si"),
    join(process.cwd(), "relative/index.si")
  ]);
});

test("index no extension", async () => {
  const result = resolve("relative/index");
  expect(result.value).toEqual([
    join(process.cwd(), "relative/index.si"),
    join(process.cwd(), "relative/index/index.si")
  ]);
});

test("relative no extension", async () => {
  const result = resolve("relative/other");
  expect(result.value).toEqual([
    join(process.cwd(), "relative/other.si"),
    join(process.cwd(), "relative/other/index.si")
  ]);
});

test("relative with extension", async () => {
  const result = resolve("relative/other.si");
  expect(result.value).toEqual([
    join(process.cwd(), "relative/other.si")
  ]);
});
