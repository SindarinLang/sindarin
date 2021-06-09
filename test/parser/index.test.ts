import { test, expect } from "@jest/globals";
import { scan, parse } from "../../source/phases";

test("basic", () => {
  const tokens = scan({
    contents: "import { output };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("import");
});
