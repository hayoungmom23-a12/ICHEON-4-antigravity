import fs from 'fs';

async function testMore() {
  const queries = [
    '이천농업테마공원 종합안내센터',
    '이천농업테마공원 제1주차장',
    '이천농업테마공원 유아숲체험원',
    '이천농업테마공원 숲체험',
    '설봉공원 위쪽 주차장',
    '설봉공원 제4주차장',
    '이천시립월전미술관 외관',
    '이천시립박물관 외관',
    '경기도자미술관 세라피아'
  ];
  for (const q of queries) {
    const url = 'https://search.daum.net/search?w=img&q=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    const html = await res.text();
    const matches = [...html.matchAll(/fname=(https?[^&"'\s]+)/gi)].map(m => decodeURIComponent(m[1]));
    const imgUrls = [...html.matchAll(/"(https?:\/\/[^"]+\.(?:jpg|jpeg|png))"/gi)].map(m => m[1]);
    const combined = [...new Set([...matches, ...imgUrls])].filter(u => 
      !u.includes('search.daum.net') && 
      !u.includes('daumcdn.net/search') &&
      !u.includes('icon')
    );
    console.log(`[${q}]`);
    console.log(combined.slice(0, 3));
  }
}

testMore();
