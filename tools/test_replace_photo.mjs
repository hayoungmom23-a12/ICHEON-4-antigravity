import assert from 'assert';

// LocalStorage mock
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _dump: () => store
  };
})();

global.localStorage = localStorageMock;

function getCustomStore() {
  try {
    return JSON.parse(localStorage.getItem('icheon_custom_photos') || '{}');
  } catch (e) {
    return {};
  }
}

function setCustomStore(store) {
  localStorage.setItem('icheon_custom_photos', JSON.stringify(store));
  return true;
}

const PHOTO = {
  'seolbong_pk_0': { src: 'images/thumbs/seolbong_pk.jpg', credit: '설봉공원 주차장' }
};

const publishedPhotos = {};

function photoOf(key) {
  if (!key) return null;
  const store = getCustomStore();
  if (store.hiddenPhotos && store.hiddenPhotos[key]) return null;
  if (store.keys && store.keys[key]) return store.keys[key];
  if (publishedPhotos.keys && publishedPhotos.keys[key]) return publishedPhotos.keys[key];
  return PHOTO[key] || null;
}

function getKeyExtraPhotos(key) {
  const store = getCustomStore();
  return (store.keyExtras && store.keyExtras[key]) || [];
}

function getPhotosForTarget(type, targetKey, defaultKeys) {
  const store = getCustomStore();
  const list = [];
  const dKeys = Array.isArray(defaultKeys) ? defaultKeys : (defaultKeys ? [defaultKeys] : []);
  dKeys.forEach(function (k, idx) {
    if (store.hiddenPhotos && store.hiddenPhotos[k]) return;
    const p = photoOf(k);
    if (p) list.push({ src: p.src, credit: p.credit || '기본 사진', type: 'base', key: k, idx: idx });
  });
  if (store.keys && store.keys[targetKey]) {
    const p = store.keys[targetKey];
    if (!list.some(item => item.src === p.src)) {
      list.push({ src: p.src, credit: p.credit || '직접 등록한 사진', type: 'key-single', key: targetKey, idx: 0 });
    }
  }
  const extras = getKeyExtraPhotos(targetKey);
  extras.forEach(function (p, idx) {
    if (!list.some(item => item.src === p.src)) {
      list.push({ src: p.src, credit: p.credit || ('추가 사진 ' + (idx + 1)), type: 'key-extra', key: targetKey, idx: idx });
    }
  });
  return list.slice(-4);
}

function replaceCustomPhoto(type, targetKey, slotIdx, newSrc, newCredit, defaultKeys) {
  const store = getCustomStore();
  const photos = getPhotosForTarget(type, targetKey, defaultKeys);
  const item = photos[slotIdx];
  if (!item) return false;

  const creditText = newCredit || '직접 교체한 사진';

  if (item.type === 'key-extra') {
    store.keyExtras = store.keyExtras || {};
    const arr = store.keyExtras[targetKey] || [];
    const fIdx = arr.findIndex(p => p.src === item.src);
    if (fIdx !== -1) {
      arr[fIdx] = { src: newSrc, credit: creditText };
    } else {
      arr.push({ src: newSrc, credit: creditText });
    }
    store.keyExtras[targetKey] = arr;
  } else if (item.type === 'key-single') {
    store.keys = store.keys || {};
    store.keys[targetKey] = { src: newSrc, credit: creditText };
  } else if (item.type === 'base' || item.type === 'spot-base') {
    const baseKey = item.key;
    store.keys = store.keys || {};
    store.keys[baseKey] = { src: newSrc, credit: creditText };
    if (store.hiddenPhotos && store.hiddenPhotos[baseKey]) {
      delete store.hiddenPhotos[baseKey];
    }
  }

  return setCustomStore(store);
}

console.log('=== [테스트] 1:1 사진 교체 기능 검증 시작 ===');

// 초기 상태: 기본 1장 + 추가 2장 = 총 3장 등록
const targetKey = 'seolbong_pk_0';
const dKeys = ['seolbong_pk_0'];

let store = getCustomStore();
store.keyExtras = {
  [targetKey]: [
    { src: 'data:img/photo_2.jpg', credit: '2번째 사진' },
    { src: 'data:img/photo_3.jpg', credit: '3번째 사진' }
  ]
};
setCustomStore(store);

let currentList = getPhotosForTarget('key', targetKey, dKeys);
assert.strictEqual(currentList.length, 3, '초기 사진 3장이어야 함');
assert.strictEqual(currentList[0].credit, '설봉공원 주차장', '1번째: 기본 사진');
assert.strictEqual(currentList[1].credit, '2번째 사진', '2번째: 추가 사진 1');
assert.strictEqual(currentList[2].credit, '3번째 사진', '3번째: 추가 사진 2');
console.log('✅ 초기 3장 세팅 완료:', currentList.map(p => p.credit));

// 시나리오 1: 2번째 사진(slotIdx = 1)만 새로운 사진으로 1:1 교체
const ok1 = replaceCustomPhoto('key', targetKey, 1, 'data:img/photo_2_NEW.jpg', '새로 교체된 2번째 사진', dKeys);
assert.strictEqual(ok1, true, '교체 성공해야 함');

const afterRepList = getPhotosForTarget('key', targetKey, dKeys);
assert.strictEqual(afterRepList.length, 3, '교체 후에도 총 개수는 3장 유지');
assert.strictEqual(afterRepList[0].credit, '설봉공원 주차장', '1번째 사진 순서 및 내용 100% 보존');
assert.strictEqual(afterRepList[1].src, 'data:img/photo_2_NEW.jpg', '2번째 사진만 정확히 교체');
assert.strictEqual(afterRepList[1].credit, '새로 교체된 2번째 사진', '2번째 설명글 교체');
assert.strictEqual(afterRepList[2].credit, '3번째 사진', '3번째 사진이 앞으로 당겨지지 않고 3번째 자리 유지!');
console.log('✅ 2번째 사진 1:1 교체 성공 (순서 변경 없음):', afterRepList.map(p => p.credit));

// 시나리오 2: 1번째 기본 사진(slotIdx = 0)을 1:1 교체
const ok2 = replaceCustomPhoto('key', targetKey, 0, 'data:img/photo_1_NEW.jpg', '새로 교체된 1번째 대표사진', dKeys);
assert.strictEqual(ok2, true, '기본 사진 교체 성공');

const afterRepBaseList = getPhotosForTarget('key', targetKey, dKeys);
assert.strictEqual(afterRepBaseList.length, 3, '총 3장 유지');
assert.strictEqual(afterRepBaseList[0].src, 'data:img/photo_1_NEW.jpg', '1번째 사진이 새 대표사진으로 교체');
assert.strictEqual(afterRepBaseList[1].src, 'data:img/photo_2_NEW.jpg', '2번째 사진 여전히 2번째 유지');
assert.strictEqual(afterRepBaseList[2].src, 'data:img/photo_3.jpg', '3번째 사진 여전히 3번째 유지');
console.log('✅ 1번째 기본 사진 1:1 교체 성공:', afterRepBaseList.map(p => p.credit));

console.log('🎉 [테스트 완료] 1:1 사진 교체 기능 및 순서 보존 검증 통과!');
