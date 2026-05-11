const fs = require('fs');
const dir = 'C:/Users/24279/.cursor/projects/d/agent-tools/';

const files = fs.readdirSync(dir);
const geoFiles = {};
for (const f of files) {
  if (f.endsWith('.txt')) {
    const content = fs.readFileSync(dir + f, 'utf8');
    if (content.includes('"type":"Feature"') && content.length > 1000 && !content.includes('"type":"FeatureCollection"')) {
      const coordMatch = content.match(/(\d+\.\d{6,}),(\d+\.\d{6,})/);
      if (coordMatch) {
        geoFiles[f] = { content, lng: parseFloat(coordMatch[1]), lat: parseFloat(coordMatch[2]), size: content.length };
      }
    }
  }
}

const candidates = [
  { t: '丙安乡', lMin: 105.77, lMax: 105.92, bMin: 28.36, bMax: 28.53 },
  { t: '两河口乡', lMin: 105.66, lMax: 105.87, bMin: 28.26, bMax: 28.45 },
  { t: '元厚镇', lMin: 105.83, lMax: 106.02, bMin: 28.28, bMax: 28.44 },
  { t: '复兴镇', lMin: 105.69, lMax: 105.80, bMin: 28.41, bMax: 28.57 },
  { t: '大同镇', lMin: 105.60, lMax: 105.72, bMin: 28.40, bMax: 28.54 },
  { t: '天台镇', lMin: 105.73, lMax: 105.86, bMin: 28.49, bMax: 28.62 },
  { t: '官渡镇', lMin: 105.99, lMax: 106.19, bMin: 28.44, bMax: 28.65 },
  { t: '宝源乡', lMin: 105.64, lMax: 105.68, bMin: 28.30, bMax: 28.41 },
  { t: '市中街道', lMin: 105.68, lMax: 105.72, bMin: 28.57, bMax: 28.60 },
  { t: '文华街道', lMin: 105.69, lMax: 105.74, bMin: 28.57, bMax: 28.60 },
  { t: '旺隆镇', lMin: 105.82, lMax: 105.96, bMin: 28.54, bMax: 28.60 },
  { t: '白云乡', lMin: 105.93, lMax: 105.98, bMin: 28.67, bMax: 28.73 },
  { t: '石堡乡', lMin: 106.14, lMax: 106.20, bMin: 28.47, bMax: 28.58 },
  { t: '葫市镇', lMin: 106.00, lMax: 106.07, bMin: 28.44, bMax: 28.56 },
  { t: '金华街道', lMin: 105.73, lMax: 105.76, bMin: 28.57, bMax: 28.63 },
  { t: '长期镇', lMin: 106.01, lMax: 106.09, bMin: 28.59, bMax: 28.67 },
  { t: '长沙镇', lMin: 105.96, lMax: 106.02, bMin: 28.63, bMax: 28.72 },
];

const used = new Set();
const townMap = {};

for (const [fname, data] of Object.entries(geoFiles)) {
  let best = null, bestScore = Infinity;
  for (const c of candidates) {
    if (used.has(c.t)) continue;
    const cLng = (c.lMin + c.lMax) / 2, cLat = (c.bMin + c.bMax) / 2;
    const score = Math.abs(data.lng - cLng) + Math.abs(data.lat - cLat);
    if (data.lng >= c.lMin && data.lng <= c.lMax && data.lat >= c.bMin && data.lat <= c.bMax) {
      if (score < bestScore) { bestScore = score; best = c.t; }
    }
  }
  if (best) { used.add(best); townMap[best] = data; }
  console.log(best ? `MATCHED ${best}` : `UNMATCHED`, `: ${fname} (lng=${data.lng.toFixed(4)} lat=${data.lat.toFixed(4)} size=${data.size})`);
}

console.log(`\nMatched: ${used.size}/17`);
console.log(`Unmatched: ${candidates.filter(c => !used.has(c.t)).map(c => c.t).join(', ')}`);
