import fs from 'fs';

async function searchDaumImage(query) {
  try {
    const url = `https://search.daum.net/search?w=img&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    // 다음 이미지 검색 결과의 data-src 또는 src 추출
    // 보통 class="thumb_img" src="..." 또는 fname=http...
    const matches = [...html.matchAll(/fname=(https?[^&"'\s]+)/gi)].map(m => decodeURIComponent(m[1]));
    const imgUrls = [...html.matchAll(/"(https?:\/\/[^"]+\.(?:jpg|jpeg|png))"/gi)].map(m => m[1]);
    
    const combined = [...new Set([...matches, ...imgUrls])].filter(u => 
      !u.includes('search.daum.net') && 
      !u.includes('daumcdn.net/search') &&
      !u.includes('icon') &&
      !u.includes('profile')
    );

    return combined.slice(0, 5);
  } catch (err) {
    return [err.message];
  }
}

async function test() {
  const targets = [
    '이천 설봉공원 제1주차장',
    '이천시립박물관 주차장',
    '이천 설봉공원 놀이터',
    '경기도자미술관 외관',
    '이천농업테마공원 안내센터 주차장',
    '이천농업테마공원 생태주차장',
    '이천농업테마공원 라이스카페',
    '이천농업테마공원 물놀이터',
    '이천농업테마공원 숲놀이터',
    '이천농업테마공원 캠핑장',
    '이천목재문화체험장 주차장',
    '이천목재문화체험장 체험',
    '덕평공룡수목원 주차장',
    '덕평공룡수목원 공룡',
    '이진상회 주차장',
    '이진상회 빵 베이커리'
  ];

  for (const t of targets) {
    const res = await searchDaumImage(t);
    console.log(`\n[${t}]`);
    console.log(res);
  }
}

test();
