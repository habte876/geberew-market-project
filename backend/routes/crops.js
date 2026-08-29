const express = require("express");
const { sql } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const crops =
      await sql`SELECT id, name_en, name_am, name_om FROM crops ORDER BY name_en`;
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
