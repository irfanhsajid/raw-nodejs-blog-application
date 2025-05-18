// app.js
import http from "http";
import { fileService } from "./modules/fs/fileService.js";

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  if (req.url === "/read-file") {
    fileService.streamLargeFile(res);
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to File Streaming Server</h1>");
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
