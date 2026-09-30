import https from 'https';

function testUrl(name, url, referer) {
  https.get(url, {
    headers: {
      'Referer': referer,
      'User-Agent': 'Mozilla/5.0'
    }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(name, referer, 'status:', res.statusCode, 'body:', d);
    });
  });
}

testUrl('ncpClientId', 'https://oapi.map.naver.com/v1/validatev3?ncpClientId=f77j28v1v5&uri=' + encodeURIComponent('http://localhost:8765/'), 'http://localhost:8765/');
testUrl('ncpClientId', 'https://oapi.map.naver.com/v1/validatev3?ncpClientId=f77j28v1v5&uri=' + encodeURIComponent('http://localhost:8765'), 'http://localhost:8765');
testUrl('ncpClientId', 'https://oapi.map.naver.com/v1/validatev3?ncpClientId=f77j28v1v5&uri=' + encodeURIComponent('http://127.0.0.1:8765/'), 'http://127.0.0.1:8765/');
testUrl('ncpClientId', 'https://oapi.map.naver.com/v1/validatev3?ncpClientId=f77j28v1v5&uri=' + encodeURIComponent('http://localhost:8080/'), 'http://localhost:8080/');
testUrl('ncpClientId', 'https://oapi.map.naver.com/v1/validatev3?ncpClientId=f77j28v1v5&uri=' + encodeURIComponent('http://localhost:3000/'), 'http://localhost:3000/');
