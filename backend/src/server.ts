import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/db';
import authRouter from './routes/authRouter';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use("/api/auth", authRouter);

const swaggerDocument = YAML.load('./openapi.yaml');
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`⚡ Server rodando em: ${PORT}`);
});
