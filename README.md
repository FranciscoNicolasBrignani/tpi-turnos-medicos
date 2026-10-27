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

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- Mongoose
- MongoDB Atlas
- dotenv
- tsx
- Bash
- mongodump

## Modelo de datos

El sistema utiliza tres colecciones principales:

### Pacientes

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

### Médicos

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

La matrícula, la disponibilidad, los datos de contacto y las obras sociales aceptadas se almacenan mediante **Embedding**.

### Turnos

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

Los campos `pacienteId` y `medicoId` almacenan referencias a documentos de las colecciones `pacientes` y `medicos`.

De esta forma se implementa **Linking** entre las colecciones.

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

Todos los registros principales poseen:

```json
{
  "activo": true,
  "fechaBaja": null
}
```

Cuando se realiza una baja:

```json
{
  "activo": false,
  "fechaBaja": "fecha de la baja"
}
```

Las operaciones de lectura muestran únicamente los documentos que tienen:

```json
{
  "activo": true
}
```

En el caso de un turno dado de baja, también se modifica su estado a:

```text
cancelado
```

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

## Actualización de un turno

Ejemplo para cambiar el estado a `confirmado`:

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

La operación no elimina el documento.

El turno queda almacenado con:

```json
{
  "estado": "cancelado",
  "activo": false,
  "fechaBaja": "fecha de la baja"
}
```

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar al proyecto:

```bash
cd tpi-turnos-medicos
```

Instalar dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` a partir de `.env.example`.

Ejemplo:

```env
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/turnos_medicos
PORT=3002
```

El archivo `.env` no debe incluirse en el repositorio.

## Ejecución

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

## Backups

El proyecto contempla un script Bash encargado de realizar copias de seguridad mediante `mongodump`.

El respaldo se almacena dentro de:

```text
resguardos_tpi/
```

utilizando una subcarpeta con la fecha de ejecución.

Ejemplo:

```text
resguardos_tpi/
└── 2026-10-27/
    └── turnos_medicos/
        ├── pacientes.bson
        ├── medicos.bson
        └── turnos.bson
```

## RPO y RTO

### RPO

Se establece un RPO de **24 horas**, considerando la ejecución diaria del respaldo.

Ante una pérdida total de la base de datos, podrían perderse como máximo los cambios generados desde el último backup.

### RTO

Se establece un RTO estimado de **1 hora** para restaurar la base de datos y recuperar el funcionamiento del sistema mediante las herramientas de MongoDB.

## Autores

Trabajo realizado para la materia **Base de Datos II**.

**Tecnicatura Universitaria en Programación a Distancia - UTN**

**Grupo 24**