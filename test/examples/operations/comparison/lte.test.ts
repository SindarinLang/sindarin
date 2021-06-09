import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("comparison lte", async () => {
  const result = await run("examples/operations/comparison/lte.si");
  const output = [
    "false",
    "true",
    "true",
    "true",
    "false",
    "true",
    "true",
    "false",
    "true",
    "true",
    "false",
    "true"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
