import { spawn } from 'child_process';
import http from 'http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9225',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\user\\Desktop\\바이브코딩\\ICHEON_antigravity\\scratch\\edge-profile',
  'http://localhost:8765/'
]);

setTimeout(async () => {
  try {
    http.get('http://127.0.0.1:9225/json', async res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', async () => {
        const pages = JSON.parse(d);
        const page = pages.find(p => p.url.includes('localhost:8765'));
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        let id = 1;
        function send(method, params = {}) {
          ws.send(JSON.stringify({ id: id++, method, params }));
        }

        ws.onopen = () => {
          send('Runtime.enable');
          send('Log.enable');

          // Navigate to hash
          setTimeout(() => {
            console.log('Navigating to hash...');
            send('Runtime.evaluate', {
              expression: `
                window.location.hash = '#/course/seolbong-culture';
                window.location.href;
              `
            });
          }, 500);

          setTimeout(() => {
            console.log('Finding and clicking [data-toggle-pmap]...');
            send('Runtime.evaluate', {
              expression: `
                (function() {
                  const btn = document.querySelector('[data-toggle-pmap]');
                  if (btn) {
                    btn.click();
                    return 'clicked: ' + btn.textContent + ' (key: ' + btn.dataset.togglePmap + ')';
                  }
                  return 'btn not found. buttons in doc: ' + document.querySelectorAll('button').length;
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
                  canvasHtml: document.getElementById('seolbong-upper-canvas') ? document.getElementById('seolbong-upper-canvas').innerHTML : '',
                  hasNaver: !!window.naver,
                  hasNaverMaps: !!(window.naver && window.naver.maps)
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
