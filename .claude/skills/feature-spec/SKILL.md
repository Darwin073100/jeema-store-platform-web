---
name: feature-spec
description: Redacta la especificación técnica de un feature de JEEMA en spect/NN_nombre_spect.md, con reglas de negocio, diseño por capa, decisiones, riesgos y plan de tareas por agente. Úsalo cuando el usuario describa un feature nuevo o un cambio grande antes de implementarlo.
argument-hint: <descripción del feature>
---

# Spec de feature

Feature: `$ARGUMENTS`.

1. Delega en el subagente `architect` pasándole la descripción completa del usuario y cualquier
   restricción mencionada (no la resumas).
2. Cuando regrese, muestra al usuario: ruta de la spec, las reglas de negocio numeradas y las
   preguntas abiertas.
3. **No empieces a implementar** hasta que el usuario apruebe la spec o responda las preguntas.
4. Con la spec aprobada, ejecuta el plan en orden: `database` → `backend` → `frontend` → `tester`,
   pasando a cada agente la ruta de la spec y sus tareas concretas. Marca cada tarea `- [x]` en la spec
   al completarse.
5. Cierra con `pnpm validate` y el subagente `code-reviewer` sobre el diff.
