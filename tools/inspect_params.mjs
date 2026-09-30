import https from 'https';

https.get('https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=f77j28v1v5', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const lines = d.split(';');
    lines.forEach(l => {
      if (l.includes('ncpClientId') || l.includes('ncpKeyId') || l.includes('govClientId') || l.includes('finClientId')) {
        console.log('Param handling code:', l);
      }
    });
  });
});
