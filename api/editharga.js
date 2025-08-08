const fetch = require("node-fetch");

const GITHUB_TOKEN = "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";
const repoOwner = "NvidiaFR3";
const repoName = "stok-gag";
const filePath = "database.json";
const branch = "main";

module.exports = {
  name: "Edit Harga Stock",
  desc: "Edit harga stock di list stock",
  category: "Stock",
  path: "/stok/edit-harga?nama=&type=&harga=",
  async run(req, res) {
    const { nama, type, harga } = req.query;
    if (!nama || !type || !harga)
      return res.json({ status: false, error: "nama, type, harga wajib diisi" });

    try {
      const fileRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`);
      const fileData = await fileRes.json();
      let stok = JSON.parse(Buffer.from(fileData.content, "base64").toString());

      let found = false;
      stok = stok.map(item => {
        if (item.nama === nama && item.type === type) {
          item.harga = parseFloat(harga);
          found = true;
        }
        return item;
      });

      if (!found) return res.json({ status: false, error: "Stok tidak ditemukan" });

      const updateRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Edit harga stok ${nama} (${type})`,
          content: Buffer.from(JSON.stringify(stok, null, 2)).toString("base64"),
          sha: fileData.sha,
          branch
        })
      });

      if (!updateRes.ok) throw new Error("Gagal update file");
      res.json({ status: true, message: `Harga stok ${nama} (${type}) berhasil diubah` });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};