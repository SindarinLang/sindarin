import { test, expect } from "@jest/globals";
import { scan, parse, generate } from "../../source/phases";

test("basic", () => {
  const tokens = scan({
    contents: "import { output };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const ast = parse(tokens.value ?? []).value;
  if(ast !== undefined) {
    const file = generate(ast);
    expect(file.value?.name).toBe("main");
  }
});
