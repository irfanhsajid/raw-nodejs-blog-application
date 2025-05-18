// modules/auth/authService.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authModel } from "./auth-model.js";

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
