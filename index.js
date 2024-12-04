import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { connectDb } from './config/db.js';
import projectRouter from './routes/projectsRoutes.js';
import categoryRouter from './routes/categoriesRoutes.js';


const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());
app.use('/projects', projectRouter);
app.use('/categories', categoryRouter);

const startServer = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer().catch((error) => console.log('Error starting the server: ', error));


