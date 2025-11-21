const pdfParse = require('pdf-parse');

module.exports = async function extractPdf(dataBuffer) {
  const data = await pdfParse(dataBuffer);

  const pages = (data.text || '')
    .split(/\f/)
    .map((page) => page.trim())
    .filter(Boolean);

  if (pages.length === 0) return [data.text];

  return pages;
};
