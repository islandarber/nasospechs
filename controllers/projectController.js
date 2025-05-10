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

// Get projects by category id
export const getProjectsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const projects = await Project.find({ categories: categoryId }).populate('category');
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this category' });
    }
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

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).populate('category');
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No featured projects found' });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured projects', error: error.message });
    console.log(error);
  }
};

// Create a new project
export const createProject = async (req, res) => {
  try {
    // Upload image using Cloudinary's upload_stream method
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ProjectsNasos' },  // specify the folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Error uploading image to Cloudinary'));
          } else {
            resolve(result);
          }
        }
      );

      // Send the image buffer to the upload stream
      uploadStream.end(req.file.buffer);  // Upload the image buffer
    });

    // Create a new project with the uploaded image URL
    const project = new Project({
      ...req.body,
      img: result.secure_url,  // Cloudinary URL for the uploaded image
    });

    // Save the project to the database
    const newProject = await project.save();

    // Send the response with the newly created project
    res.status(201).json(newProject);
    console.log('New project created:', newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log('Error:', error.message);
  }
};

// Update a project
export const updateProject = async (req, res) => {
  const { id } = req.params;
  let imageUrl = '';  // Initialize imageUrl to store the new image URL

  try {
    // If a new image is uploaded
    if (req.file) {
      // Upload image using Cloudinary's upload_stream method
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'ProjectsNasos' },  // specify the folder in Cloudinary
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error('Error uploading image to Cloudinary'));
            } else {
              resolve(result);
            }
          }
        );

        // Send the image buffer to the upload stream
        uploadStream.end(req.file.buffer);  // Upload the image buffer
      });

      imageUrl = result.secure_url;  // Set the imageUrl to the secure URL of the uploaded image
    }

    // Update the project with new data, including image if uploaded
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      { 
        ...req.body,  // spread other fields
        img: imageUrl ? imageUrl : undefined  // If no new image, don't overwrite the old image field
      }, 
      { new: true }  // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Respond with the updated project
    res.status(200).json(updatedProject);
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
