// modules/auth/auth-model.js
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

  async findUserById(id) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  async saveRefreshToken(userId, refreshToken) {
    await pool.execute(
      "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)",
      [userId, refreshToken]
    );
  },

  async findRefreshToken(userId, token) {
    const [rows] = await pool.execute(
      "SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ?",
      [userId, token]
    );
    return rows[0];
  },

  async updateRefreshToken(userId, oldToken, newToken) {
    await pool.execute(
      "UPDATE refresh_tokens SET token = ? WHERE user_id = ? AND token = ?",
      [newToken, userId, oldToken]
    );
  },

  async removeRefreshToken(userId, token) {
    await pool.execute(
      "DELETE FROM refresh_tokens WHERE user_id = ? AND token = ?",
      [userId, token]
    );
  },
};
