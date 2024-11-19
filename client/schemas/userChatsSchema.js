import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const createUserChatsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS users_chats (
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      chat_id INT REFERENCES chats(id) ON DELETE CASCADE,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, chat_id)
    )
  `;
};

export default createUserChatsTable;
