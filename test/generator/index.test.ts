import { test, expect } from "@jest/globals";
import { scan } from "../../source/compile/phases/scanner";
import { parse } from "../../source/compile/phases/parser";
import { generate } from "../../source/compile/phases/generator";

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
