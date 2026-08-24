import fs from "fs";
import path from "path";
import pg from "pg";

// Load .env.local if DATABASE_URL is not already set in environment
if (!process.env.DATABASE_URL) {
  try {
    const envContent = fs.readFileSync(
      path.join(process.cwd(), ".env.local"),
      "utf-8"
    );
    const dbLine = envContent
      .split("\n")
      .find((line) => line.trim().startsWith("DATABASE_URL="));
    if (dbLine) {
      process.env.DATABASE_URL = dbLine.replace("DATABASE_URL=", "").trim();
    }
  } catch {
    // Ignore error if .env.local not found
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Error: DATABASE_URL is required in .env.local or process environment."
  );
  process.exit(1);
}

async function runSeed() {
  const client = new pg.Client({ connectionString });
  await client.connect();
  console.log("Connected to InsForge Postgres.");

  const seedSql = fs.readFileSync(
    path.join(process.cwd(), "supabase", "seed.sql"),
    "utf-8"
  );

  console.log("Executing seed.sql...");
  await client.query(seedSql);
  console.log("Seed data applied successfully!");

  await client.end();
}

runSeed().catch((err) => {
  console.error("Seed execution failed:", err);
  process.exit(1);
});
