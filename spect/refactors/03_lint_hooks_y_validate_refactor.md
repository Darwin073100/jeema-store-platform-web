# Refactor: ESLint, hook de lint y `pnpm validate`

> **Propuesto, sin implementar.** Redactado el 2026-11-08 a partir de la rama `development`. Todas las pruebas
> descritas se ejecutaron en Windows 11 con Node 24.22.1 y pnpm. No cambia código de producción: solo
> configuración, scripts, un hook y un test.

## Estado

- [ ] Parte 1 — ESLint vuelve a funcionar
- [ ] Parte 2 — Hook de lint en Windows
- [ ] Parte 3 — Trinquete de tipos (`typecheck:ci`)
- [ ] Parte 4 — Suite de Jest que no carga
- [ ] Parte 5 — Documentación

## Problema

`pnpm validate` (`lint` + `typecheck:ci` + `test:ci`) no pasa desde hace varias specs. Ninguna de sus tres
partes funciona por completo, y el hook de Claude Code bloquea **cada** edición de `.ts/.tsx` con un reporte vacío.
Los agentes y las personas se acostumbraron a ignorar ese aviso, así que el hook ya no protege nada.

Antecedentes en `spect/`. Todos registran el síntoma, pero ninguno tiene un plan:

| Spec | Qué dice |
|---|---|
| `02_rendimiento_producto_spect.md` | `next lint` desapareció en Next 16 (ya resuelto: el script es `eslint .`) |
| `03_resumen_ventas_caja_spect.md` | ESLint fallaba con `Converting circular structure to JSON`. **No se reprodujo hoy** |
| `11_skeletons_ui_asincrona_spect.md` | Tabla de problemas: `pnpm lint` y `typecheck:ci` fallan; una suite de Jest no carga |
| `12_seguridad_autorizacion_spect.md` | Pide arreglar ESLint y `typecheck:ci` antes de migrar actions en masa |
| `refactors/02_lista_productos_nueva_venta_refactor.md` | Causa de ESLint y arreglo sugerido: fijar la versión de React |
| `14_top_productos_vendidos_spect.md` | Mismos síntomas |

## Hallazgos

### 1. ESLint se cae al cargar `eslint-plugin-react`

```
TypeError: Error while loading rule 'react/display-name': contextOrFilename.getFilename is not a function
```

- `eslint-config-next` 16.2.10 incluye `eslint-plugin-react` 7.37.5. Con la configuración por defecto, ese
  plugin intenta **detectar** la versión de React y llama a `context.getFilename()`, que ESLint 10 eliminó.
- Falla **cualquier** archivo, incluso uno que no tenga JSX, como `src/shared/lib/utils/result.ts`.
- Si se fija `settings.react.version`, el plugin no intenta la detección. Se probó con una configuración
  temporal que extiende `eslint.config.mjs`:

| Medición (`eslint .`) | Resultado |
|---|---|
| Archivos analizados | 1504 |
| Errores | **0** (327 suprimidos por `eslint-suppressions.json`) |
| Warnings | 704 en 344 archivos (`no-unused-vars` 412, `no-explicit-any` 140, `exhaustive-deps` 71, …) |
| Tiempo | ~84 s |
| Código de salida | **2**, solo por *"There are suppressions left that do not occur anymore"* |

- ESLint 10 falla si `eslint-suppressions.json` tiene entradas obsoletas, aunque no haya errores. Hoy ese archivo
  tiene 323 mensajes en 185 archivos, y algunos ya se arreglaron. Se corrige con `pnpm lint:prune`, que es el
  único camino permitido: el hook `guard-protected-files.mjs` bloquea la edición manual.
- En un solo archivo (`eslint --quiet <archivo>`, lo que corre el hook), las supresiones obsoletas **no** hacen
  fallar la ejecución: `require-session.ts` y `page.tsx` salen con código 0.

### 2. El hook de lint no funciona en Windows (problema independiente)

`.claude/hooks/lint-edited-file.mjs` ejecuta `execFileSync("npx", …)`. En Windows el ejecutable es `npx.cmd`
y `execFileSync` no usa shell, así que lanza `ENOENT`:

```
code ENOENT  stdout undefined  stderr undefined
```

Consecuencias:

- **El reporte siempre llega vacío.** El `catch` del paso de ESLint arma el mensaje con `error.stdout` y
  `error.stderr`, que no existen, y sale con 2. Por eso el aviso es *"ESLint encontró errores… "* sin detalle,
  incluso en archivos limpios. **Aunque se arregle el hallazgo 1, el hook seguiría bloqueando todo.**
- **Prettier nunca formatea los archivos nuevos.** El paso de Prettier falla igual, pero su `catch` está vacío
  a propósito. Los archivos creados desde que existe el hook no pasaron por Prettier.

`guard-protected-files.mjs` también usa `execFileSync`, pero con `git`, que es un `.exe`. Ese sí funciona.

### 3. Prettier no está declarado como dependencia

`package.json` usa `prettier` en `format` y `format:check`, pero no lo declara. Hoy funciona por accidente:
pnpm instala `prettier@3.8.1` como dependencia par de `eslint-plugin-prettier`. Ese plugin, a su vez, **no se
usa** en `eslint.config.mjs`, cuyo comentario dice que el formateo no pasa por ESLint. Si alguien elimina el
plugin "porque no se usa", `pnpm format` deja de funcionar.

### 4. `typecheck:ci` apunta a un script que nunca existió

- `package.json` llama a `node scripts/typecheck-ratchet.mjs`, que llegó en el commit `bc473f6` ("Configuracion
  agregada para mejor control con IA"). Ese commit añadió `.tsc-baseline` y los hooks, **pero no la carpeta
  `scripts/`**. No hay ningún commit que la contenga y `.gitignore` no la excluye.
- `.tsc-baseline` contiene `75`. `tsc --noEmit` reporta hoy **66** errores.
- El comportamiento esperado ya está descrito en el propio repo:
  - `AGENTS.md`: *"falla solo si SUBEN los errores de tipos"*.
  - `guard-protected-files.mjs`: *"lo actualiza `pnpm typecheck:ci` automáticamente cuando bajan los errores"*.

### 5. Una suite de Jest no carga

`test/contexts/product-management/product/presentation/actions/findAllProductsByEstablishmentFilterAction.test.ts`
falla con `ReferenceError: Request is not defined`. Ya fallaba antes de los cambios recientes (se comprobó con
`git stash`). `spect/11` lo atribuye a importar `next/cache` en el entorno jsdom. Es la única suite que falla:
el resto suma 102 tests que pasan.

## Fuera de alcance

- Corregir los 704 warnings. Siguen siendo warnings y no bloquean.
- Reducir las 327 supresiones históricas, salvo las obsoletas que elimina `lint:prune`.
- Corregir los 66 errores de TypeScript o quitar `ignoreBuildErrors`.
- Actualizar ESLint, Next o `eslint-config-next`.

## Parte 1 — ESLint vuelve a funcionar

### Diseño

En `eslint.config.mjs`, después de `...nextTypescript`:

```js
import { createRequire } from "node:module";

// eslint-plugin-react 7.x "detecta" React con context.getFilename(), que ESLint 10 eliminó.
// Fijar la versión evita esa ruta. Se lee del paquete instalado para no tener que mantenerla a mano.
const reactVersion = createRequire(import.meta.url)("react/package.json").version;

export default [
  // ...ignores, nextCoreWebVitals, nextTypescript
  { settings: { react: { version: reactVersion } } },
  // ...resto sin cambios
];
```

### Tareas

- [ ] Agregar `settings.react.version` a `eslint.config.mjs`, leída de `react/package.json`.
- [ ] Ejecutar `pnpm lint:prune` para quitar las supresiones obsoletas y revisar el diff de
  `eslint-suppressions.json`: solo deben **desaparecer** entradas.
- [ ] Agregar `prettier` a `devDependencies` con la versión fija `3.8.1`, la que ya está instalada.
- [ ] Según la decisión 3, eliminar `eslint-plugin-prettier` de `devDependencies`.

### Criterios de aceptación

1. `pnpm lint` termina con código 0 y reporta 0 errores.
2. Un import de `typeorm` agregado a propósito en un archivo de `domain/` produce un error de
   `no-restricted-imports`. Así se comprueba que las reglas de capas siguen activas. El cambio se revierte.
3. `pnpm format <archivo>` sigue funcionando.

## Parte 2 — Hook de lint en Windows

### Diseño

Ejecutar las herramientas con el mismo Node que corre el hook (`process.execPath`) y la ruta de su script de
entrada. No pasar por `npx`: así no depende de `.cmd`, no necesita shell y evita los avisos y el retraso de npm
en cada edición.

```js
import { createRequire } from "node:module";
const require = createRequire(join(projectDir, "package.json"));
const bin = (pkg, rel) => join(dirname(require.resolve(`${pkg}/package.json`)), rel);

const ESLINT = bin("eslint", "bin/eslint.js");
const PRETTIER = bin("prettier", "bin/prettier.cjs");

const run = (script, args) =>
    execFileSync(process.execPath, [script, ...args], { cwd: projectDir, stdio: "pipe", encoding: "utf8" });
```

Además:

- **Distinguir "ESLint encontró errores" de "ESLint no pudo correr".** El código de salida 1 significa
  errores de lint: bloquear con el reporte. Cualquier otro caso (2, `ENOENT`, una excepción) significa que la
  herramienta está rota: avisar en stderr y **salir con 0**, para no bloquear la edición con un mensaje que no
  se puede corregir. Esto evita que vuelva a pasar lo de hoy.
- Si el reporte queda vacío, incluir al menos `error.message`.
- El `catch` de Prettier deja de ser silencioso: escribe un aviso en stderr sin bloquear.

La ruta de Prettier se resuelve con `require.resolve`. Por eso la Parte 1 debe declarar `prettier` como
dependencia: sin eso, la resolución depende del accidente descrito en el hallazgo 3.

### Tareas

- [ ] Reescribir `run` en `.claude/hooks/lint-edited-file.mjs` como se describe arriba.
- [ ] Separar el error de lint (salida 1) del fallo de la herramienta.
- [ ] Hacer visible el fallo de Prettier.

### Criterios de aceptación

1. Editar un archivo limpio no muestra ningún aviso del hook.
2. Editar un archivo con un error real (el import de la Parte 1) bloquea y el reporte **incluye** la regla y la
   línea.
3. Un archivo `.ts` nuevo queda formateado con Prettier, según `.prettierrc.json`.
4. Si se renombra temporalmente `node_modules/eslint`, el hook avisa sin bloquear.

## Parte 3 — Trinquete de tipos (`typecheck:ci`)

### Diseño

Nuevo `scripts/typecheck-ratchet.mjs`:

1. Ejecuta `node node_modules/typescript/bin/tsc --noEmit -p .` con `process.execPath`, igual que en la
   Parte 2.
2. Cuenta las líneas que coinciden con `/error TS\d+:/`. Si `tsc` termina con un código distinto de 0 y 2, o si
   la salida no tiene errores aunque `tsc` falló, se considera un fallo de la herramienta: salir con 1 y mostrar
   la salida.
3. Lee `.tsc-baseline`, que contiene un número. Se mantiene ese formato para no romper nada.
4. Según el resultado:
   - **Más errores que la línea base:** sale con 1. Muestra `actual > base` y, para orientar, los errores en
     archivos modificados según `git diff --name-only HEAD` y los no rastreados.
   - **Menos errores:** escribe el nuevo número en `.tsc-baseline`, avisa *"La línea base bajó de X a Y:
     incluye `.tsc-baseline` en el commit"* y sale con 0.
   - **Igual:** sale con 0.

Con 66 errores y una línea base de 75, la primera ejecución bajará `.tsc-baseline` a 66.

### Tareas

- [ ] Crear `scripts/typecheck-ratchet.mjs`.
- [ ] Ejecutar `pnpm typecheck:ci` y commitear el `.tsc-baseline` actualizado.

### Criterios de aceptación

1. `pnpm typecheck:ci` pasa y deja `.tsc-baseline` en 66.
2. Un error de tipos agregado a propósito hace fallar el comando y aparece listado. El cambio se revierte.
3. Si se corrige un error, la línea base baja sola.

## Parte 4 — Suite de Jest que no carga

### Diseño

Hipótesis: el test corre en jsdom, el entorno por defecto, e importa un Server Action que carga `next/cache`,
que necesita el `Request` global de Node. `AGENTS.md` pide anotar `/** @jest-environment node */` en los tests
que no usan DOM. Hay que **comprobarlo antes de aplicarlo**. Si la causa es otra, se documenta aquí y se decide.

### Tareas

- [ ] Confirmar la causa ejecutando solo esa suite.
- [ ] Anotar el entorno `node`, o aplicar el arreglo que resulte.

### Criterios de aceptación

1. `pnpm test:ci` pasa con todas las suites.

## Parte 5 — Documentación

- [ ] `AGENTS.md`, tabla "Deuda conocida": errores de TypeScript **75 → 66** y número real de supresiones de lint
  después de `lint:prune`.
- [ ] `spect/11_skeletons_ui_asincrona_spect.md`: marcar como resueltos los problemas de lint, `typecheck:ci` y
  Jest en su tabla, con referencia a este documento.
- [ ] `spect/12_seguridad_autorizacion_spect.md`: quitar la advertencia "No depender de ESLint mientras
  `pnpm lint` siga roto".

## Decisiones y alternativas

| Decisión | Alternativa | Motivo |
|---|---|---|
| Fijar `settings.react.version` | Volver a ESLint 9 | Es un cambio de una línea, mantiene ESLint 10 y su manejo de supresiones |
| | Esperar una versión de `eslint-plugin-react` compatible con ESLint 10 | Sin fecha; deja el lint roto mientras tanto |
| Leer la versión de `react/package.json` | Escribir `"19.2"` | No hay que acordarse de actualizarla al subir de versión React |
| Llamar al script de entrada con `process.execPath` | `shell: true` con `npx` | Funciona igual en todos los sistemas, no pasa por un shell y es más rápido |
| Si la herramienta falla, el hook avisa sin bloquear | Bloquear siempre | Un bloqueo sin solución posible enseña a ignorar el hook |
| `.tsc-baseline` sigue siendo un número | Guardar la lista de errores | Compatible con lo que ya existe; los errores de los archivos modificados bastan para orientar |

## Riesgos

- **`lint:prune` toca un archivo grande** (945 líneas). Hay que revisar que el diff solo elimine entradas.
- **Errores de lint que aparecían ocultos.** Con el lint caído, los cambios recientes no se validaron. La prueba
  dio 0 errores, así que hoy no hay ninguno, pero el número puede cambiar si alguien hace commit antes de
  implementar esto.
- **Lint completo de ~84 s.** `pnpm validate` tardará más que hasta ahora. El hook no se ve afectado porque
  analiza un solo archivo.
- **Primer formateo con Prettier.** A partir de la Parte 2, los archivos nuevos se formatean al crearse. Los
  archivos nuevos que ya existen sin commit (por ejemplo, los de la spec 14) no se reformatean solos. Si se
  quiere, se pasan por `pnpm format` en un commit aparte.

## Preguntas abiertas para el usuario

1. **Alcance:** ¿se implementan las cinco partes para que `pnpm validate` pase completo (recomendado), o solo
   las Partes 1 y 2 (lint y hook)?
2. **Versión de React en ESLint:** ¿leerla de `react/package.json` (recomendado) o fijar `"19.2"`?
3. **`eslint-plugin-prettier`:** ¿eliminarlo y declarar `prettier` directamente (recomendado), o conservarlo?
4. **Commits:** ¿uno por parte, todos `REFACTOR:` (recomendado, porque `AGENTS.md` pide no mezclar cambios de
   lint con un feature), o uno solo?

## Verificación pendiente

- No se probó en macOS ni en Linux. El diseño de la Parte 2 no depende del sistema, pero no se ejecutó allí.
- La causa de la Parte 4 es una hipótesis heredada de `spect/11`.
- No se ejecutó `pnpm build`. Ninguna parte toca código que entre en el build.
