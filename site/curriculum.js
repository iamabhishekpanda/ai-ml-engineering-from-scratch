(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AIFSCurriculum = api;
}(this, function () {
  'use strict';

  var root = typeof window !== 'undefined' ? window : globalThis;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function lessonPath(lesson) {
    var match = String(lesson && lesson.url || '').match(/(phases\/[^/?#]+\/[^/?#]+)/);
    return match ? match[1] : '';
  }

  function phaseSlug(phase) {
    for (var i = 0; i < (phase.lessons || []).length; i++) {
      var path = lessonPath(phase.lessons[i]);
      if (path) return path.split('/')[1];
    }
    return String(phase.id).padStart(2, '0') + '-' + String(phase.name || '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function flatten(phases) {
    var step = 0;
    var items = [];
    (phases || []).forEach(function (phase, phaseIndex) {
      (phase.lessons || []).forEach(function (lesson, lessonIndex) {
        step++;
        items.push({ phase: phase, phaseIndex: phaseIndex, lesson: lesson, lessonIndex: lessonIndex, step: step, path: lessonPath(lesson) });
      });
    });
    return items;
  }

  function progressSummary(items, progress) {
    var complete = 0;
    var last = null;
    var firstAvailable = null;
    items.forEach(function (item) {
      if (!item.path) return;
      if (!firstAvailable) firstAvailable = item;
      var value = progress && progress.getLessonProgress ? progress.getLessonProgress(item.path) : null;
      if (value && value.completedAt) complete++;
      if (value && value.visitedAt && (!last || value.visitedAt > last.visitedAt)) {
        last = { item: item, visitedAt: value.visitedAt };
      }
    });
    var next = items.find(function (item) {
      return item.path && !(progress && progress.isLessonComplete && progress.isLessonComplete(item.path));
    }) || firstAvailable;
    return { complete: complete, total: items.filter(function (item) { return !!item.path; }).length, last: last && last.item, next: next };
  }

  function init(options) {
    options = options || {};
    var phases = options.phases || (typeof PHASES !== 'undefined' ? PHASES : root.PHASES) || [];
    var prerequisites = options.prerequisites || (typeof ROADMAP_PREREQS !== 'undefined' ? ROADMAP_PREREQS : root.ROADMAP_PREREQS) || {};
    var progress = options.progress || root.AIFSProgress;
    var documentValue = options.document || root.document;
    if (!documentValue || !phases.length) return null;

    var list = documentValue.getElementById('phaseList');
    var rail = documentValue.getElementById('phaseRail');
    var search = documentValue.getElementById('curriculumSearch');
    var allItems = flatten(phases);

    function stateFor(path) {
      if (!path || !progress) return '';
      if (progress.isLessonComplete && progress.isLessonComplete(path)) return 'complete';
      if (progress.hasLessonActivity && progress.hasLessonActivity(path)) return 'active';
      return '';
    }

    function renderRail() {
      rail.innerHTML = phases.map(function (phase) {
        var id = 'phase-' + String(phase.id).padStart(2, '0');
        return '<li><a href="#' + id + '"><span class="phase-rail-num">' + String(phase.id).padStart(2, '0') + '</span><span class="phase-rail-name">' + escapeHtml(phase.name) + '</span></a></li>';
      }).join('');
    }

    function render(query) {
      var needle = String(query || '').trim().toLowerCase();
      var globalStep = 0;
      var matchedPhases = 0;
      var html = '';
      phases.forEach(function (phase, phaseIndex) {
        var lessons = [];
        (phase.lessons || []).forEach(function (lesson, lessonIndex) {
          globalStep++;
          var haystack = [lesson.name, lesson.summary, lesson.keywords, lesson.type, lesson.lang, phase.name].join(' ').toLowerCase();
          if (!needle || haystack.indexOf(needle) !== -1) lessons.push({ lesson: lesson, lessonIndex: lessonIndex, step: globalStep, path: lessonPath(lesson) });
        });
        if (needle && !lessons.length) return;
        matchedPhases++;
        var phaseId = 'phase-' + String(phase.id).padStart(2, '0');
        var readable = (phase.lessons || []).filter(function (lesson) { return !!lessonPath(lesson); });
        var completed = readable.filter(function (lesson) { return stateFor(lessonPath(lesson)) === 'complete'; }).length;
        var percent = readable.length ? completed / readable.length : 0;
        var prereq = prerequisites[String(phase.id)] || [];
        var first = lessons.find(function (item) { return !!item.path; });
        var shouldOpen = !!needle || phaseIndex === 0 || lessons.some(function (item) { return stateFor(item.path) === 'active'; });
        html += '<details class="phase-card" id="' + phaseId + '"' + (shouldOpen ? ' open' : '') + '>';
        html += '<summary><span class="phase-number">' + String(phase.id).padStart(2, '0') + '</span>';
        html += '<span class="phase-heading"><h3>' + escapeHtml(phase.name) + '</h3><p>' + escapeHtml(phase.desc || 'Build the next layer of your AI engineering foundation.') + '</p></span>';
        html += '<span class="phase-summary-meta"><strong>' + readable.length + ' published</strong><span>' + completed + ' completed</span><span class="phase-progress-mini"><span style="transform:scaleX(' + percent.toFixed(4) + ')"></span></span></span></summary>';
        html += '<div class="phase-body">';
        html += '<div class="phase-prereqs"><strong>Prerequisites</strong><span>' + (prereq.length ? prereq.map(function (id) { return 'Phase ' + String(id).padStart(2, '0'); }).join(' · ') : 'None — start here') + '</span></div>';
        html += '<ol class="lesson-sequence">';
        lessons.forEach(function (item) {
          var lesson = item.lesson;
          var personal = stateFor(item.path);
          var status = personal === 'complete' ? '<span class="personal-state is-complete">Completed</span>' : personal === 'active' ? '<span class="personal-state is-active">In progress</span>' : '';
          html += '<li class="course-lesson"><span class="course-lesson-step">STEP ' + String(item.step).padStart(3, '0') + '</span>';
          html += '<span class="course-lesson-copy"><span class="course-lesson-name">' + escapeHtml(lesson.name) + '</span>';
          if (lesson.summary) html += '<span class="course-lesson-summary">' + escapeHtml(lesson.summary) + '</span>';
          html += '<span class="course-lesson-meta">' + escapeHtml(lesson.type || 'Lesson') + (lesson.lang && lesson.lang !== '—' ? ' · ' + escapeHtml(lesson.lang) : '') + status + '</span></span>';
          if (item.path) html += '<a class="course-lesson-link" href="lesson?path=' + encodeURIComponent(item.path) + '">' + (personal ? 'Continue' : 'Open') + '</a>';
          else html += '<span class="course-lesson-planned">Planned</span>';
          html += '</li>';
        });
        html += '</ol>';
        if (first) html += '<div class="phase-start"><a href="lesson?path=' + encodeURIComponent(first.path) + '">Start phase ' + String(phase.id).padStart(2, '0') + ' →</a></div>';
        html += '</div></details>';
      });
      list.innerHTML = matchedPhases ? html : '<div class="curriculum-empty">No lesson matches “' + escapeHtml(query) + '”. Try a broader topic.</div>';
    }

    function paintProgress() {
      var summary = progressSummary(allItems, progress);
      var completed = documentValue.getElementById('completedCount');
      var total = documentValue.getElementById('totalCount');
      var fill = documentValue.getElementById('courseProgressFill');
      var button = documentValue.getElementById('continueCourse');
      var message = documentValue.getElementById('progressMessage');
      if (completed) completed.textContent = summary.complete;
      if (total) total.textContent = '/ ' + summary.total + ' published lessons';
      if (fill) fill.style.transform = 'scaleX(' + (summary.total ? summary.complete / summary.total : 0) + ')';
      var destination = summary.last || summary.next;
      if (button && destination) {
        button.href = 'lesson?path=' + encodeURIComponent(destination.path);
        button.textContent = summary.last ? 'Continue: ' + destination.lesson.name : 'Start with phase 00';
      }
      if (message && summary.complete) message.textContent = summary.complete + ' complete. Your next unfinished lesson is ready below.';
    }

    renderRail();
    render('');
    paintProgress();
    if (search) search.addEventListener('input', function () { render(search.value); });
    if (progress && progress.onChange) progress.onChange(function () { render(search ? search.value : ''); paintProgress(); });

    var themeButton = documentValue.getElementById('themeToggle');
    var rootElement = documentValue.documentElement;
    var stored = '';
    try { stored = root.localStorage.getItem('theme') || ''; } catch (_) {}
    if (stored) rootElement.setAttribute('data-theme', stored);
    else if (root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches) rootElement.setAttribute('data-theme', 'dark');
    function updateThemeIcon() {
      var icon = documentValue.getElementById('themeIcon');
      if (icon) icon.textContent = rootElement.getAttribute('data-theme') === 'dark' ? 'D' : 'N';
    }
    updateThemeIcon();
    if (themeButton) themeButton.addEventListener('click', function () {
      var next = rootElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      rootElement.setAttribute('data-theme', next);
      try { root.localStorage.setItem('theme', next); } catch (_) {}
      updateThemeIcon();
    });
    return { render: render, summary: function () { return progressSummary(allItems, progress); } };
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
    else init();
  }

  return { lessonPath: lessonPath, phaseSlug: phaseSlug, flatten: flatten, progressSummary: progressSummary, init: init };
}));
