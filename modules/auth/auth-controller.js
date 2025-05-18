// modules/auth/authController.js
import { authService } from "./auth-service.js";

export const authController = {
  async handleRegister(req, res) {
    try {
      const { username, email, password } = JSON.parse(req.body);
      const { user, accessToken, refreshToken } = await authService.register(
        username,
        email,
        password
      );
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          user,
          accessToken,
          refreshToken,
        })
      );
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
