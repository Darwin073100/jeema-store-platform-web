#!/usr/bin/env node
/**
 * PreToolUse (Edit|Write|MultiEdit): impide modificar archivos que no deben tocarse a mano.
 * Salida 2 = bloquear; el mensaje de stderr le llega a Claude para que corrija el rumbo.
 */
import { execFileSync } from "node:child_process";
import { relative, basename } from "node:path";

const input = JSON.parse(await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data || "{}"));
}));

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const filePath = input?.tool_input?.file_path;
if (!filePath) process.exit(0);

const rel = relative(projectDir, filePath).split("\\").join("/");
const name = basename(rel);

const block = (reason) => {
    console.error(`⛔ ${rel}: ${reason}`);
    process.exit(2);
};

const isTracked = () => {
    try {
        execFileSync("git", ["ls-files", "--error-unmatch", rel], { cwd: projectDir, stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
};

if (/^\.env(\..+)?$/.test(name) && name !== ".env.template") {
    block("archivo de secretos. Documenta variables nuevas en .env.template y pide al usuario que edite su .env.");
}

if (rel.startsWith("src/configuration/databases/typeorm/migrations/") && isTracked()) {
    block("migración ya commiteada; puede estar aplicada en producción. Crea una migración nueva con `pnpm migration:generate <Nombre>`.");
}

if (name === "eslint-suppressions.json") {
    block("se regenera con `pnpm lint:prune` (al arreglar errores) — nunca agregues supresiones a mano.");
}

if (name === ".tsc-baseline") {
    block("lo actualiza `pnpm typecheck:ci` automáticamente cuando bajan los errores; no se sube a mano.");
}

process.exit(0);
