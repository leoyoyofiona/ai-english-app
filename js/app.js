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

  PlayerApp.init();
  PlayerApp.start();
});
