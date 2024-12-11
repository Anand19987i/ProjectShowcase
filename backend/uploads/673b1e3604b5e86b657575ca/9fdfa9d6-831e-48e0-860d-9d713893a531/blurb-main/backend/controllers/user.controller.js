import express from "express";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";
import { setAuthToken } from "../config/tokenUtils.js";
import { OAuth2Client } from 'google-auth-library';
import { Post } from "../models/post.model.js";

const client = new OAuth2Client(process.env.CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const file = req.file;

    // Error handling for file and password mismatch
    if (!file) {
      return res.status(400).json({
        message: "File is required",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Handle file upload to cloud
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      avatar: cloudResponse.secure_url,
    });

    // Set the auth token and send the response
    return setAuthToken(newUser, res); // This sends the response, no need to send another one in register
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({
        message: "User doesn't exist",
        success: false
      });
    }
    if (password === user.password) {
      setAuthToken(user, res);
    } else {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while logging in",
      success: false
    });
  }
};


export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false
    });
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;
  console.log("Received Token:", token);  // Log the token


  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const cloudinaryResult = await cloudinary.uploader.upload(picture, {
        folder: 'user_avatars',
        public_id: `avatar_${email}`,
        overwrite: true,
      });

      // Create new user in the database
      user = await User.create({
        name,
        email,
        password: 'google-login',
        confirmPassword: 'google-login',
        avatar: cloudinaryResult.secure_url,
      });
    }

    setAuthToken(user, res);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: 'Invalid Google token' });
  }
};


export const updateProfile = async (req, res) => {
  try {
      const userId = req.params.id; // Use userId from URL params
      const { name, email } = req.body;
      const file = req.file;
      console.log("UserId:", userId);  // Log userId
      console.log("Request Body:", req.body);  // Log request body
      console.log("File received:", file);  // Log file

      let user = await User.findById(userId);
      if (!user) {
          return res.status(400).json({ message: "User not found." });
      }

      if (name) user.name = name;
      if (email) user.email = email;

      if (file) {
          const fileUri = getDataUri(file);
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
          console.log("Cloudinary Response:", cloudResponse);  // Check Cloudinary response
          if (cloudResponse) {
              user.avatar = cloudResponse.secure_url;
          }
      }

      await user.save();

      return res.status(200).json({
          message: "Profile updated successfully",
          success: true,
      });
  } catch (error) {
      console.error("Error during profile update:", error);
      return res.status(500).json({
          message: "Internal Server error",
          success: false
      });
  }
};

export const search = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    }).select('name avatar');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching for users" });
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ userId: userId }); // Get posts by user
    res.json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};