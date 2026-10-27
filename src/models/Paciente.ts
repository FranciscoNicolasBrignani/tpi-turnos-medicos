import mongoose, { Schema } from "mongoose";

const pacienteSchema = new Schema(
  {
    dni: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
    },

    apellido: {
      type: String,
      required: true,
      trim: true
    },

    fechaNacimiento: {
      type: Date
    },

    contacto: {
      telefono: {
        type: String
      },
      email: {
        type: String
      }
    },

    obraSocial: {
      nombre: {
        type: String
      },
      numeroAfiliado: {
        type: String
      }
    },

    activo: {
      type: Boolean,
      default: true
    },

    fechaBaja: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Paciente = mongoose.model(
  "Paciente",
  pacienteSchema
);