const fs = require('fs');
const pdfParse = require('pdf-parse');

// console.log('here is my type', typeof pdfParse);

module.exports = async function extractPdf(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);

  const data = await pdfParse(dataBuffer);

  const pages = (data.text || '')
    .split(/\f/)
    .map((page) => page.trim())
    .filter(Boolean);

  if (pages.length === 0) return [data.text];

  return pages;
};
