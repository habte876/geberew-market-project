require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const { sql } = require("./db");
const pricesRouter = require("./routes/prices");
const cropsRouter = require("./routes/crops");
const marketsRouter = require("./routes/markets");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/prices", pricesRouter);
app.use("/crops", cropsRouter);
app.use("/markets", marketsRouter);

//Health check route - confirms the server and DB are both alive
app.get("/health", async (req, res) => {
  try {
    const result = await sql`SELECT NOW() as time`;
    res.json({ status: "ok", dbTime: result[0].time });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
