/* ============ app.js · 入口 ============ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  // 免责声明
  const overlay = document.getElementById('disclaimerOverlay');
  const openBtn = document.getElementById('disclaimerBtn');
  const okBtn = document.getElementById('disclaimerOk');

  // 首次进入自动弹出免责声明
  let seen = false;
  try { seen = localStorage.getItem('leo_disclaimer_seen') === '1'; } catch(e) {}
  if (!seen) {
    setTimeout(() => { overlay.style.display = 'flex'; }, 800);
  }

  openBtn.addEventListener('click', () => { overlay.style.display = 'flex'; });
  okBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    try { localStorage.setItem('leo_disclaimer_seen', '1'); } catch(e) {}
  });

  // ===== 地区选择（国内/国外）=====
  // 国内 → V2 链接 B站·抖音；国外 → V2 链接油管
  const regionOverlay = document.getElementById('regionOverlay');
  function getRegion() {
    try { return localStorage.getItem('leo_region') || ''; } catch(e) { return ''; }
  }
  function setRegionStore(r) {
    try { localStorage.setItem('leo_region', r); } catch(e) {}
  }

  // 模式：首次进入=start（选完再启动应用）；已选过=switch（即时切换）
  let mode = getRegion() ? 'switch' : 'start';

  function bindRegionButtons(cb) {
    document.getElementById('regionDomestic').addEventListener('click', () => cb('domestic'));
    document.getElementById('regionOverseas').addEventListener('click', () => cb('overseas'));
  }

  bindRegionButtons((r) => {
    setRegionStore(r);
    regionOverlay.style.display = 'none';
    if (mode === 'start') {
      PlayerApp.init();
      PlayerApp.start(r);
      mode = 'switch';
    } else {
      PlayerApp.setRegion(r);
    }
  });

  if (mode === 'start') {
    // 首次进入：先选地区再启动
    regionOverlay.style.display = 'flex';
  } else {
    // 已选过地区：直接启动
    PlayerApp.init();
    PlayerApp.start(getRegion());
  }

  // 顶栏 🌏 按钮：随时重新选择地区
  document.getElementById('regionBtn').addEventListener('click', () => {
    regionOverlay.style.display = 'flex';
  });
});
