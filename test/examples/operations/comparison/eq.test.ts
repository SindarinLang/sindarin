import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("comparison eq", async () => {
  const result = await run("examples/operations/comparison/eq.si");
  const output = [
    "true",
    "false",
    "true",
    "false",
    "true",
    "false",
    "true",
    "false"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
