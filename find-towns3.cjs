const fs = require('fs');
const dir = 'C:/Users/24279/.cursor/projects/d/agent-tools/';
const files = fs.readdirSync(dir);

for (const f of files) {
  if (!f.endsWith('.txt')) continue;
  const content = fs.readFileSync(dir + f, 'utf8');
  // Look for files with Feature (not FeatureCollection) and check properties
  if (content.includes('"type":"Feature"') && content.length > 500 && !content.includes('"type":"FeatureCollection"')) {
    try {
      // Try to parse and extract properties
      const jsonMatch = content.match(/\{[\s\S]*"type"\s*:\s*"Feature"[\s\S]*\}/);
      if (!jsonMatch) continue;
      const obj = JSON.parse(jsonMatch[0]);
      if (obj.properties && (obj.properties.省 || obj.properties.town)) {
        const p = obj.properties;
        const name = p.乡 || p.town || p.name || p.city || '?';
        console.log(`${f}: size=${content.length} town=${name} province=${p.省 || ''} city=${p.市 || ''} county=${p.县 || ''}`);
      }
    } catch(e) {
      // Try reading the end of the file where properties usually are
      const lastChunk = content.slice(-500);
      const propsMatch = lastChunk.match(/"properties"\s*:\s*(\{[^}]+\})/);
      if (propsMatch) {
        try {
          const props = JSON.parse(propsMatch[1]);
          console.log(`${f}: size=${content.length} RAW props: ${propsMatch[1].substring(0, 200)}`);
        } catch(e2) {}
      }
    }
  }
}
