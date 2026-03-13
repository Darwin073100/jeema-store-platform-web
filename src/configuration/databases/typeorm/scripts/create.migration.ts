import { execSync } from "child_process";

const migrationName = process.argv[2];

if (!migrationName) {
  console.error("❌ Debes proporcionar un nombre para la migración.");
  process.exit(1);
}

const command = `tsx ./node_modules/typeorm/cli.js migration:generate -d src/configuration/databases/typeorm/config/app.data.source.ts src/configuration/databases/typeorm/migrations/${migrationName}`;

// ...removed console.log...
execSync(command, { stdio: "inherit" });