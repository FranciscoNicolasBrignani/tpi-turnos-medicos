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