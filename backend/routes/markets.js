const express = require("express");
const { sql } = require("../db");

const router = express.Router();

// GET /markets — list all markets (for dropdowns)
router.get("/", async (req, res) => {
  try {
    const markets =
      await sql`SELECT id, name, region FROM markets ORDER BY name`;
    res.json(markets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
