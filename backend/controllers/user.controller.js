import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";
import { setAuthToken } from "../middlewares/tokenUtils.js";
import { OAuth2Client } from 'google-auth-library';

export const register = async (req, res) => {
  try {
    const {name, username, email, password, confirmPassword } = req.body;
    const file = req.file;
    console.log("req.file:", req.file); 

    if (!file) {
      res.status(400).json({
        message: "Image is Required",
        success: false,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password do not match",
        success: false,
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    console.log("Cloudinary Response:", cloudResponse);

    const newUser = await User.create({
      name,
      username,
      email,
      password,
      confirmPassword,
      avatar: cloudResponse.secure_url,
    });

    return setAuthToken(newUser, res);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({
        message: "User doesn't exists",
        success: false,
      });
    }
    if (password == user.password) {
      setAuthToken(user, res);
    } else {
      return res.status(401).json({
        message: "Please check you credentials.",
        success: false
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while logging in",
      success: false
    });
  }
}

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
          const cloudResponse = await cloudinary.uploader.upload(fileUri);
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