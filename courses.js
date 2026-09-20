// 이천 아이맵 · 코스/스팟 텍스트 데이터
// 이 파일의 문구를 고치면 화면에 바로 반영됩니다. 따옴표(')와 쉼표(,)는 지우지 마세요.
// 문구 안에 작은따옴표가 필요하면 \' 로 씁니다.
window.ICHEON_DATA = {
  // ── 스팟(장소) 데이터 · 텍스트를 여기서 직접 수정하세요 ─────────────
  SPOTS: {
    seolbong: { name: '설봉공원', photo: 'seolbong', photos: ['seolbong', 'seolbong_spring', 'lake', 'seolbong_view'], recommended: true,
      sketch: { caption: '운전자 시점 약도: 설봉공원 입구에서 올라가는 순서로 주차장·스팟·진입로를 표시한다 (네이버지도는 동쪽에서 진입하는 것처럼 보여 실제 운전 감각과 다름).', photo: 'seolbongmap' },
      parkings: [
        { name: '위쪽 주차장', walkTo: '시립박물관·월전미술관·도자미술관', entry: '공원 안 도로는 일방통행 · 시설마다 주차장 있음 (시립박물관·세라피아·도자지원센터 앞)', q: '이천시립박물관주차장', placeId: '19065243', mapBased: false, photo: 'seolbong_parking_upper', photos: ['seolbong_parking_upper', 'seolbong_parking_lower'] },
        { name: '아래쪽 주차장', walkTo: '놀이터·조각공원·호수 산책', entry: '안내소 근처 1·2주차장이나 카페 옆 주차장에 대고 호수둘레길·놀이터·조각공원 방향으로 이동', q: '설봉공원제1주차장', placeId: '19064752', mapBased: false, photo: 'seolbong_parking_lower', photos: ['seolbong_parking_lower', 'lake'] }
      ],
      facilities: [
        { name: '이천시립박물관', hours: '10:00~18:00 (17:30까지 입장) · 월요일·1월 1일·설·추석 당일 휴관 · 문의 031-633-9734', official: 'https://www.artic.or.kr/icmus/main/view', photo: 'seolbong_museum', photos: ['seolbong_museum', 'seolbong_view'] },
        { name: '월전미술관', hours: '10:00~18:00 (17:30까지 입장) · 월요일·1월 1일·설·추석 당일 휴관 · 관람료는 홈페이지 확인', official: 'https://www.iwoljeon.org/', photo: 'woljeon_art', photos: ['woljeon_art', 'seolbong_sculpture'] },
        { name: '경기도자미술관', hours: '10:00~18:00 (17:00까지 입장) · 관람 기간·휴관일은 홈페이지에서 꼭 확인', official: 'https://www.gmocca.org/', photo: 'ceramic', photos: ['ceramic', 'seolbong_sculpture'] },
        { name: '설봉공원놀이터', hours: '관광안내소 뒤 1주차장에 대고 농구장 방향', map: 'https://map.naver.com/p/entry/place/492859743', photo: 'seolbong_play', photos: ['seolbong_play', 'lake'] },
        { name: '설봉국제조각공원', hours: '관광안내소 뒤 1주차장 또는 카페 옆 주차장에 대고 관고리 오층석탑 방향', map: 'https://map.naver.com/p/entry/place/1702134191', photo: 'seolbong_sculpture', photos: ['seolbong_sculpture', 'seolbong_view'] },
        { name: '호수 산책', hours: '관광안내소 1주차장 또는 카페 옆 주차장에 대고 길 건너 진입', photo: 'lake', photos: ['lake', 'seolbong_lake_walk', 'seolbong_spring', 'seolbong'] }
      ],
      tips: [
        '주차: 공원 도로는 일방통행 오르막길이라 한번 진입하면 유턴 불가! 놀이터나 호수가 목적이면 진입 전 입구 아래쪽 1·2주차장에 대야 평지로 유모차 이동이 수월하다',
        '진입: 시립박물관·미술관이 목적이라면 일방통행로를 끝까지 올라가 위쪽 주차장에 대면 도보 1~2분 거리다',
        '운영: 외부 공사 중이어도 시립박물관/미술관은 정상 개관 중일 수 있으므로 관람 가능 여부를 공식 홈페이지로 확인 후 출발할 것',
        '아이: 관광안내소 뒤편 1주차장 옆에 매점이 있어 간단한 간식과 음료를 살 수 있다'
      ] },
    farmpark: { name: '이천농업테마공원', photo: 'farmpark', photos: ['farmpark', 'rice_entrance', 'rice_fest', 'rice_food', 'farmpark_water'], recommended: true,
      sketch: { caption: '공원 종합안내지도 (이천시설관리공단 제공). 1600px 고화질로 전체 시설 동선을 한눈에 확인하세요.', photo: 'farmmap' },
      stay: { text: '공원 안 어농골펜션(숲체험촌·쌀체험촌)과 국민여가캠핑장(캐빈하우스·야영장)에서 숙박할 수 있습니다.', url: 'https://farmpark.2000fmc.or.kr/park/campsite/Z74973656', photo: 'farmpark_camp', photos: ['farmpark_camp', 'farmpark'] },
      parkings: [
        { name: '관광안내센터 옆 임시주차장', walkTo: '라이스카페·쌀문화전시관', entry: '임시주차장 계단을 오르면 쌀문화전시관 · 건너편 라이스카페', q: '이천농업테마공원 종합안내센터', mapBased: true, photo: 'farmpark_parking_temp', photos: ['farmpark_parking_temp', 'farmpark_parking_eco'] },
        { name: '생태2주차장', walkTo: '라이스카페·쌀문화전시관', entry: '라이스카페 뒤편이 주차장 · 건너편이 임시주차장', q: '이천농업테마공원 주차장', mapBased: true, photo: 'farmpark_parking_eco', photos: ['farmpark_parking_eco', 'farmpark_parking_temp'] }
      ],
      parkingNotice: { name: '후문 주차장', text: '숙박 체크인 고객만 주차 가능 (2026년 3월부터)', q: '이천농업테마공원 후문', note: '쌀문화전시관 앞 주차장으로 추정 · 지도 스팟 표시 확인할 것', photo: 'farmpark_parking_back', photos: ['farmpark_parking_back', 'farmpark_camp'] },
      facilities: [
        { name: '라이스카페', hours: '09:00~18:00 (17:00 라스트오더) · 031-631-3026', official: 'https://www.instagram.com/icheonbrand.official', btnLabel: '인스타그램', phone: '031-631-3026', photo: 'rice_food', photos: ['rice_food', 'rice_fest'] },
        { name: '쌀문화전시관', hours: '4~10월 09:30~18:30 · 11~3월 09:30~17:00 · 월요일 휴관', official: 'https://farmpark.2000fmc.or.kr/park/program', btnLabel: '체험예약', photo: 'rice_fest', photos: ['rice_fest', 'rice_entrance', 'farmpark'] },
        { name: '유아숲놀이터', hours: '09:30~18:30 · 월요일 휴관 · 031-632-6607', photo: 'farmpark_forest', photos: ['farmpark_forest', 'farmpark_forest_sun', 'farmpark_water'] },
        { name: '야외그림마당', hours: '09:30~18:30 · 월요일 휴관 · 031-632-6607', photo: 'farmpark', photos: ['farmpark', 'farmpark_forest'] },
        { name: '여름 물놀이터', hours: '여름철 한시 개방', photo: 'farmpark_water', photos: ['farmpark_water', 'farmpark_forest'] }
      ],
      tips: [
        '아이: 쌀문화전시관 내부에는 화장실이 없다! 언덕을 오르기 전 반드시 입구 주차장 화장실을 먼저 이용할 것',
        '진입: 정문 주차장 계단 우측의 완경사 포장 언덕길을 이용하면 유모차로 쌀문화전시관까지 계단 없이 편하게 이동 가능하다',
        '주차: 후문 보행로를 통해 이천목재문화체험장과 바로 이어지므로 두 스팟 연계 시 도보 이동이 편리하다',
        '운영: 라이스카페는 17:00 라스트오더이므로 쌀아이스크림과 음료는 시간을 먼저 확인할 것'
      ] },
    wood: { name: '이천목재문화체험장', photo: 'wood', photos: ['wood', 'wood_interior', 'wood_plane', 'wood_exterior', 'wood_parking'],
      parkings: [{ name: '체험장 주차장', walkTo: '체험동', entry: '주차장에서 바로 앞 체험장으로 진입', q: '이천목재문화체험장', mapBased: false, photo: 'wood_parking', photos: ['wood_parking', 'wood_exterior', 'wood'] }],
      facilities: [{ name: '목재 만들기 체험', hours: '체험 10:00 / 14:00 · 관람 09:00~18:00 · 화~일 운영 (월요일·둘째·넷째 일요일·설·추석 연휴·국경일 휴관)', official: 'https://www.2000forest.or.kr/facil/facil.php?sp=use', photo: 'woodcraft', photos: ['woodcraft', 'wood_interior', 'wood_plane', 'woodcarving'] }],
      tips: [
        '주차: 체험관 정문 바로 앞에 단독 무료 주차장이 있어 주차가 매우 편리하고 입구까지 10m 이내다',
        '아이: 나이별로 초·중·고급반으로 나뉘고 체험비(재료비)가 든다 · 당일 예약 가능',
        '운영: 만들기 체험 프로그램은 회차별 예약 여부를 공식 사이트에서 먼저 확인해야 한다'
      ] },
    dino: { name: '덕평공룡수목원', photo: 'dino', photos: ['dino', 'dino_model', 'dino_parking'],
      parkings: [{ name: '수목원 주차장', walkTo: '공룡 전시·동물·자연', entry: '수목원 정문 매표소 앞 넓은 전용 주차장', q: '덕평공룡수목원', mapBased: false, photo: 'dino_parking', photos: ['dino_parking', 'dino'] }],
      facilities: [
        { name: '덕평공룡수목원', hours: '09:00~18:00 (입장마감 17:00) · 연중무휴 · 031-633-5029', official: 'https://dinovill.com/', booking: 'https://map.naver.com/p/entry/place/36505156?lng=127.3379533&lat=37.2314807&placePath=%2Fticket%3Ffrom%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202609210445%26locale%3Dko%26svcName%3Dmap_pcv5&entry=plt&searchType=place&c=15.00,0,0,0,dh', photo: 'dino_model', photos: ['dino_model', 'dino'] },
        { name: '공룡카페', hours: '수목원 온실 속 커피와 디저트 쉼터 · 09:00~18:00', photo: 'dino', photos: ['dino', 'dino_model'] }
      ],
      tips: [
        '주차: 매표소 정문 바로 앞 넓은 전용 평지 주차장을 무료로 이용할 수 있다',
        '운영: 현장 발권보다 네이버 사전 예약 시 할인 및 빠른 입장이 가능하므로 방문 전 예약을 추천한다',
        '아이: 야외 공룡 모형이 움직이고 소리가 나므로 유아는 놀랄 수 있으나 사진 찍기 좋다'
      ] },
    ijin: { name: '이진상회', photo: 'ijin', photos: ['ijin', 'artisan_bread', 'bread_basket', 'ijin_parking'],
      parkings: [{ name: '이진상회 주차장', walkTo: '쌀 베이커리·도자 볼거리', entry: '이진상회 진입로를 따라 올라가면 대형 주차 공간', q: '이진상회 이천', mapBased: false, photo: 'ijin_parking', photos: ['ijin_parking', 'ijin'] }],
      facilities: [{ name: '이진상회', hours: '09:30~21:00 (20:30 라스트오더) · 0507-1497-8882', official: 'http://instagram.com/ijinsanghoe', btnLabel: '인스타그램', phone: '0507-1497-8882', photo: 'artisan_bread', photos: ['artisan_bread', 'bread_basket', 'ijin'] }],
      tips: [
        '주차: 언덕길을 따라 올라가면 대형 전용 주차 공간이 넉넉하게 마련되어 있다',
        '식사: 카페 바로 옆에 나물 반찬과 보리밥이 맛있는 강민주의들밥 식당이 있어 점심 식사와 디저트를 한곳에서 해결하기 좋다',
        '아이: 복합문화공간 정원에 도자기 인형과 분수대 산책길이 예쁘게 꾸며져 있다'
      ] }
  },
  // ── 코스 데이터 ────────────────────────────────────────────────
  COURSES: [
    { id: 'seolbong-story', name: '설봉공원 이야기·문화 코스', track: 'story', region: '도심·설봉권', rain: true,
      listLine: '설봉공원 · 위쪽 주차장 → 시립박물관·월전미술관·도자미술관', intro: '위쪽 주차장에 대고 시립박물관·월전미술관·도자미술관을 도는 실내 코스',
      spots: [{ id: 'seolbong', parking: '위쪽 주차장에 대면 시립박물관·월전미술관·도자미술관이 가깝다 · 공원 안 도로는 일방통행', going: '이천시립박물관 · 월전미술관 · 경기도자미술관' }],
      food: { q: '이천 설봉공원 근처 식당', list: [
        { name: '푸주옥', tip: '아이와 나눠 먹기 좋은 자극 없는 뽀얀 설렁탕 · 키즈의자 & 좌식 완비', q: '푸주옥 이천', placeId: '18460534', photo: 'food_pujuk' },
        { name: '강민주의들밥 설봉점', tip: '셀프바에서 신선한 반찬 무한 리필 · 아이는 겉바속촉 생선구이 추천', q: '강민주의들밥 설봉점', placeId: '1521633811' },
        { name: '최고당돈가스 이천관고점', tip: '바삭한 수제 생돈가스와 시원한 모밀 세트 · 가성비 최고 · 키즈의자 완비', q: '최고당돈가스 이천관고점', placeId: '1745174700', photo: 'food_donkatsu' }
      ] } },
    { id: 'seolbong-outdoor', name: '설봉공원 야외 활동 코스', track: 'out', region: '도심·설봉권', rain: false,
      listLine: '설봉공원 · 아래쪽 주차장 → 놀이터·조각공원·호수 산책', intro: '아래쪽 주차장에 대고 놀이터·조각공원·호수 산책을 도는 코스',
      spots: [{ id: 'seolbong', parking: '아래쪽 주차장에 대면 놀이터·조각공원이 가깝다', going: '놀이터 · 조각공원 · 호수 산책' }],
      food: { q: '이천 설봉공원 근처 식당', list: [
        { name: '푸주옥', tip: '아이와 나눠 먹기 좋은 자극 없는 뽀얀 설렁탕 · 키즈의자 & 좌식 완비', q: '푸주옥 이천', placeId: '18460534', photo: 'food_pujuk' },
        { name: '강민주의들밥 설봉점', tip: '셀프바에서 신선한 반찬 무한 리필 · 아이는 겉바속촉 생선구이 추천', q: '강민주의들밥 설봉점', placeId: '1521633811' },
        { name: '최고당돈가스 이천관고점', tip: '바삭한 수제 생돈가스와 시원한 모밀 세트 · 가성비 최고 · 키즈의자 완비', q: '최고당돈가스 이천관고점', placeId: '1745174700', photo: 'food_donkatsu' }
      ] } },
    { id: 'south-make', name: '남부 만들기 코스', track: 'make', region: '남부·모가권', rain: false,
      listLine: '이천목재문화체험장 → 이천농업테마공원 · 안내센터 옆 주차장', intro: '목재 만들기 체험을 한 뒤 농업테마공원 유아숲놀이터에서 놀고, 여름에는 물놀이터를 이용한다',
      spots: [{ id: 'wood', parking: '체험장 주차장에 대면 바로 체험동이다', going: '목재 만들기 체험' }, { id: 'farmpark', parking: '관광안내센터 옆 임시주차장·생태2주차장에 대고 걸어간다 (후문 주차장은 숙박 체크인 고객만)', going: '쌀문화전시관 · 다양한 체험 활동' }],
      food: { q: '이천목재문화체험장 근처 식당', list: [
        { name: '미솥지음 이천', tip: '임금님표 이천 쌀로 갓 지은 가마솥밥 정식 · 자극 없는 반찬으로 온 가족 식사 추천', q: '미솥지음 이천', placeId: '1920574397' },
        { name: '남이천가정식부페', tip: '집밥 스타일 반찬을 아이가 직접 골라 담는 가정식 뷔페 · 가성비 최고', q: '남이천가정식부페', placeId: '19077544' }
      ] } },
    { id: 'south-story', name: '남부 이야기·문화 코스', track: 'story', region: '남부·모가권', rain: false,
      listLine: '이천농업테마공원 · 안내센터 옆 주차장 → 쌀문화전시관·라이스카페', intro: '관광안내센터 옆 임시주차장이나 생태2주차장에 대고 쌀문화전시관과 라이스카페를 둘러본다',
      spots: [{ id: 'farmpark', parking: '관광안내센터 옆 임시주차장·생태2주차장에 대면 쌀문화전시관·라이스카페가 가깝다', going: '쌀문화전시관 · 다양한 체험 활동' }],
      food: { q: '이천농업테마공원 근처 식당', list: [
        { name: '미솥지음 이천', tip: '임금님표 이천 쌀로 갓 지은 가마솥밥 정식 · 자극 없는 반찬으로 온 가족 식사 추천', q: '미솥지음 이천', placeId: '1920574397' },
        { name: '남이천가정식부페', tip: '집밥 스타일 반찬을 아이가 직접 골라 담는 가정식 뷔페 · 가성비 최고', q: '남이천가정식부페', placeId: '19077544' }
      ] } },
    { id: 'west-outdoor', name: '서이천 야외 활동 코스', track: 'out', region: '서이천·마장권', rain: false,
      listLine: '덕평공룡수목원(공룡 전시·동물·자연) → 이진상회(쌀 베이커리)', intro: '공룡수목원에서 놀고 이진상회 쌀 베이커리에서 쉰다',
      spots: [{ id: 'dino', parking: '수목원 주차장에 대면 바로 입구다', going: '공룡 전시 · 동물 · 자연' }, { id: 'ijin', parking: '이진상회 주차장에 대면 바로 매장이다', going: '쌀 베이커리 · 도자 볼거리' }],
      food: { q: '덕평공룡수목원 근처 식당', list: [
        { name: '덕평공룡수목원 디노레스토랑', tip: '수목원 관람 전후 편리하게 이용하는 패밀리 레스토랑 · 돈가스와 파스타', q: '덕평공룡수목원 디노레스토랑', placeId: '1148934352' },
        { name: '산타의돌짜장', tip: '지글지글 뜨거운 돌판 짜장과 양념게장 · 아이들 최애 · 셀프 라면/부침개 체험', q: '산타의돌짜장 이천', placeId: '1202351897' }
      ] } }
  ]
};
