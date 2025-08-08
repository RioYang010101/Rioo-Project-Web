const fetch = require("node-fetch");

const GITHUB_TOKEN = "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";
const repoOwner = "NvidiaFR3";
const repoName = "stok-gag";
const filePath = "database.json";
const branch = "main";

module.exports = {
  name: "Delete Stock",
  desc: "Hapus stock dari list stok",
  category: "Stock",
  path: "/stok/delete?nama=&type=",
  async run(req, res) {
    const { nama, type } = req.query;
    if (!nama || !type)
      return res.json({ status: false, error: "nama dan type wajib diisi" });

    try {
      const fileRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`);
      const fileData = await fileRes.json();
      let stok = JSON.parse(Buffer.from(fileData.content, "base64").toString());

      const before = stok.length;
      stok = stok.filter(item => !(item.nama === nama && item.type === type));

      if (stok.length === before) return res.json({ status: false, error: "Stok tidak ditemukan" });

      const updateRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Delete stok ${nama} (${type})`,
          content: Buffer.from(JSON.stringify(stok, null, 2)).toString("base64"),
          sha: fileData.sha,
          branch
        })
      });

      if (!updateRes.ok) throw new Error("Gagal update file");
      res.json({ status: true, message: `Stok ${nama} (${type}) berhasil dihapus` });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};