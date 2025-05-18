// modules/blog/blogController.js
import { blogService } from "./blog-service.js";

export const blogController = {
  async handleCreatePost(req, res) {
    try {
      const { title, content } = JSON.parse(req.body);
      const userId = req.user.userId;
      const postId = await blogService.createPost(title, content, userId);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, postId }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  async handleGetPosts(req, res) {
    try {
      const posts = await blogService.getPosts();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(posts));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },
};
