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

// Based on GitHub API confirmed sizes:
// 丙安乡: 48035, first coord ~105.8938
// 两河口乡: 56861, first coord ~105.8478
// 元厚镇: 52365, first coord ~105.8535
// 复兴镇: 42344, first coord ~105.7414
// 大同镇: 36710, first coord ~105.7249
// 天台镇: 30364, first coord ~105.7857
// 官渡镇: 28671, first coord ~106.0734
// 宝源乡: 18832, first coord ~105.6788
// 市中街道: 14254, first coord ~105.6892
// 文华街道: 27621, first coord ~105.7377
// 旺隆镇: 35747, first coord ~105.8329
// 白云乡: 11119, first coord ~105.9318
// 石堡乡: 13934, first coord ~106.1911
// 葫市镇: 65860, first coord ~106.0734
// 金华街道: 14643, first coord ~105.7377
// 长期镇: 21307, first coord ~105.9836
// 长沙镇: 21307, first coord ~105.9985

// File by FIRST coord match
const sizeMap = {};
for (const [fname, data] of Object.entries(geoFiles)) {
  const size = data.size;
  const key = `${data.lng.toFixed(4)}_${data.lat.toFixed(4)}_${size}`;
  if (!sizeMap[size]) sizeMap[size] = [];
  sizeMap[size].push({ fname, ...data });
}

console.log('Files by size:');
for (const [size, arr] of Object.entries(sizeMap).sort((a,b) => parseInt(a[0]) - parseInt(b[0]))) {
  for (const f of arr) {
    console.log(`  size=${size} lng=${f.lng.toFixed(4)} lat=${f.lat.toFixed(4)} ${f.fname}`);
  }
}

// Also, let's look at the chishui-all.json from the existing download (7 towns)
// These are already converted to WGS84. Let's extract their ranges.
const outDir = 'd:/中药材/public/chishui-towns-real';
const existing = JSON.parse(fs.readFileSync(`${outDir}/chishui-all.json`, 'utf8'));
console.log('\nExisting chishui-all.json towns (WGS84, first coord):');
for (const f of existing.features) {
  const name = f.properties.name;
  const coords = f.geometry.coordinates;
  const first = coords[0][0];
  console.log(`  ${name}: [${first[0].toFixed(5)}, ${first[1].toFixed(5)}]`);
}
