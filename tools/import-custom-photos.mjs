import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { savePhotos } from './photo-publish.mjs';

const root = path.resolve('.');

export function importAndPublish(customStoreJsonOrObj) {
  const data = typeof customStoreJsonOrObj === 'string'
    ? JSON.parse(customStoreJsonOrObj)
    : customStoreJsonOrObj;

  console.log('Importing custom store photos...');
  const result = savePhotos(root, data);
  console.log(`Saved ${result.count} photo changes.`);

  execFileSync('git', ['add', '--', ...result.files], { cwd: root, stdio: 'pipe' });
  let hasChanges = true;
  try {
    execFileSync('git', ['diff', '--cached', '--quiet', '--', ...result.files], { cwd: root, stdio: 'pipe' });
    hasChanges = false;
  } catch {
    hasChanges = true;
  }
  if (hasChanges) {
    execFileSync('git', ['commit', '--only', '-m', 'feat(photos): import and publish photos from client edit', '--', ...result.files], { cwd: root, stdio: 'pipe' });
    console.log('Git commit created.');
  }
  execFileSync('git', ['push', 'origin', 'HEAD:main'], { cwd: root, stdio: 'pipe', timeout: 60000 });
  console.log('Pushed to origin main.');
  return result;
}

if (process.argv[2]) {
  const raw = fs.readFileSync(process.argv[2], 'utf8');
  importAndPublish(raw);
}
