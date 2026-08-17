/* ============ player.js · TikTok式视频流 ============
 * 交互：
 *  - 全屏竖屏视频卡片，上下滑动切换（类似抖音）
 *  - 每个视频自动播3遍：盲听 → 英文字幕 → 中英对照
 *  - 不滑动自动播完3遍；上滑下一遍/下一条，下滑回看
 *  - 右侧操作栏显示难度星级、主题、声音开关
 */

const PlayerApp = (function () {
  let clips = [];
  let currentIndex = 0;
  let currentPhase = 0;
  let currentClip = null;
  let videoEl = null;
  let phaseTimer = null;
  let autoPaused = false;
  let activeFilter = 'all';

  // ============ 初始化 ============
  function init() {
    bindGlobalEvents();
    renderFilters();
  }

  /** 渲染视频卡片 */
  function renderFeed() {
    const feed = document.getElementById('videoFeed');
    feed.innerHTML = '';
    clips.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'video-card' + (i === 0 ? ' active' : '');
      card.dataset.index = i;
      if (c.type === 'embed') {
        // 平台视频：嵌入播放器
        const embedUrl = c.platform === 'bilibili'
          ? `https://player.bilibili.com/player.html?bvid=${c.bvid}&page=1&high_quality=1&danmaku=0`
          : `https://www.youtube.com/embed/${c.videoId}?autoplay=1&rel=0`;
        card.innerHTML = `
          <div class="feed-embed" data-id="${c.id}"></div>
          <div class="card-overlay">
            <div class="card-source">${c.source}</div>
            <div class="card-subtitle" id="sub_${c.id}"></div>
          </div>`;
      } else {
        card.innerHTML = `
        <video class="feed-video" playsinline loop preload="${i < 2 ? 'auto' : 'none'}" src="${c.video}"></video>
        <div class="card-overlay">
          <div class="card-subtitle" id="sub_${c.id}"></div>
        </div>`;
      }
      feed.appendChild(card);
    });
    bindCards();
  }

  function bindCards() {
    document.querySelectorAll('.video-card').forEach(card => {
      const video = card.querySelector('video');
      if (!video) return; // 平台视频卡片无video，跳过
      video.addEventListener('ended', () => {
        if (card.classList.contains('active')) {
          if (!autoPaused) advancePhase();
        }
      });
      video.addEventListener('play', () => { hidePauseIcon(); });
      video.addEventListener('pause', () => {
        if (card.classList.contains('active') && videoEl && videoEl.currentTime > 0.5) showPauseIcon();
      });
      video.addEventListener('timeupdate', () => {
        if (card.classList.contains('active')) updateSentenceSubtitle();
      });
    });
  }

  /** 激活指定索引的卡片并播放 */
  function activate(index) {
    if (index < 0 || index >= clips.length) return;
    currentIndex = index;
    currentClip = clips[index];
    currentPhase = 0;

    document.querySelectorAll('.video-card').forEach((card, i) => {
      card.classList.toggle('active', i === index);
      const clip = clips[i];
      const v = card.querySelector('video');
      if (clip && clip.type === 'embed') {
        // 平台视频：激活时加载iframe，非激活时清空
        const embedDiv = card.querySelector('.feed-embed');
        if (i === index) {
          if (embedDiv && !embedDiv.querySelector('iframe')) {
            const url = clip.platform === 'bilibili'
              ? `https://player.bilibili.com/player.html?bvid=${clip.bvid}&page=1&high_quality=1&danmaku=0`
              : `https://www.youtube.com/embed/${clip.videoId}?autoplay=1&rel=0`;
            embedDiv.innerHTML = `<iframe src="${url}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
          }
        } else if (embedDiv) {
          embedDiv.innerHTML = '';
        }
      }
      if (v) {
        if (i === index && !(clip && clip.type === 'embed')) {
          v.src = clip.video;
          v.load();
        } else if (v) {
          v.pause();
          v.removeAttribute('src');
          v.load();
        }
      }
    });

    const activeClip = clips[index];
    if (activeClip && activeClip.type === 'embed') {
      videoEl = null;
      updateOverlay();
      // 平台视频没有逐句字幕，显示提示
      const sub = document.getElementById('sub_' + activeClip.id);
      if (sub) {
        sub.textContent = '🎬 正在播放平台视频 · 点按全屏观看';
        sub.className = 'card-subtitle phase-0';
      }
      document.getElementById('phaseLabel').textContent = '平台视频';
      document.querySelectorAll('.phase-dot').forEach(d => d.classList.remove('active'));
      return;
    }

    videoEl = document.querySelector('.video-card.active video');
    updateOverlay();
    playPhase(0);
    startKaraokeLoop();
  }


  /** 逐句字幕：根据播放时间显示当前句 */
  let karaokeTimer = null;

  /** 卡拉OK动态字幕：单词随语音节奏逐词高亮 */
  function updateSentenceSubtitle() {
    if (!currentClip || !videoEl) return;
    const sub = document.getElementById('sub_' + currentClip.id);
    if (!sub) return;
    const t = videoEl.currentTime || 0;
    const sentence = getCurrentSentence(currentClip, t);

    if (currentPhase === 0) {
      // 第一遍：完全无字幕，纯听
      sub.innerHTML = '';
      return;
    }

    if (!sentence) {
      sub.innerHTML = '';
      return;
    }

    // 计算当前进度（0~1），按词均分时间
    const duration = Math.max(0.001, sentence.end - sentence.start);
    const progress = Math.max(0, Math.min(1, (t - sentence.start) / duration));
    const words = sentence.en.trim().split(/\s+/);
    const activeIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

    // 渲染卡拉OK：已读词变亮，当前词金色高亮，未读词暗淡
    let enHtml = words.map((w, i) => {
      let cls = 'kara-word';
      if (i < activeIdx) cls += ' done';
      else if (i === activeIdx) cls += ' active';
      return `<span class="${cls}">${escapeHtml(w)}</span>`;
    }).join(' ');

    if (currentPhase === 1) {
      // 第二遍：英文卡拉OK逐词跟随
      sub.innerHTML = enHtml;
    } else {
      // 第三遍：中英文对照一起跟随口语
      // 中文按字符分段，与英文同进度卡拉OK高亮
      const zhChars = Array.from(sentence.zh.replace(/\s/g, ''));
      const zhActiveIdx = Math.min(zhChars.length - 1, Math.floor(progress * zhChars.length));
      let zhHtml = zhChars.map((ch, i) => {
        let cls = 'kara-zh-char';
        if (i < zhActiveIdx) cls += ' done';
        else if (i === zhActiveIdx) cls += ' active';
        return `<span class="${cls}">${escapeHtml(ch)}</span>`;
      }).join('');
      sub.innerHTML = `<div class="kara-en-line">${enHtml}</div><div class="kara-zh-line">${zhHtml}</div>`;
    }
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /** 卡拉OK刷新：由timeupdate事件驱动（跟随播放时间） */
  function startKaraokeLoop() {}
  function stopKaraokeLoop() {}

  /** 更新卡片信息显示 */
  function updateOverlay() {
    document.getElementById('phaseDots').innerHTML = [0,1,2].map(i =>
      `<div class="phase-dot${i === currentPhase ? ' active' : ''}"></div>`).join('');
  }

  /** 播放指定遍数 */
  function playPhase(phase) {
    clearTimeout(phaseTimer);
    currentPhase = phase;
    const phases = buildPhases(currentClip);

    const sub = document.getElementById('sub_' + currentClip.id);
    sub.className = 'card-subtitle phase-' + phase;
    updateSentenceSubtitle();

    document.getElementById('phaseLabel').textContent = phases[phase].label;
    document.querySelectorAll('.phase-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === phase);
    });

    videoEl.muted = false;
    videoEl.currentTime = 0;
    const p = videoEl.play();
    if (p) p.catch(() => {});
    startKaraokeLoop();

    const dur = (videoEl.duration && isFinite(videoEl.duration)) ? videoEl.duration : 20;
    phaseTimer = setTimeout(() => {
      if (!autoPaused && !videoEl.paused) advancePhase();
    }, (dur + 0.3) * 1000);
  }

  function advancePhase() {
    if (currentPhase < 2) {
      playPhase(currentPhase + 1);
    } else {
      if (currentIndex < clips.length - 1) {
        activate(currentIndex + 1);
      } else {
        autoPaused = true;
        document.getElementById('phaseLabel').textContent = '已播完 · 上滑继续';
      }
    }
  }

  /** 上滑：下一遍 / 下一条 */
  function swipeUp() {
    autoPaused = false;
    if (currentPhase < 2) {
      playPhase(currentPhase + 1);
    } else if (currentIndex < clips.length - 1) {
      activate(currentIndex + 1);
    } else {
      showToast('已经是最后一个啦');
    }
  }

  /** 下滑：回看 */
  function swipeDown() {
    autoPaused = false;
    if (currentPhase > 0) {
      playPhase(currentPhase - 1);
    } else if (currentIndex > 0) {
      activate(currentIndex - 1);
    } else {
      showToast('已经是第一个啦');
    }
  }

  // ============ 筛选 ============
  function applyFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === filter);
    });
    if (filter === 'all') clips = CLIPS.slice();
    else if (filter.startsWith('star')) clips = CLIPS.filter(c => c.stars === parseInt(filter.slice(4)));
    else clips = CLIPS.filter(c => c.topic === filter);
    if (clips.length === 0) clips = CLIPS.slice();
    renderFeed();
    activate(0);
  }

  function renderFilters() {
    const row = document.getElementById('filterRow');
    row.querySelectorAll('.filter-chip:not([data-filter="all"])').forEach(c => c.remove());
    STAR_LEVELS.forEach(sl => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip';
      chip.dataset.filter = 'star' + sl.stars;
      chip.textContent = '★'.repeat(sl.stars);
      chip.addEventListener('click', () => applyFilter(chip.dataset.filter));
      row.appendChild(chip);
    });
    TOPICS.forEach(tp => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip';
      chip.dataset.filter = tp.id;
      chip.textContent = tp.emoji + ' ' + tp.name;
      chip.addEventListener('click', () => applyFilter(chip.dataset.filter));
      row.appendChild(chip);
    });
  }

  // ============ 全局事件 ============
  function bindGlobalEvents() {
    const container = document.getElementById('videoContainer');
    let startY = 0, startX = 0;
    container.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    }, { passive: true });
    container.addEventListener('touchend', (e) => {
      const dy = e.changedTouches[0].clientY - startY;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dy) < 40) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.2) {
        if (dy < 0) swipeUp();
        else swipeDown();
      }
    }, { passive: true });

    let mStartY = 0;
    container.addEventListener('mousedown', (e) => { mStartY = e.clientY; });
    container.addEventListener('mouseup', (e) => {
      const dy = e.clientY - mStartY;
      if (Math.abs(dy) < 40) return;
      if (dy < 0) swipeUp();
      else swipeDown();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') swipeUp();
      if (e.key === 'ArrowDown') swipeDown();
      if (e.key === ' ' || e.key === 'Enter') togglePlay();
    });

    container.addEventListener('click', (e) => {
      if (e.target.closest('.filter-chip') || e.target.closest('.action-bar')) return;
      togglePlay();
    });

  }

  function togglePlay() {
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.muted = false;
      const p = videoEl.play();
      if (p) p.catch(() => {});
      hidePauseIcon();
    } else {
      videoEl.pause();
      showPauseIcon();
    }
  }

  function showPauseIcon() {
    const icon = document.getElementById('pauseIcon');
    if (icon) {
      icon.style.display = 'flex';
      clearTimeout(icon._timer);
      icon._timer = setTimeout(() => { icon.style.display = 'none'; }, 1200);
    }
  }
  function hidePauseIcon() {
    const icon = document.getElementById('pauseIcon');
    if (icon) icon.style.display = 'none';
  }


  /** 启动 */
  function start() {
    clips = CLIPS.slice();
    renderFeed();
    activate(0);
    bindHome();
  }

  // ============ 首页图文卡片流 ============
  function bindHome() {
    document.getElementById('homeBtn').addEventListener('click', openHome);
    document.getElementById('homeClose').addEventListener('click', closeHome);
    document.getElementById('homeTopics').addEventListener('click', (e) => {
      const chip = e.target.closest('.home-topic-chip');
      if (!chip) return;
      document.querySelectorAll('.home-topic-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderHomeGrid(chip.dataset.topic);
    });
    renderHomeTopics();
    renderHomeGrid('all');
  }

  function renderHomeTopics() {
    const wrap = document.getElementById('homeTopics');
    wrap.innerHTML = `<button class="home-topic-chip active" data-topic="all">🌟 全部</button>` +
      TOPICS.map(t => `<button class="home-topic-chip" data-topic="${t.id}">${t.emoji} ${t.name}</button>`).join('');
  }

  function renderHomeGrid(topic) {
    const grid = document.getElementById('homeGrid');
    let list = CLIPS.slice();
    if (topic !== 'all') list = list.filter(c => c.topic === topic);
    if (list.length === 0) list = CLIPS.slice();
    grid.innerHTML = list.map((c, i) => `
      <div class="home-card" data-video="${c.id}">
        <div class="home-card-cover" style="background-image:url('${c.cover}')"></div>
        <div class="home-card-body">
          <div class="home-card-title">${c.title}</div>
          <div class="home-card-stars">${'★'.repeat(c.stars)}<span class="stars-dim">${'★'.repeat(5-c.stars)}</span></div>
        </div>
      </div>`).join('');
    grid.querySelectorAll('.home-card').forEach(card => {
      card.addEventListener('click', () => {
        const cid = card.dataset.video;
        const idx = CLIPS.findIndex(c => c.id === cid);
        if (idx >= 0) {
          clips = CLIPS.slice();
          closeHome();
          activate(idx);
        }
      });
    });
  }

  function openHome() {
    if (videoEl) videoEl.pause();
    document.getElementById('homeView').style.display = 'flex';
  }
  function closeHome() {
    document.getElementById('homeView').style.display = 'none';
    if (videoEl) {
      videoEl.muted = false;
      videoEl.play().catch(() => {});
    }
  }

  return { init, start, swipeUp, swipeDown, applyFilter, activate };
})();
