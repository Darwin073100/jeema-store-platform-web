/**
 * Script para ejecutar las migraciones de TypeORM usando ts-node.
 */
import { execSync } from "child_process";

const command = `tsx ./node_modules/typeorm/cli.js migration:run -d src/configuration/databases/typeorm/config/app.data.source.ts`;

// ...removed console.log...
execSync(command, { stdio: "inherit" });