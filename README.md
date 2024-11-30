# UI Green Metrics

## Tecnologías Implementadas
- Node.js
- Express.js
- EJS (Sistema de plantillas)
- PostgreSQL
- Sequelize ORM
- Morgan (sistema de registro)
- Cookie-parser
- Debug

## Requisitos del Sistema
- Node.js instalado en su sistema
- PostgreSQL y pgAdmin configurados y en funcionamiento
- npm (Node Package Manager) actualizado

## Guía de Instalación

1. Diríjase al directorio del proyecto:
```bash
cd UIGREENMETRICS
```

2. Instale las dependencias necesarias:
```bash
npm install
```

3. Configure su base de datos PostgreSQL:
   - Importe la base de datos adjuntada en el zip con el nombre 'greenmetrics'
   - El el archivo 'conexion.db' unicado en 'config/db.js cambiar la linea 4 y poner la contrasena de su posgres en donde dice 'contrasena'

3. Configuración de la Base de Datos PostgreSQL

   3.1. Importación de la Base de Datos:
   - Asegúrese de tener PostgreSQL instalado y en ejecución
   - Abra pgAdmin
   - Cree una nueva base de datos llamada 'greenmetrics'
   - En la base de datos creada, haga clic derecho y seleccione "Restore"
   - Seleccione el archivo 'greenmetrics.backup' del zip proporcionado

   3.2. Configuración de la Conexión:
   - Navegue hasta el archivo de configuración `config/db.js`
   - Localice la línea 4
   - Reemplace 'contrasena' con su contraseña de PostgreSQL
   - Guarde los cambios

4. Inicie el servidor de desarrollo:
```bash
npm run dev
```

## Instrucciones de Uso

Una vez que el servidor esté en funcionamiento:

1. Abra su navegador web preferido
2. Diríjase a la dirección `http://localhost:3000/`
3. Encontrará dos secciones principales para su gestión:
   - Magnitudes
   - Unidades

### Proceso para Crear una Magnitud

1. Acceda a la sección de magnitudes
2. Complete el formulario con la siguiente información:
   - Nombre de la magnitud
   - Descripción detallada
3. Proceda a guardar el registro

### Proceso para Crear una Unidad

1. Acceda a la sección de unidades
2. Complete el formulario con la siguiente información:
   - Nombre de la unidad
   - Símbolo correspondiente
   - Seleccione la magnitud asociada
3. Proceda a guardar el registro


## Dependencias Principales

```json
{
  "cookie-parser": "~1.4.4",
  "debug": "~2.6.9",
  "ejs": "~2.6.1",
  "express": "~4.16.1",
  "http-errors": "~1.6.3",
  "morgan": "~1.9.1",
  "pg": "^8.13.1",
  "sequelize": "^6.37.5"
}
```