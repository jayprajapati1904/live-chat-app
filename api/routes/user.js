import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
} from "../models/user.js";
import verifyToken from "../middleware/auth.js";
import { updateUserProfilePhoto } from "../models/user.js"; // Function to update DB
import upload from "../middleware/upload.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ====== Signup Route ======
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);

    // Generate a JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ====== Signin Route ======
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists and validate password
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate a JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        message: "Signin successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ====== Signout Route ======
router.post("/signout", async (req, res) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("user has been signed out");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ====== Get User Profile ======
router.get("/getuser", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token
    const user = await getUserById(userId);
    // console.log(user);

    if (!user) return res.status(404).json({ error: "User not found" });

    const { id, username, email, profile_photo, status } = user;
    res.status(200).json({
      user: { id, username, email, profile_photo, status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/upload-profile-photo",
  verifyToken,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you're using verifyToken middleware
      //   console.log(userId);
      const profilePhotoUrl = req.file.path; // Cloudinary URL
      //   console.log(profilePhotoUrl);

      // Update the user's profile photo URL in the database
      await updateUserProfilePhoto(userId, profilePhotoUrl);

      res.status(200).json({
        message: "Profile photo updated successfully",
        profilePhotoUrl,
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ error: "Failed to upload profile photo" });
    }
  }
);
// ====== Get All Users Except the Current User Route ======
router.get("/all-users", verifyToken, async (req, res) => {
  try {
    const userId = 1; // Extract user ID from the token to check if the user is authenticated
    const currentUser = await getUserById(userId);

    // Check if the current user exists
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all users except the current user
    const users = await getAllUsers(); // Fetch all users from the database
    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    // Remove the current user from the list of users
    const filteredUsers = users.filter((user) => user.id !== userId);

    // Remove sensitive data (like password) before returning the users
    const sanitizedUsers = filteredUsers.map(({ password, ...user }) => user);

    res.status(200).json({ users: sanitizedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
