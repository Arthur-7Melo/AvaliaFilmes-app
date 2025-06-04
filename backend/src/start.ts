import { connectDB } from './db/db';
import app from './app';

connectDB();

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`⚡ Server rodando em: ${PORT}`);
});