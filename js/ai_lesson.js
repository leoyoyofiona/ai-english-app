/* ============ ai_lesson.js · AI原理实验室 ============
 * 定位：AI通识教育核心模块，4个可交互实验
 * 让孩子亲手操作、亲眼观察，在"玩"中理解AI原理：
 *  实验1 教AI学分类（感知机训练，亲手喂数据）
 *  实验2 AI语音识别（真实Web Speech API）
 *  实验3 推荐系统（点喜好看推荐变化）
 *  实验4 AI伦理（情景选择看后果）
 */

const AiLesson = (function () {
  let currentExp = 0;
  let speechRec = null;
  let speechListening = false;

  const EXPERIMENTS = [
    { id: 'train', icon: '🎓', name: '教AI学分类', desc: '亲手喂数据，训练一个真正的AI' },
    { id: 'speech', icon: '🎙️', name: 'AI听我说', desc: '对AI说话，看它怎么听懂你' },
    { id: 'recommend', icon: '🎯', name: '推荐魔法', desc: '点一点，看AI怎么猜你喜欢' },
    { id: 'ethics', icon: '⚖️', name: 'AI小法官', desc: '做选择，学AI伦理' }
  ];

  function open() {
    currentExp = 0;
    renderMenu();
    document.getElementById('lessonOverlay').style.display = 'flex';
  }

  function close() {
    document.getElementById('lessonOverlay').style.display = 'none';
    stopSpeech();
  }

  // ============ 菜单页 ============
  function renderMenu() {
    const el = document.getElementById('lessonContent');
    el.innerHTML = `
      <div class="lab-hero">
        <div class="lab-hero-icon">🧪</div>
        <div class="lab-hero-title">AI原理实验室</div>
        <div class="lab-hero-sub">4个亲手操作的实验，让你在"玩"中真正理解AI！</div>
      </div>
      <div class="lab-menu">
        ${EXPERIMENTS.map((e, i) => `
          <div class="lab-menu-item" data-exp="${i}">
            <div class="lab-menu-icon">${e.icon}</div>
            <div class="lab-menu-body">
              <div class="lab-menu-name">实验${i+1} · ${e.name}</div>
              <div class="lab-menu-desc">${e.desc}</div>
            </div>
            <div class="lab-menu-arrow">›</div>
          </div>`).join('')}
      </div>
      <div class="lab-close-btn" id="labBackMenu">← 回到刷视频</div>`;

    el.querySelectorAll('.lab-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        currentExp = parseInt(item.dataset.exp);
        renderExp();
      });
    });
    document.getElementById('labBackMenu').addEventListener('click', close);
  }

  // ============ 实验分发 ============
  function renderExp() {
    const el = document.getElementById('lessonContent');
    const exp = EXPERIMENTS[currentExp];
    el.innerHTML = `
      <div class="exp-header">
        <button class="exp-back" id="expBack">‹</button>
        <div class="exp-title">${exp.icon} 实验${currentExp+1} · ${exp.name}</div>
      </div>
      <div class="exp-body" id="expBody"></div>`;
    document.getElementById('expBack').addEventListener('click', renderMenu);
    if (exp.id === 'train') renderTrain();
    else if (exp.id === 'speech') renderSpeech();
    else if (exp.id === 'recommend') renderRecommend();
    else if (exp.id === 'ethics') renderEthics();
  }

  // ============ 实验1：教AI学分类（感知机） ============
  let trainState = null;
  function renderTrain() {
    const body = document.getElementById('expBody');
    body.innerHTML = `
      <div class="exp-intro">👆 <b>你是AI的老师！</b>在格子里点一点：红色=苹果🍎，黄色=香蕉🍌。喂够数据后点训练，看AI怎么学会分界线。</div>
      <div class="train-toolbar">
        <button class="train-tool active" data-tool="apple">🍎 苹果</button>
        <button class="train-tool" data-tool="banana">🍌 香蕉</button>
        <button class="train-tool" data-tool="erase">🧹 擦除</button>
      </div>
      <canvas class="train-canvas" id="trainCanvas" width="280" height="280"></canvas>
      <div class="train-stats">已喂：<b id="trainApple">0</b>🍎 <b id="trainBanana">0</b>🍌</div>
      <button class="lab-primary-btn" id="trainGo">🤖 开始训练AI</button>
      <div class="train-log" id="trainLog"></div>
      <div class="lab-insight" id="trainInsight" style="display:none">
        💡 <b>你看到了什么？</b> AI不是天生会分类的——你喂的<b>数据</b> + 一次次<b>训练</b>，它才慢慢画出分界线。这就是机器学习：<b>数据→学习→判断</b>！
      </div>`;

    const canvas = document.getElementById('trainCanvas');
    const ctx = canvas.getContext('2d');
    let samples = [];
    let tool = 'apple';
    let w1 = 0, w2 = 0, b = 0, trained = false;
    trainState = { canvas, ctx, samples, tool, w1, w2, b, trained };

    ctx.fillStyle = '#f5f7ff';
    ctx.fillRect(0, 0, 280, 280);
    drawAxes();

    function drawAxes() {
      const c = trainState.ctx;
      c.strokeStyle = '#ccc';
      c.setLineDash([4,4]);
      c.beginPath();
      c.moveTo(20, 260); c.lineTo(260, 260);
      c.moveTo(20, 260); c.lineTo(20, 20);
      c.stroke();
      c.setLineDash([]);
      c.fillStyle = '#999'; c.font = '10px sans-serif'; c.textAlign = 'center';
      c.fillText('越圆 →', 140, 275);
    }

    function redraw() {
      const s = trainState;
      s.ctx.fillStyle = '#f5f7ff';
      s.ctx.fillRect(0, 0, 280, 280);
      drawAxes();
      s.samples.forEach(sp => {
        s.ctx.beginPath();
        s.ctx.arc(sp.x, sp.y, 9, 0, Math.PI * 2);
        s.ctx.fillStyle = sp.label === 1 ? '#FF5B5B' : '#FFC53D';
        s.ctx.fill();
        s.ctx.fillStyle = '#fff'; s.ctx.font = '9px sans-serif';
        s.ctx.textAlign = 'center'; s.ctx.textBaseline = 'middle';
        s.ctx.fillText(sp.label === 1 ? '🍎' : '🍌', sp.x, sp.y);
      });
      if (s.trained && Math.abs(s.w2) > 1e-6) {
        s.ctx.strokeStyle = '#4A5CFF'; s.ctx.lineWidth = 3;
        s.ctx.beginPath();
        const y1 = (-s.w1 * 20 - s.b) / s.w2;
        const y2 = (-s.w1 * 260 - s.b) / s.w2;
        s.ctx.moveTo(20, y1); s.ctx.lineTo(260, y2);
        s.ctx.stroke();
      }
    }

    function addSample(e) {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      const x = (t.clientX - rect.left) * (280 / rect.width);
      const y = (t.clientY - rect.top) * (280 / rect.height);
      if (x < 15 || x > 265 || y < 15 || y > 265) return;
      const s = trainState;
      if (s.tool === 'erase') {
        s.samples = s.samples.filter(sp => Math.hypot(sp.x - x, sp.y - y) > 15);
      } else {
        if (s.samples.some(sp => Math.hypot(sp.x - x, sp.y - y) < 7)) return;
        s.samples.push({ x, y, label: s.tool === 'apple' ? 1 : -1 });
      }
      s.trained = false;
      redraw();
      document.getElementById('trainApple').textContent = s.samples.filter(sp => sp.label === 1).length;
      document.getElementById('trainBanana').textContent = s.samples.filter(sp => sp.label === -1).length;
    }

    canvas.addEventListener('touchstart', e => { e.preventDefault(); addSample(e); }, { passive: false });
    canvas.addEventListener('touchmove', e => { e.preventDefault(); addSample(e); }, { passive: false });
    canvas.addEventListener('mousedown', addSample);
    canvas.addEventListener('mousemove', e => { if (e.buttons & 1) addSample(e); });

    body.querySelectorAll('.train-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        body.querySelectorAll('.train-tool').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        trainState.tool = btn.dataset.tool;
      });
    });

    document.getElementById('trainGo').addEventListener('click', () => {
      const s = trainState;
      const apple = s.samples.filter(sp => sp.label === 1).length;
      const banana = s.samples.filter(sp => sp.label === -1).length;
      if (apple < 2 || banana < 2) {
        document.getElementById('trainLog').innerHTML = '<div class="log-warn">⚠️ 苹果和香蕉各至少喂2个，AI才能学哦！</div>';
        return;
      }
      trainPerceptron();
    });
  }

  function trainPerceptron() {
    const s = trainState;
    const data = s.samples.map(sp => ({ x: sp.x / 280, y: sp.y / 280, label: sp.label }));
    s.w1 = Math.random() * 0.2 - 0.1;
    s.w2 = Math.random() * 0.2 - 0.1;
    s.b = 0;
    const lr = 0.1;
    const log = document.getElementById('trainLog');
    let epoch = 0;
    const MAX = 60;

    function step() {
      let mistakes = 0;
      data.forEach(d => {
        const out = s.w1 * d.x + s.w2 * d.y + s.b;
        if (out * d.label <= 0) {
          s.w1 += lr * d.label * d.x;
          s.w2 += lr * d.label * d.y;
          s.b += lr * d.label;
          mistakes++;
        }
      });
      epoch++;
      s.trained = true;
      redraw();
      if (mistakes > 0 && epoch < MAX) {
        if (epoch % 8 === 0) {
          log.innerHTML = `<div class="log-info">🔄 第${epoch}轮训练：还有${mistakes}个认错了，AI继续学……</div>`;
        }
        setTimeout(step, 150);
      } else {
        const acc = data.filter(d => (s.w1*d.x + s.w2*d.y + s.b) * d.label > 0).length / data.length;
        log.innerHTML = `<div class="log-ok">✅ 训练${epoch}轮，认对率${(acc*100).toFixed(0)}%！AI学会了！</div>`;
        document.getElementById('trainInsight').style.display = 'block';
      }
    }
    log.innerHTML = '<div class="log-info">🚀 开始训练……</div>';
    setTimeout(step, 300);
  }

  // ============ 实验2：AI语音识别 ============
  function renderSpeech() {
    const body = document.getElementById('expBody');
    const supported = typeof (window.SpeechRecognition || window.webkitSpeechRecognition) !== 'undefined';
    body.innerHTML = `
      <div class="exp-intro">🎙️ <b>对着手机说一句英语</b>（比如 "Hello, how are you?"），看AI怎么把它变成文字——这就是语音识别！</div>
      <div class="speech-demo">
        <div class="speech-mic" id="speechMic">🎙️</div>
        <div class="speech-status" id="speechStatus">${supported ? '点击麦克风开始说话' : '⚠️ 当前浏览器不支持语音识别，请用Chrome试试'}</div>
        <div class="speech-result" id="speechResult">（AI识别出的文字会显示在这里）</div>
      </div>
      <div class="lab-steps-mini">
        <div class="mini-step"><b>① 耳朵</b>：声音→波形</div>
        <div class="mini-step"><b>② 大脑</b>：提取特征</div>
        <div class="mini-step"><b>③ 匹配</b>：对比学过的声音</div>
        <div class="mini-step"><b>④ 输出</b>：变成文字</div>
      </div>
      <div class="lab-insight">💡 <b>原理：</b>AI"听"的其实是声音的<b>频率和波形</b>，它用海量语音数据学会了"哪种声音对应哪个词"。你刚才说的每句话，都被AI拆成一个个音素来识别。</div>`;

    const mic = document.getElementById('speechMic');
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRec = new SR();
    speechRec.lang = 'en-US';
    speechRec.continuous = false;
    speechRec.interimResults = true;
    speechRec.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      document.getElementById('speechResult').textContent = text || '（没听清，再说一次）';
      document.getElementById('speechResult').classList.add('has-text');
      document.getElementById('speechStatus').textContent = '✅ AI听到了！';
      speechListening = false;
      mic.classList.remove('listening');
    };
    speechRec.onerror = (e) => {
      document.getElementById('speechStatus').textContent = '⚠️ 识别出错：' + e.error + '（检查麦克风权限）';
      speechListening = false;
      mic.classList.remove('listening');
    };
    mic.addEventListener('click', () => {
      if (speechListening) {
        speechRec.stop();
        speechListening = false;
        mic.classList.remove('listening');
        return;
      }
      try {
        speechRec.start();
        speechListening = true;
        mic.classList.add('listening');
        document.getElementById('speechStatus').textContent = '🔴 正在听你说……';
        document.getElementById('speechResult').textContent = '';
      } catch (err) {
        document.getElementById('speechStatus').textContent = '⚠️ 启动失败，请授权麦克风';
      }
    });
  }

  function stopSpeech() {
    if (speechRec && speechListening) {
      try { speechRec.stop(); } catch(e) {}
      speechListening = false;
    }
  }

  // ============ 实验3：推荐系统 ============
  let recState = null;
  function renderRecommend() {
    const body = document.getElementById('expBody');
    const topics = [
      { id: 'travel', name: '旅行', emoji: '✈️', interest: 0 },
      { id: 'food', name: '美食', emoji: '🍜', interest: 0 },
      { id: 'nature', name: '自然', emoji: '🌿', interest: 0 },
      { id: 'life', name: '生活', emoji: '🌱', interest: 0 },
      { id: 'speech', name: '演讲', emoji: '🎤', interest: 0 },
      { id: 'psych', name: '心理', emoji: '🧠', interest: 0 }
    ];
    recState = { topics, step: 0 };
    body.innerHTML = `
      <div class="exp-intro">👀 <b>假装你在刷视频。</b>看到喜欢的点👍，不喜欢的点👎——看AI怎么一步步"猜中"你的口味！</div>
      <div class="rec-video" id="recVideo">
        <div class="rec-emoji" id="recEmoji">✈️</div>
        <div class="rec-name" id="recName">旅行视频</div>
      </div>
      <div class="rec-buttons">
        <button class="rec-like" id="recLike">👍 喜欢</button>
        <button class="rec-dislike" id="recDislike">👎 不喜欢</button>
      </div>
      <div class="rec-progress" id="recProgress">已看 0/5 个视频</div>
      <div class="rec-rank" id="recRank"></div>
      <div class="lab-insight" id="recInsight" style="display:none">💡 <b>原理：</b>AI记住你喜欢什么（打标签），然后从"相似口味的人爱看"的内容里预测下一个——这就是<b>推荐系统</b>！不过只看喜欢的会掉进"信息茧房"哦。</div>`;

    showRecItem(0);

    function showRecItem(i) {
      if (i >= 5) {
        finishRec();
        return;
      }
      recState.step = i;
      const t = recState.topics[i % recState.topics.length];
      document.getElementById('recEmoji').textContent = t.emoji;
      document.getElementById('recName').textContent = t.name + '视频';
      document.getElementById('recProgress').textContent = `已看 ${i}/5 个视频`;
      updateRank();
    }

    document.getElementById('recLike').addEventListener('click', () => {
      const t = recState.topics[recState.step % recState.topics.length];
      t.interest += 2;
      showRecItem(recState.step + 1);
    });
    document.getElementById('recDislike').addEventListener('click', () => {
      showRecItem(recState.step + 1);
    });

    function updateRank() {
      const sorted = [...recState.topics].sort((a, b) => b.interest - a.interest);
      const rank = document.getElementById('recRank');
      rank.innerHTML = '<div class="rec-rank-title">🎯 AI预测你喜欢的排序：</div>' +
        sorted.map(t => `
          <div class="rec-rank-item ${t.interest > 0 ? 'hot' : ''}">
            <span>${t.emoji} ${t.name}</span>
            <span class="rec-interest">${'♥'.repeat(Math.min(t.interest, 4))}${t.interest === 0 ? '？' : ''}</span>
          </div>`).join('');
    }

    function finishRec() {
      const sorted = [...recState.topics].sort((a, b) => b.interest - a.interest);
      const top = sorted[0];
      document.getElementById('recVideo').innerHTML = `
        <div style="font-size:44px">${top.emoji}</div>
        <div style="font-size:15px;margin-top:6px">AI猜你最喜欢：<b>${top.name}</b>！</div>`;
      document.getElementById('recButtons').style.display = 'none';
      document.getElementById('recProgress').textContent = '✅ 看完5个视频';
      document.getElementById('recInsight').style.display = 'block';
    }
  }

  // ============ 实验4：AI伦理 ============
  let ethicsIdx = 0;
  const ETHICS = [
    {
      scene: '小刚用AI查资料写作文，AI却"一本正经"地说月球上有森林。小刚准备直接抄上去。',
      options: [
        { text: '🧐 提醒他：AI也会说错，要核实', good: true, feedback: '✅ 对！AI有时会"一本正经地胡说八道"（幻觉）。AI输出的不等于事实，要学会核实！' },
        { text: '📝 帮他抄进作文', good: false, feedback: '❌ 月球上根本没有森林！AI只是编得很像。核实信息，比会用AI更重要！' }
      ]
    },
    {
      scene: '小红在跟AI聊天助手聊天，准备把家庭住址和电话告诉AI，让AI"帮她记住"。',
      options: [
        { text: '🚨 赶紧阻止她', good: true, feedback: '✅ 姓名、住址、电话都是隐私！AI背后是服务器，聊天记录可能被保存，绝不能透露！' },
        { text: '🤷 跟AI说没关系吧', good: false, feedback: '⚠️ 危险！AI不是人，你的信息可能被记录和泄露。隐私永远第一！' }
      ]
    },
    {
      scene: 'AI推荐系统总给小强推游戏视频，他已经连着刷了3小时游戏了，作业还没写。',
      options: [
        { text: '💡 意识到"信息茧房"，主动换内容', good: true, feedback: '✅ 聪明！AI会推你喜欢看的，但我们要做"主人"——主动选择，别被算法牵着走！' },
        { text: '🎮 继续刷，反正AI推荐的都好看', good: false, feedback: '🤔 这正是推荐系统的"陷阱"！它会让你一直看同类内容。放下手机，去写作业吧！' }
      ]
    }
  ];

  function renderEthics() {
    const body = document.getElementById('expBody');
    const e = ETHICS[ethicsIdx];
    body.innerHTML = `
      <div class="exp-intro">⚖️ <b>AI小法官</b>：读一读下面的情景，你的选择很重要！（${ethicsIdx+1}/${ETHICS.length}）</div>
      <div class="ethics-scene-card">${e.scene}</div>
      <div class="ethics-options">
        ${e.options.map((o, i) => `<button class="ethics-opt" data-i="${i}">${o.text}</button>`).join('')}
      </div>
      <div class="ethics-feedback" id="ethicsFeedback"></div>
      <button class="lab-primary-btn" id="ethicsNext" style="display:none">${ethicsIdx < ETHICS.length-1 ? '下一个情景 ›' : '🎖️ 完成！'}</button>`;

    body.querySelectorAll('.ethics-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const o = e.options[parseInt(btn.dataset.i)];
        document.querySelectorAll('.ethics-opt').forEach(x => x.disabled = true);
        btn.classList.add(o.good ? 'good' : 'bad');
        const fb = document.getElementById('ethicsFeedback');
        fb.style.display = 'block';
        fb.innerHTML = o.feedback;
        fb.className = 'ethics-feedback ' + (o.good ? 'good' : 'bad');
        document.getElementById('ethicsNext').style.display = 'block';
      });
    });

    document.getElementById('ethicsNext').addEventListener('click', () => {
      if (ethicsIdx < ETHICS.length - 1) {
        ethicsIdx++;
        renderEthics();
      } else {
        ethicsIdx = 0;
        body.innerHTML = `
          <div class="lab-done-card">
            <div style="font-size:52px">🏆</div>
            <div class="lab-done-title">你是一名合格的AI小法官！</div>
            <div class="lab-done-text">记住三句话：<br>
              <b>① AI会犯错</b>（要核实）<br>
              <b>② 保护隐私</b>（不透露个人信息）<br>
              <b>③ 我们会用AI</b>（思考是自己的）</div>
            <button class="lab-primary-btn" id="ethicsRestart">🔄 再玩一次</button>
            <button class="lab-ghost-btn" id="ethicsBackMenu">← 回实验室</button>
          </div>`;
        document.getElementById('ethicsRestart').addEventListener('click', () => { ethicsIdx = 0; renderEthics(); });
        document.getElementById('ethicsBackMenu').addEventListener('click', renderMenu);
      }
    });
  }

  return { open, close };
})();
