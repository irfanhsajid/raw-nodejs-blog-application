// modules/auth/authModel.js
import pool from "../../config/database.js";

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

// modules/auth/authService.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authModel } from "./authModel.js";

export const authService = {
  async register(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await authModel.createUser(username, email, hashedPassword);
  },

  async login(email, password) {
    const user = await authModel.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return { token, userId: user.id };
  },
};

// modules/auth/authController.js
import { authService } from "./authService.js";

export const authController = {
  async handleRegister(req, res) {
    try {
      const { username, email, password } = JSON.parse(req.body);
      const userId = await authService.register(username, email, password);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, userId }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  async handleLogin(req, res) {
    try {
      const { email, password } = JSON.parse(req.body);
      const result = await authService.login(email, password);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },
};
