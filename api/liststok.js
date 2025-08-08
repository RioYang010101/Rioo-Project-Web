const fetch = require("node-fetch");

module.exports = {
  name: "List stock",
  desc: "Tampilkan semua stock",
  category: "Stock",
  path: "/stok/list",
  async run(req, res) {
    try {
      const url = "https://raw.githubusercontent.com/NvidiaFR3/stok-gag/main/database.json";
      const response = await fetch(url);
      const stok = await response.json();
      res.json({ status: true, data: stok });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};