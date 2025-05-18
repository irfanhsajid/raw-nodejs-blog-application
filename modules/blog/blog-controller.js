// modules/blog/blog-controller.js
import { blogService } from "./blog-service.js";

export const blogController = {
  async handleCreatePost(req, res) {
    try {
      // Parse the body since it's a string from app.js
      const { title, content } = JSON.parse(req.body);
      const userId = req.user.userId;

      if (!title || !content) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error: "Title and content are required",
          })
        );
      }

      const post = await blogService.createPost(title, content, userId);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          post,
        })
      );
    } catch (error) {
      console.error("Error creating post:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
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
  async handleGetPost(req, res) {
    try {
      const postId = req.params.id;
      const post = await blogService.getPost(postId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(post));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  async handleUpdatePost(req, res) {
    try {
      const postId = req.params.id;
      const { title, content } = JSON.parse(req.body);
      const userId = req.user.userId;

      if (!title || !content) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error: "Title and content are required",
          })
        );
      }

      const updatedPost = await blogService.updatePost(
        postId,
        title,
        content,
        userId
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(updatedPost));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  async handleDeletePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.userId;

      await blogService.deletePost(postId, userId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },
};
