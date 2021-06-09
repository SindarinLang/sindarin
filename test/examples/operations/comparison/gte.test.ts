import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("comparison gte", async () => {
  const result = await run("examples/operations/comparison/gte.si");
  const output = [
    "true",
    "false",
    "true",
    "false",
    "true",
    "true",
    "false",
    "true",
    "true",
    "false",
    "true",
    "true"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
