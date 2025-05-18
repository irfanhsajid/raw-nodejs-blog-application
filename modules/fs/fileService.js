// modules/fs/fileService.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileService {
  constructor() {
    // Initialize file paths
    this.largeFilePath = path.join(__dirname, "../../assets/large-file.txt");
  }

  /**
   * Stream a large file
   * @param {http.ServerResponse} res - HTTP response object
   */
  streamLargeFile(res) {
    try {
      // Check if file exists
      if (!fs.existsSync(this.largeFilePath)) {
        throw new Error("File not found");
      }

      // Get file stats
      const stat = fs.statSync(this.largeFilePath);

      // Set response headers
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Content-Length": stat.size,
      });

      // Create read stream
      const readStream = fs.createReadStream(this.largeFilePath, {
        highWaterMark: 64 * 1024, // 64KB chunks
      });

      // Handle stream events
      readStream.on("error", (error) => {
        console.error("Stream error:", error);
        res.writeHead(500);
        res.end("Internal Server Error");
      });

      // Pipe the stream to response
      readStream.pipe(res);
    } catch (error) {
      console.error("File streaming error:", error);
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  }
}

export const fileService = new FileService();
