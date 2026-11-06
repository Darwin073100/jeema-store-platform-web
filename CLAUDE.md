@AGENTS.md

# Específico de Claude Code

## Equipo de subagentes (`.claude/agents/`)

| Agente | Úsalo para | Escribe código |
|---|---|---|
| `architect` | Analizar un feature, diseñar la solución, escribir la spec en `spect/` y repartir tareas | Solo specs |
| `backend` | domain / application / infraestructure / Server Actions | Sí |
| `database` | Entidades ORM, migraciones, índices, consultas lentas | Sí |
| `frontend` | Componentes, páginas, hooks, stores, UX del POS | Sí |
| `tester` | Tests de dominio, casos de uso (pg-mem) y componentes | Sí (solo `test/`) |
| `code-reviewer` | Revisar un diff antes de commit/PR | No |
| `security-auditor` | Auditar autorización, validación y secretos | No |

## Flujo recomendado para un feature

1. `architect` → spec `spect/NN_<feature>_spect.md` con tareas por capa (aprobar antes de seguir).
2. `database` (si hay cambios de esquema) → `backend` → `frontend`, cada uno con su parte de la spec.
3. `tester` → tests del dominio y casos de uso nuevos.
4. `pnpm validate`.
5. `code-reviewer` (y `security-auditor` si toca auth, dinero, caja o Server Actions) sobre el diff.

Para cambios pequeños, trabaja directo sin orquestar agentes.

## Skills (`.claude/skills/`)

- `/new-use-case` — crea un caso de uso completo (dominio → application → infra → action → test).
- `/new-migration` — flujo seguro para cambios de esquema TypeORM.
- `/feature-spec` — redacta una spec en `spect/` con el formato del proyecto.

## Hooks activos (`.claude/settings.json`)

- Bloquea ediciones a migraciones ya commiteadas, a `.env*` y a `eslint-suppressions.json` / `.tsc-baseline`
  (estos dos solo se regeneran con sus scripts).
- Tras cada edición de `.ts/.tsx`: Prettier + ESLint sobre ese archivo; los errores vuelven a Claude.
