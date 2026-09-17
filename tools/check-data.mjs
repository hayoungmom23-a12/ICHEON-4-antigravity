/**
 * check-data.mjs - 이천 아이맵 데이터 정합성 및 문법 검사 도구 [STORY 2.6 / F6.4]
 * 실행: node tools/check-data.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

const FILES = [
  'courses.json',
  'spots.json',
  'restaurants.json'
];

let totalErrors = 0;
let totalWarnings = 0;

console.log('==============================================');
console.log(' 🔍 [이천 아이맵] 데이터 검사 도구 실행');
console.log('==============================================\n');

// 1. 파일별 JSON 문법 검사
const loadedData = {};

for (const filename of FILES) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ [파일 누락] data/${filename} 파일이 존재하지 않습니다.`);
    totalErrors++;
    continue;
  }

  const rawText = fs.readFileSync(filePath, 'utf8');
  try {
    loadedData[filename] = JSON.parse(rawText);
    console.log(`✅ [문법 통과] data/${filename} 정상`);
  } catch (err) {
    totalErrors++;
    // 오류 위치 줄 번호 추정
    let lineNum = '?';
    const match = err.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      lineNum = rawText.slice(0, pos).split('\n').length;
    }
    console.error(`❌ [문법 오류] data/${filename} 파일의 약 ${lineNum}번째 줄에 오류가 있습니다:`);
    console.error(`   👉 원인: ${err.message}`);
  }
}

// 문법 오류가 있으면 추가 검사를 건너뜁니다.
if (totalErrors > 0) {
  console.log(`\n🚨 문법 오류가 발견되어 검사를 중단합니다. (오류: ${totalErrors}건)`);
  process.exit(1);
}

// 2. 세부 비즈니스 규칙 및 관계 검사
console.log('\n--- 세부 항목 및 연결 관계 점검 ---');

const coursesData = loadedData['courses.json'];
const spotsData = loadedData['spots.json'];
const restaurantsData = loadedData['restaurants.json'];

// 스팟 ID 맵 구성
const spotMap = new Map();
if (Array.isArray(spotsData)) {
  spotsData.forEach(s => spotMap.set(s.id, s));
}

// (1) 코스 데이터 검증
if (coursesData && Array.isArray(coursesData.courses)) {
  coursesData.courses.forEach((c, idx) => {
    const cName = c.name || `코스[${idx}]`;
    if (!c.id) {
      console.error(`❌ [코스 오류] '${cName}'에 id가 없습니다.`);
      totalErrors++;
    }
    if (!c.spots || c.spots.length === 0) {
      console.error(`❌ [코스 오류] '${cName}'에 지정된 스팟이 없습니다.`);
      totalErrors++;
    } else {
      c.spots.forEach(sp => {
        if (!spotMap.has(sp.id)) {
          console.error(`❌ [참조 오류] '${cName}'가 존재하지 않는 스팟 id('${sp.id}')를 참조하고 있습니다.`);
          totalErrors++;
        }
      });
    }
  });
}

// (2) 스팟 세부 검증 (주차장 검색어, 사진 대체텍스트, 공식링크)
if (Array.isArray(spotsData)) {
  spotsData.forEach(spot => {
    const sName = spot.name || spot.id;

    // 대표 사진 대체텍스트
    if (spot.photo && spot.photo.file && !spot.photo.alt) {
      console.warn(`⚠️ [사진 권고] '${sName}' 대표 사진에 대체텍스트(alt)가 없습니다.`);
      totalWarnings++;
    }

    // 주차장 검사 (인수 기준 12번: 모든 주차장에 지도 검색어가 있어야 함)
    if (Array.isArray(spot.parkings)) {
      spot.parkings.forEach((p, pIdx) => {
        if (!p.mapQuery || !p.mapQuery.trim()) {
          console.error(`❌ [주차장 오류] '${sName}'의 주차장[${pIdx + 1}: ${p.name || '무명'}]에 지도 검색어(mapQuery)가 없습니다.`);
          totalErrors++;
        }
      });
    }

    // 시설 검사 (인수 기준 13번: 공식 페이지가 있다고 적은 시설 주소 검사)
    if (Array.isArray(spot.facilities)) {
      spot.facilities.forEach((f, fIdx) => {
        if (f.official !== undefined && f.official !== null && f.official !== '') {
          if (!f.official.startsWith('http')) {
            console.error(`❌ [시설 오류] '${sName}'의 시설 '${f.name}' 공식 페이지 URL('${f.official}')이 잘못되었습니다.`);
            totalErrors++;
          }
        }
      });
    }
  });
}

// (3) 대괄호 시드 데이터 자리표시자 점검 (알림)
let placeholderCount = 0;
for (const filename of FILES) {
  const rawText = fs.readFileSync(path.join(DATA_DIR, filename), 'utf8');
  const matches = rawText.match(/\[[^\]\r\n]*확인[^\]\r\n]*\]/g);
  if (matches) {
    placeholderCount += matches.length;
  }
}

if (placeholderCount > 0) {
  console.log(`ℹ️  [안내] 아직 미확인된 시드 데이터 자리표시자 [확인 후 기입]가 총 ${placeholderCount}건 있습니다. (개발 진행 가능 / EPIC 8에서 최종 확정 예정)`);
}

// 결과 요약
console.log('\n==============================================');
if (totalErrors === 0) {
  console.log(`🎉 모든 데이터 정합성 검사를 통과했습니다! (경고: ${totalWarnings}건)`);
  console.log('==============================================');
  process.exit(0);
} else {
  console.error(`🚨 데이터 검사 실패: 오류 ${totalErrors}건, 경고 ${totalWarnings}건`);
  console.log('==============================================');
  process.exit(1);
}
