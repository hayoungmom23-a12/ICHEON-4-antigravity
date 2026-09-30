import { spawn } from 'child_process';
import http from 'http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9224',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\user\\Desktop\\바이브코딩\\ICHEON_antigravity\\scratch\\edge-profile',
  'http://localhost:8765/#/course/seolbong-culture'
]);

setTimeout(async () => {
  try {
    http.get('http://127.0.0.1:9224/json', async res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', async () => {
        const pages = JSON.parse(d);
        const page = pages.find(p => p.url.includes('localhost:8765'));
        if (!page) {
          console.log('Page not found');
          proc.kill();
          return;
        }
        console.log('Target page found:', page.webSocketDebuggerUrl);
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        let id = 1;
        function send(method, params = {}) {
          ws.send(JSON.stringify({ id: id++, method, params }));
        }

        ws.onopen = () => {
          send('Runtime.enable');
          send('Log.enable');
          send('Page.enable');

          setTimeout(() => {
            console.log('Clicking [data-toggle-pmap]...');
            send('Runtime.evaluate', {
              expression: `
                (function() {
                  const btn = document.querySelector('[data-toggle-pmap]');
                  if (btn) {
                    btn.click();
                    return 'clicked: ' + btn.textContent;
                  }
                  return 'btn not found';
                })()
              `
            });
          }, 1500);

          setTimeout(() => {
            send('Runtime.evaluate', {
              expression: `
                JSON.stringify({
                  canvasExists: !!document.getElementById('seolbong-upper-canvas'),
                  canvasChildren: document.getElementById('seolbong-upper-canvas') ? document.getElementById('seolbong-upper-canvas').children.length : 0,
                  canvasHtml: document.getElementById('seolbong-upper-canvas') ? document.getElementById('seolbong-upper-canvas').innerHTML.slice(0, 300) : '',
                  hasNaver: !!window.naver,
                  hasNaverMaps: !!(window.naver && window.naver.maps),
                  scriptTags: Array.from(document.querySelectorAll('script')).map(s => s.src).filter(Boolean)
                })
              `
            });
          }, 4000);

          setTimeout(() => {
            ws.close();
            proc.kill();
          }, 6000);
        };

        ws.onmessage = event => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('[Console]', msg.params.type, msg.params.args.map(a => a.value));
          } else if (msg.method === 'Log.entryAdded') {
            console.log('[Log]', msg.params.entry.text);
          } else if (msg.result && msg.result.result) {
            console.log('[Eval Result]', msg.result.result.value);
          }
        };
      });
    });
  } catch(e) {
    console.error(e);
    proc.kill();
  }
}, 2000);
