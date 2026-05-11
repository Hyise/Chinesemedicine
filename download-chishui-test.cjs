const https = require('https');
const http = require('http');
const fs = require('fs');

const outDir = 'd:/中药材/public/chishui-towns-real';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const towns = [
  '丙安乡', '两河口乡', '元厚镇', '复兴镇', '大同镇', '天台镇',
  '官渡镇', '宝源乡', '市中街道', '文华街道', '旺隆镇', '白云乡',
  '石堡乡', '葫市镇', '金华街道', '长期镇', '长沙镇'
];

// First check what hosts are reachable
function testHost(host) {
  return new Promise((resolve) => {
    const mod = host.startsWith('https') ? https : http;
    const urlObj = new URL(host);
    const req = mod.request({ hostname: urlObj.hostname, path: urlObj.pathname, method: 'HEAD' }, (res) => {
      console.log(`${host}: ${res.statusCode}`);
      resolve(res.statusCode);
    });
    req.on('error', (e) => {
      console.log(`${host}: ERROR ${e.message}`);
      resolve(null);
    });
    req.end();
  });
}

async function test() {
  await testHost('https://api.github.com');
  await testHost('https://raw.githubusercontent.com');
  await testHost('http://raw.githubusercontent.com');
}

test().then(() => {
  // Then try fetching via GitHub API
  console.log('\nTrying GitHub API...');
  const encodedPath = encodeURIComponent('贵州省/遵义市/赤水市/geo_官渡镇.json');
  const apiUrl = `https://api.github.com/repos/rooma1989/china_geo_data/contents/${encodedPath}`;

  https.get(apiUrl, { headers: { 'User-Agent': 'node' } }, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try {
        const info = JSON.parse(data);
        if (info.content) {
          const content = Buffer.from(info.content, 'base64').toString('utf8');
          console.log(`SUCCESS! Content length: ${content.length}`);
          console.log(`First 200 chars: ${content.slice(0, 200)}`);
          fs.writeFileSync(`${outDir}/test-guanduzhen.json`, content);
        } else {
          console.log('No content field, response:', data.slice(0, 300));
        }
      } catch (e) {
        console.log('Parse error:', e.message);
        console.log('Response:', data.slice(0, 500));
      }
    });
  }).on('error', (e) => console.log('API Error:', e.message));
});
