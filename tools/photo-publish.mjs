import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const MAX_BODY = 40 * 1024 * 1024;
const MAX_IMAGE = 8 * 1024 * 1024;

function reply(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function validId(id) {
  if (!/^[a-z0-9_-]{1,70}$/i.test(id) || ['__proto__', 'constructor', 'prototype'].includes(id)) {
    throw new Error('사진 항목 이름이 올바르지 않습니다.');
  }
  return id;
}

export function savePhotos(root, data) {
  const manifestPath = path.join(root, 'data', 'published-photos.json');
  const thumbs = path.join(root, 'images', 'thumbs');
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : { keys: {}, keyExtras: {}, spotExtras: {} };
  const files = [];
  let count = 0;
  fs.mkdirSync(thumbs, { recursive: true });

  function save(item, baseName) {
    const match = item && typeof item.src === 'string'
      ? /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/]+={0,2})$/.exec(item.src) : null;
    if (!match) {
      throw new Error('JPEG 또는 PNG 이미지만 저장할 수 있습니다.');
    }
    const bytes = Buffer.from(match[2], 'base64');
    const isJpeg = match[1] === 'jpeg';
    const valid = isJpeg
      ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if (!bytes.length || bytes.length > MAX_IMAGE || !valid) {
      throw new Error('사진 파일 형식이나 크기를 확인해 주세요.');
    }
    const credit = typeof item.credit === 'string' ? item.credit.trim().slice(0, 150) : '';
    const filename = `${baseName}.${isJpeg ? 'jpg' : 'png'}`;
    const relative = `images/thumbs/${filename}`;
    fs.writeFileSync(path.join(thumbs, filename), bytes);
    files.push(relative);
    count++;
    return { src: relative, credit: credit || '직접 등록한 사진' };
  }

  for (const [key, item] of Object.entries(data.keys || {})) {
    validId(key);
    manifest.keys[key] = save(item, `custom_key_${key}`);
  }
  for (const [key, items] of Object.entries(data.keyExtras || {})) {
    validId(key);
    if (!Array.isArray(items) || items.length > 4) throw new Error('항목별 사진은 최대 4장입니다.');
    const added = items.map(item => save(item, `custom_key_${key}_extra_${randomUUID()}`));
    manifest.keyExtras[key] = (manifest.keyExtras[key] || []).concat(added).slice(-4);
  }
  for (const [spotId, items] of Object.entries(data.spotExtras || {})) {
    validId(spotId);
    if (!Array.isArray(items) || items.length > 8) throw new Error('스팟별 사진은 최대 8장입니다.');
    const added = items.map(item => save(item, `custom_spot_${spotId}_extra_${randomUUID()}`));
    manifest.spotExtras[spotId] = (manifest.spotExtras[spotId] || []).concat(added).slice(-8);
  }
  if (!count) throw new Error('반영할 사진이 없습니다. 먼저 사진을 등록해 주세요.');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  return { count, files: [...new Set([
    'index.html', 'tools/serve.mjs', 'tools/photo-publish.mjs',
    'data/published-photos.json', ...files
  ])] };
}

export function handlePhotoPublish(req, res, root, port) {
  const hosts = [`localhost:${port}`, `127.0.0.1:${port}`];
  const origins = [`http://localhost:${port}`, `http://127.0.0.1:${port}`];
  if (!hosts.includes(req.headers.host) || !origins.includes(req.headers.origin)) {
    reply(res, 403, { success: false, error: '로컬 미리보기 페이지에서만 반영할 수 있습니다.' });
    return;
  }
  let chunks = [];
  let length = 0;
  req.on('data', chunk => {
    length += chunk.length;
    if (length > MAX_BODY) {
      reply(res, 413, { success: false, error: '사진 용량이 너무 큽니다. 나누어 반영해 주세요.' });
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => {
    try {
      const result = savePhotos(root, JSON.parse(Buffer.concat(chunks).toString('utf8')));
      try {
        // Commit only the generated photos, their manifest, and the page that reads it.
        // Other working-tree edits are intentionally excluded.
        execFileSync('git', ['add', '--', ...result.files], { cwd: root, stdio: 'pipe' });
        let hasChanges = true;
        try { execFileSync('git', ['diff', '--cached', '--quiet', '--', ...result.files], { cwd: root, stdio: 'pipe' }); hasChanges = false; }
        catch { /* Changes are staged. */ }
        if (hasChanges) execFileSync('git', ['commit', '--only', '-m', 'feat(photos): publish edited photos', '--', ...result.files], { cwd: root, stdio: 'pipe' });
        execFileSync('git', ['push', 'origin', 'HEAD:main'], { cwd: root, stdio: 'pipe', timeout: 60000 });
        reply(res, 200, { success: true, count: result.count, message: `사진 ${result.count}장을 저장하고 GitHub에 반영했습니다.` });
      } catch (error) {
        reply(res, 502, { success: false, saved: true, count: result.count,
          error: `사진은 이 컴퓨터에 저장됐지만 GitHub 반영에 실패했습니다. ${String(error.stderr || error.message).slice(0, 500)}` });
      }
    } catch (error) {
      reply(res, 400, { success: false, saved: false, error: error.message });
    }
  });
}
