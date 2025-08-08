const fetch = require("node-fetch");

module.exports = {
  name: "Stock Grow a Garden",
  desc: "Ambil data stok Grow a Garden (Seeds, Gears, Eggs)",
  category: "Stock",
  path: "/stock/grow",
  async run(req, res) {
    try {
      const response = await fetch("https://suraweb.my.id/info/stockgarden");
      const json = await response.json();

      // Ambil bagian yang diperlukan
      const seeds = json.data?.currentStock?.Seeds || {};
      const gears = json.data?.currentStock?.Gears || {};
      const eggs = json.data?.currentStock?.Eggs || {};

      res.json({
        status: true,
        creator: "Rioo", // Ganti Creator
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