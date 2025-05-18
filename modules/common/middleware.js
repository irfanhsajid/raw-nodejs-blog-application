// modules/common/middleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = {
  async verifyToken(req, res, next) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      console.log("token", token);
      console.log("JWT_ACCESS_SECRET exists:", !!process.env.JWT_ACCESS_SECRET);

      if (!token) {
        throw new Error("No token provided");
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        console.log("decoded >>>>", decoded);
        req.user = decoded;
        next();
      } catch (jwtError) {
        console.error("JWT Verification Error:", jwtError.message);
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Middleware Error:", error.message);
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
    }
  },
};
