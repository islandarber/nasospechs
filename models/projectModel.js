import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: false }); // Avoid creating _id for subdocs if not needed

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  media: [mediaSchema],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
  roles: { type: String, required: true },
  info: String,
  featured: { type: Boolean, default: false },
  priority: { type: Number, default: 0 },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
