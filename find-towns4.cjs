const fs = require('fs');
const dir = 'C:/Users/24279/.cursor/projects/d/agent-tools/';
const files = fs.readdirSync(dir);

const found = {};

for (const f of files) {
  if (!f.endsWith('.txt')) continue;
  const content = fs.readFileSync(dir + f, 'utf8');
  if (content.includes('"type":"Feature"') && content.length > 1000 && !content.includes('"type":"FeatureCollection"')) {
    // Try to parse
    try {
      const obj = JSON.parse(content);
      if (obj.properties) {
        const p = obj.properties;
        const name = p.乡 || p.town || p.name;
        if (name) {
          found[f] = { size: content.length, name };
          const m = content.match(/(\d+\.\d+),(\d+\.\d+)/);
          console.log(`${f}: size=${content.length} name=${name} firstCoord=[${m?.[1]},${m?.[2]}]`);
        }
      }
    } catch(e) {
      // Unicode escaped - try regex
      const last500 = content.slice(-600);
      const nameMatch = last500.match(/\\u4e61["\s:]+([^",\\]+)/);
      if (nameMatch) {
        const name = nameMatch[1];
        const m = content.match(/(\d+\.\d+),(\d+\.\d+)/);
        console.log(`${f}: size=${content.length} name=${name} firstCoord=[${m?.[1]},${m?.[2]}]`);
        found[f] = { size: content.length, name };
      }
    }
  }
}

console.log('\nTotal:', Object.keys(found).length);
