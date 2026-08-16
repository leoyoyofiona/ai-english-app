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
  let soundOn = true;
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
      card.innerHTML = `
        <video class="feed-video" playsinline loop preload="${i < 2 ? 'auto' : 'none'}" src="${c.video}"></video>
        <div class="card-overlay">
          <div class="card-title">${c.title}</div>
          <div class="card-stars">${'★'.repeat(c.stars)}<span class="stars-dim">${'★'.repeat(5 - c.stars)}</span></div>
          <div class="card-subtitle" id="sub_${c.id}"></div>
        </div>`;
      feed.appendChild(card);
    });
    bindCards();
  }

  function bindCards() {
    document.querySelectorAll('.video-card').forEach(card => {
      const video = card.querySelector('video');
      video.addEventListener('ended', () => {
        if (card.classList.contains('active')) {
          if (!autoPaused) advancePhase();
        }
      });
      video.addEventListener('play', () => { hideSoundTip(); });
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
      const v = card.querySelector('video');
      if (i === index) {
        v.src = clips[index].video;
        v.load();
      } else {
        v.pause();
        v.removeAttribute('src');
        v.load();
      }
    });

    videoEl = document.querySelector('.video-card.active video');
    updateOverlay();
    playPhase(0);
  }

  /** 更新卡片信息显示 */
  function updateOverlay() {
    const topic = TOPICS.find(t => t.id === currentClip.topic);
    document.getElementById('actionStars').textContent = '★'.repeat(currentClip.stars);
    document.getElementById('actionTopic').textContent = topic ? topic.name : '';
    document.getElementById('phaseDots').innerHTML = [0,1,2].map(i =>
      `<div class="phase-dot${i === currentPhase ? ' active' : ''}"></div>`).join('');
  }

  /** 播放指定遍数 */
  function playPhase(phase) {
    clearTimeout(phaseTimer);
    currentPhase = phase;
    const phases = buildPhases(currentClip);

    const sub = document.getElementById('sub_' + currentClip.id);
    sub.textContent = phases[phase].subtitle;
    sub.className = 'card-subtitle phase-' + phase;

    document.getElementById('phaseLabel').textContent = phases[phase].label;
    document.querySelectorAll('.phase-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === phase);
    });

    videoEl.muted = !soundOn;
    videoEl.currentTime = 0;
    const p = videoEl.play();
    if (p) p.catch(() => showSoundTip());

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

    document.getElementById('actionSound').addEventListener('click', toggleSound);
  }

  function togglePlay() {
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.muted = false;
      soundOn = true;
      updateSoundBtn();
      const p = videoEl.play();
      if (p) p.catch(() => showSoundTip());
      hideSoundTip();
    } else {
      videoEl.pause();
    }
  }

  function toggleSound() {
    soundOn = !soundOn;
    if (videoEl) videoEl.muted = !soundOn;
    updateSoundBtn();
    if (soundOn && videoEl && videoEl.paused) {
      const p = videoEl.play();
      if (p) p.catch(() => showSoundTip());
    }
  }

  function updateSoundBtn() {
    document.getElementById('actionSound').querySelector('.action-icon').textContent = soundOn ? '🔊' : '🔇';
  }

  function showSoundTip() {
    document.getElementById('soundTip').style.display = 'block';
  }
  function hideSoundTip() {
    document.getElementById('soundTip').style.display = 'none';
  }

  /** 启动 */
  function start() {
    clips = CLIPS.slice();
    renderFeed();
    activate(0);
  }

  return { init, start, swipeUp, swipeDown, applyFilter, activate };
})();
