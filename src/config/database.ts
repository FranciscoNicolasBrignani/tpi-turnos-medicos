import mongoose from "mongoose";

export async function conectarDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está definida");
  }

  await mongoose.connect(uri);

  console.log("Conexión exitosa a MongoDB Atlas");
}