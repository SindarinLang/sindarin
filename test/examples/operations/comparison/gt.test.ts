import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("comparison gt", async () => {
  const result = await run("examples/operations/comparison/gt.si");
  const output = [
    "true",
    "false",
    "false",
    "false",
    "true",
    "false",
    "false",
    "true",
    "false",
    "false",
    "true",
    "false"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
