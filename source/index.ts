import program from "commander-version";
import { runCommand, compileCommand, runAction } from "./commands";

const description = [
  ",d88~~\\ .'.                888                  .'.",
  "8888     `  888-~88e  e88~\\888   /~~~8e  888-~\\  `  888-~88e",
  "`Y88b   888 888  888 d888  888       88b 888    888 888  888",
  " `Y88b, 888 888  888 8888  888  e88~-888 888    888 888  888",
  "   8888 888 888  888 Y888  888 C888  888 888    888 888  888",
  "\\__88P' 888 888  888  \"88_/888  \"88_-888 888    888 888  888"
].join("\n");

program(__dirname)
  .name("Sindarin")
  .description(description)
  .addCommand(compileCommand)
  .addCommand(runCommand)
  .action(runAction)
  .parse();
