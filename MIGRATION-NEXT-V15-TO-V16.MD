# Estrategia de Bundler: Turbopack (dev) + Webpack (producción)
 
## Resumen
 
Este proyecto usa **Turbopack** para desarrollo (`next dev --turbopack`) y **Webpack** para el build de producción (`next build --webpack`). Esta configuración híbrida no es una preferencia arbitraria: es la solución a una incompatibilidad real y actual entre Turbopack y TypeORM, documentada aquí para no volver a perder tiempo redescubriéndola en futuros proyectos.
 
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --webpack",
    "start": "next start"
  }
}
```
 
---
 
## Por qué Turbopack en desarrollo
 
Turbopack es el bundler que Next.js 16 usa por defecto, y trae ventajas reales en el día a día de desarrollo:
 
- **Arranque e iteración más rápidos**: compilación incremental basada en Rust, con Hot Module Replacement significativamente más rápido que webpack en proyectos grandes.
- **Es la dirección oficial del framework**: Vercel está invirtiendo el desarrollo activo del framework en Turbopack. Usarlo en dev mantiene el proyecto alineado con las mejoras futuras (cache de sistema de archivos, mejoras de memoria, etc., como las introducidas en Next 16.2–16.3).
- **En desarrollo, el código no se minifica agresivamente**, así que el problema descrito abajo (renombrado de clases) no se manifiesta en `next dev`. El riesgo solo aparece en builds de producción optimizados.
En resumen: en desarrollo no hay ninguna razón para no usar Turbopack, y sí varias razones (velocidad) para preferirlo.
 
---
 
## Por qué Webpack en producción
 
### El problema
 
Este proyecto usa **TypeORM** para el acceso a datos, con entidades definidas mediante decoradores de clase (`@Entity`, `@OneToOne`, `@ManyToOne`, etc.). Varias entidades tienen **relaciones bidireccionales** entre sí (por ejemplo, `AddressOrmEntity ↔ BranchOfficeOrmEntity ↔ EmployeeOrmEntity ↔ CustomerOrmEntity`), lo cual es un patrón estándar y correcto en TypeORM, resuelto mediante funciones "lazy":
 
```typescript
@OneToOne(() => BranchOfficeOrmEntity, (branch) => branch.address)
branchOffice: BranchOfficeOrmEntity | null;
```
 
Al compilar el build de producción con **Turbopack**, se detectaron dos problemas relacionados con este patrón:
 
1. **`ReferenceError: Cannot access 'X' before initialization`**
   Turbopack, al optimizar el orden de inicialización de módulos con dependencias circulares entre clases, puede generar un error de "temporal dead zone" (TDZ) — la clase se referencia antes de que su módulo termine de inicializarse. Esto ocurre incluso usando el patrón "lazy" recomendado por TypeORM.
2. **`Entity metadata for h#branchOffices was not found`**
   Turbopack **minifica los nombres de las clases** en el bundle de servidor (`BranchOfficeOrmEntity` → `h`, por ejemplo), y actualmente **no expone ninguna configuración para preservarlos** (a diferencia de Webpack, que sí soporta `keep_classnames` vía Terser). Cualquier lógica que dependa del nombre real de una clase en runtime (como la resolución de entidades de TypeORM por nombre de string) se rompe.
### Por qué no se solucionó con trucos
 
Se evaluaron dos workarounds para mantener Turbopack en producción:
 
| Workaround | Problema |
|---|---|
| Referenciar relaciones por string (`@OneToOne('BranchOfficeOrmEntity', ...)`) | Sigue dependiendo del nombre de la clase en runtime, que Turbopack igual minifica |
| Forzar el nombre con `Object.defineProperty(Clase, 'name', { value: '...' })` | Funciona, pero obliga a repetir manualmente el nombre en cada entidad, con riesgo de desincronización si alguien renombra la clase y olvida actualizar el string |
 
Ambos "funcionan", pero introducen complejidad y riesgo de bugs silenciosos a futuro, solo para compensar una limitación actual del bundler — no un error en el código o en TypeORM.
 
### La solución adoptada
 
Next.js **mantiene Webpack disponible de forma oficial y soportada** exactamente para casos de compatibilidad como este:
 
```bash
next build --webpack
```
 
Con Webpack, TypeORM funciona **sin ningún ajuste ni truco**, usando el patrón estándar de la librería (imports reales + funciones lazy), tal como está documentado oficialmente por TypeORM. Webpack tiene años de madurez manejando módulos ES con dependencias circulares y no presenta ninguno de los dos problemas anteriores.
 
---
 
## Conclusión / Regla general para futuros proyectos
 
> **Usa Turbopack en desarrollo siempre.** Para producción, evalúa si el proyecto usa librerías que dependen de reflexión en runtime sobre clases (nombres de constructor, decoradores complejos como TypeORM, class-validator, class-transformer, TypeGraphQL, NestJS-style DI, etc.). Si es así, compila producción con `next build --webpack` hasta que Turbopack soporte preservar nombres de clase de forma nativa.
 
### Cómo detectar si un proyecto nuevo tiene este riesgo
 
- ¿El proyecto usa TypeORM, TypeGraphQL, class-validator/class-transformer, o cualquier librería basada en decoradores + reflect-metadata? → riesgo alto.
- ¿Hay entidades/clases con relaciones o referencias circulares entre sí? → riesgo alto.
- Si ninguna de las anteriores aplica (proyecto típico de React/Next sin ORM basado en decoradores) → Turbopack en producción debería ser seguro.
### Cómo verificar si ya no es necesario este workaround
 
Este es un problema de una etapa temprana de Turbopack como bundler de producción. En cada actualización mayor de Next.js, vale la pena probar:
 
```bash
next build --turbopack
```
 
Si compila y arranca sin errores de `Entity metadata not found` ni `Cannot access before initialization`, se puede volver a unificar todo en Turbopack y simplificar los scripts.
 
---
 
## Referencias
 
- [Next.js Docs — Turbopack API Reference](https://nextjs.org/docs/app/api-reference/turbopack)
- [Next.js Docs — turbopack config](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [TypeORM Docs — Relations](https://typeorm.io/relations)
- Discusión de la comunidad sobre minificación de nombres de clase y Turbopack: `vercel/next.js` discussions/issues (búsqueda: "class names minification turbopack")
 