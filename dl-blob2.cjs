const https = require('https');
const fs = require('fs');

const missing = [
  { sha: '6dc826ffb2b84074c7f333007496ac4acce8d238', name: '宝源乡' },
  { sha: 'd63d4d0d256ddf51b8110844f9be76c2888c1acf', name: '市中街道' },
  { sha: '???', name: '白云乡' },
  { sha: '???', name: '石堡乡' },
  { sha: '???', name: '金华街道' },
  { sha: '???', name: '长沙镇' },
];

// Get remaining SHAs from tree
const treeContent = fs.readFileSync('C:/Users/24279/.cursor/projects/d/agent-tools/40bc1d96-6a19-4418-96a9-3511a9cb0825.txt', 'utf8');
const j = JSON.parse(treeContent);
for (const item of j.tree) {
  if (item.path.includes('赤水市/geo_')) {
    const name = item.path.replace('贵州省/遵义市/赤水市/geo_', '').replace('.json', '');
    if (['白云乡', '石堡乡', '金华街道', '长沙镇'].includes(name)) {
      const entry = missing.find(x => x.name === name);
      if (entry) entry.sha = item.sha;
    }
  }
}

console.log('Missing:', JSON.stringify(missing, null, 2));

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
          const json = JSON.parse(body);
          if (json.content) {
            resolve(Buffer.from(json.content, 'base64').toString('utf8'));
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
  for (const item of missing) {
    if (!item.sha || item.sha === '???') { console.log('No SHA for ' + item.name); continue; }
    console.log('Fetching ' + item.name + ' (SHA: ' + item.sha.substring(0,8) + ')...');
    try {
      const content = await fetchBlob(item.sha);
      const obj = JSON.parse(content);
      fs.writeFileSync(`C:/Users/24279/.cursor/projects/d/agent-tools/geo_${item.name}.json`, JSON.stringify(obj));
      console.log('  OK: type=' + obj.type + ', coords=' + (obj.geometry ? 'yes' : 'no'));
    } catch(e) {
      console.log('  ERROR: ' + e.message.substring(0, 100));
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log('Done!');
}

main();
