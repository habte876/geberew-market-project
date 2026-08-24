require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const crops =
    await sql`SELECT name_en, name_am, name_om FROM crops ORDER BY name_en`;
  console.log("Raw first row:", crops[0]);
  console.log("Crops in database:");
  crops.forEach((c) =>
    console.log(` - ${c.name_en} / ${c.name_am} / ${c.name_om}`),
  );
}

main().catch((err) => console.error("Query failed:", err));
