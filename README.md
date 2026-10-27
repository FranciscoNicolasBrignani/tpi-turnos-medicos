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
- Respaldo de la base de datos mediante `mongodump`.
- Compresión de los respaldos mediante Zstandard.

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- Mongoose
- MongoDB Atlas
- dotenv
- tsx
- Bash
- MongoDB Database Tools
- mongodump
- mongorestore
- Zstandard (`zstd`)

## Modelo de datos

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

## Embedding y Linking

### Embedding

Se utiliza Embedding para almacenar información que pertenece directamente a una entidad y que normalmente se consulta junto con ella.

Ejemplos:

- Datos de contacto de un paciente.
- Obra social de un paciente.
- Matrícula de un médico.
- Disponibilidad de un médico.
- Obras sociales aceptadas por un médico.

### Linking

Se utiliza Linking para relacionar entidades independientes.

La colección `turnos` contiene referencias a:

- `pacienteId` → colección `pacientes`.
- `medicoId` → colección `medicos`.

Esto permite evitar duplicación de información y mantener separados los datos de cada entidad.

Mongoose permite recuperar la información relacionada mediante `populate()`.

## Baja lógica

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

## Estados de los turnos

Los estados posibles son:

- `pendiente`
- `confirmado`
- `atendido`
- `cancelado`

## API REST

La aplicación se ejecuta por defecto en:

```text
http://localhost:3002
```

### Pacientes

```text
POST   /api/pacientes
GET    /api/pacientes
GET    /api/pacientes/:id
PATCH  /api/pacientes/:id
DELETE /api/pacientes/:id
```

### Médicos

```text
POST   /api/medicos
GET    /api/medicos
GET    /api/medicos/:id
PATCH  /api/medicos/:id
DELETE /api/medicos/:id
```

### Turnos

```text
POST   /api/turnos
GET    /api/turnos
GET    /api/turnos/:id
PATCH  /api/turnos/:id
DELETE /api/turnos/:id
```

## Ejemplo de creación de un paciente

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

## Ejemplo de creación de un médico

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

## Ejemplo de creación de un turno

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

## Consulta de turnos

```bash
curl http://localhost:3002/api/turnos
```

La consulta utiliza `populate()` para mostrar los datos relacionados del paciente y del médico.

Ejemplo conceptual:

```json
[
  {
    "pacienteId": {
      "_id": "...",
      "dni": "30123456",
      "nombre": "Juan",
      "apellido": "Perez"
    },
    "medicoId": {
      "_id": "...",
      "nombre": "Ana",
      "apellido": "Gomez",
      "especialidad": "Cardiologia",
      "matricula": {
        "numero": "12345",
        "tipo": "provincial",
        "jurisdiccion": "Buenos Aires"
      }
    },
    "estado": "pendiente",
    "activo": true
  }
]
```

## Actualización de un turno

Ejemplo para cambiar el estado del turno a `confirmado`:

```bash
curl -X PATCH http://localhost:3002/api/turnos/ID_TURNO \
-H "Content-Type: application/json" \
-d '{
  "estado":"confirmado"
}'
```

## Baja lógica de un turno

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

Luego, al realizar:

```bash
curl http://localhost:3002/api/turnos
```

los turnos inactivos no son mostrados.

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar al proyecto:

```bash
cd tpi-turnos-medicos
```

Instalar las dependencias de Node.js:

```bash
npm install
```

## Dependencias externas

Además de las dependencias instaladas mediante `npm`, para utilizar el mecanismo de respaldo es necesario contar con algunas herramientas instaladas en el sistema operativo.

### MongoDB Database Tools

El paquete MongoDB Database Tools contiene, entre otras, las utilidades:

```text
mongodump
mongorestore
```

Puede comprobarse la instalación mediante:

```bash
mongodump --version
```

y:

```bash
mongorestore --version
```

### Zstandard

El script de backup comprime los respaldos utilizando Zstandard.

En Debian puede instalarse mediante:

```bash
sudo apt install zstd
```

Puede comprobarse mediante:

```bash
zstd --version
```

## Variables de entorno

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

## Ejecución de la aplicación

Modo desarrollo:

```bash
npm run dev
```

Salida esperada:

```text
Conexión exitosa a MongoDB Atlas
Servidor ejecutándose en http://localhost:3002
```

## Estructura del proyecto

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
│   └── backup.sh
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## MongoDB Atlas

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

## Backups

El proyecto incluye un script Bash ubicado en:

```text
scripts/backup.sh
```

que permite realizar copias de seguridad de MongoDB Atlas mediante `mongodump`.

El backup utiliza una ruta relativa y almacena los archivos dentro del directorio:

```text
resguardos_tpi/
```

### Requisitos

Antes de ejecutar el script debe estar disponible:

- `mongodump`
- `tar`
- `zstd`
- Bash

Puede comprobarse mediante:

```bash
mongodump --version
zstd --version
```

### Variable de conexión

El script utiliza la variable:

```text
MONGODB_URI
```

definida en `.env`.

Antes de ejecutar el respaldo puede cargarse la variable de entorno mediante:

```bash
export $(grep -v '^#' .env | xargs)
```

### Permisos

La primera vez puede ser necesario otorgar permisos de ejecución:

```bash
chmod +x scripts/backup.sh
```

### Ejecución

Desde la raíz del proyecto:

```bash
./scripts/backup.sh
```

### Nombre de los respaldos

Cada respaldo incluye la fecha y hora de ejecución.

Ejemplo:

```text
backup_2026-10-27_12-45-10.tar.zst
```

Esto permite realizar múltiples copias de seguridad durante el mismo día sin sobrescribir respaldos anteriores.

La estructura resultante puede ser:

```text
resguardos_tpi/
├── backup_2026-10-27_12-45-10.tar.zst
├── backup_2026-10-27_15-30-25.tar.zst
└── backup_2026-10-27_20-12-41.tar.zst
```

## Funcionamiento del backup

El script realiza las siguientes operaciones:

1. Obtiene la fecha y hora actual.
2. Crea un directorio temporal dentro de `resguardos_tpi`.
3. Ejecuta `mongodump` utilizando la URI de MongoDB Atlas.
4. Genera los archivos BSON y los metadatos de las colecciones.
5. Comprime el respaldo mediante `tar` y Zstandard.
6. Genera un archivo `.tar.zst`.
7. Elimina el directorio temporal una vez finalizada correctamente la compresión.

## Consultar un backup sin extraerlo

Puede visualizarse el contenido mediante:

```bash
tar --zstd -tf resguardos_tpi/backup_FECHA_HORA.tar.zst
```

## Extracción de un backup

Crear un directorio para la extracción:

```bash
mkdir restauracion
```

Extraer el archivo:

```bash
tar --zstd -xf \
  resguardos_tpi/backup_FECHA_HORA.tar.zst \
  -C restauracion
```

Luego podrán encontrarse los archivos generados originalmente por `mongodump`.

## Restauración

Los datos extraídos pueden restaurarse mediante `mongorestore`.

Ejemplo conceptual:

```bash
mongorestore \
  --uri="$MONGODB_URI" \
  RUTA_DEL_BACKUP_EXTRAIDO/turnos_medicos
```

La restauración debe realizarse cuidadosamente para evitar sobrescribir información existente de forma involuntaria.

## RPO y RTO

### RPO

Se establece un RPO de **24 horas**, considerando una política de ejecución diaria del respaldo.

Esto significa que, ante una pérdida total de los datos, podrían perderse como máximo los cambios realizados desde el último backup.

### RTO

Se establece un RTO estimado de **1 hora**.

Este tiempo contempla la extracción del respaldo, la ejecución de `mongorestore`, la comprobación de los documentos restaurados y la recuperación del funcionamiento normal de la aplicación.

## Seguridad

El archivo `.env` no debe almacenarse en el repositorio debido a que contiene la URI y las credenciales utilizadas para acceder a MongoDB Atlas.

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

## Autores

Trabajo realizado para la materia **Base de Datos II**.

**Tecnicatura Universitaria en Programación a Distancia - UTN**

- Nombre Apellido 1
- Nombre Apellido 2
- Nombre Apellido 3

**Grupo 24**