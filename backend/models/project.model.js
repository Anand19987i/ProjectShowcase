import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid"
const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: { type: String, default: uuidv4, unique: true },
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
      enum: ['frontend', 'backend', 'both'],
      required: true,
    },
    frontendFile: {
      type: String,
      required: function () {
        return this.projectType === 'frontend' || this.projectType === 'both';
      },
    },
    backendFile: {
      type: String,
      required: function () {
        return this.projectType === 'backend' || this.projectType === 'both';
      },
    },
    thumbnails: {
      type: [String],
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
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    views: {
      type: Number,
      default: 0
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
