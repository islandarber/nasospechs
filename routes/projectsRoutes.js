import express from 'express';
import {upload} from '../middlewares/multer.js';
import { getProjects, getProjectById, getProjectsByCategory, createProject, updateProject, deleteProject, getFeaturedProjects } from '../controllers/projectController.js';

const projectRouter = express.Router();

projectRouter.get('/', getProjects);
projectRouter.get('/featured', getFeaturedProjects);
projectRouter.get('/category/:categoryId', getProjectsByCategory);
projectRouter.get('/:id', getProjectById);
projectRouter.post('/', upload.array('mediaFiles'), createProject);
projectRouter.put('/:id', upload.array('mediaFiles'), updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;

