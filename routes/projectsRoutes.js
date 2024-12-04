import express from 'express';
import {upload} from '../middlewares/multer.js';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';

const projectRouter = express.Router();

projectRouter.get('/', getProjects);
projectRouter.get('/:id', getProjectById);
projectRouter.post('/',upload.single('img'), createProject);
projectRouter.put('/:id',upload.single('img'), updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;

