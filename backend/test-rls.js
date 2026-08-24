require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

async function main() {
  // Simulate a request with NO set - should see nothing sensitve
  const noRole = await sql`
    SELECT set_config('app.current_role', '', true);
    `;
  const prices = await sql`SELECT * FROM prices`;
  console.log("Prices visible with no role set:", prices.length);

  // Simulate an operator session
  await sql`SELECT set_config('app.current_role', 'operator', true)`;
  const priceAsOperator = await sql`SELECT * FROM prices`;
  console.log("Prices visible as operator:", priceAsOperator.length);
}

main().catch((err) => console.error("Test failed:", err));
