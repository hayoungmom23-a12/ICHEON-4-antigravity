/**
 * course-detail.js - 코스 상세 화면 로직 [EPIC 4, 5, 6]
 * - F2.1~F2.5: 고유 주소, 머리말, 뒤로가기, 리다이렉트, 스팟 배치
 * - F3.1~F3.13: 스팟 카드(접힘/펼침, 3분할 탭, 주차 안내, 시설 목록, 팁 파싱, 약도)
 * - F4.1~F4.3: 식당 부록 (마감 안내, 네이버지도 검색 버튼, 추천 식당 목록)
 */

(function () {
  const CHEVRON_DOWN_SVG = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `;

  const CHEVRON_UP_SVG = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;

  const MAP_PIN_SVG = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `;

  const EXTERNAL_LINK_SVG = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  `;

  // 팁 문자열에서 태그 자동 파싱 [F3.7]
  function parseTip(tipStr) {
    if (!tipStr) return { tag: '', text: '' };
    const match = tipStr.match(/^([가-힣a-zA-Z0-9]+)\s*[:：]\s*(.*)$/);
    if (match) {
      return { tag: match[1], text: match[2] };
    }
    return { tag: '팁', text: tipStr };
  }

  // 코스 머리말 [F2.3]
  function renderCourseHeader(course) {
    const rainTagHtml = course.rain
      ? `<span class="rain-tag">비 오는 날 OK</span>`
      : '';

    return `
      <header class="course-detail-header">
        <a href="index.html" class="back-link">
          ← 코스 목록
        </a>
        <div class="detail-tags-row">
          ${window.renderTrackChip(course.track)}
          <span class="region-text">${window.escapeHtml(course.region)}</span>
          ${rainTagHtml}
        </div>
        <h1 class="detail-title">${window.escapeHtml(course.name)}</h1>
        <p class="detail-intro">${window.escapeHtml(course.intro)}</p>
      </header>
    `;
  }

  // 스팟 카드 렌더러 [EPIC 5]
  function renderSpotCard(spotConfig, spotData, index, isFirst) {
    const spotId = spotData ? spotData.id : spotConfig.id;
    const spotName = spotData ? spotData.name : '스팟 정보';
    const tips = (spotData && spotData.tips) ? spotData.tips : [];
    const parkings = (spotData && spotData.parkings) ? spotData.parkings : [];
    const facilities = (spotData && spotData.facilities) ? spotData.facilities : [];
    const sketch = (spotData && spotData.sketch && spotData.sketch.file) ? spotData.sketch : null;
    const photo = spotData && spotData.photo;

    // 초기 상태: 첫 번째 스팟은 펼침, 두 번째 스팟은 접힘
    const isExpanded = isFirst;

    // 사진 구역 [F3.1, F3.11, F7.2, 02-코스상세.png 기준 + 클릭하여 사진 수정 기능]
    let photoHtml = '';
    if (photo && photo.file) {
      const defaultPhotoPath = `images/spots/${photo.file}`;
      let currentPhotoSrc = defaultPhotoPath;
      let creditText = photo.credit ? window.escapeHtml(photo.credit) : '';

      try {
        if (typeof localStorage !== 'undefined') {
          const savedPhoto = localStorage.getItem(`spot_custom_photo_${spotId}`);
          if (savedPhoto) {
            currentPhotoSrc = savedPhoto;
            creditText = localStorage.getItem(`spot_custom_credit_${spotId}`) || '직접 등록한 사진';
          }
        }
      } catch (e) {}

      photoHtml = `
        <div class="spot-photo-wrap" data-action="change-photo" data-spot-id="${spotId}" data-spot-name="${window.escapeHtml(spotName)}" data-default-src="${defaultPhotoPath}" data-default-credit="${window.escapeHtml(photo.credit || '')}" title="사진을 클릭하여 수정하기">
          <span class="spot-photo-tag-p02">P02</span>
          <img src="${currentPhotoSrc}" alt="${window.escapeHtml(photo.alt || spotName)}" class="spot-photo" id="spot-photo-img-${spotId}" onerror="this.style.display='none';">
          ${creditText ? `<span class="spot-photo-credit" id="spot-photo-credit-${spotId}">${creditText}</span>` : ''}
          <div class="spot-photo-edit-badge">
            <span class="edit-badge-icon">📷</span>
            <span class="edit-badge-text">사진 수정</span>
          </div>
        </div>
      `;
    }

    // 팁 개수 배지 [F3.1, F3.9, F3.12]
    const tipBadgeHtml = tips.length > 0
      ? `<span class="badge-tip-count">방문 팁 ${tips.length}</span>`
      : '';

    // 추천 주차장 띠 문구
    const parkingBannerText = spotConfig.parking || (parkings[0] ? `${parkings[0].name} 추천` : '추천 주차장');

    // 이 코스에서 가는 곳 문구
    const goingText = spotConfig.going || '';

    // 탭 헤더 버튼 구성 [F3.3, F3.9, F3.12, 02-코스상세.png 기준]
    const hasFacilities = facilities.length > 0;
    const hasTips = tips.length > 0;
    const hasSketch = !!sketch;

    let tabsNavHtml = '';
    let tabCount = 0;
    if (hasFacilities || parkings.length > 0) tabCount++;
    if (hasTips) tabCount++;
    if (hasSketch) tabCount++;

    if (tabCount > 1 || hasTips || hasSketch) {
      tabsNavHtml = `
        <div class="spot-tabs-row spot-tabs-nav">
          <button type="button" class="spot-tab-pill spot-tab-btn active" data-tab="places" data-spot="${spotId}">
            추천 장소 <span class="tab-badge">${facilities.length || parkings.length}</span>
          </button>
          ${hasTips ? `
            <button type="button" class="spot-tab-pill spot-tab-btn" data-tab="tips" data-spot="${spotId}">
              방문 팁 <span class="tab-badge">${tips.length}</span>
            </button>
          ` : ''}
          ${hasSketch ? `
            <button type="button" class="spot-tab-pill spot-tab-btn" data-tab="sketch" data-spot="${spotId}">
              약도 보기
            </button>
          ` : ''}
        </div>
      `;
    }

    // 1. 주차 안내 표 [F3.4, F3.6, 02-코스상세.png 기준]
    const parkingRowsHtml = parkings.map((p, pIdx) => {
      const mapUrl = window.createNaverMapUrl(p.mapQuery || `${spotName} ${p.name}`);
      const mapBasedHtml = p.mapBased
        ? `<span class="map-based-badge">지도 기준</span>`
        : '';
      const thumbContent = p.thumb
        ? `<img src="images/thumbs/${p.thumb}" alt="${window.escapeHtml(p.name)}" class="thumb-image info-thumb-img" onerror="this.style.display='none';">`
        : `<span class="camera-code">P0${pIdx + 3} 📷</span>`;

      const entryText = (p.entry && !p.entry.includes('[')) ? ` · ${p.entry}` : '';

      return `
        <div class="detail-item-row info-item-row" id="parking-item-${spotId}-${encodeURIComponent(p.name)}">
          <div class="detail-item-left info-item-left">
            <div class="camera-thumb-box">
              ${thumbContent}
            </div>
            <div class="detail-item-texts info-item-texts">
              <div class="item-title-line info-title-line">
                <span class="item-main-title info-name">${window.escapeHtml(p.name)}</span>
                ${mapBasedHtml}
              </div>
              <div class="item-bullet-line info-desc">
                <span class="arrow-symbol">➔</span>
                <span>${window.escapeHtml(p.walkTo || '')}</span>
              </div>
              ${p.entry && !p.entry.includes('[') ? `
                <div class="item-bullet-line info-desc" style="margin-top: 2px;">
                  <span class="arrow-symbol">➔</span>
                  <span>${window.escapeHtml(p.entry)}</span>
                </div>
              ` : ''}
            </div>
          </div>
          ${mapUrl ? `
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-fill info-action-btn">
              지도 열기
            </a>
          ` : ''}
        </div>
      `;
    }).join('');

    // 2. 시설 목록 [F3.5, 02-코스상세.png 기준]
    const facilityRowsHtml = facilities.map((f, fIdx) => {
      let actionBtnHtml = '';
      if (f.official) {
        actionBtnHtml = `
          <a href="${window.escapeHtml(f.official)}" target="_blank" rel="noopener noreferrer" class="btn-action-fill info-action-btn">
            공식 페이지
          </a>
        `;
      } else if (f.mapQuery) {
        actionBtnHtml = `
          <a href="${window.createNaverMapUrl(f.mapQuery)}" target="_blank" rel="noopener noreferrer" class="btn-action-fill info-action-btn">
            지도 열기
          </a>
        `;
      }

      const thumbContent = f.thumb
        ? `<img src="images/thumbs/${f.thumb}" alt="${window.escapeHtml(f.name)}" class="thumb-image info-thumb-img" onerror="this.style.display='none';">`
        : `<span class="camera-code">P0${Math.min(9, parkings.length + fIdx + 3)} 📷</span>`;

      const hoursClean = f.hours && !f.hours.includes('[') ? f.hours : '상세 정보 확인 예정';

      return `
        <div class="detail-item-row info-item-row">
          <div class="detail-item-left info-item-left">
            <div class="camera-thumb-box">
              ${thumbContent}
            </div>
            <div class="detail-item-texts info-item-texts">
              <div class="item-title-line info-title-line">
                <span class="item-main-title info-name">${window.escapeHtml(f.name)}</span>
              </div>
              <div class="item-bullet-line info-desc">
                <span class="arrow-symbol">➔</span>
                <span>${window.escapeHtml(hoursClean)}</span>
              </div>
            </div>
          </div>
          ${actionBtnHtml}
        </div>
      `;
    }).join('');

    // 3. 방문 팁 목록 [F3.7, 02-코스상세.png 기준]
    const tipsListHtml = tips.map(t => {
      const parsed = parseTip(t);
      return `
        <li class="tip-row tip-item">
          <span class="tip-badge-tag tip-tag">${window.escapeHtml(parsed.tag)}</span>
          <span class="tip-text">${window.escapeHtml(parsed.text)}</span>
        </li>
      `;
    }).join('');

    // 4. 약도 구역 [F3.8, 02-코스상세.png 기준]
    let sketchHtml = '';
    if (sketch) {
      sketchHtml = `
        <div class="sketch-section-wrap sketch-container">
          <div class="sketch-box">
            <span class="sketch-code-badge">P11</span>
            <img src="images/maps/${sketch.file}" alt="${window.escapeHtml(sketch.caption || '방문 약도')}" class="sketch-media sketch-img" onerror="this.parentElement.style.display='none';">
            <div class="sketch-caption-text sketch-caption">${window.escapeHtml(sketch.caption || '')}</div>
          </div>
        </div>
      `;
    }

    return `
      <article class="spot-card ${isExpanded ? 'expanded' : ''}" id="spot-card-${spotId}" data-spot-id="${spotId}">
        ${photoHtml}

        <!-- 상단 헤더 및 접기/펼치기 토글 영역 [F3.2] -->
        <div class="spot-card-header" data-action="toggle-spot">
          <div class="spot-title-group">
            <h2 class="spot-name">${window.escapeHtml(spotName)}</h2>
            <span class="badge-star">★ 추천</span>
            ${tipBadgeHtml}
          </div>
          <div class="spot-toggle-text">
            <span class="toggle-label">${isExpanded ? '접기' : '자세히'}</span>
            <span class="toggle-icon">${isExpanded ? CHEVRON_UP_SVG : CHEVRON_DOWN_SVG}</span>
          </div>
        </div>

        <!-- 추천 주차장 띠 [F3.1, F3.13, 02-코스상세.png 기준] -->
        <div class="parking-banner" data-action="focus-parking">
          <div class="parking-banner-left">
            <span class="parking-banner-icon">P</span>
            <span class="parking-banner-text">${window.escapeHtml(parkingBannerText)}</span>
          </div>
          <span style="font-size: 14px; font-weight: 700;">&gt;</span>
        </div>

        <!-- 이 코스에서 가는 곳 -->
        ${goingText ? `
          <div class="spot-going-wrap">
            이 코스에서 가는 곳: <strong>${window.escapeHtml(goingText)}</strong>
          </div>
        ` : ''}

        <!-- 접힌 상태 힌트 문구 -->
        <div class="tap-hint" style="${isExpanded ? 'display: none;' : ''}">
          <span>👆 카드를 누르면 상세 주차와 운영시간을 볼 수 있습니다</span>
        </div>

        <!-- 펼쳐진 상세 영역 -->
        <div class="spot-details" style="${isExpanded ? 'display: block;' : 'display: none;'}">
          ${tabsNavHtml}
          
          <div class="spot-tab-panel">
            <!-- 탭 1: 추천 장소 (주차 + 시설) -->
            <div class="spot-tab-pane active" id="tab-pane-places-${spotId}">
              <div class="pane-group">
                <h3 class="detail-section-heading pane-section-title">주차 안내</h3>
                <div class="info-items-list">
                  ${parkingRowsHtml}
                </div>
              </div>

              ${facilities.length > 0 ? `
                <div class="pane-group" style="margin-top: 16px;">
                  <h3 class="detail-section-heading pane-section-title">주요 시설 및 운영시간</h3>
                  <div class="info-items-list">
                    ${facilityRowsHtml}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- 탭 2: 방문 팁 -->
            ${hasTips ? `
              <div class="spot-tab-pane" id="tab-pane-tips-${spotId}">
                <h3 class="detail-section-heading pane-section-title">현장 답사 방문 팁</h3>
                <ul class="tips-list" style="list-style: none; margin: 0; padding: 0;">
                  ${tipsListHtml}
                </ul>
              </div>
            ` : ''}

            <!-- 탭 3: 약도 보기 -->
            ${hasSketch ? `
              <div class="spot-tab-pane" id="tab-pane-sketch-${spotId}">
                <h3 class="detail-section-heading pane-section-title">방문자 시점 약도</h3>
                ${sketchHtml}
              </div>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }

  // 식당 부록 카드 [EPIC 6, F4.1~F4.3, 02-코스상세.png 기준]
  function renderRestaurantSection(course, restaurantEntry) {
    const searchQuery = (restaurantEntry && restaurantEntry.searchQuery) || course.foodSearch || '이천 맛집';
    const bigMapUrl = window.createNaverMapUrl(searchQuery);
    const list = (restaurantEntry && restaurantEntry.list) ? restaurantEntry.list : [];

    let listHtml = '';
    if (list.length > 0) {
      const itemsHtml = list.map(rest => `
        <div class="restaurant-item-row restaurant-item">
          <div class="restaurant-info restaurant-item-left">
            <span class="restaurant-name restaurant-item-name">${window.escapeHtml(rest.name)}</span>
            <span class="restaurant-tip restaurant-item-tip">${window.escapeHtml(rest.tip || '')}</span>
          </div>
          <a href="${window.createNaverMapUrl(rest.mapQuery || rest.name)}" target="_blank" rel="noopener noreferrer" class="btn-action-fill info-action-btn">
            네이버플레이스
          </a>
        </div>
      `).join('');

      listHtml = `
        <div class="recommended-restaurants-section">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge-recommended-restaurant">⭐ 추천 식당</span>
            <h3 class="recommended-restaurants-title" style="margin: 0; font-size: 13px; font-weight: 700; color: var(--text-2);">★ 답사 추천 식당</h3>
          </div>
          <div class="restaurant-list info-items-list" style="margin-top: 10px;">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    return `
      <section class="restaurant-card">
        <div class="restaurant-header">
          <h2 class="restaurant-title">식당 부록</h2>
          <p class="restaurant-notice">이천 식당·카페는 18~19시에 닫는 곳이 많으니 저녁은 영업시간을 먼저 확인하세요.</p>
        </div>

        <a href="${bigMapUrl}" target="_blank" rel="noopener noreferrer" class="btn-big-map">
          ${MAP_PIN_SVG}
          <span>근처 식당 네이버지도에서 보기</span>
        </a>

        ${listHtml}
      </section>
    `;
  }

  // 이벤트 바인딩
  function setupInteractiveEvents(container) {
    container.addEventListener('click', function (e) {
      // 1. 카드 접기/펼치기 토글 [F3.2]
      const toggleTrigger = e.target.closest('[data-action="toggle-spot"]');
      if (toggleTrigger) {
        const card = toggleTrigger.closest('.spot-card');
        if (!card) return;

        const detailsEl = card.querySelector('.spot-details');
        const hintEl = card.querySelector('.tap-hint');
        const labelEl = card.querySelector('.toggle-label');
        const iconEl = card.querySelector('.toggle-icon');

        const willExpand = !card.classList.contains('expanded');
        card.classList.toggle('expanded', willExpand);

        if (detailsEl) detailsEl.style.display = willExpand ? 'block' : 'none';
        if (hintEl) hintEl.style.display = willExpand ? 'none' : 'flex';
        if (labelEl) labelEl.textContent = willExpand ? '접기' : '자세히';
        if (iconEl) iconEl.innerHTML = willExpand ? CHEVRON_UP_SVG : CHEVRON_DOWN_SVG;
        return;
      }

      // 2. 추천 주차장 띠 클릭 [F3.13]
      const bannerTrigger = e.target.closest('[data-action="focus-parking"]');
      if (bannerTrigger) {
        const card = bannerTrigger.closest('.spot-card');
        if (!card) return;

        // 카드가 접혀있으면 펼친다
        if (!card.classList.contains('expanded')) {
          const headerToggle = card.querySelector('[data-action="toggle-spot"]');
          if (headerToggle) headerToggle.click();
        }

        // 주차장 탭 활성화
        const placesTabBtn = card.querySelector('.spot-tab-btn[data-tab="places"]');
        if (placesTabBtn) placesTabBtn.click();
        return;
      }

      // 3. 3분할 탭 전환 [F3.3]
      const tabBtn = e.target.closest('.spot-tab-btn');
      if (tabBtn) {
        const spotId = tabBtn.getAttribute('data-spot');
        const targetTab = tabBtn.getAttribute('data-tab');
        const card = tabBtn.closest('.spot-card');
        if (!card) return;

        // 탭 버튼 active 클래스 전환
        card.querySelectorAll('.spot-tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');

        // 패널 전환
        card.querySelectorAll('.spot-tab-pane').forEach(pane => pane.classList.remove('active'));
        const targetPane = card.querySelector(`#tab-pane-${targetTab}-${spotId}`);
        if (targetPane) targetPane.classList.add('active');
        return;
      }

      // 4. 스팟 사진 클릭하여 수정/변경
      const photoTrigger = e.target.closest('[data-action="change-photo"]');
      if (photoTrigger) {
        e.stopPropagation();
        const spotId = photoTrigger.getAttribute('data-spot-id');
        const spotName = photoTrigger.getAttribute('data-spot-name') || '스팟';
        const defaultSrc = photoTrigger.getAttribute('data-default-src') || '';
        const defaultCredit = photoTrigger.getAttribute('data-default-credit') || '';
        openPhotoEditModal(spotId, spotName, defaultSrc, defaultCredit);
        return;
      }
    });
  }

  // 토스트 알림 띄우기
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

  // 스팟 사진 수정 모달 열기
  function openPhotoEditModal(spotId, spotName, defaultSrc, defaultCredit) {
    if (typeof document === 'undefined') return;

    // 기존 열린 모달 제거
    const oldModal = document.getElementById('photo-modal-backdrop');
    if (oldModal) oldModal.remove();

    // 현재 표시 중인 이미지 소스 확인
    const targetImg = document.getElementById(`spot-photo-img-${spotId}`);
    const currentSrc = targetImg ? targetImg.src : defaultSrc;

    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'photo-modal-backdrop';
    modalBackdrop.id = 'photo-modal-backdrop';

    modalBackdrop.innerHTML = `
      <div class="photo-modal-card" role="dialog" aria-modal="true">
        <div class="photo-modal-header">
          <h3 class="photo-modal-title">📷 ${window.escapeHtml(spotName)} 사진 변경</h3>
          <button type="button" class="photo-modal-close-btn" id="modal-close-btn" aria-label="닫기">✕</button>
        </div>

        <div class="photo-modal-body">
          <!-- 미리보기 -->
          <div class="photo-preview-box">
            <img id="modal-preview-img" src="${currentSrc}" alt="미리보기" class="photo-preview-img">
          </div>

          <!-- 옵션 1: 기기 사진 선택 (스마트폰 앨범 / 카메라) -->
          <div class="modal-option-box">
            <span class="modal-option-label">📱 내 기기에서 사진 선택 (스마트폰 앨범 / 카메라)</span>
            <label class="btn-file-select" for="modal-file-input">
              📁 사진 파일 선택하기
              <input type="file" id="modal-file-input" accept="image/*" style="display: none;">
            </label>
            <span class="modal-option-tip">스마트폰에서는 사진첩 앨범 선택 또는 즉시 카메라 촬영이 가능합니다.</span>
          </div>

          <!-- 옵션 2: 웹 이미지 주소(URL) 입력 -->
          <div class="modal-option-box">
            <label class="modal-option-label" for="modal-url-input">🔗 웹 이미지 주소(URL) 입력</label>
            <div class="modal-url-row">
              <input type="url" id="modal-url-input" placeholder="https://example.com/photo.jpg" class="modal-url-input">
              <button type="button" id="modal-apply-url-btn" class="btn-url-apply">적용</button>
            </div>
          </div>

          <!-- 옵션 3: 기본 사진으로 초기화 -->
          <div class="modal-option-box">
            <button type="button" id="modal-reset-photo-btn" class="btn-reset-photo">
              ↺ 기본 사진으로 되돌리기
            </button>
          </div>

          <!-- 개발자 영구 배포 팁 -->
          <div class="modal-dev-note">
            <strong>💡 영구 배포 안내:</strong><br>
            여기서 변경한 사진은 현재 기기 브라우저에 안전하게 저장됩니다. 모든 방문자에게 영구 반영하려면 PC의 <code>images/spots/</code> 폴더에 사진 파일을 넣고 GitHub에 푸시하시면 됩니다.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // 모달 닫기
    function closeModal() {
      if (modalBackdrop.parentNode) modalBackdrop.remove();
    }

    modalBackdrop.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeModal();
    });

    // 1. 파일 선택 (FileReader)
    const fileInput = modalBackdrop.querySelector('#modal-file-input');
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        const dataUrl = evt.target.result;
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`spot_custom_photo_${spotId}`, dataUrl);
            localStorage.setItem(`spot_custom_credit_${spotId}`, '직접 등록한 사진');
          }
        } catch (storageErr) {
          console.warn('LocalStorage 용량 제한 등으로 화면에만 우선 반영됩니다:', storageErr);
        }

        // 모달 및 화면 즉시 갱신
        const previewEl = modalBackdrop.querySelector('#modal-preview-img');
        if (previewEl) previewEl.src = dataUrl;

        const spotImg = document.getElementById(`spot-photo-img-${spotId}`);
        if (spotImg) {
          spotImg.src = dataUrl;
          spotImg.style.display = 'block';
        }
        const creditEl = document.getElementById(`spot-photo-credit-${spotId}`);
        if (creditEl) creditEl.textContent = '직접 등록한 사진';

        showToast(`✅ ${spotName} 사진이 변경되었습니다!`);
        setTimeout(closeModal, 600);
      };
      reader.readAsDataURL(file);
    });

    // 2. URL 적용
    const urlInput = modalBackdrop.querySelector('#modal-url-input');
    const urlApplyBtn = modalBackdrop.querySelector('#modal-apply-url-btn');
    urlApplyBtn.addEventListener('click', function () {
      const url = urlInput.value.trim();
      if (!url) {
        alert('이미지 주소(URL)를 입력해주세요.');
        return;
      }

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`spot_custom_photo_${spotId}`, url);
          localStorage.setItem(`spot_custom_credit_${spotId}`, '웹 이미지');
        }
      } catch (err) {}

      const previewEl = modalBackdrop.querySelector('#modal-preview-img');
      if (previewEl) previewEl.src = url;

      const spotImg = document.getElementById(`spot-photo-img-${spotId}`);
      if (spotImg) {
        spotImg.src = url;
        spotImg.style.display = 'block';
      }
      const creditEl = document.getElementById(`spot-photo-credit-${spotId}`);
      if (creditEl) creditEl.textContent = '웹 이미지';

      showToast(`✅ ${spotName} 사진이 적용되었습니다!`);
      setTimeout(closeModal, 600);
    });

    // 3. 기본 사진으로 되돌리기
    const resetBtn = modalBackdrop.querySelector('#modal-reset-photo-btn');
    resetBtn.addEventListener('click', function () {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(`spot_custom_photo_${spotId}`);
          localStorage.removeItem(`spot_custom_credit_${spotId}`);
        }
      } catch (err) {}

      const previewEl = modalBackdrop.querySelector('#modal-preview-img');
      if (previewEl) previewEl.src = defaultSrc;

      const spotImg = document.getElementById(`spot-photo-img-${spotId}`);
      if (spotImg) {
        spotImg.src = defaultSrc;
        spotImg.style.display = 'block';
      }
      const creditEl = document.getElementById(`spot-photo-credit-${spotId}`);
      if (creditEl) creditEl.textContent = defaultCredit || '';

      showToast(`기본 사진으로 복원되었습니다.`);
      setTimeout(closeModal, 600);
    });
  }

  // 초기 실행 함수
  function initCourseDetailPage(mainContainer, appData) {
    const { coursesData, spotsData, restaurantsData } = appData;

    // URL 파라미터에서 코스 id 추출 [F2.1]
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    // 유효한 코스가 아니면 목록으로 리다이렉트 [F2.5]
    if (!courseId) {
      window.location.replace('index.html');
      return;
    }

    const currentCourse = coursesData.courses.find(c => c.id === courseId);
    if (!currentCourse) {
      window.location.replace('index.html');
      return;
    }

    // 문서 제목 갱신
    document.title = `${currentCourse.name} - 이천 아이맵`;

    // 스팟 데이터 매핑
    const spotMap = new Map();
    (spotsData || []).forEach(s => spotMap.set(s.id, s));

    // 식당 데이터 찾기
    const restEntry = (restaurantsData || []).find(r => r.courseId === currentCourse.id);

    // 스팟 카드 HTML 빌드
    const spotCardsHtml = (currentCourse.spots || []).map((spotCfg, idx) => {
      const spotItem = spotMap.get(spotCfg.id);
      const isFirst = idx === 0;
      const cardHtml = renderSpotCard(spotCfg, spotItem, idx, isFirst);

      // 스팟이 여러 개인 경우 사이 구분 연결선 [STORY 4.5]
      const dividerHtml = (idx < currentCourse.spots.length - 1)
        ? `<div class="spot-step-divider">↓ 다음 스팟</div>`
        : '';

      return cardHtml + dividerHtml;
    }).join('');

    mainContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${renderCourseHeader(currentCourse)}
        <section class="spots-section" style="display: flex; flex-direction: column; gap: 14px;">
          ${spotCardsHtml}
        </section>
        ${renderRestaurantSection(currentCourse, restEntry)}
      </div>
    `;

    setupInteractiveEvents(mainContainer);
  }

  window.initCourseDetailPage = initCourseDetailPage;
})();
