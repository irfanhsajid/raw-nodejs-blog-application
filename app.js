const http = require("http");
const myDateTime = require("./modules/my-first-module");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello World >></h1>");
  res.write("The date and time are currently: " + myDateTime.myDateTime());
  console.log("request received", req.url);
  res.end();
});

server.listen(3001, () => {
  console.log("Server is running on por 3001");
});
