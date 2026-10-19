const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const curriculum = require('./curriculum.js');
const config = require('../vercel.json');

test('curriculum page exposes the full-course navigation shell', () => {
  const html = fs.readFileSync(path.join(__dirname, 'curriculum.html'), 'utf8');
  assert.match(html, /id="phaseList"/);
  assert.match(html, /id="continueCourse"/);
  assert.match(html, /id="curriculumSearch"/);
  assert.match(html, /<script src="data\.js\?v=[^"]+"><\/script>/);
  assert.match(html, /<script src="progress\.js\?v=[^"]+"><\/script>/);
});

test('lesson paths and global steps are derived from generated curriculum data', () => {
  const phases = [
    { id: 0, name: 'Setup', lessons: [{ name: 'Tools', url: 'https://example.test/tree/main/phases/00-setup/01-tools/' }] },
    { id: 1, name: 'Math', lessons: [{ name: 'Vectors', url: null }, { name: 'Matrices', url: 'https://example.test/tree/main/phases/01-math/02-matrices/' }] },
  ];
  assert.equal(curriculum.lessonPath(phases[0].lessons[0]), 'phases/00-setup/01-tools');
  assert.equal(curriculum.phaseSlug(phases[1]), '01-math');
  assert.deepEqual(curriculum.flatten(phases).map(item => item.step), [1, 2, 3]);
});

test('resume summary counts completion and selects the most recently visited lesson', () => {
  const items = curriculum.flatten([{ id: 0, name: 'Setup', lessons: [
    { name: 'One', url: 'https://example.test/phases/00-setup/01-one/' },
    { name: 'Two', url: 'https://example.test/phases/00-setup/02-two/' },
  ] }]);
  const values = {
    'phases/00-setup/01-one': { completedAt: 1, visitedAt: 10 },
    'phases/00-setup/02-two': { completedAt: null, visitedAt: 20 },
  };
  const progress = {
    getLessonProgress: lesson => values[lesson],
    isLessonComplete: lesson => !!values[lesson].completedAt,
  };
  const summary = curriculum.progressSummary(items, progress);
  assert.equal(summary.complete, 1);
  assert.equal(summary.total, 2);
  assert.equal(summary.last.path, 'phases/00-setup/02-two');
  assert.equal(summary.next.path, 'phases/00-setup/02-two');
});

test('Vercel serves the clean curriculum URL and redirects the html variant', () => {
  assert.ok(config.rewrites.some(rule => rule.source === '/curriculum' && rule.destination === '/curriculum.html'));
  assert.ok(config.redirects.some(rule => String(rule.source).includes('curriculum') && rule.destination === '/:page'));
});
