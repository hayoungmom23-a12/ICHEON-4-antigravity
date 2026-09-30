import https from 'https';
import vm from 'vm';

https.get('https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=f77j28v1v5', {
  headers: { 'Referer': 'https://icheon-4-antigravity.vercel.app/' }
}, res => {
  let code = '';
  res.on('data', c => code += c);
  res.on('end', () => {
    // Create a mock browser window in VM
    const mockWindow = {
      location: { href: 'https://icheon-4-antigravity.vercel.app/', hostname: 'icheon-4-antigravity.vercel.app' },
      document: {
        createElement: () => ({ setAttribute: () => {}, style: {} }),
        getElementsByTagName: () => [],
        head: { appendChild: () => {} },
        documentElement: { style: {} }
      },
      navigator: { userAgent: 'Mozilla/5.0' },
      addEventListener: () => {}
    };
    mockWindow.window = mockWindow;
    try {
      vm.createContext(mockWindow);
      vm.runInContext(code, mockWindow);
      console.log('naver defined?', !!mockWindow.naver);
      console.log('naver.maps defined?', !!(mockWindow.naver && mockWindow.naver.maps));
      if (mockWindow.naver && mockWindow.naver.maps) {
        const maps = mockWindow.naver.maps;
        console.log('Testing LatLngBounds:');
        const b = new maps.LatLngBounds();
        console.log('Empty LatLngBounds:', b);
        const p1 = new maps.LatLng(37.27703, 127.42385);
        b.extend(p1);
        console.log('Extended bounds:', b);
      }
    } catch(e) {
      console.log('VM error:', e);
    }
  });
});
