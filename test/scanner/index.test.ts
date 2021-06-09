import { test, expect } from "@jest/globals";
import { scan } from "../../source/phases/scanner";

test("basic", () => {
  const result = scan({
    contents: "import { output };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  expect(result.value?.[0].kind).toBe("import");
  expect(result.value?.[1].kind).toBe("space");
  expect(result.value?.[2].kind).toBe("open_curly");
});
