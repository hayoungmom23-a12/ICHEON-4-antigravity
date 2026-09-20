import fs from 'fs';

async function fetchImagesFromUrl(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    // og:image 추출
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    // 모든 img src 추출
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    return {
      url,
      og: ogMatch ? ogMatch[1] : null,
      images: imgMatches.slice(0, 20)
    };
  } catch (err) {
    return { url, error: err.message };
  }
}

async function run() {
  const sites = [
    { name: '이천시립박물관', url: 'https://www.artic.or.kr/icmus/main/view' },
    { name: '월전미술관', url: 'https://www.iwoljeon.org/' },
    { name: '월전미술관 소개', url: 'https://www.iwoljeon.org/museum/sub01.php' },
    { name: '경기도자미술관', url: 'https://www.gmocca.org/' },
    { name: '농업테마공원', url: 'https://farmpark.2000fmc.or.kr/' },
    { name: '농업테마공원 시설', url: 'https://farmpark.2000fmc.or.kr/park/guide' },
    { name: '농업테마공원 캠핑', url: 'https://farmpark.2000fmc.or.kr/campsite/' },
    { name: '이천목재문화체험장', url: 'https://www.2000forest.or.kr/facil/facil.php?sp=use' },
    { name: '덕평공룡수목원', url: 'https://dinovill.com/' }
  ];

  for (const s of sites) {
    const res = await fetchImagesFromUrl(s.url);
    console.log(`\n=== ${s.name} (${s.url}) ===`);
    console.log('OG Image:', res.og);
    console.log('Found Images:', res.images?.filter(i => !i.includes('.svg') && !i.includes('icon') && !i.includes('logo')).slice(0, 8));
  }
}

run();
