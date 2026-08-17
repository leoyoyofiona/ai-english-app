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
  let currentVersion = 'v1'; // v1=精选下载三遍听力 | v2=在线平台搬运
  let currentRegion = 'domestic'; // domestic=国内(B站/抖音) | overseas=国外(油管)
  let embedPlaying = false; // 平台嵌入视频播放状态（粗略跟踪）
  let booted = false; // 防止 start() 重复执行

  // ============ V1 学习进度（本地记录，无需账号） ============
  const PROGRESS_KEY = 'leo_v1_progress';
  let progressData = null;
  let lastSaveAt = 0;

  function loadProgress() {
    if (progressData) return progressData;
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      progressData = raw ? JSON.parse(raw) : { last: null, clips: {} };
    } catch (e) { progressData = { last: null, clips: {} }; }
    return progressData;
  }
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData)); } catch (e) {}
  }
  /** 记录当前视频进度（节流5秒；force=关键节点立即保存） */
  function recordProgress(force) {
    if (!currentClip || currentClip.type === 'embed' || !videoEl) return;
    const now = Date.now();
    if (!force && now - lastSaveAt < 5000) return;
    lastSaveAt = now;
    const t = videoEl.currentTime || 0;
    const dur = videoEl.duration || 0;
    const done = currentPhase >= 2 && dur > 0 && t >= dur - 0.8;
    const p = loadProgress();
    const prev = p.clips[currentClip.id] || {};
    p.clips[currentClip.id] = { time: Math.round(t), phase: currentPhase, done: done || !!prev.done };
    p.last = { id: currentClip.id, time: Math.round(t), phase: currentPhase };
    saveProgress();
  }
  /** 标记某视频三遍学完 */
  function markDone(id) {
    const p = loadProgress();
    if (p.clips[id]) p.clips[id].done = true;
    else p.clips[id] = { time: 0, phase: 2, done: true };
    saveProgress();
    const badge = document.getElementById('done_' + id);
    if (badge) badge.style.display = 'inline-block';
  }

  /** Fisher-Yates 洗牌（V2推荐打乱） */
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** V2 小红书式下拉刷新：打乱推荐顺序并回到第一条 */
  function refreshV2() {
    const hint = document.getElementById('refreshHint');
    if (hint) hint.classList.add('show');
    setTimeout(() => {
      shuffleArray(clips);
      renderFeed();
      activate(0);
      if (hint) hint.classList.remove('show');
      showToast('✨ 已刷新推荐');
    }, 700);
  }

  /** 平台嵌入播放器地址 */
  function embedUrl(clip) {
    if (clip.platform === 'bilibili') {
      // muted=1：浏览器拦截带声音自动播放，静音自动播最可靠；点击后解除
      return `https://player.bilibili.com/player.html?bvid=${clip.bvid}&page=1&high_quality=1&danmaku=0&autoplay=1&muted=1`;
    }
    if (clip.platform === 'youtube') {
      return `https://www.youtube.com/embed/${clip.videoId}?autoplay=1&rel=0&mute=1&enablejsapi=1`;
    }
    if (clip.platform === 'tencent') {
      return `https://v.qq.com/txp/iframe/player.html?vid=${clip.vid}&autoplay=true`;
    }
    return '';
  }

  /**
   * 平台视频按真实方向精确适配容器（避免 aspect-ratio 双约束导致拉伸变形）
   * ar: '9/16' 竖屏 | '16/9' 横屏
   */
  function fitEmbed(embedDiv, ar) {
    const frame = embedDiv.querySelector('iframe');
    if (!frame) return;
    const ratio = ar === '9/16' ? 9 / 16 : 16 / 9;
    const W = embedDiv.clientWidth || window.innerWidth || 390;
    const H = embedDiv.clientHeight || window.innerHeight || 844;
    let w, h;
    if (ratio < 1) {
      // 竖屏：优先高度，超宽则按宽度回退
      h = H; w = h * ratio;
      if (w > W) { w = W; h = w / ratio; }
    } else {
      // 横屏：优先宽度，超高则按高度回退
      w = W; h = w / ratio;
      if (h > H) { h = H; w = h * ratio; }
    }
    frame.style.width = Math.round(w) + 'px';
    frame.style.height = Math.round(h) + 'px';
  }

  /** 向嵌入播放器发送播放/暂停指令 */
  function sendEmbedCommand(frame, cmd) {
    if (!frame || !frame.contentWindow) return;
    try {
      const clip = clips[currentIndex];
      if (!clip) return;
      if (clip.platform === 'youtube') {
        frame.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: cmd === 'play' ? 'playVideo' : 'pauseVideo',
          args: []
        }), '*');
      } else if (clip.platform === 'bilibili') {
        // 兼容两种消息格式（官方API支持 postMessage 控制）
        frame.contentWindow.postMessage({ type: cmd, data: {} }, '*');
        frame.contentWindow.postMessage({ type: cmd }, '*');
      }
      // 腾讯视频无公开控制API：由播放器自身按钮控制
    } catch (e) { /* 跨域或无效时忽略 */ }
  }

  /** 点击视频时尝试开启声音（浏览器首次自动播放强制静音，需用户交互后解除） */
  function sendEmbedUnmute(frame) {
    if (!frame || !frame.contentWindow) return;
    try {
      const clip = clips[currentIndex];
      if (!clip) return;
      if (clip.platform === 'youtube') {
        frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
      } else if (clip.platform === 'bilibili') {
        frame.contentWindow.postMessage({ type: 'mute', data: { muted: false } }, '*');
      }
      // 腾讯视频：点击提示用户操作播放器自身按钮
    } catch (e) { /* 忽略 */ }
  }

  // ============ 初始化 ============
  function init() {
    bindGlobalEvents();
    renderFilters();
    // 关闭/切后台时保存进度
    window.addEventListener('pagehide', () => recordProgress(true));
    window.addEventListener('beforeunload', () => recordProgress(true));
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
        const prog = loadProgress();
        const done = !!(prog.clips[c.id] && prog.clips[c.id].done);
        card.innerHTML = `
        <video class="feed-video" playsinline loop preload="${i < 2 ? 'auto' : 'none'}" src="${c.video}"></video>
        <div class="card-overlay">
          <div class="card-subtitle" id="sub_${c.id}"></div>
        </div>
        <div class="card-done" id="done_${c.id}" style="${done ? '' : 'display:none'}">✅ 已学完</div>`;
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
        if (card.classList.contains('active')) recordProgress(true);
      });
      video.addEventListener('timeupdate', () => {
        if (card.classList.contains('active')) {
          updateSentenceSubtitle();
          recordProgress();
        }
      });
    });
  }

  /** 激活指定索引的卡片并播放 */
  function activate(index) {
    if (index < 0 || index >= clips.length) return;
    // 保存离开前一个视频的进度
    if (videoEl && currentClip && currentClip.type !== 'embed') recordProgress(true);
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
            const url = embedUrl(clip);
            const ar = clip.ar || '16/9';
            // 上下边缘滑动层 + 中间穿透（用户可点击播放器自身按钮播放）
            embedDiv.innerHTML = `
              <iframe src="${url}" data-ar="${ar}" frameborder="0" allowfullscreen referrerpolicy="unsafe-url" allow="autoplay; encrypted-media"></iframe>
              <div class="swipe-pass"></div>
              <div class="swipe-layer swipe-top"></div>
              <div class="swipe-layer swipe-bottom"></div>
              <div class="embed-hint" id="hint_${clip.id}">🔊 已静音自动播放 · 点击开启声音</div>`;
            const frame = embedDiv.querySelector('iframe');
            embedPlaying = true;
            // 按真实方向精确适配尺寸（不拉伸）
            fitEmbed(embedDiv, ar);
            // iframe加载后：重算尺寸（布局就绪）并再次尝试触发播放
            frame.addEventListener('load', () => {
              fitEmbed(embedDiv, ar);
              setTimeout(() => {
                if (clip.platform === 'bilibili' || clip.platform === 'youtube') {
                  sendEmbedCommand(frame, 'play');
                }
              }, 400);
            });
            // 提示条3秒后淡出
            const hint = embedDiv.querySelector('.embed-hint');
            if (hint) {
              setTimeout(() => { hint.style.opacity = '0'; }, 3500);
            }
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
      // 三遍听完 = 学完
      if (currentClip && currentClip.type !== 'embed') markDone(currentClip.id);
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
    const cur = clips[currentIndex];
    if (cur && cur.type === 'embed') {
      // 平台视频：直接切下一条（无三遍听力）
      if (currentIndex < clips.length - 1) {
        activate(currentIndex + 1);
      } else {
        showToast('已经是最后一个啦');
      }
      return;
    }
    if (currentPhase < 2) {
      playPhase(currentPhase + 1);
    } else {
      // 三遍听完 = 学完（上滑切下一条时也算听完）
      if (currentClip && currentClip.type !== 'embed') markDone(currentClip.id);
      if (currentIndex < clips.length - 1) {
        activate(currentIndex + 1);
      } else {
        showToast('已经是最后一个啦');
      }
    }
  }

  /** 下滑：回看 / 第一个视频时下拉=刷新推荐（小红书式） */
  function swipeDown() {
    autoPaused = false;
    const cur = clips[currentIndex];
    if (cur && cur.type === 'embed') {
      // 平台视频：直接切上一条；已是第一个则下拉刷新
      if (currentIndex > 0) {
        activate(currentIndex - 1);
      } else {
        refreshV2();
      }
      return;
    }
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
      // 排除所有交互控件：筛选chip、操作栏、首页按钮、版本切换、地区切换、免责声明
      const excluded = ['.filter-chip', '.action-bar', '.home-btn', '.version-switch',
                        '.v-btn', '.disclaimer-btn', '.brand-row', '.top-bar',
                        '.pause-icon', '.region-btn', '.refresh-btn', '.region-overlay'];
      if (excluded.some(sel => e.target.closest(sel))) return;
      togglePlay();
    });

    // 监听嵌入播放器的播放/暂停状态（B站 {type:'playing'|'pause'}，油管 onStateChange）
    window.addEventListener('message', (e) => {
      const data = e.data;
      if (!data) return;
      if (data.event === 'onStateChange') {
        embedPlaying = (data.info === 1); // 1=播放中
      } else if (typeof data.type === 'string') {
        if (data.type === 'playing' || data.type === 'play') embedPlaying = true;
        else if (data.type === 'pause' || data.type === 'ended') embedPlaying = false;
      }
    });

    // 屏幕旋转/窗口变化时重新适配嵌入视频尺寸（防止拉伸变形）
    window.addEventListener('resize', () => {
      const embedDiv = document.querySelector('.video-card.active .feed-embed');
      if (embedDiv && embedDiv.querySelector('iframe')) {
        const clip = clips[currentIndex];
        fitEmbed(embedDiv, clip && clip.ar ? clip.ar : '16/9');
      }
    });

    // 点击暂停图标 = 恢复播放
    const pIcon = document.getElementById('pauseIcon');
    if (pIcon) {
      pIcon.addEventListener('click', () => {
        if (videoEl && videoEl.paused) togglePlay();
      });
    }

  }

  function togglePlay() {
    // 平台嵌入视频：点击=尝试开启声音 + 播放/暂停
    if (currentClip && currentClip.type === 'embed') {
      const frame = document.querySelector('.video-card.active .feed-embed iframe');
      if (!frame) return;
      sendEmbedUnmute(frame); // 解除静音（浏览器限制：首次自动播放只能静音）
      if (embedPlaying) {
        sendEmbedCommand(frame, 'pause');
        embedPlaying = false;
      } else {
        sendEmbedCommand(frame, 'play');
        embedPlaying = true;
      }
      return;
    }
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
      icon.style.display = 'flex';  // 持续显示，直到再次点击屏幕
    }
  }
  function hidePauseIcon() {
    const icon = document.getElementById('pauseIcon');
    if (icon) icon.style.display = 'none';
  }


  /** 启动（防重入：DOMContentLoaded可能被触发多次） */
  function start(region) {
    if (booted) return;
    booted = true;
    currentRegion = region || 'domestic';
    bindVersionSwitch();
    // 默认V1：只加载自有视频
    currentVersion = 'v1';
    document.getElementById('btnV1').classList.add('active');
    clips = CLIPS.filter(c => c.type !== 'embed');
    renderFeed();
    activate(0);
    bindHome();
    // 首页也按V1渲染
    renderHomeGrid('all');
    updateRegionUI();
    // 续播上次学习进度
    resumeLastProgress();
  }

  /** 从上次进度续播（进入应用时调用） */
  function resumeLastProgress() {
    const p = loadProgress();
    if (!p.last) return;
    const idx = clips.findIndex(c => c.id === p.last.id);
    if (idx < 0) return;
    const saved = p.clips[p.last.id] || { time: 0, phase: 0 };
    activate(idx);
    if (videoEl) {
      const dur = (videoEl.duration && isFinite(videoEl.duration)) ? videoEl.duration : 0;
      const target = Math.max(0, Math.min(saved.time || 0, dur > 0 ? dur - 0.5 : saved.time || 0));
      resumeAt(Math.min(saved.phase || 0, 2), target);
      showToast('📖 已续播上次进度');
    }
  }

  /** 在指定时间点恢复播放（保留遍数与阶段计时） */
  function resumeAt(phase, time) {
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
    videoEl.currentTime = time;
    const p = videoEl.play();
    if (p) p.catch(() => {});
    startKaraokeLoop();
    const dur = (videoEl.duration && isFinite(videoEl.duration)) ? videoEl.duration : 20;
    phaseTimer = setTimeout(() => {
      if (!autoPaused && !videoEl.paused) advancePhase();
    }, ((dur - time) + 0.3) * 1000);
  }

  /** 切换地区（国内/国外），影响V2内容与按钮文案 */
  function setRegion(r) {
    if (r !== 'domestic' && r !== 'overseas') return;
    if (r === currentRegion) {
      updateRegionUI();
      return;
    }
    currentRegion = r;
    if (currentVersion === 'v2') {
      clips = CLIPS.filter(c => c.type === 'embed' && c.region === currentRegion);
      if (clips.length === 0) clips = CLIPS.filter(c => c.type === 'embed');
      shuffleArray(clips); // 换地区重新打乱推荐
      renderFeed();
      activate(0);
    }
    renderHomeGrid('all');
    updateRegionUI();
  }

  /** 刷新版本按钮/品牌名文案（随版本+地区变化） */
  function updateRegionUI() {
    const btnV2 = document.getElementById('btnV2');
    if (btnV2) {
      const tag = '<span class="v-tag">V2</span>';
      btnV2.innerHTML = currentRegion === 'domestic'
        ? tag + 'B站·抖音搬运工'
        : tag + '油管搬运工';
    }
    // 刷新按钮只在V2模式显示
    const rBtn = document.getElementById('refreshBtn');
    if (rBtn) rBtn.style.display = currentVersion === 'v2' ? 'flex' : 'none';
    const brand = document.querySelector('.app-name');
    if (brand) {
      if (currentVersion === 'v1') {
        brand.textContent = '影跟子读音抖版 · 流畅下载三遍听力';
      } else {
        brand.textContent = currentRegion === 'domestic'
          ? '影跟子读音抖版 · B站抖音搬运工'
          : '影跟子读音抖版 · 油管搬运工';
      }
    }
  }

  // ============ 版本切换 ============
  function bindVersionSwitch() {
    document.getElementById('btnV1').addEventListener('click', () => switchVersion('v1'));
    document.getElementById('btnV2').addEventListener('click', () => switchVersion('v2'));
    // 刷新按钮（仅V2）：打乱推荐
    document.getElementById('refreshBtn').addEventListener('click', () => {
      if (currentVersion === 'v2') refreshV2();
    });
  }

  function switchVersion(v) {
    currentVersion = v;
    document.getElementById('btnV1').classList.toggle('active', v === 'v1');
    document.getElementById('btnV2').classList.toggle('active', v === 'v2');
    if (v === 'v1') {
      clips = CLIPS.filter(c => c.type !== 'embed');
    } else {
      // V2：按地区过滤平台（国内=B站·抖音，国外=油管）
      clips = CLIPS.filter(c => c.type === 'embed' && c.region === currentRegion);
    }
    if (clips.length === 0) clips = CLIPS.filter(c => c.type === 'embed');
    if (v === 'v2') shuffleArray(clips); // 每次进入V2打乱推荐顺序
    renderFeed();
    activate(0);
    renderHomeGrid('all');
    updateRegionUI();
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
    let list = currentVersion === 'v1'
      ? CLIPS.filter(c => c.type !== 'embed')
      : CLIPS.filter(c => c.type === 'embed' && c.region === currentRegion);
    if (list.length === 0) list = CLIPS.filter(c => c.type === 'embed');

    // ===== "全部" = 主题预览卡片（每主题一张） =====
    if (topic === 'all') {
      grid.innerHTML = TOPICS.map(tp => {
        const clips = list.filter(c => c.topic === tp.id);
        const cover = clips[0] ? clips[0].cover : '';
        const stars = clips.length ? Math.min(...clips.map(c => c.stars)) : 0;
        const maxStars = clips.length ? Math.max(...clips.map(c => c.stars)) : 0;
        return `
        <div class="home-topic-card" data-topic="${tp.id}" ${clips.length === 0 ? 'data-empty="1"' : ''}>
          <div class="htc-cover" style="background-image:url('${cover}')"></div>
          <div class="htc-overlay"></div>
          <div class="htc-body">
            <div class="htc-emoji">${tp.emoji}</div>
            <div class="htc-name">${tp.name}</div>
            <div class="htc-count">${clips.length ? clips.length + ' 个视频 · ' + '★'.repeat(stars) + '<span class="stars-dim">' + '★'.repeat(5 - maxStars) + '</span>' : '暂无视频'}</div>
          </div>
        </div>`;
      }).join('');
      grid.querySelectorAll('.home-topic-card').forEach(card => {
        card.addEventListener('click', () => {
          const tp = card.dataset.topic;
          if (card.dataset.empty) { showToast('该主题暂无视频'); return; }
          // 高亮对应 chip 并切换到该主题的视频网格
          document.querySelectorAll('.home-topic-chip').forEach(ch => {
            ch.classList.toggle('active', ch.dataset.topic === tp);
          });
          renderHomeGrid(tp);
        });
      });
      return;
    }

    // ===== 选中主题 = 该主题的视频卡片 =====
    list = list.filter(c => c.topic === topic);
    const prog = loadProgress();
    grid.innerHTML = list.map((c, i) => {
      const hdone = !!(prog.clips[c.id] && prog.clips[c.id].done);
      return `
      <div class="home-card" data-video="${c.id}">
        <div class="home-card-cover" style="background-image:url('${c.cover}')"></div>
        ${hdone ? '<div class="home-card-badge">✅</div>' : ''}
        <div class="home-card-body">
          <div class="home-card-title">${c.title}</div>
          <div class="home-card-stars">${'★'.repeat(c.stars)}<span class="stars-dim">${'★'.repeat(5-c.stars)}</span></div>
        </div>
      </div>`;
    }).join('');
    grid.querySelectorAll('.home-card').forEach(card => {
      card.addEventListener('click', () => {
        const cid = card.dataset.video;
        const list = currentVersion === 'v1'
          ? CLIPS.filter(c => c.type !== 'embed')
          : CLIPS.filter(c => c.type === 'embed' && c.region === currentRegion);
        const idx = list.findIndex(c => c.id === cid);
        if (idx >= 0) {
          clips = list;
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

  return { init, start, setRegion, refreshV2, swipeUp, swipeDown, applyFilter, activate };
})();
