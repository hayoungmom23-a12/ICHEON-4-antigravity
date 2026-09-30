import https from 'https';

https.get('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', res => {
  console.log('Leaflet CDN status:', res.statusCode);
});
https.get('https://tile.openstreetmap.org/11/1709/797.png', {
  headers: { 'User-Agent': 'IcheonMap/1.0' }
}, res => {
  console.log('OSM tile status:', res.statusCode);
});
