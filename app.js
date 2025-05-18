const http = require("http");
const myDateTime = require("./modules/my-first-module");
const readFile = require("./modules/fs/index");
const fs = require("fs");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello World >></h1>");
  res.write("The date and time are currently: " + myDateTime.myDateTime());
  if (req.url === "/read-file") {
    const data = readFile();
    res.write(data);
  }
  console.log("request received", req.url);
});

server.listen(3001, () => {
  console.log("Server is running on por 3001");
});
