import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';

const projectRouter = express.Router();

projectRouter.get('/', getProjects);
projectRouter.get('/:id', getProjectById);
projectRouter.post('/', createProject);
projectRouter.put('/:id', updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;

