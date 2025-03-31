import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Banco de dados conectado: ${conn.connection.host}`);
  } catch (error) {
    console.log("Erro ao conectar ao banco de dados", error);
    process.exit(1);
  }
};
