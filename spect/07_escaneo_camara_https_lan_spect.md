# Manual: Escaneo de código de barras por cámara + HTTPS en la red LAN

> Documento operativo (**la feature de escaneo por cámara ya está construida**; este documento es el manual
> de despliegue para que funcione en el entorno real de producción del usuario: un equipo local corriendo
> `pnpm run build` + `pnpm run start`, con celulares/tablets de la tienda accediendo por la red LAN). Elaborado
> el 2026-09-06. Enfoque elegido: **100% local, sin dependencia de internet** (mkcert + reverse proxy),
> descartando alternativas que requieren internet (Cloudflare Tunnel) o que no son viables para varios
> dispositivos/iPhones (flag de Chrome).

## Contexto

Se agregó un botón de cámara en `/sale/new` que abre el video de la cámara del dispositivo y decodifica
códigos de barra en vivo (`@zxing/browser`), alimentando el mismo flujo de "buscar producto y agregarlo a la
venta" que ya usa un lector físico de código de barras. Ver:

- `src/shared/presentation/hooks/useBarcodeScanner.ts` — hook genérico (cámara, decodificación, debounce,
  errores).
- `src/shared/ui/components/scanner/BarcodeScannerModal.tsx` — modal de escaneo (reutilizable, no
  específico de ventas).
- `src/contexts/sale-management/sale/presentation/ui/SaleProductSearch.tsx` — botón de cámara + integración.
- `src/contexts/sale-management/sale/presentation/hooks/useSale.ts` — expone `handleSearchInventory`,
  reutilizada tanto por el lector físico como por la cámara.

## Problema: por qué el escaneo por cámara no funciona hoy en la LAN

El acceso a la cámara del navegador (`navigator.mediaDevices.getUserMedia`) solo está permitido en un
**contexto seguro**: `https://` o `http://localhost`. Esta es una restricción del navegador (Chrome, Safari,
Firefox), no de esta aplicación, y aplica igual en desarrollo (`next dev`) y en producción (`next start`) —
**`next start` no trae HTTPS integrado**, sigue sirviendo HTTP plano por sí mismo.

Hoy los dispositivos de la tienda acceden por `http://192.168.1.X:3000` (LAN, HTTP) — un origen no seguro —
por lo que el botón de cámara mostrará el mensaje de error controlado ("conexión no segura, se requiere
HTTPS") en cualquier celular. **El lector físico/Bluetooth no se ve afectado** (no usa `getUserMedia`), así
que nada de lo que ya funciona se rompe; esto solo bloquea la función nueva hasta completar este manual.

## Decisión de diseño

Se evaluaron 3 alternativas para dar HTTPS a los dispositivos LAN:

| Opción | Requiere internet | Instalación por dispositivo | Compatibilidad |
|---|---|---|---|
| Cloudflare Tunnel + dominio propio | Sí (saliente, en el servidor) | Ninguna | Android + iPhone |
| **mkcert + reverse proxy local (elegida)** | **No** | **Sí, una vez por dispositivo (instalar CA raíz)** | Android + iPhone (con paso extra en iOS) |
| Flag de Chrome (`unsafely-treat-insecure-origin-as-secure`) | No | Sí, por dispositivo y no persiste bien | Solo Chrome/Android, no sirve para producción |

Se eligió **mkcert + Caddy** por el requisito explícito de operar 100% local, sin depender de que la tienda
tenga internet en todo momento.

## Arquitectura de la solución

```
Equipo local (servidor):
  mkcert  → certificado de confianza LOCAL para la IP LAN del servidor
  Caddy :443 (HTTPS) ──reverse_proxy──► next start :3000 (HTTP interno, sin cambios de código)

Celulares/tablets de la tienda (una vez por dispositivo):
  Instalan el "rootCA.pem" de mkcert como certificado de confianza
  → después de eso, https://192.168.1.X se ve como sitio seguro, cámara habilitada
```

`next start` no cambia de código ni de puerto: sigue hablando HTTP plano hacia adentro, escuchando solo en
`127.0.0.1` (nadie más que Caddy le habla directo). Todo el trabajo de HTTPS lo hace Caddy.

## Manual paso a paso

### 1. Fijar la IP del servidor

mkcert emite el certificado para una IP específica. Si el router reasigna la IP por DHCP, el certificado
deja de coincidir y todos los dispositivos vuelven a ver el error de "sitio no seguro".

- En el router: crear una **reserva DHCP** para la MAC del equipo servidor, fijando siempre la misma IP
  (ej. `192.168.1.127`).

### 2. Generar el certificado con mkcert

```bash
# Instalar mkcert (una vez) y crear la CA raíz local
sudo apt install mkcert    # o el método correspondiente a la distro
mkcert -install

# Certificado para la IP fija del servidor (agregar localhost/127.0.0.1 también,
# útil para pruebas hechas desde el propio equipo servidor)
mkcert 192.168.1.127 localhost 127.0.0.1
# → genera 192.168.1.127+2.pem  y  192.168.1.127+2-key.pem

# Ubicación de la CA raíz que hay que copiar a los celulares:
mkcert -CAROOT
```

Guardar ambos archivos `.pem` en una ruta estable del servidor, ej. `/etc/jeema/tls/`.

### 3. Reverse proxy con Caddy

Instalar Caddy y crear un `Caddyfile`:

```
192.168.1.127:443 {
    tls /etc/jeema/tls/192.168.1.127+2.pem /etc/jeema/tls/192.168.1.127+2-key.pem
    reverse_proxy 127.0.0.1:3000
}
```

`next start` debe escuchar solo en loopback, para que nadie en la LAN pueda saltarse el proxy hablando HTTP
directo al puerto 3000:

```bash
next start -H 127.0.0.1 -p 3000
```

### 4. Actualizar `NEXTAUTH_URL` (paso crítico, se olvida fácil)

En `.env`, `NEXTAUTH_URL` debe apuntar a la URL que **realmente ven los navegadores**, no al puerto interno
de `next start`:

```diff
- NEXTAUTH_URL=http://localhost:3000
+ NEXTAUTH_URL=https://192.168.1.127
```

Si se omite este cambio, NextAuth arma mal las cookies/redirects de login (`callbackUrl`, flag `secure` de
la cookie de sesión) y el síntoma es confuso: el login puede funcionar en el propio servidor pero fallar o
comportarse raro desde los celulares de la LAN.

### 5. Dejar ambos procesos corriendo de forma persistente

Correr `next start` y `caddy` como servicios `systemd` (o `pm2`), para que sobrevivan un reinicio del
equipo. No se detalla la unit file exacta aquí porque depende de cómo esté empaquetado/instalado el proyecto
en ese equipo — pedir ayuda para generarla si hace falta.

### 6. Instalar la CA raíz en cada celular/tablet (una vez por dispositivo)

Copiar `rootCA.pem` (obtenido de `mkcert -CAROOT` en el paso 2) al dispositivo — por USB, o sirviéndolo
desde el propio equipo (no es secreto, es un certificado público).

**Android:**
Ajustes → Seguridad → Más ajustes de seguridad → Cifrado y credenciales → Instalar un certificado →
Certificado de CA → seleccionar el archivo `rootCA.pem`.

**iPhone:**
1. Enviar el archivo por AirDrop o correo al propio dispositivo.
2. Abrirlo → se instala como "perfil" (Ajustes → Perfil descargado → Instalar).
3. **Paso que casi siempre se olvida y sin el cual Safari sigue rechazando la conexión**: Ajustes → General
   → Información → Confianza de certificados → activar la confianza total para esa CA.

Después de este paso, `https://192.168.1.127` se ve como un sitio seguro normal en ese dispositivo — no hay
que repetirlo hasta que el certificado expire o el dispositivo se restablezca de fábrica.

## Onboarding de un dispositivo nuevo

Cada vez que se suma un celular/tablet nuevo a la tienda (empleado nuevo, equipo nuevo), repetir **solo el
paso 6** (instalar `rootCA.pem` en ese dispositivo). No hace falta tocar el servidor ni regenerar nada.

## Mantenimiento / rotación del certificado

- Los certificados de mkcert son de larga duración (del orden de años), pero eventualmente expiran.
- Si expira: regenerar solo el certificado hoja (repetir el paso 2) y recargar Caddy (`caddy reload`). **No**
  hace falta reinstalar la CA raíz en los dispositivos — la CA raíz no cambia, solo el certificado que
  firma.
- Si la IP del servidor cambia (se perdió la reserva DHCP, cambio de router, etc.): regenerar el certificado
  para la IP nueva (paso 2) y actualizar el `Caddyfile` y `NEXTAUTH_URL`. Los dispositivos no necesitan
  ninguna acción si acceden por la IP correcta.

## Checklist de verificación

1. Desde un celular ya con la CA instalada, entrar a `https://192.168.1.127` y confirmar que el navegador lo
   muestra como sitio seguro (candado), sin advertencias.
2. Iniciar sesión desde ese celular y confirmar que el login funciona igual que antes del cambio (valida
   `NEXTAUTH_URL`).
3. Abrir `/sale/new`, tocar el botón de cámara, conceder el permiso y confirmar que la vista de cámara
   arranca sin el mensaje de error de "conexión no segura".
4. Escanear un código de barras real y confirmar que el producto se agrega a la venta igual que con el
   lector físico.
5. Confirmar que el lector físico/Bluetooth sigue funcionando exactamente igual que antes (no debería verse
   afectado por ningún cambio de este manual).
6. Reiniciar el equipo servidor y confirmar que `next start` y `caddy` vuelven a levantar solos (valida la
   configuración de servicio persistente del paso 5).

## Fuera de alcance / limitaciones conocidas

- La instalación de la CA raíz en cada dispositivo es trabajo operativo manual, no automatizable desde la
  propia aplicación Next.js.
- No se cubre aquí la configuración exacta de la unit de `systemd`/`pm2` para `next start` y `caddy` — se
  deja pendiente para cuando se ejecute el despliegue real, ya que depende de cómo está instalado el
  proyecto en ese equipo específico.
- Si en el futuro la tienda sí cuenta con internet estable y se prefiere evitar el mantenimiento de
  certificados/CA por dispositivo, la alternativa con Cloudflare Tunnel (descartada en este documento) sigue
  siendo válida y requiere mucho menos mantenimiento operativo a cambio de esa dependencia de internet.
