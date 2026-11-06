#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit) sobre .ts/.tsx de src/ o test/:
 *  - archivo NUEVO (sin trackear en git): Prettier lo formatea completo;
 *  - archivo existente: no se reformatea (evita diffs enormes de solo formato);
 *  - siempre: ESLint sobre el archivo (las supresiones históricas aplican). Si hay errores,
 *    salida 2 y el reporte vuelve a Claude para que los corrija.
 */
import { execFileSync } from "node:child_process";
import { relative } from "node:path";

const input = JSON.parse(await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data || "{}"));
}));

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const filePath = input?.tool_input?.file_path;
if (!filePath) process.exit(0);

const rel = relative(projectDir, filePath).split("\\").join("/");
if (!/^(src|test)\/.*\.(ts|tsx)$/.test(rel)) process.exit(0);
if (rel.startsWith("src/configuration/databases/typeorm/migrations/")) process.exit(0);

const run = (cmd, args) => execFileSync(cmd, args, { cwd: projectDir, stdio: "pipe", encoding: "utf8" });

let tracked = true;
try {
    run("git", ["ls-files", "--error-unmatch", rel]);
} catch {
    tracked = false;
}

if (!tracked) {
    try {
        run("npx", ["--no-install", "prettier", "--write", rel]);
    } catch {
        /* Prettier no disponible o archivo con error de sintaxis: ESLint lo reportará. */
    }
}

try {
    run("npx", ["--no-install", "eslint", "--quiet", rel]);
} catch (error) {
    const report = `${error.stdout ?? ""}${error.stderr ?? ""}`.trim();
    console.error(`ESLint encontró errores en ${rel}. Corrígelos (no los suprimas):\n${report}`);
    process.exit(2);
}

process.exit(0);
