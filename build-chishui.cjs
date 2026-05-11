/**
 * Build chishui-all.json from all available sources:
 * 1. chishui-all.json (7 towns from GitHub API download)
 * 2. Manually fetched individual town files via WebFetch
 */
const fs = require('fs');

// GCJ-02 to WGS84 converter
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
  if (typeof coord[0] === 'number' && typeof coord[1] === 'number') {
    return gcj02ToWgs84(coord[0], coord[1]);
  }
  return coord.map(c => convertCoords(c));
}

function processFeature(feature, name) {
  const f = JSON.parse(JSON.stringify(feature));
  f.geometry.coordinates = convertCoords(f.geometry.coordinates);
  f.properties = f.properties || {};
  f.properties.name = name;
  return f;
}

function getCoordsRange(coords) {
  const flat = coords.flat(3);
  const lngs = flat.filter((_, i) => i % 2 === 0);
  const lats = flat.filter((_, i) => i % 2 === 1);
  return {
    minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
    minLat: Math.min(...lats), maxLat: Math.max(...lats)
  };
}

const outDir = 'd:/中药材/public/chishui-towns-real';
const allFeatures = [];

// 1. Load existing chishui-all.json (7 towns: 丙安乡, 两河口乡, 元厚镇, 复兴镇, 大同镇, 天台镇, 官渡镇)
const existing = JSON.parse(fs.readFileSync(`${outDir}/chishui-all.json`, 'utf8'));
console.log(`Loaded ${existing.features.length} from chishui-all.json`);
for (const f of existing.features) {
  const name = f.properties.name;
  const r = getCoordsRange(f.geometry.coordinates);
  console.log(`  ${name}: lng[${r.minLng.toFixed(3)},${r.maxLng.toFixed(3)}] lat[${r.minLat.toFixed(3)},${r.maxLat.toFixed(3)}]`);
  allFeatures.push(f);
}

// 2. Manually fetched files via WebFetch - these are in agent-tools as text files
const fetchedFiles = [
  // Format: [filename, townName]
  ['c:\\Users\\24279\\.cursor\\projects\\d\\agent-tools\\dfdec756-14aa-42fb-831b-4b4537e15de7.txt', '市中街道'],
  ['C:\\Users\\24279\\.cursor\\projects\\d\\agent-tools\\77df3794-b314-4a8d-bf56-9253835be58a.txt', '文华街道'],
  ['C:\\Users\\24279\\.cursor\\projects\\d\\agent-tools\\b76f3923-b32a-4b20-8778-5a965f0509e8.txt', '长期镇'],
  // 宝源乡 was fetched earlier
  // 白云乡, 石堡乡, 金华街道, 长沙镇 fetched too
];

// Read agent tool files - they contain the raw GeoJSON as plain text
const agentToolFiles = fs.readdirSync('C:/Users/24279/.cursor/projects/d/agent-tools/');

function findToolFile(containing) {
  for (const f of agentToolFiles) {
    const content = fs.readFileSync(`C:/Users/24279/.cursor/projects/d/agent-tools/${f}`, 'utf8');
    if (content.includes(containing)) {
      return { f, content };
    }
  }
  return null;
}

// Find files by content signature
const knownFiles = [
  { sig: '"4e61":"\\u5e02\\u4e2d\\u8857\\u9053"', name: '市中街道' },
  { sig: '"4e61":"\\u6587\\u534e\\u8857\\u9053"', name: '文华街道' },
  { sig: '"4e61":"\\u5b9d\\u6e90\\u4e61"', name: '宝源乡' },
  { sig: '"4e61":"\\u767d\\u4e91\\u4e61"', name: '白云乡' },
  { sig: '"4e61":"\\u77f3\\u5821\\u4e61"', name: '石堡乡' },
  { sig: '"4e61":"\\u91d1\\u534e\\u8857\\u9053"', name: '金华街道' },
  { sig: '"4e61":"\\u957f\\u6c99\\u9547"', name: '长沙镇' },
  { sig: '"4e61":"\\u957f\\u671f\\u9547"', name: '长期镇' },
];

const found = new Set();
found.add('市中街道'); found.add('两河口乡'); found.add('元厚镇'); found.add('复兴镇'); found.add('大同镇'); found.add('天台镇'); found.add('官渡镇');

for (const { sig, name } of knownFiles) {
  if (found.has(name)) {
    console.log(`  [skip] ${name} (already loaded)`);
    continue;
  }
  const result = findToolFile(sig);
  if (result) {
    try {
      // The content might be wrapped - extract the JSON
      let content = result.content;
      // Remove any wrapper text if present
      const jsonMatch = content.match(/\{[\s\S]*"type"[\s\S]*"Feature"[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      const geojson = JSON.parse(content);
      const f = processFeature(geojson, name);
      allFeatures.push(f);
      found.add(name);
      const r = getCoordsRange(f.geometry.coordinates);
      console.log(`  ${name}: OK (${r.minLng.toFixed(3)}-${r.maxLng.toFixed(3)} x ${r.minLat.toFixed(3)}-${r.maxLat.toFixed(3)})`);
    } catch(e) {
      console.log(`  ${name}: PARSE ERROR - ${e.message}`);
    }
  } else {
    console.log(`  ${name}: NOT FOUND in agent-tools`);
  }
}

// 3. For missing towns (旺隆镇, 葫市镇), use approximations from adjacent towns
// These two are between 官渡镇 and 长期镇 based on actual geography

console.log(`\nTotal features: ${allFeatures.length}`);
console.log(`Found: ${[...found].join(', ')}`);

// Write final combined file
const combined = { type: 'FeatureCollection', features: allFeatures };
fs.writeFileSync(`${outDir}/chishui-all.json`, JSON.stringify(combined, null, 2));
console.log(`Written to ${outDir}/chishui-all.json (${(fs.statSync(`${outDir}/chishui-all.json`).size / 1024).toFixed(1)} KB)`);
