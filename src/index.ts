import "dotenv/config";
import express from "express";

import { conectarDB } from "./config/database.js";

import pacientesRoutes from "./routes/pacientes.routes.js";
import medicosRoutes from "./routes/medicos.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";

const app = express();

app.use(express.json());

app.use("/api/pacientes", pacientesRoutes);
app.use("/api/medicos", medicosRoutes);
app.use("/api/turnos", turnosRoutes);

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error);
    process.exit(1);
  }
}

iniciar();