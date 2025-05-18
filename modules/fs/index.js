const fs = require("fs");
const path = require("path");

// read a file
const readFile = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    console.log("File content:", data);
  });
};

// Define the file path
const filePath = path.join(__dirname, "test.txt");

// Call the readFile function
readFile(filePath);
