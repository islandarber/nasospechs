import Project from '../models/projectModel.js';
import cloudinary from '../config/cloudinary.js';

// Get all projects with their categories
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('categories');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

export const getProjectsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const projects = await Project.find({ categories: categoryId }).populate('categories');
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this category' });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('categories');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).populate('categories');
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No featured projects found' });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured projects', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const media = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'ProjectsNasos' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });

        media.push({ type: 'image', url: result.secure_url });
      }
    }

    if (Array.isArray(req.body.media)) {
      for (const item of req.body.media) {
        if (typeof item === 'string' && item.startsWith('http')) {
          const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item);
          media.push({ type: isImage ? 'image' : 'video', url: item });
        }
      }
    } else if (typeof req.body.media === 'string' && req.body.media.startsWith('http')) {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(req.body.media);
      media.push({ type: isImage ? 'image' : 'video', url: req.body.media });
    }

    const project = new Project({
      ...req.body,
      media,
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMedia = [];

    if (Array.isArray(req.body.media)) {
      for (const item of req.body.media) {
        if (typeof item === 'string' && item.startsWith('http')) {
          const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item);
          updatedMedia.push({ type: isImage ? 'image' : 'video', url: item });
        }
      }
    } else if (typeof req.body.media === 'string' && req.body.media.startsWith('http')) {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(req.body.media);
      updatedMedia.push({ type: isImage ? 'image' : 'video', url: req.body.media });
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'ProjectsNasos' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });

        updatedMedia.push({ type: 'image', url: result.secure_url });
      }
    }

    const updateData = {
      ...req.body,
      media: updatedMedia,
    };

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting project', error: error.message });
  }
};
