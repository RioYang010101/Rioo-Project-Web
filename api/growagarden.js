const fetch = require("node-fetch");

module.exports = {
  name: "Stock Grow a Garden",
  desc: "Ambil data stok Grow a Garden (Seeds, Gears, Eggs tanpa nextRestock, dengan API key wajib)",
  category: "Stock",
  path: "/stock/grow",
  async run(req, res) {
    try {
      // Ambil API key dari query (?apikey=...) atau header
      const apiKey = req.query.apikey || req.headers["x-api-key"];

      // Cek apakah API key benar
      if (apiKey !== "riooapi") {
        return res.status(401).json({
          status: false,
          message: "API key salah atau tidak diberikan. Gunakan apikey=riooapi"
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