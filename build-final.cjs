const fs = require('fs');
const dir = 'C:/Users/24279/.cursor/projects/d/agent-tools/';
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

function decodeUnicode(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, function(_, code) {
    return String.fromCharCode(parseInt(code, 16));
  });
}

const files = fs.readdirSync(dir);
const allFeatures = [];

// 1. Load existing (7 already converted)
const existing = JSON.parse(fs.readFileSync(outDir + '/chishui-all.json', 'utf8'));
for (const f of existing.features) allFeatures.push(f);
console.log('Loaded ' + existing.features.length + ' from chishui-all.json');

// Map escaped unicode -> town name
const propMap = {
  '\\u4e61\\u4e19\\u5b89\\u4e61': '丙安乡',
  '\\u4e61\\u4e24\\u6cb3\\u53e3\\u4e61': '两河口乡',
  '\\u4e61\\u5143\\u539d\\u9547': '元厚镇',
  '\\u4e61\\u590d\\u5174\\u9547': '复兴镇',
  '\\u4e61\\u5927\\u540c\\u9547': '大同镇',
  '\\u4e61\\u5929\\u53f0\\u9547': '天台镇',
  '\\u4e61\\u5b98\\u6e21\\u9547': '官渡镇',
  '\\u4e61\\u5b9d\\u6e90\\u4e61': '宝源乡',
  '\\u4e61\\u5e02\\u4e2d\\u8857\\u9053': '市中街道',
  '\\u4e61\\u6587\\u534e\\u8857\\u9053': '文华街道',
  '\\u4e61\\u65fa\\u9686\\u9547': '旺隆镇',
  '\\u4e61\\u767d\\u4e91\\u4e61': '白云乡',
  '\\u4e61\\u77f3\\u5821\\u4e61': '石堡乡',
  '\\u4e61\\u84c9\\u5e02\\u9547': '葫市镇',
  '\\u4e61\\u91d1\\u534e\\u8857\\u9053': '金华街道',
  '\\u4e61\\u957f\\u671f\\u9547': '长期镇',
  '\\u4e61\\u957f\\u6c99\\u9547': '长沙镇',
};

const used = new Set(existing.features.map(function(f) { return f.properties.name; }));
console.log('Starting with: ' + [...used].join(', '));

// 2. Parse agent-tool files
for (const fname of files) {
  if (!fname.endsWith('.txt')) continue;
  const content = fs.readFileSync(dir + fname, 'utf8');
  if (!content.includes('"type":"Feature"') || content.includes('"type":"FeatureCollection"')) continue;
  if (content.length < 5000) continue;

  // Try to parse JSON
  try {
    const obj = JSON.parse(content);
    if (obj.properties) {
      // Try to get town name from properties
      let townName = null;
      const p = obj.properties;
      if (p.乡) townName = p.乡;
      else if (p.town) townName = decodeUnicode(p.town);
      else if (p.name) townName = decodeUnicode(p.name);

      if (townName && !used.has(townName)) {
        obj.geometry.coordinates = convertCoords(obj.geometry.coordinates);
        obj.properties.name = townName;
        allFeatures.push(obj);
        used.add(townName);
        var r = obj.geometry.coordinates.flat(3);
        var lngs = r.filter(function(_, i) { return i % 2 === 0; });
        var lats = r.filter(function(_, i) { return i % 2 === 1; });
        console.log('OK ' + townName + ': lng[' + Math.min.apply(null, lngs).toFixed(3) + ',' + Math.max.apply(null, lngs).toFixed(3) + '] lat[' + Math.min.apply(null, lats).toFixed(3) + ',' + Math.max.apply(null, lats).toFixed(3) + ']');
        continue;
      }
    }
  } catch(e) {}

  // Try matching by unicode-escaped pattern
  for (var escaped in propMap) {
    var townName2 = propMap[escaped];
    if (used.has(townName2)) continue;
    if (content.indexOf('"town":"' + escaped + '"') !== -1 || content.indexOf('"town":"\\u' + escaped.substring(1)) !== -1) {
      // Found! Try to parse and convert
      try {
        // Find the Feature JSON
        var match = content.match(/\{[\s\S]+"type"\s*:\s*"Feature"[\s\S]+\}/);
        if (match) {
          var obj2 = JSON.parse(match[0]);
          if (obj2.properties) {
            obj2.geometry.coordinates = convertCoords(obj2.geometry.coordinates);
            obj2.properties.name = townName2;
            allFeatures.push(obj2);
            used.add(townName2);
            var r2 = obj2.geometry.coordinates.flat(3);
            var lngs2 = r2.filter(function(_, i) { return i % 2 === 0; });
            var lats2 = r2.filter(function(_, i) { return i % 2 === 1; });
            console.log('OK2 ' + townName2 + ': lng[' + Math.min.apply(null, lngs2).toFixed(3) + ',' + Math.max.apply(null, lngs2).toFixed(3) + '] lat[' + Math.min.apply(null, lats2).toFixed(3) + ',' + Math.max.apply(null, lats2).toFixed(3) + ']');
          }
        }
      } catch(e2) {
        console.log('ERR2 ' + townName2 + ': ' + e2.message);
      }
    }
  }
}

console.log('\nTotal features: ' + allFeatures.length);
console.log('Found: ' + [...used].sort().join(', '));
var missing = Object.values(propMap).filter(function(n) { return !used.has(n); });
if (missing.length > 0) console.log('Missing: ' + missing.join(', '));

// Write final file
var combined = { type: 'FeatureCollection', features: allFeatures };
fs.writeFileSync(outDir + '/chishui-all.json', JSON.stringify(combined, null, 2));
console.log('Written: ' + (fs.statSync(outDir + '/chishui-all.json').size / 1024).toFixed(1) + ' KB');
