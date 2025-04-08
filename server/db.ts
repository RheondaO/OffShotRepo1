import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { log } from "./vite";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a postgres connection
const client = postgres(connectionString);

// Create a drizzle instance
export const db = drizzle(client);

// Function to test the connection
export async function testDatabaseConnection() {
  try {
    // Simple query to test the connection
    await client`SELECT 1`;
    log("Database connection established", "database");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}