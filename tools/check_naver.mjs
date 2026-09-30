import https from 'https';

https.get('https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=f77j28v1v5', {
  headers: { 'Referer': 'https://icheon-4-antigravity.vercel.app/' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const authMatch = d.match(/naver\.maps\.jserror/i) || d.match(/OpenAPI/i);
    console.log('Matches:', authMatch);
    // Find auth endpoints
    const eps = d.match(/[a-z0-9_-]+\.ncloud\.com[^\s"']*/gi) || [];
    console.log('Endpoints:', [...new Set(eps)]);
  });
});
