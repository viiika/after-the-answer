/* Presentation only: never reads save files, unlocks story nodes, or changes game state. */
(() => {
  'use strict';
  const stage = document.querySelector('.stage'), background = document.querySelector('#background');
  if (!stage || !background) return;
  const languages = ['zh-Hans', 'en', 'ar', 'hi', 'ja'];
  const words = {
    explore: ['点击标记，走近一件小事。', 'Choose a marker. Notice a small detail.', 'اختر علامة وتأمل تفصيلًا صغيرًا.', 'एक निशान चुनें। किसी छोटी बात पर ध्यान दें।', '印を選び、小さな出来事に目を向ける。'],
    motion: ['场景动效', 'Scene motion', 'حركة المشهد', 'दृश्य की गति', 'シーンの動き'],
    still: ['静止画面', 'Still scene', 'مشهد ثابت', 'स्थिर दृश्य', '静止表示'],
    system: ['跟随系统：减少动态', 'System: reduced motion', 'النظام: تقليل الحركة', 'सिस्टम: कम गति', 'システム設定：動きを抑制'],
    labels: ['显示标记名称', 'Show marker labels', 'إظهار أسماء العلامات', 'निशानों के नाम दिखाएँ', '印の名前を表示'],
    controls: ['画面设置', 'Scene settings', 'إعدادات المشهد', 'दृश्य की सेटिंग', '画面設定']
  };
  const key = 'answers-afterward.v75.presentation.1';
  let preferences = { motion: true, labels: false };
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && typeof saved.motion === 'boolean' && typeof saved.labels === 'boolean') preferences = saved; } catch { /* Presentation also works without storage. */ }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const make = (tag, className) => { const n = document.createElement(tag); n.className = className; return n; };
  const layers = make('div', 'stage-layers'); layers.setAttribute('aria-hidden', 'true');
  const ghost = make('img', 'stage-previous'); ghost.alt = '';
  const light = make('div', 'stage-light');
  const rain = make('div', 'stage-rain');
  const cast = make('div', 'stage-cast');
  const focus = make('div', 'stage-object-focus');
  layers.append(ghost, light, rain, cast, focus); stage.append(layers);
  const actors = {};
  ['vika', 'noyi'].forEach(name => { const figure = make('div', 'stage-person'); figure.dataset.person = name; const image = make('img', 'stage-person-image'); image.src = 'assets/' + name + '.webp'; image.alt = ''; image.draggable = false; figure.append(image); cast.append(figure); actors[name] = figure; });
  const toolbar = make('div', 'stage-toolbar'), note = make('p', 'stage-explore-note'), settings = make('div', 'stage-settings');
  settings.setAttribute('role', 'group');
  const motion = make('button', 'stage-motion'), labels = make('button', 'stage-labels');
  motion.type = labels.type = 'button'; motion.id = 'scene-motion'; labels.id = 'scene-labels';
  settings.append(labels, motion); toolbar.append(note, settings); stage.after(toolbar);
  stage.classList.add('stage-directed');
  let previousImage = '', previousActor = '', pending = false, effectTimer = 0, dissolveTimer = 0;
  const text = name => words[name][Math.max(0, languages.indexOf(document.documentElement.lang))];
  function updatePreferences() {
    const quiet = reduced.matches || !preferences.motion;
    document.documentElement.classList.toggle('scene-motion-off', quiet);
    stage.classList.toggle('stage-show-labels', preferences.labels);
    motion.setAttribute('aria-pressed', String(!quiet));
    motion.textContent = text(reduced.matches ? 'system' : quiet ? 'still' : 'motion');
    motion.disabled = reduced.matches;
    labels.setAttribute('aria-pressed', String(preferences.labels)); labels.textContent = text('labels');
    settings.setAttribute('aria-label', text('controls')); note.textContent = text('explore');
    if (quiet) { ghost.classList.remove('is-dissolving'); stage.classList.remove('stage-object-active'); }
  }
  function persist() { try { localStorage.setItem(key, JSON.stringify(preferences)); } catch { /* Optional preference only. */ } updatePreferences(); }
  motion.addEventListener('click', () => { preferences.motion = !preferences.motion; persist(); });
  labels.addEventListener('click', () => { preferences.labels = !preferences.labels; persist(); });
  reduced.addEventListener('change', updatePreferences);

  function currentChapter() {
    const id = document.querySelector('#spots [data-node]')?.dataset.node;
    return window.FULL_STORY?.chapters.find(chapter => chapter.nodes.some(node => node.id === id))?.id || '';
  }
  function update() {
    pending = false;
    const source = background.getAttribute('src') || '';
    const chapter = currentChapter();
    const actor = document.querySelector('#actors [aria-pressed="true"]')?.dataset.actor || 'vika';
    const maternal = chapter === 'departure' && source.includes('hidden-home');
    const solemn = ['accident', 'aftermath', 'empty', 'hearing', 'rescue', 'departure'].includes(chapter);
    const room = source.includes('morning-room');
    stage.dataset.sceneMood = solemn || maternal ? 'quiet' : room || ['tenyears', 'epilogue'].includes(chapter) ? 'warm' : 'observant';
    stage.dataset.scene = chapter || (source.includes('river-lab') ? 'jaipur' : room ? 'room' : source.includes('archive') ? 'office' : 'hospital');
    stage.classList.toggle('stage-london', chapter === 'london');
    stage.classList.toggle('stage-mother', maternal);
    // The opening shows only the active protagonist, so it cannot imply a first meeting.
    // Farewell at her mother's home belongs to Noyi; other scenes show the selected viewpoint.
    const both = ['tenyears', 'epilogue'].includes(chapter);
    const shown = maternal ? ['noyi'] : both ? ['vika', 'noyi'] : [actor];
    Object.entries(actors).forEach(([name, figure]) => {
      figure.hidden = !shown.includes(name); figure.classList.toggle('is-active', name === actor);
      figure.classList.toggle('is-right', name === 'noyi');
    });
    if (actor !== previousActor && !solemn && !reduced.matches && preferences.motion) {
      actors[actor].classList.remove('is-entering'); void actors[actor].offsetWidth; actors[actor].classList.add('is-entering');
    }
    previousActor = actor;
    if (source !== previousImage) {
      if (previousImage && !reduced.matches && preferences.motion) {
        ghost.src = previousImage; ghost.classList.remove('is-dissolving'); void ghost.offsetWidth; ghost.classList.add('is-dissolving');
        clearTimeout(dissolveTimer); dissolveTimer = setTimeout(() => ghost.classList.remove('is-dissolving'), 700);
      }
      previousImage = source;
    }
    document.querySelectorAll('#spots .spot').forEach((spot, index) => {
      spot.dataset.markerLabel = spot.textContent.trim();
      if (!spot.dataset.index) spot.dataset.index = String(index + 1);
      if (!spot.getAttribute('aria-label')) spot.setAttribute('aria-label', spot.textContent.trim());
      const x = parseFloat(spot.style.left) || 50;
      spot.classList.toggle('label-left', x > 68); spot.classList.toggle('label-right', x < 32);
    });
    updatePreferences();
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  new MutationObserver(schedule).observe(background, { attributes: true, attributeFilter: ['src'] });
  new MutationObserver(schedule).observe(document.querySelector('#spots'), { childList: true });
  new MutationObserver(schedule).observe(document.querySelector('#actors'), { attributes: true, subtree: true, attributeFilter: ['aria-pressed'] });
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  document.addEventListener('click', event => {
    const button = event.target.closest('.spot, [data-list-node]');
    if (!button) return;
    const nodeId = button.dataset.node || button.dataset.listNode;
    const spot = nodeId ? [...document.querySelectorAll('#spots .spot')].find(n => n.dataset.node === nodeId) : button;
    if (!spot) return;
    focus.style.left = spot.style.left; focus.style.top = spot.style.top;
    stage.classList.remove('stage-object-active'); void focus.offsetWidth;
    if (!reduced.matches && preferences.motion) stage.classList.add('stage-object-active');
    clearTimeout(effectTimer); effectTimer = setTimeout(() => stage.classList.remove('stage-object-active'), 850);
    schedule();
  }, true);
  update();
})();
