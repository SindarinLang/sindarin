import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("conditionals", async () => {
  const result = await run("examples/operations/arithmetic/index.si");
  const output = [
    "3",
    "-1",
    "2",
    "1",
    "3.570000",
    "-1.110000",
    "2.878200",
    "0.500000",
    "0.525641",
    "inf",
    "2.230000",
    "-0.230000",
    "1.230000",
    "1.000000"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
