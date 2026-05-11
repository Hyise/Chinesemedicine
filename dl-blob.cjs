const https = require('https');
const fs = require('fs');

const missing = [
  '贵州省/遵义市/赤水市/宝源乡.json',
  '贵州省/遵义市/赤水市/市中街道.json',
  '贵州省/遵义市/赤水市/白云乡.json',
  '贵州省/遵义市/赤水市/石堡乡.json',
  '贵州省/遵义市/赤水市/金华街道.json',
  '贵州省/遵义市/赤水市/长沙镇.json',
];

// Read tree file
const treeContent = fs.readFileSync('C:/Users/24279/.cursor/projects/d/agent-tools/40bc1d96-6a19-4418-96a9-3511a9cb0825.txt', 'utf8');
const j = JSON.parse(treeContent);
const treeMap = {};
for (const item of j.tree) {
  if (item.path.includes('赤水市/geo_')) {
    treeMap[item.path] = item.sha;
  }
}

function fetchBlob(sha) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/repos/rooma1989/china_geo_data/git/blobs/' + sha,
      method: 'GET',
      headers: {
        'User-Agent': 'node',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.content) {
            resolve(Buffer.from(j.content, 'base64').toString('utf8'));
          } else {
            reject(new Error('No content: ' + body.substring(0, 200)));
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
  for (const path of missing) {
    const sha = treeMap[path];
    if (!sha) { console.log('No SHA for ' + path); continue; }
    const name = path.split('/').pop().replace('.json', '');
    console.log('Fetching ' + name + ' (SHA: ' + sha.substring(0,8) + ')...');
    try {
      const content = await fetchBlob(sha);
      const obj = JSON.parse(content);
      fs.writeFileSync(`C:/Users/24279/.cursor/projects/d/agent-tools/geo_${name}.json`, JSON.stringify(obj));
      console.log('  OK: ' + obj.type + ', coords length: ' + (obj.geometry ? obj.geometry.coordinates.flat(3).length : 'N/A'));
    } catch(e) {
      console.log('  ERROR: ' + e.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  console.log('Done!');
}

main();
