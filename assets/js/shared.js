/**
 * shared.js - 이천 아이맵 공통 유틸리티 [STORY 2.5]
 * - 네이버지도 검색 링크 자동 생성 [F6.5]
 * - 하단 공통 안내 렌더링 [F5.1~F5.3, F6.2]
 * - HTML 안전 변환 (escapeHtml)
 * - 취향 트랙 칩 렌더러
 */

// 1. 네이버지도 검색 링크 생성 [F6.5]
function createNaverMapUrl(query) {
  if (!query || typeof query !== 'string') return '';
  return `https://map.naver.com/p/search/${encodeURIComponent(query.trim())}`;
}

// 2. HTML 특수문자 안전 변환 (XSS 방지)
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 3. 취향 트랙 명칭 및 스타일 매핑
const TRACK_MAP = {
  make: { label: '만들기', className: 'track-make' },
  out: { label: '야외 활동', className: 'track-out' },
  story: { label: '이야기·문화', className: 'track-story' }
};

function renderTrackChip(trackKey) {
  const info = TRACK_MAP[trackKey] || { label: trackKey, className: '' };
  return `<span class="track-pill ${info.className}">${escapeHtml(info.label)}</span>`;
}

// 4. 공통 하단 안내 렌더링 [F5.1, F5.2, F5.3, F6.2, 03-하단안내.png 기준]
function renderFooter(asOfDate) {
  const dateStr = asOfDate || '2026-09-04';
  return `
    <footer class="app-footer">
      <div class="footer-line brand">이천 아이맵 · 아이 동반 가족을 위한 출발 전 확인 카드</div>
      <div class="footer-line">운영 정보는 ${escapeHtml(dateStr)} 기준이며, 방문 전 각 시설의 공식 페이지에서 최신 정보를 확인해 주세요.</div>
      <div class="footer-line">‘지도 기준’ 표시가 있는 주차·진입 정보는 지도와 공개 자료를 바탕으로 정리한 것으로, 실제 현장과 다를 수 있습니다.</div>
    </footer>
  `;
}

// 전역 스코프에 노출
window.createNaverMapUrl = createNaverMapUrl;
window.escapeHtml = escapeHtml;
window.TRACK_MAP = TRACK_MAP;
window.renderTrackChip = renderTrackChip;
window.renderFooter = renderFooter;
