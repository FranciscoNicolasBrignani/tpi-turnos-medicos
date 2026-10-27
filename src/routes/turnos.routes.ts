import { Router } from "express";

import { Turno } from "../models/Turno.js";
import { Paciente } from "../models/Paciente.js";
import { Medico } from "../models/Medico.js";

const router = Router();

// Create
router.post("/", async (req, res) => {
  try {
    const {
      pacienteId,
      medicoId,
      fechaHora,
      motivo
    } = req.body;

    const paciente = await Paciente.findOne({
      _id: pacienteId,
      activo: true
    });

    if (!paciente) {
      return res.status(404).json({
        error: "Paciente inexistente o inactivo"
      });
    }

    const medico = await Medico.findOne({
      _id: medicoId,
      activo: true
    });

    if (!medico) {
      return res.status(404).json({
        error: "Médico inexistente o inactivo"
      });
    }

    const turno = await Turno.create({
      pacienteId,
      medicoId,
      fechaHora,
      motivo
    });

    res.status(201).json(turno);
  } catch {
    res.status(400).json({
      error: "No se pudo crear el turno"
    });
  }
});

// Read con populate() - Linking
router.get("/", async (_req, res) => {
  const turnos = await Turno.find({
    activo: true
  })
    .populate(
      "pacienteId",
      "nombre apellido dni"
    )
    .populate(
      "medicoId",
      "nombre apellido especialidad matricula"
    );

  res.json(turnos);
});

// Update
router.patch("/:id", async (req, res) => {
  const turno = await Turno.findOneAndUpdate(
    {
      _id: req.params.id,
      activo: true
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!turno) {
    return res.status(404).json({
      error: "Turno no encontrado"
    });
  }

  res.json(turno);
});

// Delete Lógico
router.delete("/:id", async (req, res) => {
  const turno = await Turno.findOneAndUpdate(
    {
      _id: req.params.id,
      activo: true
    },
    {
      activo: false,
      fechaBaja: new Date(),
      estado: "cancelado"
    },
    {
      new: true
    }
  );

  if (!turno) {
    return res.status(404).json({
      error: "Turno no encontrado"
    });
  }

  res.json({
    mensaje: "Turno dado de baja",
    turno
  });
});

export default router;





