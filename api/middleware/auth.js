import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  // Attempt to retrieve the token from different sources

  const token = req.cookies.access_token;

  // If no token is found, return an error
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded payload to the `req` object
    next(); // Pass control to the next middleware or route
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export default verifyToken;
