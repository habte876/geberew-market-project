require("dotenv").config({ quiet: true });
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
