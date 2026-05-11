const https = require('https');
const fs = require('fs');

const outDir = 'd:/中药材/public/chishui-towns-real';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const REPO = 'rooma1989/china_geo_data';
const BRANCH = 'main';

const towns = [
  '丙安乡', '两河口乡', '元厚镇', '复兴镇', '大同镇', '天台镇',
  '官渡镇', '宝源乡', '市中街道', '文华街道', '旺隆镇', '白云乡',
  '石堡乡', '葫市镇', '金华街道', '长期镇', '长沙镇'
];

// GCJ-02 to WGS84
function gcj02ToWgs84(lng, lat) {
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
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
  if (typeof coord[0] === 'number' && typeof coord[1] === 'number') {
    return gcj02ToWgs84(coord[0], coord[1]);
  }
  return coord.map(c => convertCoords(c));
}

function fetchGitHub(repo, filePath, branch) {
  return new Promise((resolve, reject) => {
    const encodedPath = encodeURIComponent(filePath);
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${repo}/contents/${encodedPath}?ref=${branch}`,
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

async function main() {
  const allFeatures = [];

  for (const town of towns) {
    const filePath = `贵州省/遵义市/赤水市/geo_${town}.json`;
    process.stdout.write(`${town}... `);
    try {
      const content = await fetchGitHub(REPO, filePath, BRANCH);
      const gj = JSON.parse(content);

      let features = [];
      if (gj.type === 'FeatureCollection') {
        for (const f of gj.features) {
          f.properties = f.properties || {};
          f.properties.name = town;
          f.geometry.coordinates = convertCoords(f.geometry.coordinates);
          features.push(f);
        }
      } else if (gj.type === 'Feature') {
        gj.properties = gj.properties || {};
        gj.properties.name = town;
        gj.geometry.coordinates = convertCoords(gj.geometry.coordinates);
        features.push(gj);
      }

      for (const f of features) allFeatures.push(f);

      // Get coord range
      let range = '';
      try {
        const coords = features[0].geometry.coordinates;
        const flat = coords.flat(3);
        const lngs = flat.filter((_, i) => i % 2 === 0);
        const lats = flat.filter((_, i) => i % 2 === 1);
        range = ` [${Math.min(...lngs).toFixed(3)},${Math.max(...lngs).toFixed(3)}] x [${Math.min(...lats).toFixed(3)},${Math.max(...lats).toFixed(3)}]`;
      } catch(e) {}

      console.log(`OK (${features.length} feat${range})`);
    } catch(e) {
      console.log(`FAIL: ${e.message}`);
    }
  }

  const combined = { type: 'FeatureCollection', features: allFeatures };
  const out = `${outDir}/chishui-all.json`;
  fs.writeFileSync(out, JSON.stringify(combined, null, 2));
  console.log(`\nWrote ${allFeatures.length} features -> ${out}`);
  console.log(`File size: ${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
