const fetch = require("node-fetch");

module.exports = {
  name: "Stock Grow a Garden",
  desc: "Ambil data stok Grow a Garden (hanya Seeds)",
  category: "Stock",
  path: "/stock/grow",
  async run(req, res) {
    try {
      const response = await fetch("https://suraweb.my.id/info/stockgarden");
      const json = await response.json();

      // Ambil hanya bagian Seeds
      const seedsData = json.data?.currentStock?.Seeds || {};

      res.json({
        status: true,
        creator: "Rioo", // Ganti nama creator
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