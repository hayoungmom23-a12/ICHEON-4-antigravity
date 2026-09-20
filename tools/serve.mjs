import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handlePhotoPublish } from './photo-publish.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_PORT = 8765;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

function createServer(port) {
  const server = http.createServer((req, res) => {
    // Local preview; avoid exposing the publish endpoint to other devices.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    try {
      const parsedUrl = new URL(req.url, `http://localhost:${port}`);
      let pathname = decodeURIComponent(parsedUrl.pathname);

      if (pathname.endsWith('/')) {
        pathname += 'index.html';
      }

      if (req.method === 'POST' && pathname === '/api/save-and-push') {
        handlePhotoPublish(req, res, ROOT_DIR, port);
        return;
      }


      const filePath = path.resolve(ROOT_DIR, `.${pathname}`);

      // Prevent directory traversal
      const relative = path.relative(ROOT_DIR, filePath);
      if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(part => part.startsWith('.'))) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden');
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404 Not Found: ${pathname}`);
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      });
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`500 Internal Server Error: ${e.message}`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[미리보기 서버] 포트 ${port}번이 이미 사용 중입니다. 다음 포트 ${port + 1}번으로 시도합니다...`);
      createServer(port + 1);
    } else if (err.code === 'EACCES' && port === DEFAULT_PORT) {
      console.warn(`[미리보기 서버] 포트 ${port}번을 사용할 수 없어 12345번으로 시도합니다...`);
      createServer(12345);
    } else {
      console.error('[미리보기 서버 오류]', err);
    }
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`=========================================`);
    console.log(` [이천 아이맵 로컬 미리보기 서버]`);
    console.log(` 주소: http://localhost:${port}`);
    console.log(` 서비스 루트: ${ROOT_DIR}`);
    console.log(` 종료하려면 Ctrl+C를 누르세요.`);
    console.log(`=========================================`);
  });
}

const targetPort = parseInt(process.env.PORT || DEFAULT_PORT, 10);
createServer(targetPort);
