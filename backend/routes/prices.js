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

module.exports = router;
