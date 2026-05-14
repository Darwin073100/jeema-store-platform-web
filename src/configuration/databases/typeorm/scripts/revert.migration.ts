import { execSync } from "child_process";

const command = `tsx ./node_modules/typeorm/cli.js migration:revert -d src/configuration/databases/typeorm/config/config.ts`;

execSync(command, { stdio: "inherit" });