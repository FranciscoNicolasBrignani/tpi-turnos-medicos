import mongoose, { Schema } from "mongoose";

const medicoSchema = new Schema(
  {
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

    matricula: {
      numero: {
        type: String,
        required: true
      },

      tipo: {
        type: String,
        enum: ["nacional", "provincial"],
        required: true
      },

      jurisdiccion: {
        type: String
      }
    },

    especialidades: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "El medico tiene que tener al menos una especialidad"
      }
    },

    disponibilidad: [
      {
        dia: String,
        horaDesde: String,
        horaHasta: String
      }
    ],

    obrasSocialesAceptadas: [
      {
        type: String
      }
    ],

    contacto: {
      telefono: String,
      email: String
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

export const Medico = mongoose.model(
  "Medico",
  medicoSchema
);