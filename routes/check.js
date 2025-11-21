const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const extractPdf = require('../utils/extractPdf');
const { callLLMForRules } = require('../utils/llm');

const upload = multer({ storage: storage });
const router = express.Router();

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'PDF required' });
    const textByPages = await extractPdf(req.file.path);
    const rules = req.body.rules ? JSON.parse(req.body.rules) : [];
    if (!Array.isArray(rules) || rules.length !== 3) {
      return res
        .status(400)
        .json({ error: 'Send rules as JSON array of 3 strings' });
    }
    const response = await callLLMForRules(textByPages, rules);
    res.json({ results: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'server error' });
  }
});

module.exports = router;
