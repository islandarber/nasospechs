import express from 'express';
import {upload} from '../middlewares/multer.js';
import { getProjects, getProjectById, getProjectsByCategory, createProject, updateProject, deleteProject, getFeaturedProjects } from '../controllers/projectController.js';

const projectRouter = express.Router();

projectRouter.get('/', getProjects);
projectRouter.get('/featured', getFeaturedProjects);
projectRouter.get('/category/:categoryId', getProjectsByCategory);
projectRouter.post('/',upload.single('img'), createProject);
projectRouter.get('/:id', getProjectById);
projectRouter.put('/:id',upload.single('img'), updateProject);
projectRouter.delete('/:id', deleteProject);

export default projectRouter;

