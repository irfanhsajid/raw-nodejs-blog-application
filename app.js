// app.js
import http from "http";
import { authController } from "./modules/auth/auth-controller.js";
import { blogController } from "./modules/blog/blog-controller.js";
import { authMiddleware } from "./modules/common/middleware.js";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Collect request body
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  await new Promise((resolve) => req.on("end", resolve));
  req.body = body;

  // Routes
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    switch (true) {
      // Auth routes
      case path === "/auth/register" && req.method === "POST":
        await authController.handleRegister(req, res);
        break;

      case path === "/auth/login" && req.method === "POST":
        await authController.handleLogin(req, res);
        break;

      // Blog routes (protected)
      case path === "/posts" && req.method === "GET":
        await blogController.handleGetPosts(req, res);
        break;

      case path === "/posts" && req.method === "POST":
        await authMiddleware.verifyToken(req, res, async () => {
          await blogController.handleCreatePost(req, res);
        });
        break;

      default:
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
