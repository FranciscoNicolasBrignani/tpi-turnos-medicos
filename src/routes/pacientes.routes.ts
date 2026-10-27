import { Router } from "express";
import { Paciente } from "../models/Paciente.js";

const router = Router();

// Create
router.post("/", async (req, res) => {
  try {
    const paciente = await Paciente.create(req.body);

    res.status(201).json(paciente);
  } catch (error) {
    res.status(400).json({
      error: "No se pudo crear el paciente"
    });
  }
});

// Read
router.get("/", async (_req, res) => {
  try {
    const pacientes = await Paciente.find({
      activo: true
    });

    res.json(pacientes);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron obtener los pacientes"
    });
  }
});

// Read por ID
router.get("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      _id: req.params.id,
      activo: true
    });

    if (!paciente) {
      return res.status(404).json({
        error: "Paciente no encontrado"
      });
    }

    res.json(paciente);
  } catch {
    res.status(400).json({
      error: "ID inválido"
    });
  }
});

// Update
router.patch("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findOneAndUpdate(
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

    if (!paciente) {
      return res.status(404).json({
        error: "Paciente no encontrado"
      });
    }

    res.json(paciente);
  } catch {
    res.status(400).json({
      error: "No se pudo actualizar"
    });
  }
});

// Delete Lógico
router.delete("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findOneAndUpdate(
      {
        _id: req.params.id,
        activo: true
      },
      {
        activo: false,
        fechaBaja: new Date()
      },
      {
        new: true
      }
    );

    if (!paciente) {
      return res.status(404).json({
        error: "Paciente no encontrado"
      });
    }

    res.json({
      mensaje: "Paciente dado de baja correctamente",
      paciente
    });
  } catch {
    res.status(400).json({
      error: "No se pudo realizar la baja"
    });
  }
});

export default router;