import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("bitwise or", async () => {
  const result = await run("examples/operations/bitwise/or.si");
  expect(result?.stdout).toBe("false\ntrue\n7\n");
  expect(result?.stderr).toBe("");
});
