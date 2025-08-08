const fetch = require("node-fetch");

const GITHUB_TOKEN = "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";
const repoOwner = "NvidiaFR3";
const repoName = "stok-gag";
const filePath = "database.json";
const branch = "main";

module.exports = {
  name: "add stock",
  desc: "Tambah stock ke list stok",
  category: "Stock",
  path: "/stok/add?nama=&type=&harga=&jumlah=",
  async run(req, res) {
    const { nama, type, harga, jumlah } = req.query;
    if (!nama || !type || !harga || !jumlah)
      return res.json({ status: false, error: "nama, type, harga, jumlah wajib diisi" });

    try {
      // Ambil file lama
      const fileRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`);
      const fileData = await fileRes.json();

      let stok = [];
      if (fileData.content) {
        stok = JSON.parse(Buffer.from(fileData.content, "base64").toString());
      }

      // Tambah data baru
      stok.push({ nama, type, harga: parseFloat(harga), jumlah: parseInt(jumlah) });

      // Upload ke GitHub
      const updateRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Add stok ${nama} (${type})`,
          content: Buffer.from(JSON.stringify(stok, null, 2)).toString("base64"),
          sha: fileData.sha,
          branch
        })
      });

      if (!updateRes.ok) throw new Error("Gagal update file");
      res.json({ status: true, message: `Stok ${nama} (${type}) berhasil ditambahkan` });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};