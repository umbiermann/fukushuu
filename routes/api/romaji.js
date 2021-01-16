const express = require("express");
const router = express.Router();
const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

router.get("/:kanji", async (req, res) => {
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(
    new KuromojiAnalyzer({ dictPath: "node_modules/kuromoji/dict" })
  );
  const input = req.params.kanji;
  const result = await kuroshiro.convert(input, {
    mode: "furigana",
    to: "hiragana",
  });
  res.json(result);
});

module.exports = router;
