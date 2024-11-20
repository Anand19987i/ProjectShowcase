import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a 'User' model, linking the project to a user
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      projectGenre: {
        type: String,
        required: true,
      },
      projectType: {
        type: String,
        enum: ['frontend', 'backend', 'both'], // You can adjust types as needed
        required: true,
      },
      frontendFile: {
        type: String, // URL to Cloudinary or external storage
        required: function() {
          return this.projectType === 'frontend' || this.projectType === 'both';
        },
      },
      backendFile: {
        type: String, // URL to Cloudinary or external storage
        required: function() {
          return this.projectType === 'backend' || this.projectType === 'both';
        },
      },
      thumbnails: {
        type: [String], // Array of URLs to Cloudinary images or local image storage
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true, // Automatically handles createdAt and updatedAt
    }
  );
  
  // Create and export the model
export const Project = mongoose.model('Project', projectSchema);