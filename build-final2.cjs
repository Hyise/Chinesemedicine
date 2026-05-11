const fs = require('fs');
const outDir = 'd:/中药材/public/chishui-towns-real';

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

const allFeatures = [];

// 1. Load existing 11 towns
const existing = JSON.parse(fs.readFileSync(outDir + '/chishui-all.json', 'utf8'));
for (const f of existing.features) allFeatures.push(f);
console.log('Loaded ' + existing.features.length + ' from existing chishui-all.json');

// 2. Process agent-tools .json files
const agentDir = 'C:/Users/24279/.cursor/projects/d/agent-tools/';
const townFiles = {
  'geo_宝源乡.json': '宝源乡',
  'geo_市中街道.json': '市中街道',
  'geo_白云乡.json': '白云乡',
  'geo_石堡乡.json': '石堡乡',
  'geo_金华街道.json': '金华街道',
  'geo_长沙镇.json': '长沙镇',
};

const used = new Set(existing.features.map(f => f.properties.name));
console.log('Already have: ' + [...used].sort().join(', '));

for (const [fname, townName] of Object.entries(townFiles)) {
  if (used.has(townName)) continue;
  const fpath = agentDir + fname;
  if (!fs.existsSync(fpath)) { console.log('MISSING: ' + fname); continue; }
  try {
    const obj = JSON.parse(fs.readFileSync(fpath, 'utf8'));
    if (obj.type === 'Feature' && obj.geometry) {
      obj.geometry.coordinates = convertCoords(obj.geometry.coordinates);
      obj.properties = obj.properties || {};
      obj.properties.name = townName;
      allFeatures.push(obj);
      used.add(townName);
      const coords = obj.geometry.coordinates.flat(3);
      const lngs = coords.filter((_, i) => i % 2 === 0);
      const lats = coords.filter((_, i) => i % 2 === 1);
      console.log(`OK ${townName}: lng[${Math.min(...lngs).toFixed(3)},${Math.max(...lngs).toFixed(3)}] lat[${Math.min(...lats).toFixed(3)},${Math.max(...lats).toFixed(3)}]`);
    }
  } catch(e) {
    console.log('ERROR ' + townName + ': ' + e.message);
  }
}

console.log('\nTotal features: ' + allFeatures.length);
console.log('Found: ' + [...used].sort().join(', '));
const missing = Object.values(townFiles).filter(n => !used.has(n));
if (missing.length > 0) console.log('Still missing: ' + missing.join(', '));

// Write
const combined = { type: 'FeatureCollection', features: allFeatures };
fs.writeFileSync(outDir + '/chishui-all.json', JSON.stringify(combined, null, 2));
console.log('Written: ' + (fs.statSync(outDir + '/chishui-all.json').size / 1024).toFixed(1) + ' KB');
