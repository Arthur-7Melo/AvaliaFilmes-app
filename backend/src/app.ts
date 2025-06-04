import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);

const swaggerDocument = YAML.load('./openapi.yaml');
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

export default app;
