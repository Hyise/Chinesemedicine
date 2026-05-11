const https = require('https');
const fs = require('fs');

const outDir = 'd:/中药材/public/chishui-towns-real';

const REPO = 'rooma1989/china_geo_data';
const BRANCH = 'main';

const remaining = [
  '宝源乡', '市中街道', '文华街道', '旺隆镇', '白云乡',
  '石堡乡', '葫市镇', '金华街道', '长期镇', '长沙镇'
];

function gcj02ToWgs84(lng, lat) {
  const a = 6378245.0, ee = 0.00669342162296594323;
  let dLat = -100.0 + 2.0*(lng-105.0) + 3.0*(lat-35.0) + 0.2*(lat-35.0)*(lat-35.0) + 0.1*(lng-105.0)*(lat-35.0) + 0.2*Math.sqrt(Math.abs(lng-105.0));
  dLat += (20.0*Math.sin(6.0*(lng-105.0)*Math.PI)+20.0*Math.sin(2.0*(lng-105.0)*Math.PI))*2.0/3.0;
  dLat += (20.0*Math.sin((lat-35.0)*Math.PI)+40.0*Math.sin((lat-35.0)/3.0*Math.PI))*2.0/3.0;
  dLat += (160.0*Math.sin((lat-35.0)/12.0*Math.PI)+320.0*Math.sin((lat-35.0)*Math.PI/30.0))*2.0/3.0;
  let dLng = 300.0 + (lng-105.0) + 2.0*(lat-35.0) + 0.1*(lng-105.0)*(lng-105.0) + 0.1*(lng-105.0)*(lat-35.0) + 0.1*Math.sqrt(Math.abs(lng-105.0));
  dLng += (20.0*Math.sin(6.0*(lng-105.0)*Math.PI)+20.0*Math.sin(2.0*(lng-105.0)*Math.PI))*2.0/3.0;
  dLng += (20.0*Math.sin((lng-105.0)*Math.PI)+40.0*Math.sin((lng-105.0)/3.0*Math.PI))*2.0/3.0;
  dLng += (150.0*Math.sin((lng-105.0)/12.0*Math.PI)+300.0*Math.sin((lng-105.0)/30.0*Math.PI))*2.0/3.0;
  const radLat = lat / 180.0 * Math.PI;
  const magic = 1 - ee * Math.sin(radLat) * Math.sin(radLat);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * Math.sqrt(magic)) * Math.PI);
  dLng = (dLng * 180.0) / (a / Math.sqrt(magic) * Math.cos(radLat) * Math.PI);
  return [lng - dLng, lat - dLat];
}

function convertCoords(coord) {
  if (typeof coord[0] === 'number' && typeof coord[1] === 'number') return gcj02ToWgs84(coord[0], coord[1]);
  return coord.map(c => convertCoords(c));
}

function fetchFile(filePath) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${encodeURIComponent(filePath)}?ref=${BRANCH}`,
      method: 'GET',
      headers: { 'User-Agent': 'node', 'Accept': 'application/vnd.github.v3+json' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.content) resolve(Buffer.from(j.content, 'base64').toString('utf8'));
          else reject(new Error(j.message || 'Not found'));
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Load existing
  const existing = JSON.parse(fs.readFileSync(`${outDir}/chishui-all.json`, 'utf8'));
  console.log(`Loaded ${existing.features.length} existing features`);

  for (const town of remaining) {
    process.stdout.write(`${town}... `);
    await delay(8000); // 8 second delay between requests
    const filePath = `贵州省/遵义市/赤水市/geo_${town}.json`;
    try {
      const content = await fetchFile(filePath);
      const gj = JSON.parse(content);
      let features = [];
      if (gj.type === 'FeatureCollection') {
        for (const f of gj.features) {
          f.properties = f.properties || {};
          f.properties.name = town;
          f.geometry.coordinates = convertCoords(f.geometry.coordinates);
          features.push(f);
        }
      } else {
        gj.properties = gj.properties || {};
        gj.properties.name = town;
        gj.geometry.coordinates = convertCoords(gj.geometry.coordinates);
        features.push(gj);
      }
      for (const f of features) existing.features.push(f);
      console.log('OK');
    } catch(e) {
      console.log(`FAIL: ${e.message}`);
    }
  }

  fs.writeFileSync(`${outDir}/chishui-all.json`, JSON.stringify(existing, null, 2));
  console.log(`\nTotal: ${existing.features.length} features`);
  console.log(`File: ${(fs.statSync(`${outDir}/chishui-all.json`).size / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
