#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit) sobre .ts/.tsx de src/ o test/:
 *  - archivo NUEVO (sin trackear en git): Prettier lo formatea completo;
 *  - archivo existente: no se reformatea (evita diffs enormes de solo formato);
 *  - siempre: ESLint sobre el archivo (las supresiones históricas aplican). Si hay errores,
 *    salida 2 y el reporte vuelve a Claude para que los corrija.
 *
 * Las herramientas se ejecutan con el mismo Node que corre el hook y la ruta de su script, no con `npx`:
 * en Windows `npx` es `npx.cmd` y `execFileSync` sin shell falla con ENOENT (el hook bloqueaba todo con un
 * reporte vacío). Si una herramienta no puede correr, se avisa SIN bloquear: un bloqueo imposible de
 * corregir solo enseña a ignorar el hook.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";

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

const projectRequire = createRequire(join(projectDir, "package.json"));
/** Ruta absoluta al script de entrada de una dependencia del proyecto. */
const bin = (pkg, entry) => join(dirname(projectRequire.resolve(`${pkg}/package.json`)), entry);

const runNode = (script, args) =>
    execFileSync(process.execPath, [script, ...args], { cwd: projectDir, stdio: "pipe", encoding: "utf8" });

const outputOf = (error) => `${error.stdout ?? ""}${error.stderr ?? ""}`.trim() || String(error.message ?? error);

let tracked = true;
try {
    execFileSync("git", ["ls-files", "--error-unmatch", rel], { cwd: projectDir, stdio: "ignore" });
} catch {
    tracked = false;
}

if (!tracked) {
    try {
        runNode(bin("prettier", "bin/prettier.cjs"), ["--write", rel]);
    } catch (error) {
        // Un error de sintaxis lo reportará ESLint; aquí solo se avisa.
        console.error(`Aviso: Prettier no pudo formatear ${rel}:\n${outputOf(error)}`);
    }
}

try {
    runNode(bin("eslint", "bin/eslint.js"), ["--quiet", rel]);
} catch (error) {
    // ESLint sale con 1 cuando encuentra errores de lint; cualquier otra cosa es un fallo de la herramienta.
    if (error.status === 1) {
        console.error(`ESLint encontró errores en ${rel}. Corrígelos (no los suprimas):\n${outputOf(error)}`);
        process.exit(2);
    }
    console.error(`Aviso: ESLint no pudo ejecutarse sobre ${rel} (no bloquea la edición):\n${outputOf(error)}`);
}

process.exit(0);
