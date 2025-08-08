const express = require("express");
const fetch = require("node-fetch");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint
app.get("/stock/grow", async (req, res) => {
  try {
    const apiKey = req.query.apikey || req.headers["x-api-key"];

    if (apiKey !== "riooapi") {
      return res.status(401).json({
        status: false,
        message: "API key salah atau tidak diberikan. Gunakan apikey=riooapi"
      });
    }

    const response = await fetch("https://suraweb.my.id/info/stockgarden");
    const json = await response.json();

    const seeds = json.data?.currentStock?.Seeds?.items || [];
    const gears = json.data?.currentStock?.Gears?.items || [];
    const eggs = json.data?.currentStock?.Eggs?.items || [];

    res.json({
      status: true,
      creator: "Rioo",
      seeds,
      gears,
      eggs
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      creator: "Rioo",
      error: err.message
    });
  }
});

// Jalankan server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Swagger docs: http://localhost:3000/docs");
});