import Project from '../models/projectModel.js';
import cloudinary from '../config/cloudinary.js';

// Get all projects with their categories
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('category');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('category');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path); 
    const project = new Project({
      ...req.body,
      image: result.secure_url,
    });
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  const { id } = req.params;
  let imageUrl = '';  

  try {
    // If a new image is uploaded
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'PorjectsNasos' },  // specify the folder in Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);  // uploading the image buffer
      });
      imageUrl = result.secure_url;  // The secure URL of the uploaded image
    }

    // Update the project with new data, including image if uploaded
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      { 
        ...req.body,  // spread other fields
        image: imageUrl ? imageUrl : undefined  // If no new image, don't overwrite the old image field
      }, 
      { new: true }  // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);  // Respond with the updated project
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error: error.message });
  }
};

// Delete a project
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
