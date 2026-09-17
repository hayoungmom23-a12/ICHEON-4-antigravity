/**
 * course-list.js - 코스 목록 화면 로직 [EPIC 3]
 * - F1.2: 코스 요약 목록 5줄
 * - F1.3, F1.5: 취향 3택 칩 필터링
 * - F1.4: 코스 카드 5장
 * - F1.6: 바깥 링크 타일 2개
 * - F5.1~F5.3, F6.2: 하단 안내
 */

(function () {
  let appCoursesData = null;
  let selectedTrack = null; // null: 전체, 'make' | 'out' | 'story'

  const CHEVRON_SVG = `
    <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;

  const EXTERNAL_ICON_SVG = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  `;

  // 코스 필터링 유틸
  function getFilteredCourses() {
    if (!appCoursesData || !appCoursesData.courses) return [];
    if (!selectedTrack) return appCoursesData.courses;
    return appCoursesData.courses.filter(c => c.track === selectedTrack);
  }

  // F1.2 요약 목록 렌더링
  function renderSummarySection() {
    const courses = getFilteredCourses();
    const titleText = selectedTrack
      ? `취향별 추천 코스 ${courses.length}개`
      : '코스 5개 한눈에';

    const itemsHtml = courses.map(course => `
      <li>
        <a href="course.html?id=${encodeURIComponent(course.id)}" class="summary-item">
          <div class="summary-item-left">
            ${window.renderTrackChip(course.track)}
            <span class="summary-item-title">${window.escapeHtml(course.name)}</span>
          </div>
          <div class="summary-item-right">
            <span class="summary-item-region">${window.escapeHtml(course.region)}</span>
            ${CHEVRON_SVG}
          </div>
        </a>
      </li>
    `).join('');

    return `
      <section class="summary-section">
        <h2 class="section-title" id="summary-section-title">${window.escapeHtml(titleText)}</h2>
        <div class="summary-card" style="margin-top: 10px;">
          <ul class="summary-list" id="summary-list">
            ${itemsHtml}
          </ul>
        </div>
      </section>
    `;
  }

  // F1.3 취향 필터 칩 렌더링 (가로 알약 타원형, 한 줄 텍스트)
  function renderFilterChipsSection() {
    const tracks = [
      { key: 'make', label: '만들기' },
      { key: 'out', label: '야외 활동' },
      { key: 'story', label: '이야기·문화' }
    ];

    const chipsHtml = tracks.map(t => {
      const isActive = selectedTrack === t.key;
      return `
        <button type="button" class="filter-chip ${isActive ? 'active' : ''}" data-track="${t.key}">
          ${window.escapeHtml(t.label)}
        </button>
      `;
    }).join('');

    return `
      <section class="filter-section">
        <h2 class="section-title">아이 취향으로 고르기</h2>
        <div class="filter-chips">
          ${chipsHtml}
        </div>
      </section>
    `;
  }

  // F1.4 코스 카드 목록 렌더링 [01-코스목록.png 기준]
  function renderCourseCardsSection() {
    const courses = getFilteredCourses();
    const titleText = `취향별 추천 코스 ${courses.length}개`;

    const cardsHtml = courses.map(course => {
      const rainTagHtml = course.rain
        ? `<span class="rain-tag">비 오는 날 OK</span>`
        : '';

      return `
        <a href="course.html?id=${encodeURIComponent(course.id)}" class="course-card">
          <div class="course-card-body">
            <div class="course-card-header">
              ${window.renderTrackChip(course.track)}
              <span class="region-text">${window.escapeHtml(course.region)}</span>
            </div>
            <div class="course-card-title-line">
              <span class="course-name">${window.escapeHtml(course.name)}</span>
              ${rainTagHtml}
            </div>
            <div class="course-subline">
              ${window.escapeHtml(course.listLine || course.intro || '')}
            </div>
          </div>
          ${CHEVRON_SVG}
        </a>
      `;
    }).join('');

    return `
      <section class="courses-section">
        <h2 class="section-title" id="cards-section-title">${window.escapeHtml(titleText)}</h2>
        <div class="course-cards-list" id="course-cards-list" style="margin-top: 10px;">
          ${cardsHtml}
        </div>
      </section>
    `;
  }

  // 지도 자리 상자 ("스팟 5곳 위치") [01-코스목록.png 기준]
  function renderMapBoxSection() {
    const pinSvg = `
      <svg class="map-pin-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;

    return `
      <section class="map-box-section">
        <h2 class="section-title">스팟 5곳 위치</h2>
        <div class="map-placeholder-box">
          <div class="map-pins-row">
            ${pinSvg}${pinSvg}${pinSvg}${pinSvg}${pinSvg}
          </div>
          <p class="map-box-title">이천 지도 자리 (네이버지도 임베드)</p>
          <p class="map-box-desc">편집 메모 · 네이버지도 키가 준비되면 넣고, 아니면 이 상자를 뺀다</p>
        </div>
      </section>
    `;
  }

  // F1.6 바깥 링크 타일 2개 ("이천시 공식 블로그", "이천관광 누리집") [01-코스목록.png 기준]
  function renderExternalLinksSection() {
    return `
      <section class="external-links-section">
        <div class="external-links-grid">
          <a href="https://blog.naver.com/2000happy_" target="_blank" rel="noopener noreferrer" class="external-link-tile">
            <span class="link-card-title link-tile-title">이천시 공식 블로그</span>
            <span class="link-card-desc link-tile-desc">blog.naver.com · 여행 소식</span>
          </a>
          <a href="https://www.icheon.go.kr/tour/index.do" target="_blank" rel="noopener noreferrer" class="external-link-tile">
            <span class="link-card-title link-tile-title">이천관광 누리집</span>
            <span class="link-card-desc link-tile-desc">icheon.go.kr/tour · 공식 관광 정보</span>
          </a>
        </div>
      </section>
    `;
  }

  // 전체 화면 조립 및 갱신
  function updateListUI() {
    const container = document.getElementById('course-list-container');
    if (!container) return;

    // 요약 목록 갱신
    const summaryTitle = document.getElementById('summary-section-title');
    const summaryList = document.getElementById('summary-list');
    const courses = getFilteredCourses();

    if (summaryTitle) {
      summaryTitle.textContent = selectedTrack
        ? `취향별 추천 코스 ${courses.length}개`
        : '코스 5개 한눈에';
    }

    if (summaryList) {
      summaryList.innerHTML = courses.map(course => `
        <li>
          <a href="course.html?id=${encodeURIComponent(course.id)}" class="summary-item">
            <div class="summary-item-left">
              ${window.renderTrackChip(course.track)}
              <span class="summary-item-title">${window.escapeHtml(course.name)}</span>
            </div>
            <div class="summary-item-right">
              <span class="summary-item-region">${window.escapeHtml(course.region)}</span>
              ${CHEVRON_SVG}
            </div>
          </a>
        </li>
      `).join('');
    }

    // 코스 카드 갱신
    const cardsTitle = document.getElementById('cards-section-title');
    const cardsList = document.getElementById('course-cards-list');

    if (cardsTitle) {
      cardsTitle.textContent = `취향별 추천 코스 ${courses.length}개`;
    }

    if (cardsList) {
      cardsList.innerHTML = courses.map(course => {
        const rainTagHtml = course.rain
          ? `<span class="rain-tag">비 오는 날 OK</span>`
          : '';

        return `
          <a href="course.html?id=${encodeURIComponent(course.id)}" class="course-card">
            <div class="course-card-body">
              <div class="course-card-header">
                ${window.renderTrackChip(course.track)}
                <span class="region-text">${window.escapeHtml(course.region)}</span>
              </div>
              <div class="course-card-title-line">
                <span class="course-name">${window.escapeHtml(course.name)}</span>
                ${rainTagHtml}
              </div>
              <div class="course-subline">
                ${window.escapeHtml(course.listLine || course.intro || '')}
              </div>
            </div>
            ${CHEVRON_SVG}
          </a>
        `;
      }).join('');
    }

    // 칩 활성화 클래스 토글
    document.querySelectorAll('.filter-chip').forEach(btn => {
      const track = btn.getAttribute('data-track');
      if (track === selectedTrack) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 초기 렌더링 진입 함수
  function initCourseList(mainContainer, coursesData) {
    appCoursesData = coursesData;

    mainContainer.innerHTML = `
      <div id="course-list-container" style="display: flex; flex-direction: column; gap: 24px;">
        ${renderSummarySection()}
        ${renderFilterChipsSection()}
        ${renderCourseCardsSection()}
        ${renderMapBoxSection()}
        ${renderExternalLinksSection()}
      </div>
    `;

    // 칩 클릭 이벤트 리스너 등록
    mainContainer.addEventListener('click', function (e) {
      const chipBtn = e.target.closest('.filter-chip');
      if (!chipBtn) return;

      const track = chipBtn.getAttribute('data-track');
      if (selectedTrack === track) {
        // 이미 켜진 칩 누르면 해제 (토글)
        selectedTrack = null;
      } else {
        selectedTrack = track;
      }
      updateListUI();
    });

    // 히어로 배너 배경 사진 기능 연동
    setupHeroBannerPhoto();
  }

  // 히어로 배너 커스텀 배경 사진 관리
  function setupHeroBannerPhoto() {
    if (typeof document === 'undefined') return;
    const heroBanner = document.getElementById('hero-banner');
    const heroBtn = document.getElementById('btn-hero-photo');
    if (!heroBanner || !heroBtn) return;

    // 저장된 배경 사진 복원
    try {
      if (typeof localStorage !== 'undefined') {
        const savedBg = localStorage.getItem('hero_custom_bg');
        if (savedBg) {
          heroBanner.style.background = `linear-gradient(rgba(17, 33, 28, 0.65), rgba(17, 33, 28, 0.88)), url('${savedBg}') center/cover no-repeat`;
        }
      }
    } catch (e) {}

    heroBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openHeroPhotoModal(heroBanner);
    });
  }

  function openHeroPhotoModal(heroBanner) {
    if (typeof document === 'undefined') return;

    const oldModal = document.getElementById('hero-photo-modal-backdrop');
    if (oldModal) oldModal.remove();

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'photo-modal-backdrop';
    modalBackdrop.id = 'hero-photo-modal-backdrop';

    modalBackdrop.innerHTML = `
      <div class="photo-modal-card" role="dialog" aria-modal="true">
        <div class="photo-modal-header">
          <h3 class="photo-modal-title">📷 히어로 배경 사진 변경</h3>
          <button type="button" class="photo-modal-close-btn" id="hero-modal-close-btn" aria-label="닫기">✕</button>
        </div>

        <div class="photo-modal-body">
          <p style="margin: 0; font-size: 13px; color: var(--text-2); line-height: 1.5;">
            메인 상단 히어로 배너에 원하는 이천 풍경이나 가족 여행 사진을 배경으로 넣을 수 있습니다.
          </p>

          <!-- 옵션 1: 기기 사진 선택 -->
          <div class="modal-option-box">
            <span class="modal-option-label">📱 내 기기에서 사진 선택 (스마트폰 앨범 / 카메라)</span>
            <label class="btn-file-select" for="hero-file-input">
              📁 배경 사진 파일 선택하기
              <input type="file" id="hero-file-input" accept="image/*" style="display: none;">
            </label>
            <span class="modal-option-tip">선택한 사진은 현재 기기 브라우저에 안전하게 저장됩니다.</span>
          </div>

          <!-- 옵션 2: 웹 이미지 주소 -->
          <div class="modal-option-box">
            <label class="modal-option-label" for="hero-url-input">🔗 웹 이미지 주소(URL) 입력</label>
            <div class="modal-url-row">
              <input type="url" id="hero-url-input" placeholder="https://example.com/banner.jpg" class="modal-url-input">
              <button type="button" id="hero-apply-url-btn" class="btn-url-apply">적용</button>
            </div>
          </div>

          <!-- 옵션 3: 기본 그라데이션으로 복원 -->
          <div class="modal-option-box">
            <button type="button" id="hero-reset-btn" class="btn-reset-photo">
              ↺ 기본 진초록 그라데이션으로 되돌리기
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    function closeModal() {
      if (modalBackdrop.parentNode) modalBackdrop.remove();
    }

    modalBackdrop.querySelector('#hero-modal-close-btn').addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeModal();
    });

    // 1. 파일 선택
    const fileInput = modalBackdrop.querySelector('#hero-file-input');
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        const dataUrl = evt.target.result;
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('hero_custom_bg', dataUrl);
          }
        } catch (storageErr) {}

        heroBanner.style.background = `linear-gradient(rgba(17, 33, 28, 0.65), rgba(17, 33, 28, 0.88)), url('${dataUrl}') center/cover no-repeat`;
        showToast('✅ 히어로 배경 사진이 변경되었습니다!');
        setTimeout(closeModal, 600);
      };
      reader.readAsDataURL(file);
    });

    // 2. URL 적용
    const urlInput = modalBackdrop.querySelector('#hero-url-input');
    const urlApplyBtn = modalBackdrop.querySelector('#hero-apply-url-btn');
    urlApplyBtn.addEventListener('click', function () {
      const url = urlInput.value.trim();
      if (!url) return;

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('hero_custom_bg', url);
        }
      } catch (err) {}

      heroBanner.style.background = `linear-gradient(rgba(17, 33, 28, 0.65), rgba(17, 33, 28, 0.88)), url('${url}') center/cover no-repeat`;
      showToast('✅ 히어로 배경 사진이 적용되었습니다!');
      setTimeout(closeModal, 600);
    });

    // 3. 기본 복원
    const resetBtn = modalBackdrop.querySelector('#hero-reset-btn');
    resetBtn.addEventListener('click', function () {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('hero_custom_bg');
        }
      } catch (err) {}

      heroBanner.style.background = 'linear-gradient(180deg, var(--hero-top) 0%, var(--hero-bottom) 100%)';
      showToast('기본 배경으로 복원되었습니다.');
      setTimeout(closeModal, 600);
    });
  }

  function showToast(message) {
    if (typeof document === 'undefined') return;
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 2800);
  }

  window.initCourseList = initCourseList;
})();
