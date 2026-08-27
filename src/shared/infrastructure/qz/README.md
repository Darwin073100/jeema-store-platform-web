# Firma de mensajes QZ Tray

Infraestructura transversal (fuera de cualquier bounded context) para que el navegador pueda
imprimir automáticamente vía [QZ Tray](https://qz.io/) sin que el usuario tenga que aceptar un
popup de confianza cada vez que abre una sesión.

QZ Tray funciona así:

1. El cliente carga el certificado público con `qz.security.setCertificatePromise(...)`, apuntando
   al asset estático servido en `/qz/digital-certificate.txt` (carpeta `public/qz/`).
2. Cada vez que el cliente manda un mensaje a QZ Tray (conectar, listar impresoras, imprimir), QZ le
   pide al navegador que firme el mensaje. El navegador llama a `qz.security.setSignaturePromise(...)`,
   que a su vez debe invocar un endpoint del backend que firme el string con la clave privada
   correspondiente al certificado cargado en el paso 1, usando `SHA1withRSA`.
3. El endpoint de firma es la Server Action `signQzMessageAction` (`sign-qz-message.action.ts`), que
   usa `crypto.createSign('SHA1')`.

## Clave privada — desarrollo vs producción

**Nunca** se hardcodea una clave privada en el código ni se manda al bundle del cliente. Se lee en
runtime desde variables de entorno:

- `QZ_PRIVATE_KEY_PATH` — ruta a un archivo `.pem` con la clave privada RSA.
- `QZ_PRIVATE_KEY` — alternativa: el contenido PEM completo como string (tiene prioridad sobre
  `QZ_PRIVATE_KEY_PATH` si ambas están definidas). Útil para secret managers que solo inyectan
  variables de entorno, no archivos (Vercel, etc).

### Desarrollo

Este directorio incluye un par de claves **autofirmado de desarrollo**, generado localmente con
OpenSSL (no es una clave real de producción, no representa ninguna identidad verificada):

```bash
openssl req -x509 -newkey rsa:2048 -keyout private-key.dev.pem -out digital-certificate.dev.pem \
  -days 3650 -nodes -sha256 \
  -subj "/C=MX/ST=Dev/L=Dev/O=JEEMA Store Platform (DEV ONLY)/OU=QZ Tray Dev Signing/CN=jeema-store-platform-dev"
```

- `dev-keys/private-key.dev.pem` — clave privada. **Nunca se commitea** (`*.pem` está en
  `.gitignore` a nivel de todo el repo). Cada desarrollador debe generar la suya con el comando de
  arriba, o pedir el par compartido de desarrollo por un canal seguro.
- `dev-keys/digital-certificate.dev.pem` — certificado público correspondiente. Tampoco se commitea
  desde aquí (mismo patrón `*.pem`), pero su contenido se copió a `public/qz/digital-certificate.txt`
  (ese sí se commitea — es información pública, es lo que el navegador carga vía
  `setCertificatePromise`).

`.env` local ya apunta a `QZ_PRIVATE_KEY_PATH=src/shared/infrastructure/qz/dev-keys/private-key.dev.pem`.
Si regeneras el par de claves, el certificado público en `public/qz/digital-certificate.txt` debe
regenerarse junto con él (deben ser pareja) — vuelve a copiar `digital-certificate.dev.pem` sobre
`public/qz/digital-certificate.txt`.

### Producción

QZ Tray solo evita el popup de confianza si el certificado está en su lista de confianza o si el
usuario lo importó manualmente una vez por equipo. Dos opciones:

1. Comprar un certificado firmado por QZ Industries (evita el paso manual de importar confianza en
   cada caja).
2. Usar un certificado autofirmado real de producción (no el de desarrollo de este repo) e importar
   manualmente su confianza una vez en cada equipo donde corra QZ Tray.

En cualquier caso, la clave privada de producción se inyecta vía `QZ_PRIVATE_KEY` (o
`QZ_PRIVATE_KEY_PATH` apuntando a un archivo montado de forma segura) desde el gestor de secretos del
entorno de despliegue — nunca se guarda en el repositorio.
