/* AI 실습 코스 통합관 엔진
   1) 업종·단계를 고르면  2) lib/manifest.json 에서 맞는 강의를 고르고
   3) lib/<그룹>.html 에서 강의를 꺼내 {{토큰}}을 업종 말로 바꾼 뒤
   4) 기존 코스와 같은 방식(목차·진도·?풀이·AI/요금제 전환)으로 보여 줍니다. */
(function () {
  'use strict';
  var IND = window.INDUSTRIES, DATA = window.COURSE_DATA;
  var PREF_KEY = 'aicourse:prefs';
  var STAGES = ['prep', 'takeover', 'operate'];
  var STAGE_HINT = {
    prep: '빈 공간에서 이름·인테리어부터 새로 시작해요',
    takeover: '운영 중인 곳을 넘겨받아요. 실사·계약·승계·채널 넘겨받기 강의가 더해져요',
    operate: '이미 문을 열었어요. 준비 강의는 빼고 운영·자동화 위주로 엮어요'
  };
  var BIZ_LABEL = { vet: '동물병원', salad: '샐러드', flower: '꽃집', arch: '건축사' };

  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var prefs = lsGet(PREF_KEY, {}) || {};
  function savePrefs() { lsSet(PREF_KEY, prefs); }

  // ---------- 주소(코스 링크) ----------
  var Q = new URLSearchParams(location.search);
  function profileFromQuery() {
    var biz = Q.get('biz'), stage = Q.get('stage');
    if (!biz || STAGES.indexOf(stage) < 0) return null;
    if (biz !== 'custom' && !IND[biz]) return null;
    var p = { biz: biz, stage: stage };
    if (biz === 'custom') { p.name = (Q.get('name') || '').slice(0, 30); p.type = Q.get('type') || 'shop'; }
    return p;
  }
  function profKey(p) { return 'aicourse:' + p.biz + (p.biz === 'custom' ? ':' + p.name + ':' + p.type : '') + ':' + p.stage; }
  function profUrl(p, extra) {
    var u = new URLSearchParams();
    u.set('biz', p.biz);
    if (p.biz === 'custom') { u.set('name', p.name); u.set('type', p.type); }
    u.set('stage', p.stage);
    if (extra) Object.keys(extra).forEach(function (k) { if (extra[k]) u.set(k, extra[k]); });
    return location.pathname + '?' + u.toString();
  }
  function industryOf(p) { return p.biz === 'custom' ? window.makeCustomIndustry(p.name, p.type) : IND[p.biz]; }

  // ---------- 토큰과 조사 ----------
  function hasBatchim(word) {
    var c = (word || '').replace(/[\s)\]」』'"·]+$/, '').slice(-1);
    if (!c) return false;
    var code = c.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) return (code - 0xAC00) % 28 !== 0;
    if (/[0-9]/.test(c)) return '0136780'.indexOf(c) >= 0;
    return false;
  }
  function rieul(word) { var c = (word || '').slice(-1).charCodeAt(0); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 === 8; }
  function josa(word, j) {
    var b = hasBatchim(word);
    switch (j) {
      case '이': case '가': return b ? '이' : '가';
      case '은': case '는': return b ? '은' : '는';
      case '을': case '를': return b ? '을' : '를';
      case '과': case '와': return b ? '과' : '와';
      case '으로': case '로': return b && !rieul(word) ? '으로' : '로';
      case '이다': return b ? '이' : '';
      case '이에요': case '예요': return b ? '이에요' : '예요';
      default: return j;
    }
  }
  function makeReplacer(terms) {
    return function (s) {
      return s.replace(/\{\{(\w+)(?::([^}]+))?\}\}/g, function (m, k, j) {
        if (!(k in terms)) return m;
        var w = terms[k];
        return j ? w + josa(w, j) : w;
      });
    };
  }

  // ---------- 고르는 화면 ----------
  function runSetup(initial) {
    document.getElementById('setup').hidden = false;
    document.title = '우리 가게 AI 코스 만들기';
    var sel = { biz: initial ? initial.biz : '', name: initial && initial.name || '', type: initial && initial.type || 'shop', stage: initial ? initial.stage : '', ai: prefs.ai || '', plan: prefs.plan || '' };
    var q = document.getElementById('bizQ'), chips = document.getElementById('bizChips');
    var cbox = document.getElementById('customBox'), ctypes = document.getElementById('customTypes');

    Object.keys(window.CUSTOM_TYPES).forEach(function (k) {
      var t = window.CUSTOM_TYPES[k], b = document.createElement('button');
      b.type = 'button'; b.dataset.type = k;
      b.innerHTML = '<strong></strong><span></span>';
      b.querySelector('strong').textContent = t.label;
      b.querySelector('span').textContent = t.owner + ' · ' + t.customer + ' · ' + t.place;
      b.addEventListener('click', function () { sel.type = k; paint(); });
      ctypes.appendChild(b);
    });

    function matches(text) {
      var t = text.trim().toLowerCase();
      if (!t) return Object.keys(IND);
      return Object.keys(IND).filter(function (k) {
        return IND[k].aliases.some(function (a) { a = a.toLowerCase(); return a.indexOf(t) >= 0 || t.indexOf(a) >= 0; });
      });
    }
    function chip(label, icon, small, pressed, onClick, cls) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 's-chip' + (cls ? ' ' + cls : ''); b.setAttribute('role', 'listitem');
      b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      var i = document.createElement('span'); i.className = 'ic'; i.textContent = icon; i.setAttribute('aria-hidden', 'true');
      var s = document.createElement('span'); s.textContent = label;
      b.appendChild(i); b.appendChild(s);
      if (small) { var sm = document.createElement('small'); sm.textContent = small; b.appendChild(sm); }
      b.addEventListener('click', onClick);
      return b;
    }
    function renderChips() {
      chips.textContent = '';
      var text = q.value.trim();
      var m = matches(text);
      m.forEach(function (k) {
        chips.appendChild(chip(IND[k].name, IND[k].icon, '전용 강의 있음', sel.biz === k, function () { sel.biz = k; paint(); }));
      });
      if (text && !(m.length && IND[m[0]].name === text)) {
        chips.appendChild(chip("'" + text + "'(으)로 만들기", '＋', '공통 강의', sel.biz === 'custom' && sel.name === text, function () { sel.biz = 'custom'; sel.name = text; paint(); }, 'new'));
      } else if (!text && sel.biz === 'custom' && sel.name) {
        chips.appendChild(chip(sel.name, '🏪', '공통 강의', true, function () {}, 'new'));
      }
    }
    var stageCards = document.getElementById('stageCards');
    function renderStages() {
      stageCards.textContent = '';
      var ind = sel.biz ? industryOf(sel) : null;
      STAGES.forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-pressed', sel.stage === s ? 'true' : 'false');
        b.innerHTML = '<strong></strong><span></span>';
        b.querySelector('strong').textContent = ind ? ind.stages[s] : { prep: '새로 열어요', takeover: '넘겨받아요', operate: '운영 중이에요' }[s];
        b.querySelector('span').textContent = STAGE_HINT[s];
        b.addEventListener('click', function () { sel.stage = s; paint(); });
        stageCards.appendChild(b);
      });
    }
    function paint() {
      renderChips(); renderStages();
      cbox.hidden = sel.biz !== 'custom';
      document.getElementById('customName').textContent = sel.name;
      ctypes.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.type === sel.type ? 'true' : 'false'); });
      document.querySelectorAll('[data-s-ai]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.sAi === sel.ai ? 'true' : 'false'); });
      document.querySelectorAll('[data-s-plan]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.sPlan === sel.plan ? 'true' : 'false'); });
      var ok = sel.biz && sel.stage && (sel.biz !== 'custom' || sel.name);
      document.getElementById('goBtn').disabled = !ok;
      var sum = document.getElementById('goSum');
      if (!ok) sum.textContent = !sel.biz ? '업종을 골라 주세요.' : '단계를 골라 주세요.';
      else {
        var ind = industryOf(sel);
        var n = countLessons(sel);
        sum.textContent = ind.name + ' · ' + ind.stages[sel.stage] + (n ? ' — 강의 ' + n + '개로 엮어요' : '');
      }
    }
    var MAN = null;
    fetch('lib/manifest.json').then(function (r) { return r.json(); }).then(function (m) { MAN = m; paint(); }).catch(function () {});
    function countLessons(p) { return MAN ? MAN.lessons.filter(function (L) { return defaultOn(L, p.biz, p.stage); }).length : 0; }

    q.addEventListener('input', function () { renderChips(); });
    q.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var m = matches(q.value); var t = q.value.trim();
      if (m.length === 1) sel.biz = m[0]; else if (t && !m.length) { sel.biz = 'custom'; sel.name = t; }
      paint();
    });
    document.querySelectorAll('[data-s-ai]').forEach(function (b) { b.addEventListener('click', function () { sel.ai = b.dataset.sAi; paint(); }); });
    document.querySelectorAll('[data-s-plan]').forEach(function (b) { b.addEventListener('click', function () { sel.plan = b.dataset.sPlan; paint(); }); });
    document.getElementById('goBtn').addEventListener('click', function () {
      if (sel.ai) prefs.ai = sel.ai; if (sel.plan) prefs.plan = sel.plan; savePrefs();
      var p = { biz: sel.biz, stage: sel.stage };
      if (p.biz === 'custom') { p.name = sel.name; p.type = sel.type; }
      location.href = profUrl(p);
    });
    // 최근 코스
    var rec = (prefs.recent || []).filter(function (p) { return p && (p.biz === 'custom' || IND[p.biz]); });
    if (rec.length) {
      document.getElementById('recentBox').hidden = false;
      var rl = document.getElementById('recentList');
      rec.forEach(function (p) {
        var ind = industryOf(p);
        rl.appendChild(chip(ind.name, ind.icon, ind.stages[p.stage], false, function () { location.href = profUrl(p); }));
      });
    }
    paint();
    if (!sel.biz) q.focus({ preventScroll: true });
  }

  function defaultOn(L, biz, stage) {
    if (L.biz.length && L.biz.indexOf(biz) < 0) return false;
    if (L.not.indexOf(biz) >= 0) return false;
    if (L.stage.indexOf(stage) < 0) return false;
    return true;
  }

  // ---------- 코스 화면 ----------
  var P = profileFromQuery();
  if (!P) { runSetup(null); return; }

  var IN = industryOf(P);
  var BIZ = P.biz;
  var terms = IN.terms;
  var R = makeReplacer(terms);
  window.COURSE = { biz: BIZ, stage: P.stage, name: IN.name, terms: terms };
  var KEY = profKey(P);
  var state = lsGet(KEY, {}) || {};
  function save() { lsSet(KEY, state); }

  // 링크로 받은 강의 구성(off/add)은 이 기기 구성보다 우선
  if (Q.has('off') || Q.has('add')) {
    state.off = (Q.get('off') || '').split(',').filter(Boolean);
    state.add = (Q.get('add') || '').split(',').filter(Boolean);
    save();
  }
  state.off = state.off || []; state.add = state.add || [];

  // 최근 코스 목록
  prefs.recent = [P].concat((prefs.recent || []).filter(function (p) { return profKey(p) !== KEY; })).slice(0, 6);
  if (Q.get('ai') === 'claude' || Q.get('ai') === 'gpt') prefs.ai = Q.get('ai');
  if (Q.get('plan') === 'free' || Q.get('plan') === 'paid') prefs.plan = Q.get('plan');
  savePrefs();

  document.getElementById('shell').hidden = false;
  document.getElementById('mnav').hidden = false;
  var title = IN.name + ' AI 실습 코스';
  document.title = title;
  document.getElementById('courseTitle').textContent = title;
  document.getElementById('eyebrow').textContent = '업체 없이 ' + terms.owner + josa(terms.owner, '이') + ' 직접 하는 ' + IN.stages[P.stage] + ' 실습 코스';
  document.getElementById('bizTag').textContent = IN.icon + ' ' + IN.name;
  document.getElementById('stageTag').textContent = IN.stages[P.stage];
  document.getElementById('changeBiz').addEventListener('click', function () {
    location.href = location.pathname + '?pick=1';
  });

  var MAN;
  fetch('lib/manifest.json').then(function (r) { return r.json(); }).then(function (m) {
    MAN = m;
    var chosen = MAN.lessons.filter(function (L) {
      if (state.add.indexOf(L.id) >= 0) return true;
      return defaultOn(L, BIZ, P.stage) && state.off.indexOf(L.id) < 0;
    });
    var groups = {};
    chosen.forEach(function (L) { groups[L.g] = true; });
    return Promise.all(Object.keys(groups).map(function (g) {
      return fetch('lib/' + g + '.html').then(function (r) { return r.text(); }).then(function (t) { return [g, t]; });
    })).then(function (texts) {
      var pool = {};
      texts.forEach(function (gt) {
        var tpl = document.createElement('template');
        tpl.innerHTML = gt[1];
        Array.prototype.forEach.call(tpl.content.querySelectorAll('section.lesson'), function (s) { pool[s.id] = s.outerHTML; });
      });
      mount(chosen, pool);
    });
  }).catch(function (e) {
    document.getElementById('loading').textContent = '강의를 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침해 주세요. (' + e + ')';
  });

  function inList(attr, v) { return (attr || '').split(/\s+/).indexOf(v) >= 0; }
  function prune(root) {
    root.querySelectorAll('[data-biz]').forEach(function (el) { if (el.tagName !== 'SECTION' && !inList(el.getAttribute('data-biz'), BIZ)) el.remove(); });
    root.querySelectorAll('[data-biz-not]').forEach(function (el) { if (el.tagName !== 'SECTION' && inList(el.getAttribute('data-biz-not'), BIZ)) el.remove(); });
    root.querySelectorAll('[data-stage-only]').forEach(function (el) { if (!inList(el.getAttribute('data-stage-only'), P.stage)) el.remove(); });
  }

  function mount(chosen, pool) {
    var main = document.getElementById('lessons');
    main.textContent = '';
    var scripts = [];
    chosen.forEach(function (L) {
      var html = pool[L.id]; if (!html) return;
      var tpl = document.createElement('template');
      tpl.innerHTML = R(html);
      var sec = tpl.content.querySelector('section');
      prune(tpl.content);
      sec.hidden = true;
      if (L.biz.length && L.biz.indexOf(BIZ) < 0) sec.dataset.from = L.biz[0];
      sec.querySelectorAll('script').forEach(function (s) { scripts.push(s.textContent); s.remove(); });
      main.appendChild(sec);
    });
    // 인트로 제목은 업종 문장으로
    var ih = document.getElementById('introH'); if (ih) ih.textContent = IN.blurb;
    scripts.forEach(function (code) {
      var s = document.createElement('script'); s.textContent = code;
      try { document.body.appendChild(s); } catch (e) { console.error(e); }
    });
    buildCourseMap(chosen);
    initEngine();
  }

  // ---------- 코스 지도 (인트로 강의 안) ----------
  function buildCourseMap(chosen) {
    var box = document.getElementById('courseMap'); if (!box) return;
    var partTitle = {}; MAN.parts.forEach(function (p) { partTitle[p[0]] = p[1]; });
    var by = {}, order = [];
    chosen.forEach(function (L) {
      if (L.ai && prefs.ai && L.ai !== prefs.ai) return;
      if (!by[L.part]) { by[L.part] = []; order.push(L.part); }
      by[L.part].push(L);
    });
    var cnt = { core: 0, grow: 0, adv: 0 };
    var rows = order.map(function (k) {
      var ls = by[k];
      ls.forEach(function (L) { cnt[L.level] = (cnt[L.level] || 0) + 1; });
      var c = ls.filter(function (L) { return L.level === 'core'; }).length;
      return '<tr><td><b>' + esc(partTitle[k] || k) + '</b></td><td><span class="refs" data-refs="' + ls.map(function (L) { return L.id; }).join(' ') + '"></span></td><td class="cm-count">' + ls.length + '강' + (c ? ' · 핵심 ' + c : '') + '</td></tr>';
    }).join('');
    box.innerHTML = '<div class="paths">' +
      '<div class="path"><div class="ph"><span class="lv lv-core">핵심</span><b>꼭 할 것</b><small>' + cnt.core + '강 · 이것만 해도 굴러가요</small></div></div>' +
      '<div class="path"><div class="ph"><span class="lv lv-grow">넓히기</span><b>하나씩 붙이기</b><small>' + cnt.grow + '강 · 익숙해지면</small></div></div>' +
      '<div class="path"><div class="ph"><span class="lv lv-adv">고급</span><b>필요할 때만</b><small>' + cnt.adv + '강 · 코드·봇·API</small></div></div></div>' +
      '<div class="table-wrap"><table><thead><tr><th>장</th><th>강의</th><th>분량</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- 강의 고르기 ----------
  var tab = 'mine';
  function openPicker() {
    var dlg = document.getElementById('picker');
    var off = state.off.slice(), add = state.add.slice();
    var list = document.getElementById('pickList'), qi = document.getElementById('pickQ');
    var partTitle = {}; MAN.parts.forEach(function (p) { partTitle[p[0]] = p[1]; });
    function isOnNow(L) { return add.indexOf(L.id) >= 0 || (defaultOn(L, BIZ, P.stage) && off.indexOf(L.id) < 0); }
    function render() {
      var t = qi.value.trim().toLowerCase();
      list.textContent = '';
      var last = '', shown = 0;
      MAN.lessons.forEach(function (L) {
        var mine = defaultOn(L, BIZ, P.stage);
        if (tab === 'mine' && !mine && add.indexOf(L.id) < 0) return;
        var title = R(L.title);
        var hay = (title + ' ' + R(L.kw) + ' ' + (partTitle[L.part] || '')).toLowerCase();
        if (t && hay.indexOf(t) < 0) return;
        if (L.part !== last) { last = L.part; var h = document.createElement('p'); h.className = 'p-part'; h.textContent = partTitle[L.part] || L.part; list.appendChild(h); }
        var lab = document.createElement('label'); lab.className = 'p-item';
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = isOnNow(L);
        var sp = document.createElement('span'); sp.className = 't'; sp.textContent = title;
        var meta = [];
        meta.push({ core: '핵심', grow: '넓히기', adv: '고급' }[L.level] || '');
        if (L.biz.length) meta.push(L.biz.map(function (b) { return (IND[b] || {}).name || b; }).join('·') + ' 전용');
        if (!mine) meta.push((L.biz.length && L.biz.indexOf(BIZ) < 0) || L.not.indexOf(BIZ) >= 0 ? '다른 업종 강의' : '다른 단계 강의');
        if (L.ai) meta.push(L.ai === 'claude' ? 'Claude' : 'ChatGPT');
        var sm = document.createElement('small'); sm.textContent = meta.filter(Boolean).join(' · '); sp.appendChild(sm);
        cb.addEventListener('change', function () {
          if (mine) { var i = off.indexOf(L.id); if (cb.checked) { if (i >= 0) off.splice(i, 1); } else if (i < 0) off.push(L.id); }
          else { var j = add.indexOf(L.id); if (cb.checked) { if (j < 0) add.push(L.id); } else if (j >= 0) add.splice(j, 1); }
          sum();
        });
        lab.appendChild(cb); lab.appendChild(sp); list.appendChild(lab); shown++;
      });
      if (!shown) { var e = document.createElement('p'); e.className = 'p-empty'; e.textContent = t ? "'" + qi.value + "'에 맞는 강의가 없어요." + (tab === 'mine' ? " '모든 강의 창고'에서 찾아보세요." : '') : '강의가 없어요.'; list.appendChild(e); }
      sum();
    }
    function sum() {
      var n = MAN.lessons.filter(isOnNow).length;
      document.getElementById('pickSum').textContent = '선택 ' + n + '강' + (off.length ? ' · 뺀 강의 ' + off.length : '') + (add.length ? ' · 더한 강의 ' + add.length : '');
    }
    document.querySelectorAll('[data-ptab]').forEach(function (b) {
      b.onclick = function () { tab = b.dataset.ptab; document.querySelectorAll('[data-ptab]').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); render(); };
    });
    qi.oninput = function () { if (qi.value.trim() && tab === 'mine') { /* 내 코스에 없으면 창고로 */ } render(); };
    document.getElementById('pickReset').onclick = function () { off = []; add = []; render(); };
    document.getElementById('pickApply').onclick = function () {
      state.off = off; state.add = add; save();
      location.href = profUrl(P);
    };
    document.getElementById('pickClose').onclick = function () { dlg.close(); };
    render();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    qi.focus({ preventScroll: true });
  }

  function flash(msg) {
    var m = document.getElementById('hubMsg'); m.textContent = msg; m.hidden = false;
    clearTimeout(flash.t); flash.t = setTimeout(function () { m.hidden = true; }, 3200);
  }

  // ---------- 강의 화면 엔진 (기존 코스와 같은 동작) ----------
  function initEngine() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var G = {};
    Object.keys(DATA.G).forEach(function (k) { var v = (BIZ !== 'vet' && DATA.G_ALT && DATA.G_ALT[k]) || DATA.G[k]; G[k] = v.map(function (s) { return R(s); }); });
    var DICT_SKIP = BIZ === 'vet' ? [] : (DATA.VET_ONLY || []);
    window.__AIHOW = DATA.AIHOW;

    document.getElementById('pickBtn').addEventListener('click', openPicker);
    document.getElementById('shareBtn').addEventListener('click', function () {
      var url = location.origin + profUrl(P, { off: state.off.join(','), add: state.add.join(',') });
      function ok() { flash('코스 링크를 복사했어요. 카톡이나 문자로 보내면 같은 구성으로 열려요.'); }
      function fail() { window.prompt('이 링크를 길게 눌러 복사하세요', url); }
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fail); else fail(); } catch (e) { fail(); }
    });

    // ? 풀이
    var pop = document.getElementById('gloss');
    var gT = document.getElementById('glossTitle'), gD = document.getElementById('glossDef'), gE = document.getElementById('glossEasy'), gH = document.getElementById('glossHow');
    var openBtn = null;
    function openGloss(key, btn) {
      var g = G[key]; if (!g) return;
      if (openBtn && openBtn !== btn) openBtn.setAttribute('aria-expanded', 'false');
      var how = (window.__AIHOW && window.__AIHOW[key] && window.__AIHOW[key][document.documentElement.dataset.ai || '']) || g[3];
      gT.textContent = g[0]; gD.textContent = g[1]; gE.textContent = g[2]; gH.textContent = R(how);
      pop.hidden = false;
      var narrow = window.innerWidth < 640;
      pop.classList.toggle('sheet', narrow);
      if (!narrow) {
        var r = btn.getBoundingClientRect(), w = pop.offsetWidth;
        var left = Math.min(Math.max(16, r.left + window.scrollX - 24), window.scrollX + document.documentElement.clientWidth - w - 16);
        var top = r.bottom + window.scrollY + 10, h = pop.offsetHeight;
        if (r.bottom + h + 20 > window.innerHeight && r.top - h - 10 > 0) top = r.top + window.scrollY - h - 10;
        pop.style.left = left + 'px'; pop.style.top = top + 'px';
      } else { pop.style.left = ''; pop.style.top = ''; }
      openBtn = btn; btn.setAttribute('aria-expanded', 'true');
      document.getElementById('glossClose').focus({ preventScroll: true });
    }
    function closeGloss() {
      if (pop.hidden) return;
      pop.hidden = true;
      if (openBtn) { openBtn.setAttribute('aria-expanded', 'false'); openBtn.focus({ preventScroll: true }); openBtn = null; }
    }
    document.getElementById('glossClose').addEventListener('click', closeGloss);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeGloss(); });
    document.addEventListener('click', function (e) {
      if (pop.hidden) return;
      if (pop.contains(e.target) || (e.target.closest && e.target.closest('.q, .dict button'))) return;
      closeGloss();
    });
    window.addEventListener('resize', function () { if (!pop.hidden && openBtn) openGloss(openBtn.dataset.t, openBtn); });
    function makeQ(key, label) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'q'; b.textContent = '?'; b.dataset.t = key;
      b.setAttribute('aria-label', label + ' 설명 보기'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', 'gloss');
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (openBtn === b && !pop.hidden) closeGloss(); else openGloss(key, b); });
      return b;
    }
    document.querySelectorAll('dfn[data-t]').forEach(function (d) { if (G[d.dataset.t]) d.appendChild(makeQ(d.dataset.t, d.textContent)); });
    var dict = document.getElementById('dict');
    if (dict) {
      Object.keys(G).filter(function (k) { return DICT_SKIP.indexOf(k) < 0; }).sort(function (a, b) { return G[a][0].localeCompare(G[b][0], 'ko'); }).forEach(function (k) {
        var b = document.createElement('button');
        b.type = 'button'; b.dataset.t = k; b.setAttribute('aria-controls', 'gloss'); b.setAttribute('aria-expanded', 'false');
        var s = document.createElement('span'); s.textContent = G[k][0];
        var i = document.createElement('i'); i.textContent = '?'; i.setAttribute('aria-hidden', 'true');
        b.appendChild(s); b.appendChild(i);
        b.addEventListener('click', function (e) { e.stopPropagation(); if (openBtn === b && !pop.hidden) closeGloss(); else openGloss(k, b); });
        dict.appendChild(b);
      });
      var dq = document.getElementById('dictQ');
      if (dq) dq.addEventListener('input', function (e) {
        var q = e.target.value.trim().toLowerCase();
        dict.querySelectorAll('button').forEach(function (b) { var g = G[b.dataset.t]; b.hidden = q && (g[0] + ' ' + g[1] + ' ' + g[2]).toLowerCase().indexOf(q) < 0; });
      });
    }

    var lessons = Array.prototype.slice.call(document.querySelectorAll('#lessons .lesson'));
    var AI = (prefs.ai === 'claude' || prefs.ai === 'gpt') ? prefs.ai : '';
    var AINAME = { claude: 'Claude', gpt: 'ChatGPT' };
    var PLAN = (prefs.plan === 'free' || prefs.plan === 'paid') ? prefs.plan : '';
    var VIEW = prefs.view === 'core' ? 'core' : 'all';
    var idx = {}, num = {};
    lessons.forEach(function (sec, i) { idx[sec.id] = i; var k = sec.querySelector('.kicker'); if (k) k.dataset.k = k.textContent; });
    function isOn(sec) { return (!sec.dataset.ai || !AI || sec.dataset.ai === AI) && (VIEW !== 'core' || sec.dataset.level === 'core'); }
    function active() { return lessons.filter(isOn); }
    function pairOf(id) { return id === 'c-l5' ? 'c-l7' : id === 'c-l7' ? 'c-l5' : null; }
    document.querySelectorAll('a.ref').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); if (idx[a.dataset.ref] != null) show(idx[a.dataset.ref], true); });
    });
    function renderRefs() {
      document.querySelectorAll('a.ref').forEach(function (a) {
        var id = a.dataset.ref;
        if (num[id] == null && pairOf(id) && num[pairOf(id)] != null) id = pairOf(id);
        a.hidden = num[id] == null;
        a.textContent = num[id] == null ? '' : '강의 ' + num[id];
        if (num[id] != null) a.dataset.ref = id;
      });
      document.querySelectorAll('.refs').forEach(function (sp) {
        sp.textContent = '';
        sp.dataset.refs.split(' ').filter(function (id) { return num[id] != null; }).forEach(function (id, j) {
          if (j) sp.appendChild(document.createTextNode(', '));
          var a = document.createElement('a'); a.href = '#' + id; a.textContent = String(num[id]);
          a.addEventListener('click', function (e) { e.preventDefault(); show(idx[id], true); });
          sp.appendChild(a);
        });
        if (!sp.childNodes.length) sp.textContent = '—';
      });
    }

    var partTitle = {}; MAN.parts.forEach(function (p) { partTitle[p[0]] = p[1]; });
    var tocList = document.getElementById('tocList');
    var tocBtns = [], partLis = [], lastPart = '', curPart = null;
    lessons.forEach(function (sec, i) {
      if (sec.dataset.part !== lastPart) {
        lastPart = sec.dataset.part;
        var p = document.createElement('li'); p.className = 'part';
        var t = document.createElement('span'); t.textContent = partTitle[lastPart] || lastPart;
        var bar = document.createElement('span'); bar.className = 'pbar'; bar.setAttribute('aria-hidden', 'true'); bar.appendChild(document.createElement('i'));
        var pp = document.createElement('span'); pp.className = 'pp';
        p.appendChild(t); p.appendChild(bar); p.appendChild(pp);
        tocList.appendChild(p);
        curPart = { li: p, items: [] }; partLis.push(curPart);
      }
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<span class="n"></span><span class="t"></span><span class="ok" aria-hidden="true"></span>';
      var bt = b.querySelector('.t'); bt.textContent = sec.dataset.title;
      var L = sec.dataset.level;
      if (L && L !== 'grow') { var lv = document.createElement('span'); lv.className = 'lv lv-' + L; lv.textContent = L === 'core' ? '핵심' : '고급'; bt.appendChild(lv); }
      if (sec.dataset.from) { var fr = document.createElement('span'); fr.className = 'hub-from'; fr.textContent = BIZ_LABEL[sec.dataset.from] || sec.dataset.from; bt.appendChild(fr); }
      b.addEventListener('click', function () { show(i, true); closeToc(); });
      li.appendChild(b); tocList.appendChild(li); tocBtns.push(b); curPart.items.push(li);
      // 강의 머리 수준 표시
      var head = sec.querySelector('.lesson-head');
      if (head && L) {
        var kk = head.querySelector('.kicker');
        var badge = document.createElement('span'); badge.className = 'lv lv-' + L; badge.textContent = { core: '핵심', grow: '넓히기', adv: '고급' }[L];
        if (kk) kk.insertAdjacentElement('afterend', badge);
        if (sec.dataset.from) { var fb = document.createElement('span'); fb.className = 'hub-from'; fb.textContent = (BIZ_LABEL[sec.dataset.from] || '') + ' 코스에서 가져온 강의'; badge.insertAdjacentElement('afterend', fb); }
      }
      var foot = document.createElement('div');
      foot.className = 'lesson-foot';
      foot.innerHTML = '<button type="button" class="prev">이전 강의</button><span class="spacer"></span><button type="button" class="done-btn" aria-pressed="false">이 강의 완료</button><button type="button" class="next">다음 강의</button>';
      sec.appendChild(foot);
      foot.querySelector('.prev').addEventListener('click', function () { move(sec, -1); });
      foot.querySelector('.next').addEventListener('click', function () { move(sec, 1); });
      foot.querySelector('.done-btn').addEventListener('click', function () {
        var k = 'done:' + sec.id;
        state[k] = !state[k]; save(); paint();
        if (state[k]) move(sec, 1);
      });
    });

    function move(sec, d) {
      var act = active(); var j = act.indexOf(sec) + d;
      if (j >= 0 && j < act.length) show(idx[act[j].id], true);
    }
    function applyAI() {
      if (AI) document.documentElement.dataset.ai = AI; else delete document.documentElement.dataset.ai;
      if (PLAN) document.documentElement.dataset.plan = PLAN; else delete document.documentElement.dataset.plan;
      document.querySelectorAll('[data-view-pick]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.viewPick === VIEW ? 'true' : 'false'); });
      document.querySelectorAll('[data-pick]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.pick === AI ? 'true' : 'false'); });
      document.querySelectorAll('[data-plan-pick]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.planPick === PLAN ? 'true' : 'false'); });
      document.querySelectorAll('.ainame').forEach(function (el) { el.textContent = AI ? AINAME[AI] : el.dataset.both; });
      var act = active();
      num = {};
      act.forEach(function (sec, n) { num[sec.id] = n; });
      lessons.forEach(function (sec, i) {
        var on = isOn(sec);
        tocBtns[i].parentNode.hidden = !on;
        tocBtns[i].querySelector('.n').textContent = on ? String(num[sec.id]).padStart(2, '0') : '';
        var k = sec.querySelector('.kicker'); if (k) k.textContent = '강의 ' + (on ? num[sec.id] : '') + ' · ' + k.dataset.k;
        var f = sec.querySelector('.lesson-foot');
        f.querySelector('.prev').hidden = act[0] === sec;
        f.querySelector('.next').hidden = act[act.length - 1] === sec;
      });
      renderRefs(); paint();
    }
    function curSec() { return lessons.filter(function (l) { return !l.hidden; })[0]; }
    function keepCurrent() {
      var cur = curSec();
      if (cur && !isOn(cur)) { var alt = pairOf(cur.id); show(alt && idx[alt] != null && isOn(lessons[idx[alt]]) ? idx[alt] : idx[active()[0].id], false); }
    }
    document.querySelectorAll('[data-pick]').forEach(function (b) { b.addEventListener('click', function () { AI = b.dataset.pick; prefs.ai = AI; savePrefs(); applyAI(); keepCurrent(); }); });
    document.querySelectorAll('[data-plan-pick]').forEach(function (b) { b.addEventListener('click', function () { PLAN = b.dataset.planPick; prefs.plan = PLAN; savePrefs(); applyAI(); }); });
    document.querySelectorAll('[data-view-pick]').forEach(function (b) { b.addEventListener('click', function () { VIEW = b.dataset.viewPick; prefs.view = VIEW; savePrefs(); applyAI(); keepCurrent(); }); });

    function paint() {
      var n = 0, total = 0;
      lessons.forEach(function (sec, i) {
        if (!isOn(sec)) return;
        total++;
        var d = !!state['done:' + sec.id];
        if (d) n++;
        tocBtns[i].querySelector('.ok').textContent = d ? '완료' : '';
        var btn = sec.querySelector('.done-btn');
        btn.setAttribute('aria-pressed', d ? 'true' : 'false');
        btn.textContent = d ? '완료함 · 다시 누르면 해제' : '이 강의 완료';
      });
      var pct = total ? Math.round(n / total * 100) : 0;
      document.getElementById('pct').textContent = pct + '% · ' + n + '/' + total + '강';
      document.getElementById('pbar').style.width = pct + '%';
      partLis.forEach(function (p) {
        var on = p.items.filter(function (li) { return !li.hidden; });
        var done = on.filter(function (li) { return li.querySelector('.ok').textContent; }).length;
        p.li.querySelector('.pp').textContent = done + '/' + on.length;
        p.li.querySelector('.pbar i').style.width = (on.length ? Math.round(done / on.length * 100) : 0) + '%';
        p.li.classList.toggle('full', on.length > 0 && done === on.length);
        p.li.hidden = on.length === 0;
      });
      mnavSync();
    }

    var officeTimer = null;
    function show(i, scroll) {
      i = Math.max(0, Math.min(lessons.length - 1, i));
      if (!isOn(lessons[i])) { var alt = pairOf(lessons[i].id); i = alt && idx[alt] != null && isOn(lessons[idx[alt]]) ? idx[alt] : idx[active()[0].id]; }
      closeGloss();
      lessons.forEach(function (sec, k) {
        if (k === i) { sec.hidden = false; sec.classList.remove('on'); void sec.offsetWidth; sec.classList.add('on'); }
        else { sec.hidden = true; sec.classList.remove('on'); }
      });
      tocBtns.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      state.last = lessons[i].id; save();
      if (scroll) { var mb = document.getElementById('mbar'); var top = document.querySelector('.grid').getBoundingClientRect().top + window.scrollY - 12 - (mb && mb.offsetHeight ? mb.offsetHeight : 0); window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' }); }
      if (officeTimer) { clearInterval(officeTimer); officeTimer = null; }
      if (lessons[i].id === 'c-l6') startOffice();
      if (history.replaceState) history.replaceState(null, '', '#' + lessons[i].id);
      mnavSync();
    }

    document.querySelectorAll('#lessons input[type="checkbox"][data-key]').forEach(function (cb) {
      cb.checked = !!state['c:' + cb.dataset.key];
      cb.addEventListener('change', function () { state['c:' + cb.dataset.key] = cb.checked; save(); });
    });
    document.querySelectorAll('#lessons .prompt .copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var box = btn.closest('.prompt'), pre = box.querySelector('pre');
        var text = pre.textContent;
        if (box.hasAttribute('data-tsv')) text = text.split(' | ').join('\t');
        function ok() { btn.textContent = '복사됨'; btn.classList.add('done'); setTimeout(function () { btn.textContent = '복사'; btn.classList.remove('done'); }, 1600); }
        function fallback() {
          var r = document.createRange(); r.selectNodeContents(pre);
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          btn.textContent = '선택됨 · 길게 눌러 복사'; setTimeout(function () { btn.textContent = '복사'; }, 2400);
        }
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback(); } catch (e) { fallback(); }
      });
    });

    // 가상 사무실
    var staff = (DATA.STAFF[BIZ] || DATA.STAFF.custom).map(function (s) { return { name: R(s.name), chat: R(s.chat), job: R(s.job), ask: R(s.ask), reply: R(s.reply), wide: s.wide }; });
    var office = document.getElementById('office'), talk = document.getElementById('officeTalk');
    var desks = [], picked = 0;
    function pick(k) {
      if (!talk) return;
      picked = k;
      desks.forEach(function (d, j) { d.classList.toggle('active', j === k); d.setAttribute('aria-pressed', j === k ? 'true' : 'false'); });
      var s = staff[k];
      talk.innerHTML = '';
      var w = document.createElement('span'); w.className = 'who-desk'; w.textContent = s.name + ' · ' + s.chat + ' 채팅 · 예시';
      var me = document.createElement('div'); me.className = 'bubble me'; me.innerHTML = '<span class="who"></span>'; me.querySelector('.who').textContent = terms.owner; me.appendChild(document.createTextNode(s.ask));
      var ai = document.createElement('div'); ai.className = 'bubble ai'; ai.innerHTML = '<span class="who"></span>'; ai.querySelector('.who').textContent = s.name; ai.appendChild(document.createTextNode(s.reply));
      var wrap = document.createElement('div'); wrap.className = 'chat';
      wrap.appendChild(me); wrap.appendChild(ai);
      talk.appendChild(w); talk.appendChild(wrap);
    }
    if (office) {
      desks = staff.map(function (s, k) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'desk pop' + (s.wide ? ' wide' : ''); b.style.setProperty('--d', (0.3 + k * 0.08) + 's');
        b.innerHTML = '<strong></strong><span class="c"></span><span class="j"></span>';
        b.querySelector('strong').textContent = s.name;
        b.querySelector('.c').textContent = s.chat + ' 채팅';
        b.querySelector('.j').textContent = s.job;
        b.addEventListener('click', function () { if (officeTimer) { clearInterval(officeTimer); officeTimer = null; } pick(k); });
        office.appendChild(b);
        return b;
      });
      pick(0);
    }
    function startOffice() {
      if (!office) return;
      pick(picked);
      if (reduce) return;
      officeTimer = setInterval(function () { pick((picked + 1) % staff.length); }, 4200);
    }

    // 목차(휴대폰 서랍)
    var toggle = document.getElementById('tocToggle'), toc = document.getElementById('toc');
    var mq = window.matchMedia('(max-width: 900px)');
    function syncToc() {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toc.hidden = mq.matches ? !open : false;
      document.body.classList.toggle('toc-open', mq.matches && open);
      document.getElementById('mbarToc').setAttribute('aria-expanded', open ? 'true' : 'false');
      if (mq.matches && open) { var cur = toc.querySelector('[aria-current="true"]'); if (cur) cur.scrollIntoView({ block: 'center' }); }
    }
    function closeToc() { if (mq.matches) { toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = '목차 열기'; syncToc(); } }
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '목차 닫기' : '목차 열기';
      syncToc();
    });
    if (mq.addEventListener) mq.addEventListener('change', syncToc);
    syncToc();
    document.getElementById('mbarToc').addEventListener('click', function () { toggle.click(); });
    document.getElementById('tocClose').addEventListener('click', closeToc);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeToc(); });

    document.getElementById('reset').addEventListener('click', function () {
      var keep = { off: state.off, add: state.add };
      state = keep; save();
      document.querySelectorAll('#lessons input[type="checkbox"][data-key]').forEach(function (cb) { cb.checked = false; });
      paint();
      var m = document.getElementById('resetMsg'); m.hidden = false; setTimeout(function () { m.hidden = true; }, 2000);
    });

    var mPrev = document.getElementById('mPrev'), mNext = document.getElementById('mNext'), mDone = document.getElementById('mDone');
    function footBtn(cls) { var c = curSec(); return c && c.querySelector('.lesson-foot ' + cls); }
    mPrev.addEventListener('click', function () { var b = footBtn('.prev'); if (b) b.click(); });
    mNext.addEventListener('click', function () { var b = footBtn('.next'); if (b) b.click(); });
    mDone.addEventListener('click', function () { var b = footBtn('.done-btn'); if (b) b.click(); });
    function mnavSync() {
      var c = curSec(); if (!c) return;
      var f = c.querySelector('.lesson-foot');
      mPrev.disabled = f.querySelector('.prev').hidden;
      mNext.disabled = f.querySelector('.next').hidden;
      var d = !!state['done:' + c.id];
      mDone.setAttribute('aria-pressed', d ? 'true' : 'false');
      mDone.textContent = d ? '완료함 ✓' : '이 강의 완료';
      document.getElementById('mbarT').textContent = (num[c.id] != null ? num[c.id] + '. ' : '') + c.dataset.title;
      document.getElementById('mbarP').textContent = document.getElementById('pct').textContent.split(' · ')[0];
      document.getElementById('mbarBar').style.width = document.getElementById('pbar').style.width;
    }
    document.querySelectorAll('#lessons .table-wrap table').forEach(function (t) {
      var hs = Array.prototype.map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
      t.querySelectorAll('tbody tr').forEach(function (tr) { Array.prototype.forEach.call(tr.children, function (td, k) { if (hs[k]) td.setAttribute('data-label', hs[k]); }); });
    });
    document.querySelectorAll('ol.steps').forEach(function (ol) { Array.prototype.forEach.call(ol.children, function (li, i) { li.style.setProperty('--i', Math.min(i, 10)); }); });

    applyAI();
    var h = (location.hash || '').replace('#', '');
    var start = idx[h] != null ? idx[h] : (state.last && idx[state.last] != null ? idx[state.last] : 0);
    show(start, false);
  }
})();
