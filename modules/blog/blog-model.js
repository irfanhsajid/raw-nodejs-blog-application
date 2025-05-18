// modules/blog/blogModel.js
import pool from "../../config/database.js";

export const blogModel = {
  async createPost(title, content, userId) {
    const [result] = await pool.execute(
      "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );
    return result.insertId;
  },

  async getPosts() {
    const [rows] = await pool.execute(
      "SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC"
    );
    return rows;
  },

  async getPostById(id) {
    const [rows] = await pool.execute(
      "SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?",
      [id]
    );
    return rows[0];
  },

  async updatePost(id, title, content, userId) {
    const [result] = await pool.execute(
      "UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?",
      [title, content, id, userId]
    );
    return result.affectedRows > 0;
  },

  async deletePost(id, userId) {
    const [result] = await pool.execute(
      "DELETE FROM posts WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};
