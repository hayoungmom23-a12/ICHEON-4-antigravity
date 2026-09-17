import fs from 'fs';

const coursesData = JSON.parse(fs.readFileSync('data/courses.json', 'utf8'));
const spotsData = JSON.parse(fs.readFileSync('data/spots.json', 'utf8'));
const restaurantsData = JSON.parse(fs.readFileSync('data/restaurants.json', 'utf8'));
const sharedJs = fs.readFileSync('assets/js/shared.js', 'utf8');
const courseDetailJs = fs.readFileSync('assets/js/course-detail.js', 'utf8');

function setupMockEnv(searchQuery) {
  let redirectedTo = null;
  const mockLocation = {
    search: searchQuery,
    replace: (url) => { redirectedTo = url; }
  };
  const mockDocument = {
    title: '',
    querySelectorAll: () => [],
    querySelector: () => null
  };
  const mockContainer = {
    innerHTML: '',
    addEventListener: () => {}
  };

  const mockWindow = {
    location: mockLocation,
    document: mockDocument,
    createNaverMapUrl: null,
    escapeHtml: null,
    renderTrackChip: null,
    renderFooter: null,
    initCourseDetailPage: null
  };

  // Evaluate scripts in mock scope
  const evalShared = new Function('window', 'document', 'location', `${sharedJs}; Object.assign(window, { createNaverMapUrl, escapeHtml, renderTrackChip, renderFooter });`);
  evalShared(mockWindow, mockDocument, mockLocation);

  const evalDetail = new Function('window', 'document', 'location', `${courseDetailJs};`);
  evalDetail(mockWindow, mockDocument, mockLocation);

  return { mockWindow, mockDocument, mockLocation, mockContainer, getRedirect: () => redirectedTo };
}

console.log('=== TEST 1: Course with 1 spot & surveyed restaurants (seolbong-story) ===');
{
  const env = setupMockEnv('?id=seolbong-story');
  env.mockWindow.initCourseDetailPage(env.mockContainer, { coursesData, spotsData, restaurantsData });

  const html = env.mockContainer.innerHTML;
  console.log('HTML Length:', html.length);
  console.log('1. Back link present:', html.includes('← 코스 목록'));
  console.log('2. Course title present:', html.includes('설봉공원 이야기·문화 코스'));
  console.log('3. Rain OK tag present:', html.includes('비 오는 날 OK'));
  console.log('4. Spot card present:', html.includes('설봉공원'));
  console.log('5. Star badge present:', html.includes('★ 추천'));
  console.log('6. Tip badge count 3:', html.includes('방문 팁 3'));
  console.log('7. Recommended parking banner:', html.includes('위쪽 주차장'));
  console.log('8. 3 tabs present:', html.includes('추천 장소') && html.includes('방문 팁') && html.includes('약도 보기'));
  console.log('9. Official page button:', html.includes('공식 페이지') && html.includes('https://www.artic.or.kr/icmus/main/view'));
  console.log('10. Big restaurant button:', html.includes('근처 식당 네이버지도에서 보기'));
  console.log('11. Surveyed restaurants list:', html.includes('푸주옥') && html.includes('강민주의들밥 설봉점'));

  if (!html.includes('설봉공원 이야기·문화 코스') || !html.includes('푸주옥')) {
    throw new Error('Test 1 failed');
  }
}

console.log('\n=== TEST 2: Course with 2 spots & empty restaurant list (south-make) ===');
{
  const env = setupMockEnv('?id=south-make');
  env.mockWindow.initCourseDetailPage(env.mockContainer, { coursesData, spotsData, restaurantsData });

  const html = env.mockContainer.innerHTML;
  console.log('1. Course title present:', html.includes('남부 만들기 코스'));
  console.log('2. Spot 1 (wood):', html.includes('이천목재문화체험장'));
  console.log('3. Spot 2 (farmpark):', html.includes('이천농업테마공원'));
  console.log('4. Step divider present:', html.includes('↓ 다음 스팟'));
  console.log('5. Big map button present:', html.includes('근처 식당 네이버지도에서 보기'));
  console.log('6. Recommended restaurant section hidden:', !html.includes('★ 답사 추천 식당'));

  if (!html.includes('이천목재문화체험장') || !html.includes('이천농업테마공원') || !html.includes('↓ 다음 스팟')) {
    throw new Error('Test 2 failed');
  }
}

console.log('\n=== TEST 3: Invalid course ID redirect ===');
{
  const env = setupMockEnv('?id=nonexistent-course');
  env.mockWindow.initCourseDetailPage(env.mockContainer, { coursesData, spotsData, restaurantsData });
  console.log('Redirected to:', env.getRedirect());

  if (env.getRedirect() !== 'index.html') {
    throw new Error('Test 3 failed: Should redirect to index.html');
  }
}

console.log('\n>>> ALL COURSE DETAIL TESTS PASSED! <<<');
