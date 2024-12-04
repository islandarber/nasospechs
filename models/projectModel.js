import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  video: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  
    required: true,
  },
  info: {
    type: String,
  },
  roles: {
    type: String, 
    required: true,
  },
  additionalMedia: {
    type: [String], 
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String], 
  },
  links: {
    type: [String], 
  },
  featured: { 
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    default: 0,
  },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
