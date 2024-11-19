import express from "express";
import dotenv from "dotenv";
import UserRoute from "./routes/user.js";
import CookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(CookieParser());

app.use("/api/user", UserRoute);

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
