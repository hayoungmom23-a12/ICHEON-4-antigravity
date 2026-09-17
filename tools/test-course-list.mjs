import fs from 'fs';

const courses = JSON.parse(fs.readFileSync('data/courses.json', 'utf8'));
const spots = JSON.parse(fs.readFileSync('data/spots.json', 'utf8'));
const sharedJs = fs.readFileSync('assets/js/shared.js', 'utf8');
const courseListJs = fs.readFileSync('assets/js/course-list.js', 'utf8');

// Mock DOM & global window
global.window = global;
eval(sharedJs);
eval(courseListJs);

console.log('1. escapeHtml test:', window.escapeHtml('<div>&"\'</div>'));
console.log('2. renderTrackChip test:', window.renderTrackChip('make'));
console.log('3. renderFooter test:', window.renderFooter('2026-09-04').includes('2026-09-04'));

const mockContainer = { innerHTML: '', addEventListener: () => {} };
window.initCourseList(mockContainer, courses);

console.log('4. HTML length:', mockContainer.innerHTML.length);
console.log('5. Summary list present:', mockContainer.innerHTML.includes('summary-list'));
console.log('6. Filter chips present:', mockContainer.innerHTML.includes('filter-chip'));
console.log('7. Course cards count:', (mockContainer.innerHTML.match(/class="course-card"/g) || []).length);
console.log('8. External links count:', (mockContainer.innerHTML.match(/class="external-link-tile"/g) || []).length);

if (
  mockContainer.innerHTML.includes('summary-list') &&
  mockContainer.innerHTML.includes('filter-chip') &&
  (mockContainer.innerHTML.match(/class="course-card"/g) || []).length === 5 &&
  (mockContainer.innerHTML.match(/class="external-link-tile"/g) || []).length === 2
) {
  console.log('>>> ALL COURSE LIST TESTS PASSED! <<<');
} else {
  console.error('>>> TESTS FAILED! <<<');
  process.exit(1);
}
