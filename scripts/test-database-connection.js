// scripts/test-database-connection.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

// Debug: Print environment variables (but hide sensitive data)
console.log("Environment Variables Check:");
console.log("DB_HOST:", process.env.DB_HOST || "Not set");
console.log("DB_USER:", process.env.DB_USER || "Not set");
console.log("DB_NAME:", process.env.DB_NAME || "Not set");
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Is set" : "Not set");

async function testDatabaseConnection() {
  let connection;
  try {
    // Create a connection
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

    console.log("\nAttempting to connect with config:", {
      ...config,
      password: "****", // Hide password in logs
    });

    connection = await mysql.createConnection(config);

    console.log("🟢 Successfully connected to MySQL database!");

    // Test basic query
    const [result] = await connection.execute("SELECT 1 + 1 AS sum");
    console.log("✅ Test query result:", result[0].sum);

    // Test users table
    const [users] = await connection.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    console.log("👥 Number of users in database:", users[0].count);

    // Test posts table
    const [posts] = await connection.execute(
      "SELECT COUNT(*) as count FROM posts"
    );
    console.log("📝 Number of posts in database:", posts[0].count);

    console.log("✨ All database tests completed successfully!");
  } catch (error) {
    console.error("🔴 Database connection failed:", error.message);
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("❌ Error: Invalid database credentials");
    } else if (error.code === "ECONNREFUSED") {
      console.error("❌ Error: Database server is not running");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("❌ Error: Database does not exist");
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔄 Database connection closed");
    }
  }
}

// Check if .env file exists
const envPath = join(__dirname, "../.env");
if (!fs.existsSync(envPath)) {
  console.error("❌ Error: .env file not found at:", envPath);
  process.exit(1);
}

// Run the test
console.log("🚀 Starting database connection test...");
testDatabaseConnection().catch(console.error);
