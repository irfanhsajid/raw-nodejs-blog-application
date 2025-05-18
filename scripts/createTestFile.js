// scripts/createTestFile.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Create assets directory if it doesn't exist
  const assetsDir = path.join(__dirname, "../assets");
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
    console.log("Created assets directory");
  }

  // Create a large file (100MB)
  const filePath = path.join(assetsDir, "large-file.txt");
  const writeStream = fs.createWriteStream(filePath);

  console.log("Creating large test file...");

  // Write data in chunks
  for (let i = 0; i < 1000000; i++) {
    const data = `Line ${i}: ${"x".repeat(100)}\n`;
    // Use write with a callback to handle backpressure
    const canContinue = writeStream.write(data);

    if (!canContinue) {
      // Wait for the drain event before continuing
      await new Promise((resolve) => writeStream.once("drain", resolve));
    }

    // Log progress every 100000 lines
    if (i % 100000 === 0) {
      console.log(`Progress: ${i / 10000}%`);
    }
  }

  // Close the stream properly
  writeStream.end();

  writeStream.on("finish", () => {
    console.log("Large test file created successfully!");
    const stats = fs.statSync(filePath);
    console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  });
} catch (error) {
  console.error("Error creating test file:", error);
  process.exit(1);
}
