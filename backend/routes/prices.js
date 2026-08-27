const express = require("express");
const { body, validationResult } = require("express-validator");
const { sql } = require("../db");

const router = express.Router();

//POST /prices - submit a new price for review
router.post(
  "/",
  [
    body("cropId").isUUID().withMessage("cropId must be a valid UUID"),
    body("marketId").isUUID().withMessage("marketId must be a valid UUID"),
    body("priceValue")
      .isFloat({ gt: 0 })
      .withMessage("priceValue must be a positive number"),
    body("effectiveDate")
      .isISO8601()
      .withMessage("effectiveDate must be a valid date (YYYY-MM-DD)"),
    body("submittedBy")
      .isUUID()
      .withMessage("submittedBy must be a valid UUID"),
    body("source")
      .isIn(["web", "sms"])
      .withMessage("source must be web or sms"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      cropId,
      marketId,
      priceValue,
      effectiveDate,
      submittedBy,
      source,
      unit,
    } = req.body;

    try {
      const result = await sql`
   INSERT INTO prices (crop_id, market_id, price_value, effective_date, submitted_by, source, unit)
   VALUES (${cropId}, ${marketId}, ${priceValue}, ${effectiveDate}, ${submittedBy}, ${source}, ${unit || "kg"})
   RETURNING id, crop_id, market_id, price_value, effective_date, is_verified, created_at
   `;
      res.status(201).json(result[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// PATCH /prices/:id/verify — operator approves a pending price
router.patch("/:id/verify", async (req, res) => {
  const { id } = req.params;
  const { verifiedBy } = req.body;

  if (!verifiedBy) {
    return res.status(400).json({ error: "verifiedBy is required" });
  }

  try {
    const result = await sql`
      UPDATE prices
      SET is_verified = true, verified_by = ${verifiedBy}
      WHERE id = ${id}
      RETURNING id, is_verified, verified_by
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Price not found" });
    }

    res.json(result[0]);
    // TODO: trigger SMS fanout here once Task 5's SMS module exists
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
