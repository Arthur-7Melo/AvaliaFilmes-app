import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log("Conectado ao mongoDB")
  } catch (error) {
    console.error("Mongodb connection error: ", error)
    process.exit(1);
  }
}