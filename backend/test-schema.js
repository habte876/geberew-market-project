require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
    `;
  console.log("Tables in database:");
  tables.forEach((t) => console.log("-", t.table_name));
}

main().catch((err) => console.error("Query failed:", err));
