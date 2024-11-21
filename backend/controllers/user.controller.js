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

export const followUser = async (req, res) => {
  try {
    const { userId, followId } = req.body;  // userId: logged-in user, followId: user to be followed
    
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);
    
    if (!user || !followUser) {
      return res.status(404).json({ message: "User(s) not found" });
    }

    // Check if the user is already following
    if (user.following.includes(followId)) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    // Add to following and followers arrays
    user.following.push(followId);
    followUser.followers.push(userId);

    await user.save();
    await followUser.save();

    res.status(200).json({ message: "Followed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId, unfollowId } = req.body;  // userId: logged-in user, unfollowId: user to be unfollowed
    
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);
    
    if (!user || !unfollowUser) {
      return res.status(404).json({ message: "User(s) not found" });
    }

    // Check if the user is not following
    if (!user.following.includes(unfollowId)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    // Remove from following and followers arrays
    user.following = user.following.filter(id => id !== unfollowId);
    unfollowUser.followers = unfollowUser.followers.filter(id => id !== userId);

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ message: "Unfollowed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
