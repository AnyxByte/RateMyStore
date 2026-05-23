
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import { initDB } from './config/db.js';
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json()); 

await initDB();

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "Healthy",
    message: "Backend is running smoothly and connected to NeonDB."
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke on the server side!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});