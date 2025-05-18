// modules/auth/authModel.js
import pool from "../config/database.js";

export const authModel = {
  async createUser(username, email, hashedPassword) {
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    return result.insertId;
  },

  async findUserByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },
};
