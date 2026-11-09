// ESLint flat config (ESLint 10 + eslint-config-next 16).
// `next lint` ya no existe en Next 16: el lint se corre con `pnpm lint` (eslint .).
// El formateo NO pasa por ESLint: lo hace Prettier (`pnpm format`), mucho más rápido.
import { createRequire } from "node:module";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-plugin-react 7.x "detecta" React con context.getFilename(), que ESLint 10 eliminó, y tumba el lint.
// Fijar la versión evita esa ruta; se lee del paquete instalado para no mantenerla a mano.
const reactVersion = createRequire(import.meta.url)("react/package.json").version;

/** Carpetas de infraestructura (existen 4 grafías en el repo; todas cuentan). */
const INFRA = [
  "**/infraestructure/**",
  "**/infraestruture/**",
  "**/infraestructura/**",
  "**/infrastructure/**",
];

/** Frameworks que no deben aparecer en dominio ni aplicación. */
const FRAMEWORKS = [
  { name: "typeorm", message: "TypeORM vive en infraestructure/. Define un puerto en domain/." },
  { name: "react", message: "React vive en presentation/ o app/." },
  { name: "next", message: "Next.js vive en presentation/ o app/." },
  { name: "next-auth", message: "La sesión se resuelve en presentation/ (requireSession)." },
];
const FRAMEWORK_PATTERNS = [
  { group: ["next/*", "typeorm/*", "react-dom", "react-dom/*"], message: "Framework fuera de su capa." },
];

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "public/**",
      "storage/**",
      "next-env.d.ts",
      // Migraciones generadas por TypeORM: no se reescriben.
      "src/configuration/databases/typeorm/migrations/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  { settings: { react: { version: reactVersion } } },

  // ---- Reglas generales -------------------------------------------------
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // ---- Arquitectura limpia: la dependencia apunta hacia adentro ----------
  // domain/  ← no conoce a nadie (ni frameworks, ni application, ni infra, ni presentation)
  {
    files: ["src/contexts/**/domain/**/*.{ts,tsx}", "src/shared/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: FRAMEWORKS,
          patterns: [
            ...FRAMEWORK_PATTERNS,
            { group: INFRA, message: "domain/ no puede depender de infraestructura." },
            { group: ["**/application/**"], message: "domain/ no puede depender de application/." },
            { group: ["**/presentation/**", "@/app/**"], message: "domain/ no puede depender de la UI." },
          ],
        },
      ],
    },
  },
  // application/ ← solo conoce domain/ (repositorios y puertos como interfaces)
  {
    files: ["src/contexts/**/application/**/*.{ts,tsx}", "src/shared/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: FRAMEWORKS,
          patterns: [
            ...FRAMEWORK_PATTERNS,
            { group: INFRA, message: "application/ debe depender de un puerto de domain/, no de la implementación." },
            { group: ["**/presentation/**", "@/app/**"], message: "application/ no puede depender de la UI." },
          ],
        },
      ],
    },
  },
  // Componentes cliente: nunca importar infraestructura (TypeORM, pg, bcrypt...) — usar Server Actions.
  {
    files: ["src/**/presentation/ui/**/*.tsx", "src/**/presentation/hooks/**/*.{ts,tsx}", "src/shared/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "typeorm", message: "El cliente llega a la BD solo a través de Server Actions." },
            { name: "pg", message: "El cliente llega a la BD solo a través de Server Actions." },
            { name: "bcrypt", message: "bcrypt es solo de servidor." },
          ],
          patterns: [
            // Los Server Actions ("use server") sí se pueden importar desde la UI, vivan donde vivan.
            { group: [...INFRA, "!**/*.action", "!**/*.action.ts"], message: "La UI no importa infraestructura: usa un Server Action." },
          ],
        },
      ],
    },
  },
];
