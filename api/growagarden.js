const fetch = require("node-fetch");

module.exports = {
  name: "Stock Grow a Garden",
  desc: "Ambil data stok Grow a Garden",
  category: "Stock",
  path: "/stock/grow",
  async run(req, res) {
    try {
      const response = await fetch("https://suraweb.my.id/info/stockgarden");
      const data = await response.json();

      // Ubah Creator jika ada
      if (data.Creator) {
        data.Creator = "Rioo";
      }

      res.json({
        status: true,
        data
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};