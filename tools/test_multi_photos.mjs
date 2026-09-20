import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');
const js = fs.readFileSync('courses.js', 'utf-8');

const photoMatch = html.match(/var PHOTO = ({[\s\S]*?});/);
const PHOTO = new Function('return ' + photoMatch[1])();
function photoOf(k) { return PHOTO[k]; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
function isEditMode() { return false; }
const IC = { cam: () => '' };

// index.html에서 추출한 thumb 함수
const thumbMatch = html.match(/function thumb\([\s\S]*?\n\}/);
const thumb = new Function('photoOf', 'esc', 'isEditMode', 'IC', 'return ' + thumbMatch[0])(photoOf, esc, isEditMode, IC);

console.log('--- 1. 단일 사진 썸네일 테스트 ---');
const out1 = thumb('seolbong_parking_upper', null, '위쪽 주차장', '진입');
console.log('단일 사진 HTML에 thumb-zoom-hint 포함 여부:', out1.includes('thumb-zoom-hint'));
console.log('단일 사진 HTML에 thumb-count-badge 미포함 여부:', !out1.includes('thumb-count-badge'));

console.log('\n--- 2. 다중 사진 (2장) 썸네일 테스트 ---');
const out2 = thumb(['seolbong_parking_upper', 'seolbong_parking_lower'], null, '위쪽 주차장');
console.log('다중 사진 HTML에 thumb-count-badge 포함 여부:', out2.includes('thumb-count-badge'));
console.log('다중 사진 배지 내용:', out2.match(/<span class="thumb-count-badge">([^<]+)<\/span>/)?.[1]);
console.log('data-lb-list 포함 여부:', out2.includes('data-lb-list'));

console.log('\n--- 3. 다중 사진 (4장) 썸네일 테스트 ---');
const out4 = thumb(['seolbong', 'seolbong_spring', 'lake', 'seolbong_view'], null, '설봉 4장');
console.log('4장 배지 내용:', out4.match(/<span class="thumb-count-badge">([^<]+)<\/span>/)?.[1]);
console.log('4장 data-lb-list 항목 수:', JSON.parse(out4.match(/data-lb-list="([^"]+)"/)?.[1].replace(/&quot;/g, '"')).length);
