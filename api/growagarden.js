const fetch = require("node-fetch");

module.exports = {
  name: "Stock Grow a Garden",
  desc: "Ambil data stok Grow a Garden (Seeds, Gears, Eggs tanpa nextRestock, dengan API key)",
  category: "Stock",
  path: "/stock/grow",
  async run(req, res) {
    try {
      // Ambil API key dari query atau header
      const apiKey = req.query.apikey || req.headers["x-api-key"];

      // Validasi API key
      if (apiKey !== "riooapi") {
        return res.status(403).json({
          status: false,
          message: "Invalid API key"
        });
      }

      const response = await fetch("https://suraweb.my.id/info/stockgarden");
      const json = await response.json();

      // Ambil hanya items
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
  }
};