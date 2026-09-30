import https from 'https';

function testWithOrigin(origin) {
  const url = 'https://oapi.map.naver.com/v1/validatev3?ncpClientId=f77j28v1v5&uri=' + encodeURIComponent(origin);
  https.get(url, {
    headers: {
      'Origin': origin,
      'Referer': origin,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => console.log('Origin:', origin, 'Status:', res.statusCode, 'Body:', d));
  });
}

testWithOrigin('https://icheon-4-antigravity.vercel.app/');
testWithOrigin('https://icheon-4-antigravity.vercel.app');
testWithOrigin('http://localhost:8765/');
testWithOrigin('http://localhost:8765');
testWithOrigin('http://127.0.0.1:8765/');
testWithOrigin('http://localhost');
