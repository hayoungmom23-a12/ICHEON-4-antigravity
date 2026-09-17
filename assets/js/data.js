/**
 * data.js - 이천 아이맵 데이터 로더 및 실패 시 안내 [STORY 2.4]
 * courses.json, spots.json, restaurants.json 3개 파일을 비동기로 읽어옵니다.
 * file:// 등으로 열어 로딩에 실패할 경우 사용자 친화적인 안내 화면을 표시합니다.
 */

async function loadAppData() {
  try {
    const [coursesRes, spotsRes, restaurantsRes] = await Promise.all([
      fetch('data/courses.json'),
      fetch('data/spots.json'),
      fetch('data/restaurants.json')
    ]);

    if (!coursesRes.ok || !spotsRes.ok || !restaurantsRes.ok) {
      throw new Error(`데이터 응답 오류: courses(${coursesRes.status}), spots(${spotsRes.status}), restaurants(${restaurantsRes.status})`);
    }

    const coursesData = await coursesRes.json();
    const spotsData = await spotsRes.json();
    const restaurantsData = await restaurantsRes.json();

    return {
      coursesData,
      spotsData,
      restaurantsData
    };
  } catch (error) {
    console.error('[이천 아이맵 데이터 로딩 실패]', error);
    renderDataLoadError(error);
    throw error;
  }
}

function renderDataLoadError(error) {
  const container = document.querySelector('.main-content') || document.querySelector('.app-container') || document.body;
  
  const isFileProtocol = window.location.protocol === 'file:';
  
  const noticeHtml = `
    <div style="margin: 20px 0; padding: 20px; background-color: #FFF9F0; border: 1px solid #E6D5B8; border-radius: 12px; color: #1F2933; font-family: Pretendard, sans-serif; line-height: 1.6;">
      <div style="display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 700; color: #8C4A00; margin-bottom: 10px;">
        <span>⚠️</span>
        <span>이 페이지는 미리보기 서버로 열어야 합니다</span>
      </div>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #5C6470;">
        브라우저의 보안 정책으로 인해 파일을 더블클릭(<code>file://</code>)으로 열면 데이터 파일(JSON)을 직접 읽어올 수 없습니다.
      </p>
      <div style="background: #FFFFFF; padding: 14px 16px; border-radius: 8px; border: 1px solid #E6E0D4; font-size: 13px;">
        <strong style="color: #111827; display: block; margin-bottom: 6px;">정상적으로 여는 방법:</strong>
        <ol style="margin: 0; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 4px;">터미널에서 <code>node tools/serve.mjs</code>를 실행하세요.</li>
          <li>브라우저 주소창에 <a href="http://localhost:8765" style="color: #0F6E56; font-weight: 700; text-decoration: underline;">http://localhost:8765</a> 를 입력해 접속하세요.</li>
        </ol>
      </div>
      ${!isFileProtocol ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #8B8374;">(오류 세부 정보: ${error.message})</p>` : ''}
    </div>
  `;

  container.innerHTML = noticeHtml;
}

// 전역 스코프에 노출
window.loadAppData = loadAppData;
window.renderDataLoadError = renderDataLoadError;
