require("dotenv").config({ quiet: true });
const { sql } = require("./db");

async function main() {
  const markets =
    await sql`SELECT id, name FROM markets WHERE name = 'Merkato'`;
  console.log("All Merkato rows:", markets);

  const prices = await sql`SELECT id, market_id FROM prices`;
  console.log("Prices and which market_id they use:", prices);
}

main().catch((err) => console.error(err));
