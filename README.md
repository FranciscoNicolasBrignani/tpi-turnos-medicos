# TPI - Sistema de Turnos Médicos

Trabajo Práctico Integrador de la materia **Base de Datos II** de la Tecnicatura Universitaria en Programación a Distancia - UTN.

El proyecto consiste en una API backend para la gestión de turnos médicos utilizando **TypeScript**, **Express**, **Mongoose** y **MongoDB Atlas**.

## Objetivo

Desarrollar un sistema que permita administrar:

- Pacientes.
- Médicos.
- Turnos médicos.
- Relaciones entre pacientes, médicos y turnos.
- Bajas lógicas sin eliminar físicamente los documentos.
- Persistencia de datos en MongoDB Atlas.
- Respaldo de la base de datos mediante `mongodump`.
- Ejecución de backups mediante scripts para Linux/macOS y Windows.

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- Mongoose
- MongoDB Atlas
- dotenv
- tsx
- Bash
- Windows Batch
- MongoDB Command Line Database Tools
- `mongodump`
- `mongorestore`
- Zstandard (`zstd`) para el script de Linux

---

# Modelo de datos

El sistema utiliza tres colecciones principales:

- `pacientes`
- `medicos`
- `turnos`

## Pacientes

Contiene información personal y administrativa del paciente.

Campos principales:

- `dni`
- `nombre`
- `apellido`
- `fechaNacimiento`
- `contacto`
  - `telefono`
  - `email`
- `obraSocial`
  - `nombre`
  - `numeroAfiliado`
- `activo`
- `fechaBaja`
- `createdAt`
- `updatedAt`

Los datos de contacto y obra social se encuentran embebidos dentro del documento del paciente.

Ejemplo:

```json
{
  "dni": "30123456",
  "nombre": "Juan",
  "apellido": "Perez",
  "contacto": {
    "telefono": "2235551234",
    "email": "juan@email.com"
  },
  "obraSocial": {
    "nombre": "OSDE",
    "numeroAfiliado": "123456"
  },
  "activo": true,
  "fechaBaja": null
}
```

## Médicos

Contiene la información correspondiente a los profesionales médicos.

Campos principales:

- `nombre`
- `apellido`
- `matricula`
  - `numero`
  - `tipo`
  - `jurisdiccion`
- `especialidad`
- `disponibilidad`
- `obrasSocialesAceptadas`
- `contacto`
- `activo`
- `fechaBaja`
- `createdAt`
- `updatedAt`

La matrícula, disponibilidad, información de contacto y obras sociales aceptadas se almacenan mediante **Embedding**.

Ejemplo:

```json
{
  "nombre": "Ana",
  "apellido": "Gomez",
  "matricula": {
    "numero": "12345",
    "tipo": "provincial",
    "jurisdiccion": "Buenos Aires"
  },
  "especialidad": "Cardiologia",
  "disponibilidad": [
    {
      "dia": "lunes",
      "horaDesde": "08:00",
      "horaHasta": "12:00"
    }
  ],
  "obrasSocialesAceptadas": [
    "OSDE",
    "IOMA"
  ],
  "contacto": {
    "telefono": "2235559999",
    "email": "ana.gomez@clinica.com"
  },
  "activo": true,
  "fechaBaja": null
}
```

## Turnos

Representa la relación entre pacientes y médicos.

Campos principales:

- `pacienteId`
- `medicoId`
- `fechaHora`
- `motivo`
- `estado`
- `observaciones`
- `activo`
- `fechaBaja`
- `createdAt`
- `updatedAt`

Los campos `pacienteId` y `medicoId` almacenan referencias a documentos pertenecientes a las colecciones `pacientes` y `medicos`.

De esta forma se implementa **Linking** entre las colecciones.

Ejemplo:

```json
{
  "pacienteId": "ObjectId",
  "medicoId": "ObjectId",
  "fechaHora": "2026-11-10T13:30:00.000Z",
  "motivo": "Control cardiologico",
  "estado": "pendiente",
  "activo": true,
  "fechaBaja": null
}
```

---

# Embedding y Linking

## Embedding

Se utiliza Embedding para almacenar información que pertenece directamente a una entidad y que normalmente se consulta junto con ella.

Ejemplos:

- Datos de contacto de un paciente.
- Obra social de un paciente.
- Matrícula de un médico.
- Disponibilidad de un médico.
- Obras sociales aceptadas por un médico.

## Linking

Se utiliza Linking para relacionar entidades independientes.

La colección `turnos` contiene referencias a:

- `pacienteId` → colección `pacientes`.
- `medicoId` → colección `medicos`.

Esto permite evitar duplicación de información y mantener separados los datos de cada entidad.

Mongoose permite recuperar la información relacionada mediante `populate()`.

---

# Baja lógica

El sistema no elimina físicamente los documentos.

Todos los registros principales poseen inicialmente:

```json
{
  "activo": true,
  "fechaBaja": null
}
```

Cuando se realiza una baja lógica:

```json
{
  "activo": false,
  "fechaBaja": "fecha de la baja"
}
```

Las operaciones de lectura muestran únicamente documentos que posean:

```json
{
  "activo": true
}
```

En el caso de un turno dado de baja, también se modifica su estado a:

```text
cancelado
```

De esta forma el documento continúa almacenado en MongoDB, pero deja de aparecer en las consultas normales de la aplicación.

---

# Estados de los turnos

Los estados posibles son:

- `pendiente`
- `confirmado`
- `atendido`
- `cancelado`

---

# API REST

La aplicación se ejecuta por defecto en:

```text
http://localhost:3002
```

## Pacientes

```text
POST   /api/pacientes
GET    /api/pacientes
GET    /api/pacientes/:id
PATCH  /api/pacientes/:id
DELETE /api/pacientes/:id
```

## Médicos

```text
POST   /api/medicos
GET    /api/medicos
GET    /api/medicos/:id
PATCH  /api/medicos/:id
DELETE /api/medicos/:id
```

## Turnos

```text
POST   /api/turnos
GET    /api/turnos
GET    /api/turnos/:id
PATCH  /api/turnos/:id
DELETE /api/turnos/:id
```

---

# Ejemplo de creación de un paciente

```bash
curl -X POST http://localhost:3002/api/pacientes \
-H "Content-Type: application/json" \
-d '{
  "dni":"30123456",
  "nombre":"Juan",
  "apellido":"Perez",
  "contacto":{
    "telefono":"2235551234",
    "email":"juan@email.com"
  },
  "obraSocial":{
    "nombre":"OSDE",
    "numeroAfiliado":"123456"
  }
}'
```

# Ejemplo de creación de un médico

```bash
curl -X POST http://localhost:3002/api/medicos \
-H "Content-Type: application/json" \
-d '{
  "nombre":"Ana",
  "apellido":"Gomez",
  "matricula":{
    "numero":"12345",
    "tipo":"provincial",
    "jurisdiccion":"Buenos Aires"
  },
  "especialidad":"Cardiologia",
  "disponibilidad":[
    {
      "dia":"lunes",
      "horaDesde":"08:00",
      "horaHasta":"12:00"
    }
  ],
  "obrasSocialesAceptadas":[
    "OSDE",
    "IOMA"
  ],
  "contacto":{
    "telefono":"2235559999",
    "email":"ana.gomez@clinica.com"
  }
}'
```

# Ejemplo de creación de un turno

```bash
curl -X POST http://localhost:3002/api/turnos \
-H "Content-Type: application/json" \
-d '{
  "pacienteId":"ID_PACIENTE",
  "medicoId":"ID_MEDICO",
  "fechaHora":"2026-11-10T10:30:00-03:00",
  "motivo":"Control cardiologico"
}'
```

# Consulta de turnos

```bash
curl http://localhost:3002/api/turnos
```

La consulta utiliza `populate()` para mostrar los datos relacionados del paciente y del médico.

# Actualización de un turno

```bash
curl -X PATCH http://localhost:3002/api/turnos/ID_TURNO \
-H "Content-Type: application/json" \
-d '{
  "estado":"confirmado"
}'
```

# Baja lógica de un turno

```bash
curl -X DELETE http://localhost:3002/api/turnos/ID_TURNO
```

La operación no elimina físicamente el documento.

El turno queda almacenado con:

```json
{
  "estado": "cancelado",
  "activo": false,
  "fechaBaja": "fecha de la baja"
}
```

---

# Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar al proyecto:

```bash
cd tpi-turnos-medicos
```

Instalar las dependencias:

```bash
npm install
```

---

# Dependencias externas para los backups

Además de las dependencias instaladas mediante `npm`, los scripts de respaldo requieren herramientas de línea de comandos instaladas en el sistema operativo.

## MongoDB Command Line Database Tools

Los scripts utilizan principalmente:

```text
mongodump
mongorestore
```

Estas utilidades forman parte de **MongoDB Command Line Database Tools**.

No es necesario instalar MongoDB Server localmente para disponer de estas herramientas.

Si la base de datos se encuentra alojada en MongoDB Atlas y solamente se requieren las utilidades de backup y restauración, puede instalarse únicamente la suite MongoDB Database Tools.

Descarga oficial:

https://www.mongodb.com/try/download/database-tools

Desde el sitio oficial puede seleccionarse:

- versión;
- sistema operativo o distribución;
- arquitectura;
- formato del paquete.

Después de la instalación puede comprobarse:

```bash
mongodump --version
mongorestore --version
```

En Windows:

```bat
mongodump --version
mongorestore --version
```

Si el comando no es reconocido, debe verificarse que el directorio que contiene MongoDB Database Tools se encuentre incluido en la variable de entorno `PATH`.

## Zstandard

El script `backup.sh` para Linux comprime los respaldos utilizando Zstandard.

En Debian puede instalarse mediante:

```bash
sudo apt install zstd
```

Verificación:

```bash
zstd --version
```

---

# Variables de entorno

Crear un archivo `.env` a partir de `.env.example`.

Ejemplo:

```env
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/turnos_medicos
PORT=3002
```

El archivo `.env` contiene información sensible y no debe incluirse en el repositorio.

El archivo `.gitignore` debe contener:

```gitignore
node_modules/
dist/
.env
resguardos_tpi/
```

---

# Ejecución de la aplicación

```bash
npm run dev
```

Salida esperada:

```text
Conexión exitosa a MongoDB Atlas
Servidor ejecutándose en http://localhost:3002
```

---

# Estructura del proyecto

```text
tpi-turnos-medicos/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   ├── Paciente.ts
│   │   ├── Medico.ts
│   │   └── Turno.ts
│   ├── routes/
│   │   ├── pacientes.routes.ts
│   │   ├── medicos.routes.ts
│   │   └── turnos.routes.ts
│   └── index.ts
├── scripts/
│   ├── backup.sh
│   └── backup.bat
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

# MongoDB Atlas

La aplicación utiliza MongoDB Atlas como servicio remoto de base de datos.

La base utilizada es:

```text
turnos_medicos
```

Colecciones:

```text
pacientes
medicos
turnos
```

La configuración de Atlas contempla:

- Database Access.
- Network Access.
- Cluster remoto.
- Usuario de base de datos.
- URI de conexión mediante `mongodb+srv://`.

---

# Backups

El proyecto incluye dos scripts:

```text
scripts/
├── backup.sh
└── backup.bat
```

## Backup en Linux/macOS

El script:

```text
scripts/backup.sh
```

realiza un respaldo mediante `mongodump` y posteriormente comprime el resultado utilizando `tar` y Zstandard.

Los backups se almacenan en:

```text
resguardos_tpi/
```

y utilizan fecha y hora para evitar sobrescribir respaldos realizados durante el mismo día.

Ejemplo:

```text
resguardos_tpi/
├── backup_2026-10-27_12-45-10.tar.zst
└── backup_2026-10-27_18-30-05.tar.zst
```

Antes de ejecutarlo debe cargarse la variable:

```bash
export $(grep -v '^#' .env | xargs)
```

Puede ser necesario otorgar permisos:

```bash
chmod +x scripts/backup.sh
```

Ejecución:

```bash
./scripts/backup.sh
```

El script realiza:

1. Obtención de fecha y hora.
2. Creación de un directorio temporal.
3. Ejecución de `mongodump`.
4. Generación de archivos BSON y metadatos.
5. Compresión mediante `tar` y `zstd`.
6. Generación de archivo `.tar.zst`.
7. Eliminación del directorio temporal.

---

# Backup en Windows

El archivo:

```text
scripts\backup.bat
```

realiza un respaldo utilizando `mongodump`.

El script obtiene:

- la fecha actual;
- la hora actual;

y utiliza ambos valores para generar un nombre diferente para cada respaldo.

El funcionamiento actual del script es:

1. Obtiene la fecha.
2. Obtiene la hora.
3. Formatea la hora para poder utilizarla en el nombre de la carpeta.
4. Genera una ruta relativa para el respaldo.
5. Crea automáticamente el directorio.
6. Ejecuta `mongodump`.
7. Guarda el contenido generado por MongoDB Database Tools dentro del directorio correspondiente.
8. Muestra un mensaje cuando el backup finaliza.

La estructura generada sigue el esquema definido en el script `backup.bat`, utilizando la fecha y la hora para diferenciar respaldos realizados el mismo día.

Ejemplo conceptual:

```text
resguardostpi2026-10-2718-30-45/
└── sistema_turnos_odm/
    ├── pacientes.bson
    ├── pacientes.metadata.json
    ├── medicos.bson
    ├── medicos.metadata.json
    ├── turnos.bson
    └── turnos.metadata.json
```

El script requiere que `mongodump` esté disponible desde la línea de comandos de Windows.

Puede comprobarse mediante:

```bat
mongodump --version
```

Ejecución:

```bat
scripts\backup.bat
```

### Consideración de seguridad

La versión actual del script de Windows contiene la cadena de conexión a MongoDB Atlas directamente en el comando `mongodump`.

Para una implementación en producción sería recomendable utilizar una variable de entorno o un mecanismo externo de configuración para evitar almacenar las credenciales dentro del script.

En el contexto del TPI, esta sección documenta el funcionamiento actual del archivo `backup.bat`.

---

# Restauración

Los archivos generados por `mongodump` pueden restaurarse utilizando:

```text
mongorestore
```

Ejemplo conceptual en Linux:

```bash
mongorestore \
  --uri="$MONGODB_URI" \
  RUTA_DEL_BACKUP/turnos_medicos
```

En Windows:

```bat
mongorestore --uri="URI_MONGODB" RUTA_DEL_BACKUP\sistema_turnos_odm
```

La restauración debe realizarse cuidadosamente para evitar sobrescribir información existente de forma involuntaria.

---

# RPO y RTO

## RPO

Se establece un RPO de **24 horas**, considerando una política de ejecución diaria del respaldo.

Esto significa que ante una pérdida total de los datos podrían perderse como máximo los cambios realizados desde el último backup.

## RTO

Se establece un RTO estimado de **1 hora**.

Este tiempo contempla:

- restauración mediante `mongorestore`;
- comprobación de los documentos restaurados;
- verificación de la conexión de la aplicación;
- recuperación del funcionamiento normal del sistema.

---

# Seguridad

El archivo `.env` de la aplicación no debe almacenarse en el repositorio debido a que contiene la URI y las credenciales utilizadas para acceder a MongoDB Atlas.

Por esta razón se utiliza:

```text
.env.example
```

como referencia de las variables necesarias para ejecutar el proyecto.

Ejemplo:

```env
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/turnos_medicos
PORT=3002
```

---

# Autores

Trabajo realizado para la materia **Base de Datos II**.

**Tecnicatura Universitaria en Programación a Distancia - UTN**

- Nombre Apellido 1
- Nombre Apellido 2
- Nombre Apellido 3

**Grupo 24**