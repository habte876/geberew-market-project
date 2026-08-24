require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const cols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'crops'
    ORDER BY ordinal_position
  `;
  console.log("Columns in crops table:");
  cols.forEach((c) => console.log(" -", c.column_name));
}

main().catch((err) => console.error("Query failed:", err));
