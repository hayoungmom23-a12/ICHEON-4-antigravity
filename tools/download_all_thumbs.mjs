import fs from 'fs';
import path from 'path';

const THUMBS_DIR = path.resolve('images/thumbs');
if (!fs.existsSync(THUMBS_DIR)) {
  fs.mkdirSync(THUMBS_DIR, { recursive: true });
}

// 각 스팟 및 시설/주차장의 실사 이미지 매핑 목록
const ASSETS = [
  // 1. 설봉공원
  {
    key: 'seolbong_parking_upper',
    file: 'seolbong_parking_upper.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/dRK08B/btsJS634EOd/o3SBQK8R2sLIU9rihpdjlk/img.jpg',
      'https://blog.kakaocdn.net/dn/sTaOU/btsGPO45aHF/5nldHkebCmolkgL413yg8K/img.jpg'
    ]
  },
  {
    key: 'seolbong_parking_lower',
    file: 'seolbong_parking_lower.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/sTaOU/btsGPO45aHF/5nldHkebCmolkgL413yg8K/img.jpg',
      'http://www.tookyung.com/news/photo/202305/374116_374603_0109.jpg'
    ]
  },
  {
    key: 'seolbong_museum',
    file: 'seolbong_museum.jpg',
    urls: [
      'https://koreaartguide.com/data/file/museum/3529501830_gIY49pMX_bd81796b449e177d4e2f72aa0dcece3676c7c187.jpg',
      'https://blog.kakaocdn.net/dn/bwjlVx/btsNJqczSXn/c3iXfXJKW09FPlVHScfu90/img.jpg',
      'http://tong.visitkorea.or.kr/cms/resource/33/2845633_image2_1.jpg'
    ]
  },
  {
    key: 'woljeon_art',
    file: 'woljeon_art.jpg',
    urls: [
      'https://koreaartguide.com/data/file/museum/2105810030_7rjkTp8d_bc53d85a2a9495b9a81b2dd2825b8e4dc86a340a.jpg',
      'https://t1.daumcdn.net/news/202412/05/kyeonggi/20241205151322830walk.jpg'
    ]
  },
  {
    key: 'ceramic',
    file: 'ceramic.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/bS8WTQ/btrvZ4rXT1q/STuPY76hkpOnWCNjLK4n0K/img.jpg',
      'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250519_59%2F1747621724421a1DiM_JPEG%2F%25B0%25E6%25B1%25E2%25B5%25B5%25C0%25DA%25B9%25CC%25BC%25FA%25B0%25FC_%25282%2529.jpg'
    ]
  },
  {
    key: 'seolbong_play',
    file: 'seolbong_play.jpg',
    urls: [
      'https://t1.daumcdn.net/news/202312/04/akn/20231204151417941pwcl.jpg',
      'https://t1.daumcdn.net/news/202312/05/inews24/20231205161958974hcpt.png'
    ]
  },
  {
    key: 'seolbong_sculpture',
    file: 'seolbong_sculpture.jpg',
    urls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Seolbong_Park,_Icheon.jpg?width=640'
    ]
  },
  {
    key: 'lake',
    file: 'lake.jpg',
    urls: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lake_at_Seolbong_Park_4.jpg?width=480'
    ]
  },

  // 2. 이천농업테마공원
  {
    key: 'farmpark_parking_temp',
    file: 'farmpark_parking_temp.jpg',
    urls: [
      'http://tong.visitkorea.or.kr/cms/resource/04/2764104_image2_1.png',
      'https://t1.daumcdn.net/news/202410/16/ohmynews/20241016060004440laed.jpg'
    ]
  },
  {
    key: 'farmpark_parking_eco',
    file: 'farmpark_parking_eco.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/dJye13/btrJn7gKAmg/tBC5SomkkF5WbXTrY4oVh1/img.jpg',
      'https://blog.kakaocdn.net/dn/epRwTJ/dJMb9QFgT67/7KxVeXPceKauFAX728KmZk/img.png'
    ]
  },
  {
    key: 'farmpark_parking_back',
    file: 'farmpark_parking_back.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/epRwTJ/dJMb9QFgT67/7KxVeXPceKauFAX728KmZk/img.png'
    ]
  },
  {
    key: 'rice_fest',
    file: 'rice_fest.jpg',
    urls: [
      'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=aab15f9d-a70d-4e55-8c6b-c508d07342a5'
    ]
  },
  {
    key: 'rice_food',
    file: 'rice_food.jpg',
    urls: [
      'https://t1.daumcdn.net/news/202307/18/ohmynews/20230718180010309ngla.jpg',
      'https://t1.daumcdn.net/news/202507/29/nocut/20250729093306146bcxm.jpg'
    ]
  },
  {
    key: 'farmpark_forest',
    file: 'farmpark_forest.jpg',
    urls: [
      'https://t1.daumcdn.net/news/201710/16/TourKorea/20171016104037934zaju.jpg',
      'https://image.mom-mom.net/eyJrZXkiOiJtaWdyYXRlZC9wbGFjZXMvNjMwODJmMDhmNWFiZmM1ZmQzYzQyOGM1IiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo3NDIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX19fQ=='
    ]
  },
  {
    key: 'farmpark_water',
    file: 'farmpark_water.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/croIeF/btrZbOzdm9U/8FpUm32BXLS3nTQ0BX84nK/img.jpg',
      'https://phinf.pstatic.net/tvcast/20260718_73/ydl1_1784364792732xj8gh_JPEG/PublishThumb_20260718_175239_060.jpg'
    ]
  },
  {
    key: 'farmpark_camp',
    file: 'farmpark_camp.jpg',
    urls: [
      'https://gocamping.or.kr/upload/camp/7763/thumb/thumb_720_4446Qc0CN4y0tH3VLVz2uLWh.jpg',
      'http://farmpark.2000fmc.or.kr/campsite/images/img/og.jpg'
    ]
  },

  // 3. 이천목재문화체험장
  {
    key: 'wood_parking',
    file: 'wood_parking.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/c6q5n6/btsNOmG8fMd/APzutDyX9PxK1mZMKq7AK0/img.jpg'
    ]
  },
  {
    key: 'woodcraft',
    file: 'woodcraft.jpg',
    urls: [
      'https://t1.daumcdn.net/news/202407/22/akn/20240722104809387gbdd.jpg',
      'http://www.sisai.co.kr/news/photo/202601/27318_26698_5258.jpg'
    ]
  },
  {
    key: 'woodcarving',
    file: 'woodcarving.jpg',
    urls: [
      'http://www.sisai.co.kr/news/photo/202601/27318_26698_5258.jpg'
    ]
  },

  // 4. 덕평공룡수목원
  {
    key: 'dino_parking',
    file: 'dino_parking.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/biN5MC/btrj2Wy6iJk/nDfxWOskuqKh5fCk3xi300/img.png'
    ]
  },
  {
    key: 'dino_model',
    file: 'dino_model.jpg',
    urls: [
      'https://tong.visitkorea.or.kr/cms/resource/73/3304773_image2_1.JPG',
      'https://cdn.imweb.me/upload/S201811265bfb55532ae6a/4fa97f9355f59.jpg'
    ]
  },

  // 5. 이진상회
  {
    key: 'ijin_parking',
    file: 'ijin_parking.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/cPWANI/btrPFYq2LO1/pVKBaqWZbgsETGnZ3ID2b1/img.jpg'
    ]
  },
  {
    key: 'artisan_bread',
    file: 'artisan_bread.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/bHRoGz/btraXWTHkXR/EsTq40k7kKrNgydlHsWv1k/img.jpg'
    ]
  },
  {
    key: 'bread_basket',
    file: 'bread_basket.jpg',
    urls: [
      'https://blog.kakaocdn.net/dn/ZxNKq/btrSWxKBwWE/kLXJt111bHRbiqkqRpyv51/img.jpg'
    ]
  }
];

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': url.includes('kakaocdn') ? 'https://blog.daum.net/' : undefined
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) {
      throw new Error(`File too small: ${buffer.length} bytes`);
    }
    fs.writeFileSync(destPath, buffer);
    return buffer.length;
  } catch (err) {
    return null;
  }
}

async function run() {
  console.log(`Starting real asset downloads to ${THUMBS_DIR}...`);
  const results = [];
  for (const item of ASSETS) {
    const dest = path.join(THUMBS_DIR, item.file);
    let downloaded = false;
    for (const u of item.urls) {
      const size = await downloadImage(u, dest);
      if (size) {
        console.log(`[OK] ${item.key} (${item.file}) <- ${size} bytes from ${u.slice(0, 60)}...`);
        downloaded = true;
        results.push({ key: item.key, file: `images/thumbs/${item.file}`, size, success: true });
        break;
      } else {
        console.log(`[FAIL] ${item.key} failed from ${u.slice(0, 60)}...`);
      }
    }
    if (!downloaded) {
      console.log(`[ERROR] All URLs failed for ${item.key}!`);
      results.push({ key: item.key, file: `images/thumbs/${item.file}`, success: false });
    }
  }
  console.log('\n--- Download Summary ---');
  console.table(results);
}

run();
