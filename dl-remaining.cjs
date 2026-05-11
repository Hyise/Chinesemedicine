const https = require('https');

const REPO = 'rooma1989/china_geo_data';
const BRANCH = 'main';
const towns = ['宝源乡', '市中街道', '白云乡', '石堡乡', '金华街道', '长沙镇'];

function fetchGitHubFile(filePath) {
  return new Promise((resolve, reject) => {
    const encodedPath = encodeURIComponent(filePath);
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${encodedPath}?ref=${BRANCH}`,
      method: 'GET',
      headers: { 'User-Agent': 'node', 'Accept': 'application/vnd.github.v3+json' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.content) {
            const content = Buffer.from(json.content, 'base64').toString('utf8');
            resolve(content);
          } else {
            reject(new Error('No content: ' + data));
          }
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  for (const town of towns) {
    const filePath = `贵州省/遵义市/赤水市/${town}.json`;
    console.log(`Fetching ${town}...`);
    try {
      const content = await fetchGitHubFile(filePath);
      const obj = JSON.parse(content);
      // Extract the Feature
      let feature = null;
      if (obj.type === 'Feature') feature = obj;
      else if (obj.type === 'FeatureCollection' && obj.features && obj.features.length > 0) feature = obj.features[0];
      else if (obj.features) feature = obj.features[0];

      if (feature) {
        // Get first coord to verify
        const coords = feature.geometry.coordinates.flat(3);
        console.log(`  OK: type=${feature.geometry.type}, coords count=${coords.length/2}`);
      } else {
        console.log(`  WARN: no feature found, obj keys: ${Object.keys(obj)}`);
      }

      // Write to agent-tools for build-final.cjs to pick up
      const fs = require('fs');
      fs.writeFileSync(`C:/Users/24279/.cursor/projects/d/agent-tools/geo_${town}.json`, JSON.stringify(obj));
      console.log(`  Saved geo_${town}.json`);
    } catch(e) {
      console.log(`  ERROR: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

main();
