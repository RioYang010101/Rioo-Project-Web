const fetch = require("node-fetch");

module.exports = {
  name: "Stock Grow a Garden",
  desc: "Ambil data stok Grow a Garden (hanya seeds)",
  category: "Stock",
  path: "/stock/grow",
  async run(req, res) {
    try {
      const response = await fetch("https://suraweb.my.id/info/stockgarden");
      const data = await response.json();

      // Ambil hanya bagian seeds
      const seedsData = data.seeds || null;

      res.json({
        status: true,
        creator: "Rioo",
        seeds: seedsData
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