import fs from 'fs';
import path from 'path';

// 네이버 플레이스 모바일 GraphQL이나 검색을 통해 이미지 URL 가져오기
async function getNaverPlacePhotos(placeId) {
  try {
    const res = await fetch('https://api.place.naver.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify([
        {
          operationName: 'getPlaceDetail',
          variables: { input: { id: placeId } },
          query: `query getPlaceDetail($input: PlaceDetailInput) {
            placeDetail(input: $input) {
              name
              images {
                url
              }
            }
          }`
        }
      ])
    });
    const json = await res.json();
    const detail = json[0]?.data?.placeDetail;
    return detail;
  } catch (err) {
    return { error: err.message };
  }
}

// 네이버 검색 연동 또는 스마트플레이스 사진 조회
async function searchNaverImages(keyword) {
  try {
    const url = `https://map.naver.com/p/api/search/allSearch?query=${encodeURIComponent(keyword)}&type=all&searchCoord=127.427;37.278`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://map.naver.com/'
      }
    });
    const data = await res.json();
    const place = data?.result?.place?.list?.[0];
    return {
      name: place?.name,
      thumUrl: place?.thumUrl,
      thumUrls: place?.thumUrls,
      id: place?.id
    };
  } catch (e) {
    return { error: e.message };
  }
}

async function test() {
  console.log('Testing search for places...');
  const spots = [
    '이천시립박물관',
    '이천시립월전미술관',
    '경기도자미술관',
    '설봉공원놀이터',
    '설봉국제조각공원',
    '설봉공원제1주차장',
    '이천시립박물관주차장',
    '이천농업테마공원 종합안내센터',
    '이천농업테마공원 쌀문화전시관',
    '이천농업테마공원 라이스카페',
    '이천농업테마공원 물놀이장',
    '이천농업테마공원 캠핑장',
    '이천목재문화체험장',
    '덕평공룡수목원',
    '이진상회',
    '이진상회 주차장'
  ];

  for (const s of spots) {
    const r = await searchNaverImages(s);
    console.log(`[${s}] ->`, r?.name, '| id:', r?.id, '| img:', r?.thumUrl || r?.thumUrls?.[0]);
  }
}

test();
