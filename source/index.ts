import program from "commander-version";
import { compile } from "./compile";

program(__dirname)
  .name("Sindarin")
  .description("Sindarin compiler.")
  .addCommand(compile)
  .parse();
