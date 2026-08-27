require("dotenv").config({ quiet: true });
const { sql } = require("./db");

async function main() {
  const market = await sql`
    INSERT INTO markets (name, region, latitude, longitude)
    VALUES ('Merkato', 'Addis Ababa', 9.0192, 38.7420)
    RETURNING id, name
  `;
  console.log("Created market:", market[0]);

  const user = await sql`
    INSERT INTO users (role, full_name, phone)
    VALUES ('farmer', 'Test Farmer', '+251910000000')
    RETURNING id, role, full_name
  `;
  console.log("Created user:", user[0]);

  const crop = await sql`SELECT id, name_en FROM crops WHERE name_en = 'Teff'`;
  console.log("Teff crop id:", crop[0]);
}

main().catch((err) => console.error("Seed failed:", err));

