const express = require("express");
const path = require("path");

const app = express();

// Azure App Service provides the port via process.env.PORT
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Simple health/version endpoint - handy for checking which slot you're hitting
app.get("/api/version", (req, res) => {
  res.json({
    version: "2.0.0",
    // SLOT_NAME is a custom App Setting you set yourself in each slot (see README)
    // - useful for visually confirming which slot you're hitting
    slot: process.env.SLOT_NAME || "not set",
    hostname: process.env.WEBSITE_HOSTNAME || "localhost"
  });
});

app.listen(port, () => {
  console.log(`Calculator app (v2) listening on port ${port}`);
});
