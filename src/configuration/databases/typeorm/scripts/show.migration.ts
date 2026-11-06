/**
 * Muestra qué migraciones están aplicadas ([X]) y cuáles pendientes ([ ]) en la BD de DATABASE_URL.
 * No modifica nada: es seguro para que un agente lo ejecute antes de proponer un migration:run.
 */
import { execSync } from "child_process";

const command = `tsx ./node_modules/typeorm/cli.js migration:show -d src/configuration/databases/typeorm/config/config.ts`;

execSync(command, { stdio: "inherit" });
