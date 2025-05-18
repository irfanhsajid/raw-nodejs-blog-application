// modules/blog/blogService.js
import { blogModel } from "./blog-model.js";

export const blogService = {
  async createPost(title, content, userId) {
    return await blogModel.createPost(title, content, userId);
  },

  async getPosts() {
    return await blogModel.getPosts();
  },

  async getPost(id) {
    const post = await blogModel.getPostById(id);
    if (!post) throw new Error("Post not found");
    return post;
  },

  async updatePost(id, title, content, userId) {
    const success = await blogModel.updatePost(id, title, content, userId);
    if (!success) throw new Error("Post not found or unauthorized");
    return success;
  },

  async deletePost(id, userId) {
    const success = await blogModel.deletePost(id, userId);
    if (!success) throw new Error("Post not found or unauthorized");
    return success;
  },
};
