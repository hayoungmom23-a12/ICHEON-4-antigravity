import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');

// LocalStorage 모킹
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  removeItem: (k) => { delete storage[k]; }
};

const photoMatch = html.match(/var PHOTO = ({[\s\S]*?});/);
const PHOTO = new Function('return ' + photoMatch[1])();
function photoOf(k) {
  var store = JSON.parse(storage['icheon_custom_photos'] || '{}');
  if (store.keys && store.keys[k]) return store.keys[k];
  return PHOTO[k] || null;
}
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
function isEditMode() { return true; }
const IC = { cam: () => '' };

function getCustomStore() {
  try { return JSON.parse(storage['icheon_custom_photos'] || '{}'); } catch (e) { return {}; }
}
function setCustomStore(store) {
  storage['icheon_custom_photos'] = JSON.stringify(store);
}

// index.html에서 추출한 함수들
const getKeyExtraPhotosMatch = html.match(/function getKeyExtraPhotos\([\s\S]*?\n\}/);
const getKeyExtraPhotos = new Function('getCustomStore', 'return ' + getKeyExtraPhotosMatch[0])(getCustomStore);

const addKeyExtraPhotoMatch = html.match(/function addKeyExtraPhoto\([\s\S]*?\n\}/);
const addKeyExtraPhoto = new Function('getCustomStore', 'setCustomStore', 'return ' + addKeyExtraPhotoMatch[0])(getCustomStore, setCustomStore);

const thumbMatch = html.match(/function thumb\([\s\S]*?\n\}/);
const thumb = new Function('photoOf', 'getKeyExtraPhotos', 'esc', 'isEditMode', 'IC', 'return ' + thumbMatch[0])(photoOf, getKeyExtraPhotos, esc, isEditMode, IC);

console.log('=== 1. 초기 상태: 기본 사진 1장인 주차장 ===');
let out = thumb('seolbong_parking_upper', null, '위쪽 주차장', '진입', 'seolbong_pk_0');
console.log('초기 배지 확인 (없어야 정상):', out.includes('thumb-count-badge'));
console.log('초기 힌트 확인 (있어야 정상):', out.includes('thumb-zoom-hint'));

console.log('\n=== 2. 사용자가 📷 버튼 클릭해서 1장 추가 등록 ===');
addKeyExtraPhoto('seolbong_pk_0', 'data:image/jpeg;base64,sample1', '현장 추가 사진 1');
out = thumb('seolbong_parking_upper', null, '위쪽 주차장', '진입', 'seolbong_pk_0');
console.log('배지 포함 여부:', out.includes('thumb-count-badge'));
console.log('배지 내용:', out.match(/<span class="thumb-count-badge">([^<]+)<\/span>/)?.[1]);

console.log('\n=== 3. 사용자가 📷 버튼 클릭해서 2장 더 추가 등록 (총 4장) ===');
addKeyExtraPhoto('seolbong_pk_0', 'data:image/jpeg;base64,sample2', '현장 추가 사진 2');
addKeyExtraPhoto('seolbong_pk_0', 'data:image/jpeg;base64,sample3', '현장 추가 사진 3');
out = thumb('seolbong_parking_upper', null, '위쪽 주차장', '진입', 'seolbong_pk_0');
console.log('배지 내용 (📷 4 나와야 함):', out.match(/<span class="thumb-count-badge">([^<]+)<\/span>/)?.[1]);

console.log('\n=== 4. 라이트박스 목록에 4장 모두 들어있는지 검증 ===');
const listJson = JSON.parse(out.match(/data-lb-list="([^"]+)"/)?.[1].replace(/&quot;/g, '"'));
console.log('라이트박스 사진 수:', listJson.length);
listJson.forEach((item, i) => console.log(`  [${i+1}] ${item.caption}`));

console.log('\n=== 5. 4장 초과 등록 시 최대 4장 유지 검증 ===');
addKeyExtraPhoto('seolbong_pk_0', 'data:image/jpeg;base64,sample4', '현장 추가 사진 4');
out = thumb('seolbong_parking_upper', null, '위쪽 주차장', '진입', 'seolbong_pk_0');
console.log('초과 등록 후 배지 내용:', out.match(/<span class="thumb-count-badge">([^<]+)<\/span>/)?.[1]);
