import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  video: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
  roles: { type: String, required: true },
  info: String,
  additionalMedia: [String],
  tags: [String],
  links: [String],
  featured: { type: Boolean, default: false },
  priority: { type: Number, default: 0 },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
