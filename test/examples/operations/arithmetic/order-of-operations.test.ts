import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("conditionals", async () => {
  const result = await run("examples/operations/arithmetic/order-of-operations.si");
  expect(result?.stdout).toBe("9\n");
  expect(result?.stderr).toBe("");
});
