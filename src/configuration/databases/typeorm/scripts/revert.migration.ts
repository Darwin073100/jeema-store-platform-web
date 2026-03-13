import { execSync } from "child_process";

const command = `tsx ./node_modules/typeorm/cli.js migration:revert -d src/configuration/databases/typeorm/config/app.data.source.ts`;

// ...removed console.log...
execSync(command, { stdio: "inherit" });