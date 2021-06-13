import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("conditionals", async () => {
  const result = await run("examples/operations/conditional/index.si");
  const output = [
    // "1",
    // "null",
    "true",
    "false",
    "5",
    // "1",
    "1",
    "2"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
