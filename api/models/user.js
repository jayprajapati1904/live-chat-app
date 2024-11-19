// models/user.js
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

export const createUser = async (username, email, password) => {
  const result = await sql`
    INSERT INTO users (username, email, password)
    VALUES (${username}, ${email}, ${password})
    RETURNING id, username, email`;
  return result[0];
};

export const getUserByEmail = async (email) => {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}`;
  return result[0];
};

export const getUserById = async (id) => {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}`;
  return result[0]; // Return the first record if found
};

export const updateUserProfilePhoto = async (userId, profilePhotoUrl) => {
  await sql`
    UPDATE users SET profile_photo = ${profilePhotoUrl} WHERE id = ${userId}`;
};

// models/user.js

// Function to fetch all users from the database
export const getAllUsers = async () => {
  try {
    const rows =
      await sql`SELECT id, username, email, profile_photo, status FROM users`;

    return rows;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
