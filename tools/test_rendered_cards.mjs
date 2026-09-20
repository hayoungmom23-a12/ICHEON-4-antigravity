import fs from 'fs';

// index.html과 courses.js를 읽어 렌더링 함수 검증
const indexHtml = fs.readFileSync('index.html', 'utf-8');
const coursesJs = fs.readFileSync('courses.js', 'utf-8');

// PHOTO 객체 및 ICHEON_DATA 추출
const photoMatch = indexHtml.match(/var PHOTO = ({[\s\S]*?});/);
const PHOTO = new Function('return ' + photoMatch[1])();

const dataCode = coursesJs.replace('window.ICHEON_DATA =', 'return ') + ';';
const ICHEON_DATA = new Function(dataCode)();

function photoUrl(key) {
  var p = PHOTO[key];
  if (!p) return '';
  return typeof p === 'string' ? p : (p.src || '');
}

function photoCredit(key) {
  var p = PHOTO[key];
  if (!p || typeof p === 'string') return '';
  return p.credit || '';
}

console.log('=====================================================');
console.log(' [이천 아이맵] 5개 코스별 실제 사진 렌더링 시뮬레이션');
console.log('=====================================================');

for (const course of ICHEON_DATA.COURSES) {
  console.log(`\n=====================================================`);
  console.log(`📌 코스 [${course.id}]: ${course.name}`);
  console.log(`=====================================================`);

  for (const sRef of course.spots) {
    const spot = ICHEON_DATA.SPOTS[sRef.id];
    console.log(`\n  ▶ 스팟: ${spot.name} (id: ${sRef.id})`);
    console.log(`    - 대표 사진: ${photoUrl(spot.photo)} [${photoCredit(spot.photo)}]`);

    // 주차장
    if (spot.parkings && spot.parkings.length > 0) {
      console.log(`    [주차장 카드 목록]`);
      for (const p of spot.parkings) {
        const url = photoUrl(p.photo);
        const credit = photoCredit(p.photo);
        console.log(`      * ${p.name}:`);
        console.log(`        - 이미지 파일: ${url}`);
        console.log(`        - 사진 출처명: [${credit}]`);
        console.log(`        - 진입 안내: ${p.entry}`);
      }
    }

    // 시설
    if (spot.facilities && spot.facilities.length > 0) {
      console.log(`    [추천 장소/시설 카드 목록]`);
      for (const f of spot.facilities) {
        const url = photoUrl(f.photo);
        const credit = photoCredit(f.photo);
        console.log(`      * ${f.name}:`);
        console.log(`        - 이미지 파일: ${url}`);
        console.log(`        - 사진 출처명: [${credit}]`);
      }
    }

    // 숙박
    if (spot.stay) {
      console.log(`    [숙박 정보 카드]`);
      console.log(`      * 이미지: ${photoUrl(spot.stay.photo)} [${photoCredit(spot.stay.photo)}]`);
      console.log(`      * 안내: ${spot.stay.text}`);
    }
  }
}
