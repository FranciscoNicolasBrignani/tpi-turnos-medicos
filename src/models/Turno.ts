import mongoose, { Schema } from "mongoose";

const turnoSchema = new Schema(
  {
    pacienteId: {
      type: Schema.Types.ObjectId,
      ref: "Paciente",
      required: true
    },

    medicoId: {
      type: Schema.Types.ObjectId,
      ref: "Medico",
      required: true
    },

    fechaHora: {
      type: Date,
      required: true
    },

    motivo: {
      type: String
    },

    estado: {
      type: String,
      enum: [
        "pendiente",
        "confirmado",
        "atendido",
        "cancelado"
      ],
      default: "pendiente"
    },

    observaciones: {
      type: String
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

export const Turno = mongoose.model(
  "Turno",
  turnoSchema
);