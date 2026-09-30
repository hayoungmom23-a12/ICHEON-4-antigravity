import https from 'https';

https.get('https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=f77j28v1v5', {
  headers: { 'Referer': 'https://icheon-4-antigravity.vercel.app/' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Includes ncpClientId in code?', d.includes('ncpClientId'));
    console.log('Includes ncpKeyId in code?', d.includes('ncpKeyId'));
  });
});
