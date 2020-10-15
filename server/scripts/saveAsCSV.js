const fs = require('fs');
const path = require('path');

function escapeComma(string) {
  if (typeof string !== 'string' || !string.includes(',')) {
    return string;
  }

  return `"${string}"`;
}

function getCSV(array) {
  if (!array.length) {
    return '';
  }

  const header = `${Object.keys(array[0]).join(',')}\n`;
  const body = array
    .map(row =>
      Object.entries(row)
        .map(entry => {
          if (Array.isArray(entry[1])) {
            return `"${entry[1].join(' ')}"`;
          }
          return escapeComma(entry[1]);
        })
        .join(',')
    )
    .join('\n');

  return header + body;
}

const result = fs.readFileSync(path.resolve(__dirname, 'huafen.json'), 'utf8');
const articles = JSON.parse(result);
const csv = getCSV(articles);
fs.writeFileSync(path.resolve(__dirname, 'huafen.csv'), csv);
