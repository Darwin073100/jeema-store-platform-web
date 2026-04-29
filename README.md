# JEEMA Store Platform Web

## Tecnologías utilizadas
- Nextjs v15
- Reactjs v19
- PNPM v10
- Typeorm V0.3.28
- pg V8.20

## Comandos a ejecutar
### Crear la base de datos 
Crea la base de datos para el sistema, asegurate de escribir el nombre de la base de datos como `jeema_platform_db`.

### Configurar variables de entorno 
Copiar y renombrar el __.env.template__ a un __.env__ y cambiar los valores de las propiedades si es necesario.

### Ejecutar las migraciones de la base de batos
``` sh
# Este script corre las migraciones
pnpm run migration:run
# Este script crea una migración despues de haber modificado una entidad de TypeOrm
pnpm run migration:generate <migration_name>
# Este script revierte la ultima migración
pnpm run migration:revert
``` 
### Ejecuta el script sql inicial
En la ruta `src/configuration/database/typeorm/scripts/initial-data-postgres-script.sql` ingresa a PGAdmin, selecciona el servidor correspondiente y en la base de datos `jeema_platform_db` dale ejecutar un script, copias y pegas el contenido del archivo y ejecuta el script o preciona `F5`.

### Instala el manejador de paquetes __pnpm__
``` bash
npm install -g pnpm 
``` 

### Instalar las dependencias del proyecto
``` bash
pnpm install 
``` 

### Inicia el proyecto
``` bash
# Compila la aplicación para producción
pnpm run build
# Corre la aplicación de producción
pnpm run start
# Corre la aplicacion en desarrollo
pnpm run build
```