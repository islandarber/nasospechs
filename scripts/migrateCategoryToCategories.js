import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/projectModel.js';  // Path to your project model

dotenv.config();  // Load .env variables

const migrateCategoryToCategories = async () => {
  try {
    // Load MongoDB URI from .env file
    const dbUri = process.env.MONGO_DB;
    if (!dbUri) {
      throw new Error("Mongo URI not found in .env file");
    }

    // Connect to MongoDB
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB...');

    // Find all projects that have the category field (which needs to be migrated)
    const projects = await Project.find({ category: { $exists: true } });
    console.log(`Found ${projects.length} projects to migrate...`);

    let updatedCount = 0;

    // Loop through all the projects and update them
    for (const project of projects) {
      // If there's a single category, make it an array
      if (project.category && !Array.isArray(project.category)) {
        project.categories = [project.category]; // Convert single category ObjectId to an array
        project.category = undefined; // Remove the old category field
      }

      // Save the updated project
      try {
        await project.save();
        updatedCount++;
        console.log(`Updated project: ${project.title}`);
      } catch (error) {
        console.error(`Error updating project ${project.title}:`, error);
      }
    }

    console.log(`Migration complete. ${updatedCount} projects updated.`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

migrateCategoryToCategories();
