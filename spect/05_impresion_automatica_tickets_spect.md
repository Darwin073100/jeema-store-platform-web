# Análisis Técnico: Impresión automática de tickets en impresora térmica

> Documento prospectivo (plan de implementación, **feature aún no construida**). Elaborado el 2026-08-26
> tras análisis del estado actual del código y confirmación del usuario sobre el enfoque técnico a seguir
> (QZ Tray). Sirve como especificación para la implementación.

## Problema

Al finalizar una venta, el sistema abre un modal con el ticket, pero **no imprime nada automáticamente**:
el usuario debe imprimir manualmente (Ctrl+P dentro del visor de PDF embebido), elegir la impresora y el
tamaño de papel él mismo cada vez. Se pide que, al finalizar la venta, el modal se siga mostrando pero el
ticket se imprima en paralelo, de forma automática, en la impresora térmica configurada — sin diálogos del
sistema operativo. También se pide una nueva sección "Impresiones/Impresoras" en `/configurations`, junto a
"General" e "Información Financiera", desde donde configurar la impresora térmica.

## Hallazgos sobre el estado del código (previos a implementar)

- **No existe ningún `window.print()` ni librería de impresión** (`react-to-print` u otra) en el proyecto.
  El flujo real es: `useTicketSale.handlePrint(saleId)`
  (`src/contexts/sale-management/sale/presentation/hooks/useTicketSale.tsx:13-42`) llama a la Server Action
  `findTicketBySaleIdAction`, genera un PDF client-side con `@react-pdf/renderer`
  (`pdf(doc).toBlob()`, líneas 28-36) usando el documento `Ticket58Document`, y abre el modal
  (`openSaleModal("saleTicketModal")` vía el store `sale.ui.store.ts`).
- **`SaleTicketModal.tsx`** (y su análogo de reimpresión `SaleReprintTicketModal.tsx` +
  `useReprintTicketSale.tsx`) simplemente embeben el blob del PDF en un `<iframe src={pdfUrl}>`
  (`SaleTicketModal.tsx:24-33`). La impresión física queda 100% delegada al visor de PDF del navegador.
- **`Ticket58Document.tsx`** (hay variantes análogas en `cash-management` y `inventory-management`) define
  el layout del ticket con `StyleSheet.create` de `@react-pdf/renderer`, con ancho **58mm hardcodeado**
  (`Page size={[mmToPt(58), mmToPt(...)]}`, línea 183) — no hay parametrización de ancho (58 vs 80mm) ni
  `@media print` (es PDF, no HTML).
- **No existe ninguna noción de "impresora" en el sistema** — ni entidad, ni configuración, ni value
  object. Se confirmó por grep (`printer|impresora|escpos|thermal`) en todo `src/` sin resultados
  relevantes. Es un módulo nuevo desde cero.
- **`/configurations`** (`src/app/(platform)/configurations/page.tsx`) renderiza
  `ConfigurationOptions.tsx` (`contexts/configuration-management/configuration/presentation/ui/`), que
  **no usa routing por query param ni sub-rutas dinámicas**: son bloques JSX estáticos, cada uno con un
  `<h2>` + `<ContainerConfig>` que envuelve varios `<ItemConfig link="...">` (cada uno un `<Link>` a una
  ruta real bajo `/configurations/*`), con visibilidad por rol vía `<HideElement roles={[...]}>`.
- **El contexto `configuration-management` hoy solo tiene capa de presentación** (`ConfigurationOptions`,
  `ContainerConfig`, `ItemConfig`) — no tiene `domain/application/infraestructura`. No hay entidades de
  configuración existentes para extender; `PrinterConfiguration` requiere el módulo DDD completo desde
  cero, siguiendo como referencia un módulo pequeño ya completo del proyecto:
  `src/contexts/sale-management/payment-method/`.
- **No hay `DependencyFactory` central para Server Actions**: cada acción instancia manualmente su
  repositorio vía factory estático `.create()` y arma el use-case a mano (ver
  `find-ticket-by-sale-id.action.ts:1-26` como ejemplo del patrón a seguir).
- **Límite técnico real (no de este código, de la plataforma web)**: un navegador no puede abrir sockets
  TCP crudos, ni hablar directo con el spooler del SO o un puerto serial/USB sin intervención del usuario.
  `window.print()` siempre abre el diálogo del SO salvo que el navegador se lance con banderas especiales
  (`--kiosk-printing`), y aun así solo imprime a la impresora predeterminada del SO vía driver genérico (sin
  corte de papel/apertura de cajón garantizados). Por eso "imprimir sin diálogo" requiere necesariamente un
  puente fuera del navegador puro.

## Decisión confirmada con el usuario

Se evaluaron 3 enfoques (tabla comparativa abajo) y el usuario eligió **QZ Tray** como puente de impresión.

| Opción | Cómo funciona | Diálogo | Impresoras soportadas | Costo operativo |
|---|---|---|---|---|
| **QZ Tray (elegida)** | Agente local (WebSocket `wss://localhost:8181`) instalado una vez por caja; el navegador le manda el PDF o comandos ESC/POS crudos | Ninguno | USB, red (socket raw), impresora del SO — cualquier marca | Instalar QZ Tray + certificado firmado (una vez por equipo) |
| Chrome `--kiosk-printing` | Bandera de lanzamiento del navegador; `window.print()` imprime silenciosamente a la impresora predeterminada del SO | Ninguno, pero solo si se controla cómo se abre el navegador | Solo la impresora default del SO, vía driver genérico | Cero instalación, pero frágil y sin corte/cajón garantizado |
| WebUSB / WebSerial | El navegador toma el dispositivo USB directo, sin driver del SO | Uno único (permiso de dispositivo) | Solo USB, solo Chrome/Edge | Sin instalación, pero sin soporte de red y choca con drivers del SO ya instalados |

**Razón de la elección**: es el estándar de facto en POS web (Loyverse, Odoo POS y muchos sistemas custom lo
usan exactamente para este problema), da control real ESC/POS (corte de papel, apertura de cajón), funciona
con impresoras de red o USB indistintamente, y no depende de cómo cada sucursal lanza su navegador —
relevante porque, según `CLAUDE.md`, cada sucursal opera de forma independiente (patrón EDYOF
multi-sucursal), con hardware potencialmente distinto.

**Alcance del MVP (fase 1)**: reutilizar el PDF que ya se genera con `Ticket58Document` — solo cambia el
mecanismo de entrega, de "Ctrl+P manual en iframe" a `qz.print(config, [{type:'pixel', format:'pdf', data:
base64}])`. Comandos ESC/POS crudos (corte automático, apertura de cajón) quedan como fase 2 opcional, no
bloquean el MVP.

## Impacto arquitectural / Propuesta de solución

### Backend de firma QZ (infraestructura transversal, fuera de cualquier bounded context)

QZ Tray exige, en producción, que el sitio web firme cada mensaje de impresión (si no, aparece un popup de
confianza en cada sesión de navegador — inaceptable para "automático"). Se necesita:

- **Certificado público** — servido como asset estático, vía `qz.security.setCertificatePromise`.
- **Firma por mensaje** — el navegador manda el string a firmar; un endpoint de backend (Server Action o
  route handler, ej. `src/shared/infrastructure/qz/sign-qz-message.action.ts`) lo firma con
  `crypto.createSign('SHA1')` usando una clave privada leída de variable de entorno/secret (nunca en el
  bundle del cliente), vía `qz.security.setSignaturePromise`.

### Módulo de dominio `printer-configuration` (contexto `configuration-management`)

Sigue el patrón de 4 capas de `sale-management/payment-method/`:

- **domain/entities**: `PrinterConfiguration` (factories `create()`/`reconstitute()`, sin setters públicos;
  métodos `activate()`, `deactivate()`, `updateTarget()`).
- **domain/value-objects**: `PrinterConnectionType` (`QZ_OS_PRINTER | QZ_NETWORK | QZ_USB`), `PaperWidth`
  (solo acepta 58 o 80).
- **domain/exceptions**: `PrinterConfigurationNotFoundException`, `InvalidPrinterConnectionException`.
- **domain/repositories**: `PrinterConfigurationRepository` (interfaz: `findByBranchOffice`, `save`,
  `update`).
- **infraestructura/persistence/typeorm**: `printer-configuration.orm-entity.ts` (registrar en
  `config.ts` → array `entities`), mapper, `typeorm-printer-configuration.repository.ts`.
- **application/use-cases**: `RegisterPrinterConfigurationUseCase`, `UpdatePrinterConfigurationUseCase`,
  `FindPrinterConfigurationByBranchOfficeUseCase`.
- **application/dtos + mappers**: `PrinterConfigurationResponseDTO`, mapper dominio↔DTO.
- **presentation/actions**: `register-printer-configuration.action.ts`,
  `update-printer-configuration.action.ts`, `find-printer-configuration-by-branch.action.ts` — patrón
  estático `.create()`, igual que el resto del proyecto.
- **presentation/interfaces**: `IPrinterConfiguration.ts` (vista cliente).

### Base de datos

- Tabla nueva `printer_configuration`: `id`, `branch_office_id` (FK — la config es por sucursal/caja),
  `label`, `connection_type` (enum), `target` (nombre de impresora o `ip:puerto`), `paper_width_mm`
  (58|80), `auto_print_on_sale` (bool), `open_cash_drawer` (bool, fase 2), `copies` (int), `is_active`
  (bool), timestamps.
- Requiere `pnpm run migration:generate add-printer-configuration` después de registrar la orm-entity.

### Frontend — nueva sección de configuración

- **`ConfigurationOptions.tsx`**: nuevo bloque `<h2>Impresiones</h2>` con
  `<ItemConfig link='/configurations/printer'>Impresora térmica</ItemConfig>`.
- **`app/(platform)/configurations/printer/page.tsx`** (nueva ruta, mismo patrón que
  `configurations/establishment/page.tsx`).
- **`PrinterConfigurationForm.tsx`** (nuevo componente): botón "Conectar impresora"
  (`qz.websocket.connect()`), dropdown de impresoras poblado con `qz.printers.find()` cuando el tipo es
  `QZ_OS_PRINTER`, campos IP/puerto si es `QZ_NETWORK`, selector de ancho de papel, toggle "imprimir
  automáticamente al finalizar venta", toggle "abrir cajón" (fase 2), botón "Imprimir ticket de prueba"
  (usa el mismo pipeline que la venta real, para validar antes de operar).
- **`useQzTray.ts`** (nuevo hook): encapsula conectar/reconectar al agente local y expone
  `printPdf(base64Pdf, printerConfig)`.

### Enganche en el flujo de venta

- **`useTicketSale.tsx`** (línea ~28-36): tras abrir el modal, disparar en paralelo — sin bloquear el
  render del modal — la impresión silenciosa si existe una `PrinterConfiguration` activa con
  `auto_print_on_sale = true` para la sucursal actual.
- **`useReprintTicketSale.tsx`**: mismo tratamiento para reimpresión manual.
- **Manejo de fallo**: si QZ Tray no está corriendo o la impresora no responde, capturar el error y mostrar
  un toast no bloqueante ("No se pudo imprimir automáticamente — revisa la impresora"). Un fallo de
  impresión **nunca** debe afectar el estado de la venta ya persistida.
- **Indicador de estado** (opcional, deseable): icono de impresora conectada/desconectada visible durante
  el flujo de venta, para que el cajero note el problema antes de acumular tickets sin imprimir.

## Plan de implementación (orden de ejecución)

1. **Backend de firma QZ** — certificado público + endpoint de firma. Sin esto, nada funciona en
   producción sin popups.
2. **Módulo `printer-configuration` completo** (domain → infraestructura → application →
   presentation/actions) + migración de base de datos.
3. **UI de configuración** `/configurations/printer` con prueba de impresión — verificable de punta a
   punta antes de tocar el flujo de venta.
4. **Enganche en `useTicketSale`/`useReprintTicketSale`** para disparar la impresión silenciosa.
5. **(Fase 2, opcional)** Reemplazar el envío de PDF por comandos ESC/POS crudos generados desde los
   mismos datos de `Ticket58Document` (texto, alineación, corte de papel, apertura de cajón) — módulo
   aparte (`build-escpos-ticket.ts`) que no toca lo construido en fase 1.

## Archivos a crear (planificado)

- `src/shared/infrastructure/qz/sign-qz-message.action.ts`
- `src/contexts/configuration-management/printer-configuration/domain/entities/printer-configuration.entity.ts`
- `src/contexts/configuration-management/printer-configuration/domain/value-objects/printer-connection-type.vo.ts`
- `src/contexts/configuration-management/printer-configuration/domain/value-objects/paper-width.vo.ts`
- `src/contexts/configuration-management/printer-configuration/domain/exceptions/printer-configuration-not-found.exception.ts`
- `src/contexts/configuration-management/printer-configuration/domain/exceptions/invalid-printer-connection.exception.ts`
- `src/contexts/configuration-management/printer-configuration/domain/repositories/printer-configuration.repository.ts`
- `src/contexts/configuration-management/printer-configuration/infraestructura/persistence/typeorm/printer-configuration.orm-entity.ts`
- `src/contexts/configuration-management/printer-configuration/infraestructura/persistence/typeorm/mappers/printer-configuration.mapper.ts`
- `src/contexts/configuration-management/printer-configuration/infraestructura/persistence/typeorm/repositories/typeorm-printer-configuration.repository.ts`
- `src/contexts/configuration-management/printer-configuration/application/use-cases/register-printer-configuration.use-case.ts`
- `src/contexts/configuration-management/printer-configuration/application/use-cases/update-printer-configuration.use-case.ts`
- `src/contexts/configuration-management/printer-configuration/application/use-cases/find-printer-configuration-by-branch-office.use-case.ts`
- `src/contexts/configuration-management/printer-configuration/application/dtos/printer-configuration-response.dto.ts`
- `src/contexts/configuration-management/printer-configuration/application/mappers/printer-configuration.mapper.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/actions/register-printer-configuration.action.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/actions/update-printer-configuration.action.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/actions/find-printer-configuration-by-branch.action.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/interfaces/IPrinterConfiguration.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/hooks/useQzTray.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/ui/PrinterConfigurationForm.tsx`
- `src/app/(platform)/configurations/printer/page.tsx`
- Migración TypeORM generada (`pnpm run migration:generate add-printer-configuration`)

## Archivos a modificar (planificado)

- `src/configuration/databases/typeorm/config/config.ts` (registrar `PrinterConfigurationOrmEntity`)
- `src/contexts/configuration-management/configuration/presentation/ui/ConfigurationOptions.tsx` (nuevo
  bloque "Impresiones")
- `src/contexts/sale-management/sale/presentation/hooks/useTicketSale.tsx` (disparo de impresión silenciosa)
- `src/contexts/sale-management/sale/presentation/hooks/useReprintTicketSale.tsx` (idem, reimpresión)
- `package.json` (dependencia `qz-tray`)

## Verificación pendiente (a ejecutar durante la implementación)

1. `tsc --noEmit` sin nuevos errores atribuibles a este módulo.
2. Prueba de impresión manual desde `/configurations/printer` contra una impresora térmica real (o
   impresora del SO como sustituto en desarrollo) antes de habilitar `auto_print_on_sale`.
3. Verificación visual en navegador del flujo completo: finalizar venta → modal se abre → ticket se
   imprime en paralelo sin diálogos del SO.
4. Verificar que un fallo de impresión (QZ Tray apagado, impresora desconectada) no bloquea ni revierte la
   venta, y que el toast de error se muestra.
5. Test unitario de `RegisterPrinterConfigurationUseCase`/`UpdatePrinterConfigurationUseCase` (pendiente de
   decidir si se cubre en esta iteración, dado que no todos los use-cases del proyecto tienen test — ver
   precedente en `03_resumen_ventas_caja_spect.md`).

## Fuera de alcance / limitaciones conocidas

- **Instalación de QZ Tray + certificado en cada equipo de caja es trabajo operativo, no de código** —
  cada sucursal debe instalar el agente una vez; no hay forma de automatizar esto desde el propio
  Next.js app.
- **Corte de papel automático y apertura de cajón portamonedas quedan en fase 2** (requieren comandos
  ESC/POS crudos, no disponibles enviando solo el PDF vía QZ).
- **Impresoras de red sin driver instalado en el SO**: la conexión `QZ_NETWORK` (socket raw IP:puerto) no
  se validó contra hardware real en esta sesión — queda como riesgo técnico a confirmar en la
  implementación.
- **No se decidió aún** si el toggle "abrir cajón" se expone en la UI desde el MVP (fase 1) aunque no
  tenga efecto hasta fase 2, o si se oculta hasta que ESC/POS esté implementado.
