import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const createOnlineStatusTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS online_status (
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(50), -- 'online', 'offline', 'away', etc.
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
};

export default createOnlineStatusTable;
