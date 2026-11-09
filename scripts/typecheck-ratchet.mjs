#!/usr/bin/env node
/**
 * Trinquete de errores de TypeScript (`pnpm typecheck:ci`).
 *
 * El build ignora los errores de tipos (`ignoreBuildErrors`), así que hay errores históricos. Este script
 * impide que AUMENTEN:
 *  - más errores que `.tsc-baseline`  → falla y lista los errores de los archivos modificados;
 *  - menos errores                    → baja `.tsc-baseline` y pide incluirlo en el commit;
 *  - igual                            → pasa.
 *
 * No cuenta los errores dentro de `.next/`: son tipos generados por `next dev`/`build` que no existen en un
 * clon limpio, y harían que el número cambiara según el estado de esa carpeta. Se muestran aparte.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = join(root, ".tsc-baseline");
const tsc = join(dirname(createRequire(join(root, "package.json")).resolve("typescript/package.json")), "bin/tsc");

let output = "";
let status = 0;
try {
    output = execFileSync(process.execPath, [tsc, "--noEmit", "-p", "."], { cwd: root, encoding: "utf8", stdio: "pipe" });
} catch (error) {
    output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    status = error.status ?? -1;
}

const errorLines = output.split(/\r?\n/).filter((line) => /error TS\d+:/.test(line));
// tsc sale con 1 o 2 cuando hay errores de tipos; otro código, o salir mal sin errores, es un fallo de tsc.
if (![0, 1, 2].includes(status) || (status !== 0 && errorLines.length === 0)) {
    console.error(`tsc no pudo completar la verificación (código ${status}):\n${output}`);
    process.exit(1);
}

const isGenerated = (line) => line.startsWith(".next/");
const counted = errorLines.filter((line) => !isGenerated(line));
const generated = errorLines.length - counted.length;
const baseline = Number.parseInt(readFileSync(baselinePath, "utf8").trim(), 10);
if (Number.isNaN(baseline)) {
    console.error(".tsc-baseline no contiene un número.");
    process.exit(1);
}

const note = generated > 0 ? ` (+${generated} en tipos generados de .next/, no cuentan)` : "";

if (counted.length > baseline) {
    const git = (args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
    const changed = new Set([...git(["diff", "--name-only", "HEAD"]), ...git(["ls-files", "--others", "--exclude-standard"])]);
    const inChanged = counted.filter((line) => changed.has(line.replace(/\(\d+,\d+\).*$/, "")));

    console.error(`✖ Errores de TypeScript: ${counted.length} > línea base ${baseline}${note}.`);
    if (inChanged.length > 0) {
        console.error(`\nErrores en archivos modificados:\n${inChanged.join("\n")}`);
    } else {
        console.error("\nNingún error está en archivos modificados; revisa la salida completa con `pnpm typecheck`.");
    }
    process.exit(1);
}

if (counted.length < baseline) {
    writeFileSync(baselinePath, `${counted.length}\n`);
    process.stdout.write(`✔ La línea base bajó de ${baseline} a ${counted.length}${note}: incluye .tsc-baseline en el commit.\n`);
    process.exit(0);
}

process.stdout.write(`✔ Errores de TypeScript: ${counted.length} (línea base ${baseline})${note}.\n`);
