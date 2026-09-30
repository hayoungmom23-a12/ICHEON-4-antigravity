import https from 'https';

function testUrl(name, url) {
  https.get(url, {
    headers: {
      'Referer': 'https://icheon-4-antigravity.vercel.app/',
      'User-Agent': 'Mozilla/5.0'
    }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(name, 'status:', res.statusCode, 'body:', d);
    });
  });
}

testUrl('validatev3 (ncpClientId)', 'https://oapi.map.naver.com/v1/validatev3?ncpClientId=f77j28v1v5&uri=' + encodeURIComponent('https://icheon-4-antigravity.vercel.app/'));
testUrl('v3/auth (ncpKeyId)', 'https://oapi.map.naver.com/v3/auth?ncpKeyId=f77j28v1v5&url=' + encodeURIComponent('https://icheon-4-antigravity.vercel.app/'));
