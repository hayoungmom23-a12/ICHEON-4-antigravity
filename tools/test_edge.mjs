import { spawn } from 'child_process';
import http from 'http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  'http://localhost:8765/#/course/seolbong-culture'
]);

setTimeout(async () => {
  try {
    http.get('http://127.0.0.1:9222/json', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log('Edge pages:', d);
        proc.kill();
      });
    });
  } catch(e) {
    console.error(e);
    proc.kill();
  }
}, 3000);
