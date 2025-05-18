// modules/common/middleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = {
  async verifyToken(req, res, next) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        throw new Error("No token provided");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
    }
  },
};
