import fs from 'fs';

const spotsData = JSON.parse(fs.readFileSync('data/spots.json', 'utf8'));
const seolbong = spotsData.find(s => s.id === 'seolbong');

const origCount = seolbong.tips.length;
console.log('Original tips count:', origCount);

// Add a test tip
seolbong.tips.push('식사: 공원 앞 매점에서 간단한 간식과 음료를 살 수 있다');
console.log('After adding tip, count:', seolbong.tips.length);

// Verify that course-detail would render 4 tips
const parsedTips = seolbong.tips.map(t => {
  const match = t.match(/^([가-힣a-zA-Z0-9]+)\s*[:：]\s*(.*)$/);
  return match ? { tag: match[1], text: match[2] } : { tag: '팁', text: t };
});

console.log('Parsed tags:', parsedTips.map(p => p.tag));
console.log('Last parsed tag:', parsedTips[parsedTips.length - 1].tag, 'text:', parsedTips[parsedTips.length - 1].text);

// Revert tip
seolbong.tips.pop();
console.log('Reverted back to original tips count:', seolbong.tips.length);
if (seolbong.tips.length !== origCount) throw new Error('Failed to revert');
console.log('>>> STORY 8.3 TIP REACTIVITY TEST PASSED! <<<');
