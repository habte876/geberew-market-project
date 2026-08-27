require("dotenv").config({ quiet: true });
const { sql } = require("./db");

async function main() {
  const operator = await sql`
    INSERT INTO users (role, full_name, email)
    VALUES ('operator', 'Test Operator', 'operator@test.com')
    RETURNING id, role, full_name
  `;
  console.log("Created operator:", operator[0]);
}

main().catch((err) => console.error("Failed:", err));
