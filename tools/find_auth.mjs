import https from 'https';

https.get('https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=f77j28v1v5', {
  headers: { 'Referer': 'https://icheon-4-antigravity.vercel.app/' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Search for fetch or XMLHttpRequest or jsonp in maps.js
    const matches = d.match(/https?:\/\/[a-zA-Z0-9.-]+\/[^"']+/g) || [];
    console.log('Unique URLs in maps.js:', [...new Set(matches)]);
  });
});
