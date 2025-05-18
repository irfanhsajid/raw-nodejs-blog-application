// modules/auth/auth-service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authModel } from "./auth-model.js";

export const authService = {
  // Generate access token
  generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" } // Short-lived token
    );
  },

  // Generate refresh token
  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Long-lived token
    );
  },

  async register(username, email, password) {
    // Check if user already exists
    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await authModel.createUser(username, email, hashedPassword);

    const user = { id: userId, email };
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token in database
    await authModel.saveRefreshToken(userId, refreshToken);

    return {
      user: { id: userId, email, username },
      accessToken,
      refreshToken,
    };
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

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token in database
    await authModel.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    };
  },

  async refresh(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Check if token exists in database
      const storedToken = await authModel.findRefreshToken(
        decoded.userId,
        refreshToken
      );
      if (!storedToken) {
        throw new Error("Invalid refresh token");
      }

      // Get user data
      const user = await authModel.findUserById(decoded.userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate new tokens
      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Replace old refresh token with new one
      await authModel.updateRefreshToken(
        decoded.userId,
        refreshToken,
        newRefreshToken
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  },

  async logout(userId, refreshToken) {
    // Remove refresh token from database
    await authModel.removeRefreshToken(userId, refreshToken);
  },

  async validateAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  },
};
