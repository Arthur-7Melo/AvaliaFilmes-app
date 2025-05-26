import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/db';
import authRouter from './routes/authRouter';

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`⚡ Server rodando em: ${PORT}`);
});
