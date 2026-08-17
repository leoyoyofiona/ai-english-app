/* ============ ai_lesson.js · AI小课堂 ============
 * 定位：把英语刷视频APP升级为"AI通识教育"作品
 * 每个原理都用孩子在APP里刚经历的真实场景讲解（体验→理解）
 */

const AiLesson = (function () {
  let current = 0;

  const LESSONS = [
    {
      id: 'speech',
      icon: '🎙️',
      title: 'AI怎么听懂英语？',
      tag: '语音识别',
      scene: '刚才你刷视频时，视频里的英语是不是一句句跟着画面走？这是AI在"听"声音。',
      steps: [
        { icon: '👂', title: '1. 耳朵：声音采集', desc: '麦克风把声波的振动变成数字信号——就像把声音画成一条波形图。' },
        { icon: '📊', title: '2. 大脑：特征提取', desc: 'AI分析声音的频率和音色，提取"音素"——英语里最小的声音单位（如 /k/ /æ/ /t/）。' },
        { icon: '🔍', title: '3. 匹配：模式识别', desc: 'AI把音素串和它"学过"的千万条语音对比，找出最像的单词和句子。' },
        { icon: '💬', title: '4. 输出：生成字幕', desc: '把识别出的文字显示出来——这就是你看到逐句字幕的原理！' }
      ],
      insight: 'AI不是"真的听懂"英语，而是通过海量数据学会了"声音→文字"的对应规律。这就像你听多了英语，自然就能分辨出不同单词。'
    },
    {
      id: 'recommend',
      icon: '🎯',
      title: 'AI怎么给你推荐视频？',
      tag: '推荐系统',
      scene: '你刷视频时，是不是发现越刷越"对胃口"？那是AI在偷偷观察你！',
      steps: [
        { icon: '👀', title: '1. 观察：记录你的行为', desc: 'AI记录你看完了什么、在哪个视频停留久、上滑还是下滑。' },
        { icon: '🏷️', title: '2. 打标签：理解你的喜好', desc: '每个视频都有标签（旅行、美食、生活……）。AI统计你对哪些标签更感兴趣。' },
        { icon: '🧮', title: '3. 预测：猜你喜欢的', desc: 'AI用"相似用户也喜欢"的规律，预测你下一个可能爱看的视频。' },
        { icon: '📱', title: '4. 推荐：推送给你', desc: '把预测分数最高的视频排前面——这就是"越刷越懂你"。' }
      ],
      insight: '推荐系统让内容找上门，但也要小心"信息茧房"——只看一类内容会错过新世界！多尝试不同主题，让AI认识更多面的你。'
    },
    {
      id: 'translate',
      icon: '🌐',
      title: 'AI怎么翻译英语？',
      tag: '机器翻译',
      scene: '第三遍视频会显示中英对照——AI是怎么把"Where are you from?"变成"你从哪里来？"的？',
      steps: [
        { icon: '📖', title: '1. 拆解：理解句子结构', desc: 'AI先分析英语句子的语法结构：主语、动词、宾语……' },
        { icon: '🧠', title: '2. 语义：理解意思', desc: 'AI理解整句的意思，而不是逐词翻译——所以"Where are you from"不会译成"哪里是你从"。' },
        { icon: '🔄', title: '3. 生成：用中文重新表达', desc: 'AI按照中文的说话习惯重新组织句子，让翻译读起来自然。' }
      ],
      insight: '现代翻译AI是"先理解再表达"，就像真正的翻译官。它看过几十亿句中英对照文本，才学会了这个本领。'
    },
    {
      id: 'tts',
      icon: '🔊',
      title: 'AI怎么"说"英语？',
      tag: '语音合成',
      scene: '如果这个APP加上朗读功能，AI就能"开口说英语"——这背后是语音合成（TTS）技术。',
      steps: [
        { icon: '🔤', title: '1. 文字→音素', desc: 'AI先把文字转成音素（发音单元），决定每个词怎么读。' },
        { icon: '🎵', title: '2. 音素→声音', desc: 'AI用"学过的真人发音"拼接/生成每个音素的声音片段。' },
        { icon: '🎶', title: '3. 加上语调', desc: 'AI根据句子语气（疑问/感叹）调整音高和停顿，让它像真人说话。' }
      ],
      insight: '现在的AI语音已经能模仿真人语气甚至方言。不过AI朗读再自然，也比不上你亲自开口练习——因为语言的灵魂是交流！'
    },
    {
      id: 'ethics',
      icon: '⚖️',
      title: 'AI会犯错吗？',
      tag: 'AI伦理',
      scene: 'AI很强大，但它不是完美的。用AI学英语，也要学会判断。',
      steps: [
        { icon: '🤥', title: '1. AI也会"说错"', desc: '语音识别可能听错单词、翻译可能不准确——AI的话要核实，不要盲信。' },
        { icon: '🔒', title: '2. 保护隐私', desc: '不要把自己的姓名、地址、电话告诉AI助手，AI背后是服务器在记录。' },
        { icon: '🧠', title: '3. 人机协作', desc: 'AI是学习工具，不是答案机器。让它讲思路、你自己思考，才是真学会。' }
      ],
      insight: '会用AI，更要会判断AI。做聪明的学习者：把AI当"教练"，不当"拐杖"。'
    }
  ];

  function open() {
    current = 0;
    render();
    document.getElementById('lessonOverlay').style.display = 'flex';
  }

  function close() {
    document.getElementById('lessonOverlay').style.display = 'none';
  }

  function render() {
    const l = LESSONS[current];
    document.getElementById('lessonContent').innerHTML = `
      <div class="lesson-scene">
        <div class="lesson-scene-icon">${l.icon}</div>
        <div class="lesson-scene-tag">${l.tag} · 第${current+1}/${LESSONS.length}课</div>
        <div class="lesson-title">${l.title}</div>
        <div class="lesson-scene-text">${l.scene}</div>
      </div>
      <div class="lesson-steps">
        ${l.steps.map(s => `
          <div class="lesson-step">
            <div class="lesson-step-icon">${s.icon}</div>
            <div class="lesson-step-body">
              <div class="lesson-step-title">${s.title}</div>
              <div class="lesson-step-desc">${s.desc}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="lesson-insight">
        <div class="lesson-insight-icon">💡</div>
        <div class="lesson-insight-text"><b>你知道吗？</b>${l.insight}</div>
      </div>
      <div class="lesson-nav">
        ${current > 0 ? '<button class="lesson-btn prev" id="lessonPrev">‹ 上一课</button>' : ''}
        ${current < LESSONS.length - 1
          ? '<button class="lesson-btn next" id="lessonNext">下一课 ›</button>'
          : '<button class="lesson-btn done" id="lessonDone">✅ 学完啦，回刷视频</button>'}
      </div>`;

    document.getElementById('lessonPrev')?.addEventListener('click', () => { current--; render(); });
    document.getElementById('lessonNext')?.addEventListener('click', () => { current++; render(); });
    document.getElementById('lessonDone')?.addEventListener('click', close);
  }

  return { open, close };
})();
