import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
  }]
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);
