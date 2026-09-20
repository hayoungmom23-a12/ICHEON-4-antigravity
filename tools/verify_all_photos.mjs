import fs from 'fs';
import path from 'path';

// index.html과 courses.js의 데이터 추출 검증
const indexHtml = fs.readFileSync('index.html', 'utf-8');
const coursesJs = fs.readFileSync('courses.js', 'utf-8');

// PHOTO 객체 파싱
const photoMatch = indexHtml.match(/var PHOTO = ({[\s\S]*?});/);
if (!photoMatch) {
  console.error('PHOTO dictionary not found in index.html');
  process.exit(1);
}

const photoCode = 'const PHOTO = ' + photoMatch[1] + '; return PHOTO;';
const PHOTO = new Function(photoCode)();

// courses.js 데이터 파싱
const dataCode = coursesJs.replace('window.ICHEON_DATA =', 'const data =') + '; return data;';
const ICHEON_DATA = new Function(dataCode)();

console.log('=== 검증: PHOTO 딕셔너리 항목 총', Object.keys(PHOTO).length, '개 ===');

let missingPhotos = 0;
let genericStockPhotos = 0;

for (const [key, val] of Object.entries(PHOTO)) {
  const src = val.src;
  const isLocal = src.startsWith('images/');
  let exists = true;
  let size = 0;

  if (isLocal) {
    exists = fs.existsSync(src);
    if (exists) {
      size = fs.statSync(src).size;
    }
  }

  // 제네릭 스톡 사진 체크
  const isGeneric = src.includes('History_museum') || 
                    src.includes('Art_gallery') || 
                    src.includes('Playground_slide') || 
                    src.includes('Children_playground') || 
                    src.includes('Campground.jpg') || 
                    src.includes('Woodcraft_in_the_making') || 
                    src.includes('Woodcarving.jpg') || 
                    src.includes('T-Rex_model.jpg') || 
                    src.includes('Artisan_bread.jpg') || 
                    src.includes('Bread_basket.jpg') || 
                    (src.includes('Parking_lot.jpg') && !key.includes('fallback'));

  if (isGeneric) {
    console.warn(`[WARNING: 제네릭 스톡 사진 감지] ${key} -> ${src}`);
    genericStockPhotos++;
  }

  if (isLocal && !exists) {
    console.error(`[ERROR: 로컬 파일 없음] ${key} -> ${src}`);
    missingPhotos++;
  } else {
    console.log(`[OK] ${key.padEnd(24)} -> ${isLocal ? `(로컬 ${size} bytes)` : '(원격 URL)'} | ${val.credit}`);
  }
}

console.log('\n=== 검증: SPOTS 내 주차장/시설/숙박 매핑 검사 ===');
for (const [spotId, spot] of Object.entries(ICHEON_DATA.SPOTS)) {
  console.log(`\n▶ [${spot.name}] (spotId: ${spotId})`);
  // 대표 사진
  if (!PHOTO[spot.photo]) {
    console.error(`  - 대표 사진 누락: ${spot.photo}`);
    missingPhotos++;
  } else {
    console.log(`  - 대표 사진: ${spot.photo} (${PHOTO[spot.photo].credit})`);
  }
  // 갤러리 사진들
  if (spot.photos) {
    for (const p of spot.photos) {
      if (!PHOTO[p]) {
        console.error(`  - 갤러리 사진 누락: ${p}`);
        missingPhotos++;
      } else {
        console.log(`  - 갤러리: ${p} (${PHOTO[p].credit})`);
      }
    }
  }
  // 주차장들
  if (spot.parkings) {
    for (const pkg of spot.parkings) {
      if (!PHOTO[pkg.photo]) {
        console.error(`  - 주차장 사진 누락: [${pkg.name}] ${pkg.photo}`);
        missingPhotos++;
      } else {
        console.log(`  - 주차장 [${pkg.name}]: ${pkg.photo} (${PHOTO[pkg.photo].credit})`);
      }
    }
  }
  // 숙박
  if (spot.stay) {
    if (!PHOTO[spot.stay.photo]) {
      console.error(`  - 숙박 사진 누락: ${spot.stay.photo}`);
      missingPhotos++;
    } else {
      console.log(`  - 숙박: ${spot.stay.photo} (${PHOTO[spot.stay.photo].credit})`);
    }
  }
  // 시설들
  if (spot.facilities) {
    for (const fac of spot.facilities) {
      if (!PHOTO[fac.photo]) {
        console.error(`  - 시설 사진 누락: [${fac.name}] ${fac.photo}`);
        missingPhotos++;
      } else {
        console.log(`  - 시설 [${fac.name}]: ${fac.photo} (${PHOTO[fac.photo].credit})`);
      }
    }
  }
}

console.log('\n==============================================');
console.log(`검사 완료: 누락 사진 ${missingPhotos}건, 제네릭 스톡 사진 ${genericStockPhotos}건`);
console.log('==============================================');
