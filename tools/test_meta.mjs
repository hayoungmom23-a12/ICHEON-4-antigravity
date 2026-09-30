import https from 'https';

function testMetadata(referer) {
  const options = {
    headers: {
      'Referer': referer,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  };
  https.get('https://map.pstatic.net/nvc/ctt/wmts/naver/getMetadata/v1?caller=ncp_maps&callerId=f77j28v1v5', options, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('Referer:', referer, 'Status:', res.statusCode, 'Body:', d.slice(0, 200));
    });
  });
}

testMetadata('https://icheon-4-antigravity.vercel.app/');
testMetadata('http://localhost:8765/');
testMetadata('http://localhost:8765');
