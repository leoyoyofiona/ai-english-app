/* ============ content.js · 内容库 ============
 * 素材：shadowtalk 英语课程（用户购买的正版内容）
 * 每条含逐句字幕时间轴（sentences）：播放时按时间显示当前句
 */

const CLIPS = [
  {
    id: 'v1_a', title: '酒店入住', stars: 1, topic: 'travel',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v1_a.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v1_a.jpg',
    sentences: [
      { start: 0.0, end: 6.7, en: 'We\'ve just checked in, and now we need to go to our room, so let\'s take the lift.', zh: '我们刚办完入住，现在要去我们的房间，所以坐电梯吧。' },
      { start: 6.7, end: 16.1, en: 'This, guys, is a luggage trolley where you put your bags on.', zh: '各位，这是行李推车，可以放你的包。' },
      { start: 16.1, end: 18.7, en: 'Normally the concierge takes your bags.', zh: '通常礼宾员会帮你拿行李。' },
      { start: 18.7, end: 24.1, en: 'The concierge in the hotel is like your personal assistant who makes your experience more pleasant.', zh: '酒店礼宾员就像你的私人助理，让你的体验更愉快。' },
      { start: 24.1, end: 29.2, en: 'So this is the lift, I\'m pressing the button, and the lift is opening.', zh: '这是电梯，我按下按钮，电梯门开了。' },
    ]
  },
  {
    id: 'v1_b', title: '乘电梯上楼', stars: 1, topic: 'travel',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v1_b.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v1_b.jpg',
    sentences: [
      { start: 0.4, end: 7.2, en: 'So right now we\'re on the ground floor, and I\'m taking the card and tapping it,', zh: '现在我们在一楼，我拿出房卡刷一下。' },
      { start: 7.2, end: 11.4, en: 'and pressing the number 21.', zh: '按下21层。' },
      { start: 11.4, end: 16.9, en: 'Now we don\'t say the 21 floor, we do say the 21st floor.', zh: '我们不念"the 21 floor"，要说"the 21st floor"。' },
      { start: 16.9, end: 24.1, en: 'We are going up to the 21st floor.', zh: '我们要上21层了。' },
    ]
  },
  {
    id: 'v1_c', title: '走进房间', stars: 1, topic: 'travel',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v1_c.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v1_c.jpg',
    sentences: [
      { start: 0.1, end: 9.2, en: 'We\'re on the 21st floor, and down here is a corridor, a corridor, and walking down the corridor.', zh: '我们到了21层，这边是走廊，沿着走廊走。' },
      { start: 9.3, end: 13.3, en: 'But our room is not down there, it\'s not down that corridor.', zh: '但我们的房间不在那边。' },
      { start: 13.3, end: 17.2, en: 'Our room is here, 21.01.', zh: '我们的房间在这里，2101号。' },
      { start: 17.2, end: 23.5, en: 'Got the keycard, tapping the keycard, pushing down the handle, and entering the room.', zh: '刷房卡，按门把手，走进房间。' },
      { start: 23.5, end: 28.2, en: 'Welcome to MTV Crips, welcome to my Crips.', zh: '欢迎来到我的小屋！' },
      { start: 28.2, end: 34.7, en: 'Here we have the lounge area where you can relax on the sofa.', zh: '这边是休息区，你可以在沙发上放松。' },
      { start: 34.8, end: 37.9, en: 'In the UK we say the lounge or the living room.', zh: '在英国我们说lounge或living room。' },
      { start: 37.9, end: 41.7, en: 'You can use both, the space where you relax, watch TV, read a book.', zh: '两个都可以用——放松、看电视、看书的地方。' },
    ]
  },
  {
    id: 'v2_a', title: '突然就30岁了', stars: 2, topic: 'life',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v2_a.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v2_a.jpg',
    sentences: [
      { start: 0.2, end: 2.2, en: 'Suddenly I\'m 30.', zh: '突然我就30岁了。' },
      { start: 2.2, end: 3.6, en: 'Free zero.', zh: '30岁！' },
      { start: 3.6, end: 4.6, en: '40 years old.', zh: '40岁。' },
      { start: 4.6, end: 6.1, en: 'What a time goal.', zh: '时间过得好快。' },
      { start: 6.1, end: 9.9, en: 'When it comes to being 30, there are a lot of things that I\'m thinking of right now.', zh: '说到30岁，我现在有很多想法。' },
      { start: 9.9, end: 15.8, en: 'There\'s a lot of pressure to figure things out, to settle down, to buy a house, to think about kids,', zh: '有很多压力：搞清楚方向、安定、买房、考虑孩子。' },
      { start: 15.8, end: 21.2, en: 'to think about finding someone, finding the love of my life and getting married.', zh: '找到另一半、找到真爱、结婚。' },
      { start: 21.2, end: 26.2, en: 'There are so many things, but the truth is, like at least for me, at least in my life,', zh: '有太多事了，但事实是，至少对我来说。' },
      { start: 26.2, end: 28.7, en: 'I don\'t have any of these things.', zh: '这些我一样都没有。' },
      { start: 28.7, end: 29.8, en: 'I don\'t have a house now.', zh: '我现在没有房子。' },
      { start: 29.8, end: 31.8, en: 'I don\'t even know where I want to live.', zh: '甚至不知道想住哪里。' },
      { start: 31.8, end: 33.1, en: 'It\'s very complicated.', zh: '很复杂。' },
      { start: 33.1, end: 34.1, en: 'It\'s very confusing.', zh: '很迷茫。' },
      { start: 34.1, end: 36.3, en: 'I don\'t know where home is.', zh: '我不知道家在何方。' },
    ]
  },
  {
    id: 'v2_b', title: '该不该要孩子', stars: 2, topic: 'life',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v2_b.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v2_b.jpg',
    sentences: [
      { start: 0.3, end: 2.6, en: 'I don\'t know if I want to have kids.', zh: '我不知道自己是否想要孩子。' },
      { start: 2.6, end: 5.5, en: 'I know there\'s this biological clock, and I\'m a bit afraid of it.', zh: '我知道有生物钟这回事，我有点害怕。' },
      { start: 5.5, end: 7.3, en: 'I\'m a bit scared, but I really don\'t know.', zh: '我有点怕，但我真的不知道。' },
      { start: 7.3, end: 9.5, en: 'Right now, I don\'t want to have kids.', zh: '现在，我不想要孩子。' },
      { start: 9.5, end: 14.6, en: 'So I don\'t even know if it\'s in three years, if it\'s in five years, I really don\'t know.', zh: '我不知道三年后、五年后会怎样，真的不知道。' },
      { start: 14.6, end: 20.8, en: 'In so many areas right now, I feel behind.', zh: '在很多方面，我觉得自己落后了。' },
      { start: 20.8, end: 26.5, en: 'I feel behind in life, and I\'m sure many of you can relate.', zh: '我觉得人生落后了，相信很多人有同感。' },
      { start: 26.5, end: 27.6, en: 'There are two reasons.', zh: '有两个原因。' },
      { start: 27.6, end: 30.9, en: 'I think a lot of us feel behind in life.', zh: '我觉得很多人都有这种落后感。' },
      { start: 30.9, end: 37.0, en: 'The first thing that I want to talk about today is the social clock, this timeline that', zh: '所以我觉得必须面对它。' },
    ]
  },
  {
    id: 'v2_c', title: '社会时钟的压力', stars: 2, topic: 'life',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v2_c.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v2_c.jpg',
    sentences: [
      { start: 0.0, end: 4.1, en: 'society gives us, especially for women in our fairies.', zh: '社会给我们的时间表，尤其是对女性。' },
      { start: 4.1, end: 13.0, en: 'We have so much pressure to fit into this perfect role or to adapt to this timeline that society', zh: '我们压力很大，要符合这个完美的角色。' },
      { start: 13.0, end: 14.0, en: 'gives us.', zh: '适应社会给我们的时间表。' },
      { start: 14.0, end: 18.3, en: 'Let me tell you, it\'s not possible for all of us because we all are so individual.', zh: '让我告诉你，这对所有人都不可能。' },
      { start: 18.3, end: 19.7, en: 'We all are so different.', zh: '因为我们都是独立的个体。' },
      { start: 19.7, end: 23.6, en: 'And also this timeline is from years ago.', zh: '我们都各不相同。' },
      { start: 23.6, end: 26.0, en: 'It\'s from like 50 or 100, or I don\'t know.', zh: '而且这个时间表是很多年前的。' },
      { start: 26.0, end: 29.3, en: 'It\'s from ages ago, and I don\'t even know who made this timeline.', zh: '大概是50年前、100年前。' },
      { start: 29.3, end: 31.1, en: 'I really don\'t know.', zh: '很久以前，我甚至不知道谁定的。' },
      { start: 31.1, end: 35.1, en: 'Because who said that we have to be married by a certain age?', zh: '因为谁规定了一定要在某个年龄结婚？' },
      { start: 35.1, end: 39.4, en: 'If I want to get married by the age of like 75 or 80, then please let me do it.', zh: '如果我想75岁或80岁再结婚，就让我这么做吧。' },
    ]
  },
  {
    id: 'v2_d', title: '先爱自己', stars: 2, topic: 'life',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v2_d.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v2_d.jpg',
    sentences: [
      { start: 0.4, end: 6.1, en: 'And I think it\'s super cool if you don\'t have this time limit for anything in life.', zh: '我觉得人生没有时间限制真的很酷。' },
      { start: 6.1, end: 12.3, en: 'The only thing, yes, with kids, that is something we as women, we can\'t ignore.', zh: '唯一一件事，关于孩子，是我们女性无法忽视的。' },
      { start: 12.3, end: 16.4, en: 'There will be one point in our lives when we can\'t get kids anymore, and then it might', zh: '我们人生会有那么一个时间点，之后不能再要孩子。' },
      { start: 16.4, end: 19.6, en: 'be too late, and then maybe one day we regret it.', zh: '到那时可能就太晚了，也许某天会后悔。' },
      { start: 19.6, end: 26.1, en: 'But also, I\'m not 30, and I really don\'t at this point, right now, in this moment, I', zh: '但我也还没到30岁，我真的不想现在想这些。' },
      { start: 26.1, end: 27.5, en: 'don\'t want to think about it.', zh: '我还没准备好。' },
      { start: 27.5, end: 29.4, en: 'I don\'t have to write partner for it.', zh: '即使有合适的伴侣，即使恋爱中。' },
      { start: 29.4, end: 31.2, en: 'I\'m not even ready for it.', zh: '我现在也不会准备好要孩子。' },
      { start: 31.2, end: 35.1, en: 'Not even if I would have the right partner if I would be in a relationship, I wouldn\'t', zh: '我的生活方式，一切都还不太对。' },
      { start: 35.1, end: 36.8, en: 'be ready for kids right now.', zh: '我真的觉得得先照顾自己。' },
      { start: 36.8, end: 39.9, en: 'My lifestyle, all of it, it doesn\'t make sense.', zh: '我要填满自己的杯子，先爱自己。' },
      { start: 39.9, end: 41.9, en: 'I really feel like I can kick myself.', zh: '这样我才能把很多爱给别人。' },
      { start: 41.9, end: 46.6, en: 'I have to take care of myself first right now, and I want to fill up my cup and love myself', zh: '所以，是的，我还没准备好。' },
      { start: 46.6, end: 49.8, en: 'so much that I can give so much love to someone else.', zh: '这样我才真正准备好了。' },
      { start: 49.8, end: 51.0, en: 'So yeah, I\'m not ready.', zh: '是啊，我还没准备好。' },
    ]
  },
  {
    id: 'v3_a', title: '石头村庄巴拉祖克', stars: 3, topic: 'travel',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v3_a.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v3_a.jpg',
    sentences: [
      { start: 0.0, end: 6.5, en: 'Here in Balazook, all of the houses are made of stone.', zh: '在巴拉祖克，所有的房子都是用石头建的。' },
      { start: 9.7, end: 14.3, en: 'All of the houses are made of stone.', zh: '这里的房子都是用石头建的。' },
      { start: 14.3, end: 17.6, en: 'And the streets in Balazook that you walk on', zh: '巴拉祖克的街道也是用石头铺的。' },
      { start: 18.8, end: 20.3, en: 'are paved with stones.', zh: '很多不同的石头。' },
      { start: 21.2, end: 26.6, en: 'Many different stones that you walk on together', zh: '你走在上面。' },
      { start: 26.6, end: 29.8, en: 'outside of this house in Balazook.', zh: '在这栋房子外面。' },
      { start: 29.8, end: 36.1, en: 'You can see a railing, this is a railing,', zh: '这里叫巴拉祖克。' },
    ]
  },
  {
    id: 'v3_b', title: '栏杆和大门', stars: 3, topic: 'travel',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v3_b.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v3_b.jpg',
    sentences: [
      { start: -0.2, end: 6.1, en: 'You can see a railing, this is a railing,', zh: '你可以看到栏杆，这是栏杆。' },
      { start: 6.1, end: 8.2, en: 'and this is a gate.', zh: '这是大门。' },
      { start: 9.0, end: 10.0, en: 'This is a gate.', zh: '这是大门。' },
      { start: 11.2, end: 16.5, en: 'The gate has a door handle that you can use', zh: '大门上有门把手，你可以转动打开它。' },
      { start: 16.5, end: 20.8, en: 'to turn and open the gate.', zh: '大门和栏杆是熟铁做的。' },
      { start: 20.8, end: 25.6, en: 'And the gate and the railing is made of rot iron,', zh: '熟铁。' },
      { start: 25.6, end: 26.7, en: 'rot iron.', zh: '熟铁是坚固可弯曲的铁。' },
      { start: 27.7, end: 31.8, en: 'Rot iron is a strong bendable iron', zh: '常用于装饰性的金属工艺。' },
      { start: 31.8, end: 35.4, en: 'that\'s used for decorative metal work.', zh: '用于装饰性的金属工艺。' },
    ]
  },
  {
    id: 'v3_c', title: '古罗马教堂', stars: 3, topic: 'travel',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v3_c.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v3_c.jpg',
    sentences: [
      { start: 0.4, end: 5.0, en: 'Behind me here, this is one of the most famous sites', zh: '在我身后，是巴拉祖克最有名的景点之一。' },
      { start: 5.0, end: 7.5, en: 'that you can see in all of Balazook.', zh: '在巴拉祖克你能看到的所有景点里。' },
      { start: 7.5, end: 11.3, en: 'It\'s an ancient Roman church that was built', zh: '这是一座古罗马教堂。' },
      { start: 11.3, end: 12.9, en: 'in the 13th century.', zh: '建于13世纪。' },
      { start: 12.9, end: 18.7, en: 'Let\'s go take a look.', zh: '我们进去看看吧。' },
      { start: 18.7, end: 21.4, en: 'The area that I\'m standing in front of right now,', zh: '我现在站的地方。' },
      { start: 21.4, end: 25.1, en: 'you can see on the ground, there\'s a circle.', zh: '你可以看到地面上有一个圆圈。' },
      { start: 26.7, end: 27.8, en: 'A circle.', zh: '一个圆圈。' },
      { start: 28.8, end: 32.8, en: 'And this spot right here marks the center of the circle.', zh: '这个位置标记着圆圈的中心。' },
      { start: 35.5, end: 38.5, en: 'So right now I\'m standing in the center,', zh: '所以现在我正站在中心。' },
      { start: 38.5, end: 47.5, en: 'the center of the circle.', zh: '圆圈的中心。' },
      { start: 47.5, end: 50.5, en: 'These are the stairs that we\'re going to take', zh: '这些是我们要爬的楼梯。' },
      { start: 50.5, end: 54.0, en: 'to climb up to the top of the bell tower.', zh: '通往钟楼的顶部。' },
      { start: 54.0, end: 57.6, en: 'We have to be really careful walking up these steps', zh: '爬这些台阶要非常小心。' },
      { start: 57.6, end: 59.8, en: 'because the steps are really steep.', zh: '因为台阶非常陡。' },
      { start: 59.8, end: 63.5, en: 'So I\'m going to hold on to this hand rail', zh: '所以我会扶着这个扶手。' },
      { start: 63.5, end: 66.3, en: 'to make sure that I don\'t lose my balance.', zh: '确保不会失去平衡。' },
    ]
  },
  {
    id: 'v4_a', title: '湖边漫步', stars: 4, topic: 'nature',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v4_a.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v4_a.jpg',
    sentences: [
      { start: 0.2, end: 3.6, en: 'Ooh, it\'s brisk out here.', zh: '哦，外面真冷。' },
      { start: 5.2, end: 6.5, en: 'Let\'s go to the lake.', zh: '我们去湖边吧。' },
      { start: 6.5, end: 7.4, en: 'Let\'s go.', zh: '走！' },
      { start: 8.9, end: 11.4, en: 'There is a lot of wind today.', zh: '今天风很大。' },
      { start: 11.4, end: 14.6, en: 'I only see one person out on the lake kayaking.', zh: '我看到湖上只有一个人在划皮划艇。' },
      { start: 14.6, end: 18.1, en: 'This reminds me of the homes along the BC coast,', zh: '这让我想起BC省海岸边的房子。' },
      { start: 18.1, end: 20.8, en: 'like especially in all those like small islands', zh: '尤其是那些小岛上的房子。' },
      { start: 20.8, end: 22.2, en: 'and stuff, all those houses.', zh: '是的。' },
      { start: 22.2, end: 23.7, en: 'Yes.', zh: '这个海滩很岩石。' },
      { start: 23.7, end: 26.6, en: 'And this beach is very rocky.', zh: '这是个很岩石的海滩。' },
      { start: 26.6, end: 29.4, en: 'This is a very rocky beach.', zh: '是的，很漂亮。' },
      { start: 29.4, end: 34.0, en: 'The other pebbles, like a small rock, like this.', zh: '是的。' },
    ]
  },
  {
    id: 'v4_b', title: '鹅卵石与涟漪', stars: 4, topic: 'nature',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v4_b.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v4_b.jpg',
    sentences: [
      { start: 4.0, end: 5.1, en: 'This is called a pebble.', zh: '这叫鹅卵石。' },
      { start: 5.1, end: 7.5, en: 'A small rock like this is called a pebble.', zh: '像这样的小石头叫鹅卵石。' },
      { start: 7.5, end: 11.3, en: 'But yeah, this water is pretty choppy.', zh: '不过，这水面还挺汹涌的。' },
      { start: 11.3, end: 13.0, en: 'The water is pretty choppy.', zh: '水面很汹涌。' },
      { start: 13.0, end: 14.9, en: 'If the water was smoother and calmer,', zh: '如果水面更平滑平静。' },
      { start: 14.9, end: 16.1, en: 'I would be able to skip this,', zh: '我就能打水漂了。' },
      { start: 16.1, end: 17.6, en: 'but it\'s pretty choppy right now.', zh: '但现在水很汹涌。' },
      { start: 17.6, end: 20.5, en: 'So I don\'t think I could skip it.', zh: '所以我觉得没法打水漂了。' },
      { start: 20.5, end: 21.6, en: 'No.', zh: '不行。' },
      { start: 21.6, end: 23.8, en: 'Let\'s all rocks in there too.', zh: '里面也有很多石头。' },
      { start: 23.8, end: 27.8, en: 'And you can see this, you can see this foam.', zh: '看看这水。' },
    ]
  },
  {
    id: 'v4_c', title: '湖边的泡沫是什么', stars: 4, topic: 'nature',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v4_c.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v4_c.jpg',
    sentences: [
      { start: 0.8, end: 3.7, en: 'All this foam along the shoreline.', zh: '岸边全是这种泡沫。' },
      { start: 3.7, end: 5.2, en: 'What is this foam?', zh: '这是什么泡沫？' },
      { start: 5.2, end: 6.6, en: 'I just asked Chachy Beauty.', zh: '我刚问了ChatGPT。' },
      { start: 6.6, end: 13.1, en: 'So we\'ll see what this foam is along the shoreline.', zh: '所以来看看岸边的泡沫是什么。' },
      { start: 13.1, end: 14.7, en: 'And it\'s natural lake.', zh: '这是天然的湖水泡沫。' },
      { start: 14.7, end: 16.3, en: 'So the foam you see along the shoreline', zh: '所以岸边的泡沫是天然湖泡沫。' },
      { start: 16.3, end: 17.9, en: 'is natural lake foam.', zh: '当水中的有机物。' },
      { start: 17.9, end: 20.2, en: 'Forms when organic material in the water,', zh: '比如分解的植物、藻类。' },
      { start: 20.2, end: 22.4, en: 'like decomposed plants, algae,', zh: '和其他天然物质分解时。' },
      { start: 22.4, end: 24.6, en: 'and other natural matter breaks down', zh: '会释放出叫表面活性剂的化合物。' },
      { start: 24.6, end: 27.3, en: 'or releases compounds called surfactants.', zh: '这些表面活性剂降低了水的表面张力。' },
      { start: 27.3, end: 29.9, en: 'These surfactants lower the surface tension of the water.', zh: '所以当波浪和风搅动湖水时。' },
      { start: 29.9, end: 31.9, en: 'So when the waves and winds start the lake,', zh: '气泡形成并聚集成泡沫。' },
      { start: 31.9, end: 34.5, en: 'bubbles form a gather into foam.', zh: '所以它无害。' },
      { start: 34.5, end: 36.2, en: 'So it\'s harmless.', zh: '是风和波浪让泡沫堆积。' },
      { start: 36.2, end: 39.2, en: 'It\'s caused by the wind and the waves making it build up', zh: '附着在水和陆地交汇的地方。' },
      { start: 39.2, end: 41.1, en: 'and it sticks to where the water meets the land.', zh: '所以它就是湖水自然形成的。' },
      { start: 41.1, end: 43.5, en: 'So it\'s just formed by the lake.', zh: '没什么特别的，不过也许能吃。' },
      { start: 43.5, end: 45.6, en: 'It\'s nothing, nothing but you can probably eat it.', zh: '但我不建议。' },
      { start: 45.6, end: 47.9, en: 'But I would not recommend that.', zh: '所以它无害，就是湖里的泡沫。' },
      { start: 47.9, end: 50.0, en: 'It\'s pretty cold.', zh: '没什么特别的。' },
    ]
  },
  {
    id: 'v4_d', title: '返程', stars: 4, topic: 'nature',
    video: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/videos/v4_d.mp4',
    cover: 'https://cdn.jsdelivr.net/gh/leoyoyofiona/ai-english-app@54e8450/covers/v4_d.jpg',
    sentences: [
      { start: -0.1, end: 2.0, en: 'It\'s pretty cold.', zh: '挺冷的。' },
      { start: 2.0, end: 4.7, en: 'Let\'s head back.', zh: '我们回去吧。' },
      { start: 4.7, end: 6.6, en: 'Oh, I don\'t know what happened to it.', zh: '哦，我不知道天气怎么了。' },
      { start: 6.6, end: 7.9, en: 'All the nice weather.', zh: '之前天气多好。' },
      { start: 7.9, end: 10.4, en: 'Yes, today was beautiful.', zh: '是的，今天很漂亮。' },
      { start: 10.4, end: 11.3, en: 'Today?', zh: '今天？' },
      { start: 11.3, end: 12.3, en: 'Is it always like this here?', zh: '这里一直这样吗？' },
      { start: 12.3, end: 14.6, en: 'No, last time we were here in the summer,', zh: '不，上次我们来是夏天。' },
      { start: 14.6, end: 16.7, en: 'was the lake was calm.', zh: '湖水很平静。' },
      { start: 16.7, end: 18.0, en: 'We had ice cream here.', zh: '我们在这里吃了冰淇淋。' },
      { start: 18.0, end: 19.1, en: 'It was beautiful.', zh: '很漂亮。' },
      { start: 22.7, end: 23.5, en: 'Let\'s go.', zh: '走吧。' },
    ]
  },
];

const TOPICS = [
  { id: 'travel', name: '旅行', emoji: '✈️' },
  { id: 'life', name: '生活感悟', emoji: '🌱' },
  { id: 'nature', name: '自然', emoji: '🌿' },
  { id: 'daily', name: '日常', emoji: '☕' },
  { id: 'speech', name: '演讲', emoji: '🎤' },
  { id: 'work', name: '职场', emoji: '💼' },
  { id: 'food', name: '美食', emoji: '🍜' },
  { id: 'news', name: '新闻', emoji: '📰' },
  { id: 'psych', name: '心理', emoji: '🧠' },
];

const STAR_LEVELS = [
  { stars: 1, name: '入门' },
  { stars: 2, name: '初级' },
  { stars: 3, name: '进阶' },
  { stars: 4, name: '高级' },
  { stars: 5, name: '挑战' },
];

function getClip(id) { return CLIPS.find(c => c.id === id) || null; }
function getClipsByStars(stars) { return stars ? CLIPS.filter(c => c.stars === stars) : CLIPS; }
function getClipsByTopic(topic) { return topic ? CLIPS.filter(c => c.topic === topic) : CLIPS; }

/* 根据播放时间找当前句子 */
function getCurrentSentence(clip, time) {
  const sents = clip.sentences || [];
  for (let i = 0; i < sents.length; i++) {
    if (time >= sents[i].start && time <= sents[i].end) return sents[i];
  }
  return null;
}

/* 三段递进字幕（逐句） */
function buildPhases(clip) {
  return [
    { key: 'listen', label: '第一遍 · 听', subtitle: '' },
    { key: 'en', label: '第二遍 · 英文字幕', subtitle: '（逐句显示）' },
    { key: 'bilingual', label: '第三遍 · 中英对照', subtitle: '（逐句显示）' }
  ];
}