/**
 * Download all 17 Chishui town GeoJSON files from GitHub API
 * and convert GCJ-02 to WGS84 coordinates
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = 'd:/中药材/public/chishui-towns-real';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const REPO = 'rooma1989/china_geo_data';
const BRANCH = 'main';

const towns = [
  '丙安乡', '两河口乡', '元厚镇', '复兴镇', '大同镇', '天台镇',
  '官渡镇', '宝源乡', '市中街道', '文华街道', '旺隆镇', '白云乡',
  '石堡乡', '葫市镇', '金华街道', '长期镇', '长沙镇'
];

/**
 * GCJ-02 (火星坐标系) to WGS84 converter
 * Based on official algorithms used by Chinese map APIs
 */
function gcj02ToWgs84(lng, lat) {
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * Math.PI;
  const magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  return [lng - dLng, lat - dLat];
}

function transformLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320.0 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLng(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
  return ret;
}

function convertCoords(coord) {
  if (typeof coord[0] === 'number' && typeof coord[1] === 'number') {
    const [wgsLng, wgsLat] = gcj02ToWgs84(coord[0], coord[1]);
    return [wgsLng, wgsLat];
  }
  if (Array.isArray(coord[0])) {
    return coord.map(c => convertCoords(c));
  }
  return coord;
}

function convertFeature(feature) {
  const converted = JSON.parse(JSON.stringify(feature));
  const coords = converted.geometry.coordinates;
  converted.geometry.coordinates = convertCoords(coords);

  // Also update centroid if present
  if (converted.properties && converted.properties.centroid) {
    const [lng, lat] = converted.properties.centroid;
    const [wgsLng, wgsLat] = gcj02ToWgs84(lng, lat);
    converted.properties.centroid = [wgsLng, wgsLat];
  }
  return converted;
}

function fetchGitHubFile(filePath) {
  return new Promise((resolve, reject) => {
    const encodedPath = encodeURIComponent(filePath);
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${encodedPath}?ref=${BRANCH}`,
      method: 'GET',
      headers: {
        'User-Agent': 'node',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    console.log(`  URL: https://api.github.com/repos/${REPO}/contents/${encodedPath}`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const info = JSON.parse(data);
          if (info.content) {
            const content = Buffer.from(info.content, 'base64').toString('utf8');
            resolve(content);
          } else if (info.message) {
            reject(new Error(`GitHub API error: ${info.message}`));
          } else {
            reject(new Error(`Unknown response: ${data.slice(0, 200)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('Downloading real Chishui town boundaries...\n');

  const allFeatures = [];
  const results = [];

  for (const town of towns) {
    const fileName = `geo_${town}.json`;
    const filePath = `贵州省/遵义市/赤水市/${fileName}`;

    process.stdout.write(`[${town}] `);
    try {
      const content = await fetchGitHubFile(filePath);
      const geojson = JSON.parse(content);

      // Convert GCJ-02 to WGS84
      let features = [];
      if (geojson.type === 'FeatureCollection') {
        features = geojson.features.map(f => {
          const converted = convertFeature(f);
          converted.properties = converted.properties || {};
          converted.properties.name = town;
          return converted;
        });
      } else if (geojson.type === 'Feature') {
        const converted = convertFeature(geojson);
        converted.properties = converted.properties || {};
        converted.properties.name = town;
        features = [converted];
      }

      for (const f of features) {
        allFeatures.push(f);
      }

      // Save individual file
      fs.writeFileSync(`${outDir}/${town}.json`, JSON.stringify(geojson));

      // Get coordinate range
      const coords = features[0]?.geometry?.coordinates;
      let coordRange = '';
      if (coords && coords[0] && coords[0][0]) {
        const flat = coords.flat(3);
        const lngs = flat.filter((_, i) => i % 2 === 0);
        const lats = flat.filter((_, i) => i % 2 === 1);
        const minLng = Math.min(...lngs).toFixed(4);
        const maxLng = Math.max(...lngs).toFixed(4);
        const minLat = Math.min(...lats).toFixed(4);
        const maxLat = Math.max(...lats).toFixed(4);
        coordRange = ` lng:[${minLng},${maxLng}] lat:[${minLat},${maxLat}]`;
      }

      console.log(`OK ${features.length} feature(s)${coordRange}`);
      results.push({ town, status: 'OK', features: features.length });
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      results.push({ town, status: 'FAILED', error: e.message });
    }
  }

  // Write combined file
  const combined = {
    type: 'FeatureCollection',
    features: allFeatures
  };

  const combinedPath = `${outDir}/chishui-all.json`;
  fs.writeFileSync(combinedPath, JSON.stringify(combined, null, 2));
  console.log(`\nTotal: ${allFeatures.length} features`);
  console.log(`Combined file: ${combinedPath} (${(fs.statSync(combinedPath).size / 1024).toFixed(1)} KB)`);

  // Summary
  const ok = results.filter(r => r.status === 'OK').length;
  const fail = results.filter(r => r.status === 'FAILED').length;
  console.log(`\nSummary: ${ok} succeeded, ${fail} failed`);
}

main().catch(console.error);
