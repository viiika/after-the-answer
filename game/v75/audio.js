/* Original, offline procedural score. No samples, external services, or autoplay. */
(function () {
  'use strict';
  if (window.V75Audio) return;
  const KEY = 'answers-afterward.v75.sound.1';
  const LANGS = ['zh-Hans', 'en', 'ar', 'hi', 'ja'];
  const WORDS = {
    sound: ['声音', 'Sound', 'الصوت', 'ध्वनि', 'サウンド'],
    start: ['启用声音', 'Enable sound', 'تشغيل الصوت', 'ध्वनि चालू करें', 'サウンドを有効にする'],
    stop: ['暂停声音', 'Pause sound', 'إيقاف الصوت مؤقتًا', 'ध्वनि रोकें', 'サウンドを停止する'],
    music: ['氛围音乐', 'Ambient music', 'موسيقى هادئة', 'परिवेश संगीत', '環境音楽'],
    effects: ['交互音效', 'Interaction sounds', 'أصوات التفاعل', 'क्रिया ध्वनियाँ', '操作音'],
    volume: ['总音量', 'Master volume', 'مستوى الصوت', 'कुल आवाज़', '全体の音量'],
    silent: ['声音尚未启用；点击后才会播放。', 'Sound is off. It starts only when you enable it.', 'الصوت متوقف. لن يبدأ إلا عندما تشغّله.', 'ध्वनि बंद है। आपके चालू करने पर ही बजेगी।', 'サウンドはオフです。有効にすると再生します。'],
    background: ['页面在后台，声音已暂停。', 'Sound is paused while this page is in the background.', 'الصوت متوقف مؤقتًا لأن الصفحة في الخلفية.', 'यह पृष्ठ पृष्ठभूमि में है; ध्वनि रुकी हुई है।', 'ページが非表示の間はサウンドを停止します。'],
    unavailable: ['这个浏览器暂时无法播放声音，仍可继续游戏。', 'Sound is unavailable in this browser. You can continue playing.', 'الصوت غير متاح في هذا المتصفح. يمكنك متابعة اللعب.', 'इस ब्राउज़र में ध्वनि उपलब्ध नहीं है। खेल जारी रख सकते हैं।', 'このブラウザーではサウンドを再生できません。ゲームは続けられます。'],
    retry: ['声音播放被浏览器暂停，请再点击启用。', 'The browser paused audio. Enable sound again to retry.', 'أوقف المتصفح الصوت. شغّله مجددًا للمحاولة.', 'ब्राउज़र ने ध्वनि रोक दी। फिर चालू करके देखें।', 'ブラウザーが再生を停止しました。もう一度有効にしてください。'],
    playing: ['正在播放', 'Playing', 'قيد التشغيل', 'चल रहा है', '再生中'],
    quiet: ['音乐与音效均已关闭。', 'Music and effects are both off.', 'الموسيقى والمؤثرات متوقفة.', 'संगीत और ध्वनि प्रभाव दोनों बंद हैं।', '音楽と操作音はどちらもオフです。'],
    onlyEffects: ['仅交互音效', 'Interaction sounds only', 'أصوات التفاعل فقط', 'केवल क्रिया ध्वनियाँ', '操作音のみ'],
    draft: ['原创算法音色试配；无配音。音频偏好会保留，重新打开后仍需手动启用。', 'Original procedural draft score; no voice acting. Preferences are saved, but playback always needs your permission after reopening.', 'موسيقى أولية أصلية مولدة برمجيًا؛ بلا تمثيل صوتي. تُحفظ الإعدادات، لكن التشغيل يتطلب تفعيلك بعد إعادة الفتح.', 'मूल प्रोग्राम-निर्मित प्रारंभिक संगीत; आवाज़ का अभिनय नहीं। सेटिंग सेव होती हैं, पर दोबारा खोलने पर आपको ध्वनि चालू करनी होगी।', '独自の音色合成による仮の楽曲です。音声演技はありません。設定は保存しますが、再度開いた際には手動で有効にしてください。'],
    daily: ['窗边的杯子', 'A Cup by the Window', 'كوب بجوار النافذة', 'खिड़की के पास प्याला', '窓辺のカップ'],
    inquiry: ['交错的地图', 'Crossing Maps', 'خرائط متقاطعة', 'उलझे नक्शे', '重なり合う地図'],
    grief: ['空着的椅子', 'An Empty Chair', 'كرسي فارغ', 'खाली कुर्सी', '空いた椅子'],
    finale: ['另一个早晨', 'Another Morning', 'صباح آخر', 'एक और सुबह', 'もう一つの朝']
  };
  // Sparse original motifs; pitch values are MIDI note numbers, null means a rest.
  // Shared pitches make transitions related; no success fanfare or failure buzzer.
  const THEMES = {
    daily: { step: 1.65, melody: [64, null, 67, 62, null, 69, 67, null, 64, 59, null, 62, 67, null, 64, null], bass: [48, 45, 53, 48], gain: .16 },
    inquiry: { step: 1.45, melody: [62, null, 65, null, 69, 64, null, 62, 67, null, 65, 60, null, 64, null, null], bass: [38, 46, 43, 45], gain: .13 },
    grief: { step: 2.3, melody: [57, null, null, 64, null, 60, null, null, 59, null, 55, null, null, 62, null, null], bass: [45, 41, 48, 40], gain: .10 },
    finale: { step: 1.85, melody: [64, null, 67, 69, null, 71, null, 67, 62, null, 64, null, 69, null, 67, null], bass: [48, 43, 45, 53], gain: .15 }
  };
  const CHAPTER_THEMES = { london: 'inquiry', classroom: 'daily', accident: 'grief', aftermath: 'grief', hidden: 'daily', return: 'inquiry', empty: 'grief', hearing: 'inquiry', rescue: 'inquiry', departure: 'grief', tenyears: 'finale', epilogue: 'finale' };
  let prefs = { music: true, effects: true, volume: .35 };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.version === 1 && typeof saved.music === 'boolean' && typeof saved.effects === 'boolean' && Number.isFinite(saved.volume) && saved.volume >= 0 && saved.volume <= 1) prefs = { music: saved.music, effects: saved.effects, volume: saved.volume };
  } catch (_) { /* Storage is optional. */ }
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  let ctx, master, musicBus, fxBus, timer, nextTime = 0, beat = 0, theme = 'daily';
  let enabled = false, pending = false, failed = false, previousFx = 0, explicitTheme = null;
  let revision = 0, ui, foleyCount = 0, lastFoley = null;
  const voices = new Set();
  const locale = () => Math.max(0, LANGS.indexOf(document.documentElement.lang));
  const tr = key => WORDS[key][locale()];
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify({ version: 1, ...prefs })); } catch (_) {} };
  const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);
  const visible = () => !document.hidden;
  function param(p, value, seconds = .25) {
    p.cancelScheduledValues(ctx.currentTime);
    p.setTargetAtTime(value, ctx.currentTime, seconds);
  }
  function stopVoices(kind) {
    for (const voice of voices) if (!kind || voice.kind === kind) {
      try { voice.amp.gain.cancelScheduledValues(ctx.currentTime); voice.amp.gain.setTargetAtTime(.00001, ctx.currentTime, .045); voice.osc.stop(ctx.currentTime + .25); } catch (_) {}
    }
  }
  function tone(midi, at, duration, gain, type = 'sine', kind = 'music') {
    if (!ctx || ctx.state !== 'running') return;
    const osc = ctx.createOscillator(), amp = ctx.createGain();
    const voice = { osc, amp, kind }; voices.add(voice);
    osc.type = type; osc.frequency.setValueAtTime(hz(midi), at);
    amp.gain.setValueAtTime(.00001, at);
    amp.gain.exponentialRampToValueAtTime(Math.max(.00002, gain), at + (kind === 'music' ? .16 : .012));
    amp.gain.exponentialRampToValueAtTime(.00001, at + duration);
    osc.connect(amp); amp.connect(kind === 'music' ? musicBus : fxBus);
    osc.onended = () => { voices.delete(voice); osc.disconnect(); amp.disconnect(); };
    osc.start(at); osc.stop(at + duration + .04);
  }
  function scheduler() {
    if (!enabled || !visible() || !prefs.music || !ctx || ctx.state !== 'running') return;
    // Reset after a stalled tab; never schedule a burst of overdue notes.
    if (nextTime < ctx.currentTime - .1) nextTime = ctx.currentTime + .1;
    const t = THEMES[theme];
    while (nextTime < ctx.currentTime + .35) {
      const i = beat % t.melody.length, note = t.melody[i];
      if (note !== null) {
        tone(note, nextTime, t.step * 2.3, t.gain, 'sine');
        tone(note + 12, nextTime + .025, t.step * 1.7, t.gain * .10, 'triangle');
      }
      if (i % 4 === 0) tone(t.bass[Math.floor(i / 4)], nextTime, t.step * 4.5, t.gain * .48, 'sine');
      beat++; nextTime += t.step;
    }
  }
  function stopSchedule() { if (timer) clearInterval(timer); timer = null; }
  function startSchedule() {
    stopSchedule(); if (!prefs.music || !enabled || !visible()) return;
    nextTime = ctx.currentTime + .12; beat = 0;
    scheduler(); timer = setInterval(scheduler, 120);
  }
  function ensureContext() {
    if (ctx) return;
    ctx = new AudioCtor();
    master = ctx.createGain(); master.gain.value = 0;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -20; compressor.knee.value = 20; compressor.ratio.value = 4;
    compressor.attack.value = .03; compressor.release.value = .3;
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 2600;
    musicBus = ctx.createGain(); musicBus.gain.value = prefs.music ? 1 : 0;
    fxBus = ctx.createGain(); fxBus.gain.value = prefs.effects ? 1 : 0;
    musicBus.connect(filter); filter.connect(master); fxBus.connect(master);
    master.connect(compressor); compressor.connect(ctx.destination);
    ctx.addEventListener('statechange', updateUI);
  }
  async function start() {
    if (pending || !AudioCtor) return;
    const token = ++revision;
    pending = true; failed = false; updateUI();
    try {
      ensureContext();
      await ctx.resume();
      if (token !== revision || !visible()) { await ctx.suspend(); return; }
      if (ctx.state !== 'running') throw new Error('Audio did not start');
      enabled = true;
      param(master.gain, prefs.volume * .65, .35);
      startSchedule();
    } catch (_) { failed = true; enabled = false; stopSchedule(); }
    finally { pending = false; updateUI(); }
  }
  function pause() {
    revision++; enabled = false; stopSchedule();
    if (ctx) {
      param(master.gain, 0, .06); stopVoices();
      // Keep a brief release tail, then suspend; a new click invalidates this pause.
      const token = revision;
      setTimeout(() => { if (token === revision && !enabled && ctx.state === 'running') ctx.suspend().catch(() => {}); }, 260);
    }
    updateUI();
  }
  function detectTheme() {
    if (explicitTheme) return explicitTheme;
    const stagedTheme = document.body?.dataset.audioTheme;
    if (THEMES[stagedTheme]) return stagedTheme;
    const credits = document.getElementById('credits');
    if (credits && !credits.hidden) return 'finale';
    const title = document.getElementById('title')?.textContent?.trim();
    const chapter = window.FULL_STORY?.chapters?.find(c => Object.values(c.title).includes(title));
    if (chapter && CHAPTER_THEMES[chapter.id]) return CHAPTER_THEMES[chapter.id];
    const src = document.getElementById('background')?.getAttribute('src') || '';
    if (/aftermath|empty-city|departure|accident/.test(src)) return 'grief';
    if (/rio|sydney|mars-home|galaxy/.test(src)) return 'finale';
    if (/london|archive|hearing|return-museum/.test(src)) return 'inquiry';
    return 'daily';
  }
  function refreshScene() {
    const next = detectTheme();
    if (next !== theme) {
      theme = next;
      if (ctx && enabled) { stopVoices('music'); startSchedule(); }
    }
    updateUI();
  }
  function playClick(event) {
    if (!enabled || !visible() || !prefs.effects || !ctx || ctx.state !== 'running') return;
    const target = event.target instanceof Element ? event.target.closest('button, a, summary, select') : null;
    if (!target || target.closest('#v75-sound') || target.disabled || target.closest('#credits')) return;
    const now = ctx.currentTime;
    if (now - previousFx < .1) return;
    previousFx = now;
    // Same soft, neutral sound for every interaction; no moral or accident reward.
    tone(67, now + .005, .10, .045, 'sine', 'effect');
    tone(55, now + .006, .07, .025, 'triangle', 'effect');
  }
  function grain(at, duration, gain, cutoff) {
    if (!ctx || ctx.state !== 'running') return;
    const source = ctx.createBufferSource(), amp = ctx.createGain(), filter = ctx.createBiquadFilter();
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate), data = buffer.getChannelData(0);
    // Original filtered noise; no recorded voices or third-party samples.
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    source.buffer = buffer; filter.type = 'lowpass'; filter.frequency.value = cutoff;
    amp.gain.setValueAtTime(.00001, at); amp.gain.linearRampToValueAtTime(gain, at + .012); amp.gain.exponentialRampToValueAtTime(.00001, at + duration);
    source.connect(filter); filter.connect(amp); amp.connect(fxBus);
    const voice = { osc: source, amp, kind: 'effect' }; voices.add(voice);
    source.onended = () => { voices.delete(voice); source.disconnect(); filter.disconnect(); amp.disconnect(); };
    source.start(at); source.stop(at + duration + .02);
  }
  function playFoley(event) {
    const kind = event.detail?.kind;
    if (!['paper', 'roll', 'wheel', 'press', 'write', 'chop', 'ceramic', 'metal', 'wood'].includes(kind) || !enabled || !visible() || !prefs.effects || !ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    if (now - previousFx < .12) return;
    previousFx = now; foleyCount++; lastFoley = kind;
    if (kind === 'paper') { grain(now, .18, .085, 1800); grain(now + .055, .14, .055, 1000); }
    if (kind === 'roll') grain(now, .15, .07, 650);
    if (kind === 'write') { grain(now, .08, .05, 2300); grain(now + .11, .09, .04, 1900); }
    if (kind === 'wheel') { grain(now, .09, .035, 450); tone(43, now, .09, .022, 'triangle', 'effect'); }
    if (kind === 'chop') { grain(now, .055, .055, 1300); tone(48, now, .075, .026, 'triangle', 'effect'); }
    if (kind === 'ceramic') { tone(80, now, .14, .018, 'sine', 'effect'); tone(87, now + .005, .09, .009, 'sine', 'effect'); }
    if (kind === 'metal') { grain(now, .05, .018, 1800); tone(89, now, .07, .012, 'sine', 'effect'); }
    if (kind === 'wood') { grain(now, .065, .04, 450); tone(52, now, .09, .022, 'triangle', 'effect'); }
    if (kind === 'press') { grain(now, .12, .07, 350); tone(36, now, .18, .055, 'sine', 'effect'); }
  }
  async function visibilityChanged() {
    if (!ctx || !enabled) return;
    const token = ++revision;
    if (!visible()) {
      stopSchedule(); stopVoices();
      try { await ctx.suspend(); } catch (_) {}
    } else {
      try {
        await ctx.resume();
        if (token === revision && enabled && visible()) {
          param(master.gain, prefs.volume * .65, .35); startSchedule();
        }
      } catch (_) { enabled = false; failed = true; }
    }
    updateUI();
  }
  function updateUI() {
    if (!ui) return;
    ui.querySelectorAll('[data-sound-text]').forEach(el => { el.textContent = tr(el.dataset.soundText); });
    const toggle = ui.querySelector('#sound-toggle');
    toggle.textContent = tr(enabled ? 'stop' : 'start');
    toggle.setAttribute('aria-pressed', String(enabled)); toggle.disabled = !AudioCtor || pending;
    ui.querySelector('#sound-music').checked = prefs.music;
    ui.querySelector('#sound-effects').checked = prefs.effects;
    ui.querySelector('#sound-volume').value = String(Math.round(prefs.volume * 100));
    ui.querySelector('#sound-volume-value').textContent = Math.round(prefs.volume * 100) + '%';
    ui.querySelectorAll('input').forEach(el => { el.disabled = !AudioCtor; });
    const status = !AudioCtor ? tr('unavailable') : failed ? tr('retry') : !enabled ? tr('silent') : !visible() ? tr('background') : !prefs.music && !prefs.effects ? tr('quiet') : prefs.music ? tr('playing') + ' · ' + tr(theme) : tr('onlyEffects');
    const statusEl = ui.querySelector('#sound-status');
    if (statusEl.textContent !== status) statusEl.textContent = status;
    ui.querySelector('summary').setAttribute('aria-label', tr('sound') + ' · ' + (enabled ? tr('playing') : tr('silent')));
  }
  function mount() {
    ui = document.createElement('details'); ui.id = 'v75-sound'; ui.className = 'v75-sound';
    ui.innerHTML = '<summary><span aria-hidden="true">♫</span> <span data-sound-text="sound"></span></summary><div class="sound-controls"><button type="button" id="sound-toggle" aria-pressed="false"></button><label class="sound-check"><input type="checkbox" id="sound-music"><span data-sound-text="music"></span></label><label class="sound-check"><input type="checkbox" id="sound-effects"><span data-sound-text="effects"></span></label><label for="sound-volume" data-sound-text="volume"></label><div class="sound-level"><input type="range" id="sound-volume" min="0" max="100" step="1" value="35"><output id="sound-volume-value" for="sound-volume"></output></div><p id="sound-status" role="status" aria-live="polite"></p><p class="sound-note" data-sound-text="draft"></p></div>';
    const host = document.querySelector('header .tools') || document.querySelector('header') || document.body;
    host.append(ui);
    ui.querySelector('#sound-toggle').addEventListener('click', () => enabled ? pause() : start());
    ui.querySelector('#sound-music').addEventListener('change', event => {
      prefs.music = event.target.checked; persist();
      if (ctx) {
        param(musicBus.gain, prefs.music ? 1 : 0, .12);
        if (enabled && prefs.music) startSchedule(); else { stopSchedule(); stopVoices('music'); }
      }
      updateUI();
    });
    ui.querySelector('#sound-effects').addEventListener('change', event => {
      prefs.effects = event.target.checked; persist(); if (ctx) param(fxBus.gain, prefs.effects ? 1 : 0, .06); updateUI();
    });
    ui.querySelector('#sound-volume').addEventListener('input', event => {
      prefs.volume = Number(event.target.value) / 100; persist();
      if (ctx && enabled) param(master.gain, prefs.volume * .65, .08); updateUI();
    });
    new MutationObserver(refreshScene).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    new MutationObserver(refreshScene).observe(document.body, { attributes: true, attributeFilter: ['data-audio-theme'] });
    ['title', 'scene-title', 'background', 'credits'].forEach(id => {
      const el = document.getElementById(id);
      if (el) new MutationObserver(refreshScene).observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'hidden'] });
    });
    document.addEventListener('click', playClick);
    window.addEventListener('v75:foley', playFoley);
    document.addEventListener('pointerdown', event => { if (ui.open && !ui.contains(event.target)) ui.open = false; });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && ui.open && !document.querySelector('dialog[open]')) { ui.open = false; ui.querySelector('summary').focus(); }
    });
    document.addEventListener('visibilitychange', visibilityChanged);
    window.addEventListener('pagehide', () => { pause(); if (ctx) ctx.suspend().catch(() => {}); });
    window.addEventListener('v75:audio-scene', event => {
      explicitTheme = THEMES[event.detail?.theme] ? event.detail.theme : null; refreshScene();
    });
    refreshScene();
  }
  // Read-only diagnostics for regression tests and accessibility support.
  window.V75Audio = Object.freeze({ inspect: () => ({ enabled, supported: !!AudioCtor, contextCreated: !!ctx, contextState: ctx?.state || 'uncreated', theme, music: prefs.music, effects: prefs.effects, volume: prefs.volume, scheduled: !!timer, voices: voices.size, foleyCount, lastFoley }) });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
})();
