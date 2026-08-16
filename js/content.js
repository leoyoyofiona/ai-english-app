/* ============ content.js · 内容库 ============
 * 素材：shadowtalk 英语课程（用户购买的正版内容）
 * 每个视频片段：真实真人发音、音画同步
 */

const CLIPS = [
  {
    id: 'v1_a', title: '酒店入住', stars: 1, topic: 'travel',
    en: 'We\'ve just checked in, and now we need to go to our room, so let\'s take the lift. This, guys, is a luggage trolley where you put your bags on. Normally the concierge takes your bags. The concierge in the hotel is like your personal assistant who makes your experience more pleasant. So this is the lift, I\'m pressing the button, and the lift is opening.',
    zh: '我们刚办理完入住，现在要去我们的房间，所以我们坐电梯吧。各位，这是一个行李推车，你可以把包放上面。通常礼宾员会帮你拿行李。酒店里的礼宾员就像你的私人助理，让你的体验更愉快。这就是电梯，我按下按钮，电梯门开了。',
    full: 'We\'ve just checked in, and now we need to go to our room, so let\'s take the lift. This, guys, is a luggage trolley where you put your bags on. Normally the concierge takes your bags. The concierge in the hotel is like your personal assistant who makes your experience more pleasant. So this is the lift, I\'m pressing the button, and the lift is opening. ／ 我们刚办理完入住，现在要去我们的房间，所以我们坐电梯吧。各位，这是一个行李推车，你可以把包放上面。通常礼宾员会帮你拿行李。酒店里的礼宾员就像你的私人助理，让你的体验更愉快。这就是电梯，我按下按钮，电梯门开了。',
    video: 'videos/v1_a.mp4'
  },
  {
    id: 'v1_b', title: '乘电梯上楼', stars: 1, topic: 'travel',
    en: 'So right now we\'re on the ground floor, and I\'m taking the card and tapping it, and pressing the number 21. Now we don\'t say the 21 floor, we do say the 21st floor. We are going up to the 21st floor.',
    zh: '现在我们在一楼，我拿出房卡刷一下，按下21层。我们不念"the 21 floor"，应该说"the 21st floor"。我们要上21层了。',
    full: 'So right now we\'re on the ground floor, and I\'m taking the card and tapping it, and pressing the number 21. Now we don\'t say the 21 floor, we do say the 21st floor. We are going up to the 21st floor. ／ 现在我们在一楼，我拿出房卡刷一下，按下21层。我们不念"the 21 floor"，应该说"the 21st floor"。我们要上21层了。',
    video: 'videos/v1_b.mp4'
  },
  {
    id: 'v1_c', title: '走进房间', stars: 1, topic: 'travel',
    en: 'We\'re on the 21st floor, and down here is a corridor, a corridor, and walking down the corridor. But our room is not down there, it\'s not down that corridor. Our room is here, 21.01. Got the keycard, tapping the keycard, pushing down the handle, and entering the room. Welcome to MTV Crips, welcome to my Crips. Here we have the lounge area where you can relax on the sofa. In the UK we say the lounge or the living room. You can use both, the space where you relax, watch TV, read a book.',
    zh: '我们到了21层，这边是走廊，沿着走廊走。但我们的房间不在那边。我们的房间在这里，2101号。刷房卡，按下门把手，进入房间。欢迎来到我的小屋！这边是休息区，你可以在沙发上放松。在英国我们说lounge或living room，两个都可以用——就是放松、看电视、看书的地方。',
    full: 'We\'re on the 21st floor, and down here is a corridor, a corridor, and walking down the corridor. But our room is not down there, it\'s not down that corridor. Our room is here, 21.01. Got the keycard, tapping the keycard, pushing down the handle, and entering the room. Welcome to MTV Crips, welcome to my Crips. Here we have the lounge area where you can relax on the sofa. In the UK we say the lounge or the living room. You can use both, the space where you relax, watch TV, read a book. ／ 我们到了21层，这边是走廊，沿着走廊走。但我们的房间不在那边。我们的房间在这里，2101号。刷房卡，按下门把手，进入房间。欢迎来到我的小屋！这边是休息区，你可以在沙发上放松。在英国我们说lounge或living room，两个都可以用——就是放松、看电视、看书的地方。',
    video: 'videos/v1_c.mp4'
  },
  {
    id: 'v2_a', title: '突然就30岁了', stars: 2, topic: 'life',
    en: 'Suddenly I\'m 30. Free zero. 40 years old. What a time goal. When it comes to being 30, there are a lot of things that I\'m thinking of right now. There\'s a lot of pressure to figure things out, to settle down, to buy a house, to think about kids, to think about finding someone, finding the love of my life and getting married. There are so many things, but the truth is, like at least for me, at least in my life, I don\'t have any of these things. I don\'t have a house now. I don\'t even know where I want to live. It\'s very complicated. It\'s very confusing. I don\'t know where home is.',
    zh: '突然我就30岁了。30岁！40岁。时间过得好快。说到30岁，我现在有很多想法。有很多压力：要搞清楚人生方向、安定下来、买房、考虑孩子、找到另一半、找到真爱结婚。有太多事了，但事实是，至少对我来说，这些我一样都没有。我现在没有房子，甚至不知道想住哪里。很复杂，很迷茫，我不知道家在何方。',
    full: 'Suddenly I\'m 30. Free zero. 40 years old. What a time goal. When it comes to being 30, there are a lot of things that I\'m thinking of right now. There\'s a lot of pressure to figure things out, to settle down, to buy a house, to think about kids, to think about finding someone, finding the love of my life and getting married. There are so many things, but the truth is, like at least for me, at least in my life, I don\'t have any of these things. I don\'t have a house now. I don\'t even know where I want to live. It\'s very complicated. It\'s very confusing. I don\'t know where home is. ／ 突然我就30岁了。30岁！40岁。时间过得好快。说到30岁，我现在有很多想法。有很多压力：要搞清楚人生方向、安定下来、买房、考虑孩子、找到另一半、找到真爱结婚。有太多事了，但事实是，至少对我来说，这些我一样都没有。我现在没有房子，甚至不知道想住哪里。很复杂，很迷茫，我不知道家在何方。',
    video: 'videos/v2_a.mp4'
  },
  {
    id: 'v2_b', title: '该不该要孩子', stars: 2, topic: 'life',
    en: 'I don\'t know if I want to have kids. I know there\'s this biological clock, and I\'m a bit afraid of it. I\'m a bit scared, but I really don\'t know. Right now, I don\'t want to have kids. So I don\'t even know if it\'s in three years, if it\'s in five years, I really don\'t know. In so many areas right now, I feel behind. I feel behind in life, and I\'m sure many of you can relate. There are two reasons. I think a lot of us feel behind in life. The first thing that I want to talk about today is the social clock, this timeline that',
    zh: '我不知道自己是否想要孩子。我知道有生物钟这回事，我有点害怕它。我有点害怕，但我真的不知道。现在，我不想要孩子。我不知道三年后、五年后会不会想要。在很多方面，我觉得自己落后了。我觉得人生落后了，我相信很多人都有同感。有两个原因。我觉得很多人都有这种落后感。今天我想说的第一件事就是社会时钟，这个时间表……',
    full: 'I don\'t know if I want to have kids. I know there\'s this biological clock, and I\'m a bit afraid of it. I\'m a bit scared, but I really don\'t know. Right now, I don\'t want to have kids. So I don\'t even know if it\'s in three years, if it\'s in five years, I really don\'t know. In so many areas right now, I feel behind. I feel behind in life, and I\'m sure many of you can relate. There are two reasons. I think a lot of us feel behind in life. The first thing that I want to talk about today is the social clock, this timeline that ／ 我不知道自己是否想要孩子。我知道有生物钟这回事，我有点害怕它。我有点害怕，但我真的不知道。现在，我不想要孩子。我不知道三年后、五年后会不会想要。在很多方面，我觉得自己落后了。我觉得人生落后了，我相信很多人都有同感。有两个原因。我觉得很多人都有这种落后感。今天我想说的第一件事就是社会时钟，这个时间表……',
    video: 'videos/v2_b.mp4'
  },
  {
    id: 'v2_c', title: '社会时钟的压力', stars: 2, topic: 'life',
    en: 'society gives us, especially for women in our fairies. We have so much pressure to fit into this perfect role or to adapt to this timeline that society gives us. Let me tell you, it\'s not possible for all of us because we all are so individual. We all are so different. And also this timeline is from years ago. It\'s from like 50 or 100, or I don\'t know. It\'s from ages ago, and I don\'t even know who made this timeline. I really don\'t know. Because who said that we have to be married by a certain age? If I want to get married by the age of like 75 or 80, then please let me do it.',
    zh: '社会给我们的时间表，尤其是对女性。我们压力很大，要符合这个完美的角色，适应社会给我们的时间表。让我告诉你，这对所有人来说都不可能，因为我们都是独立的个体，我们都各不相同。而且这个时间表是很多年前的产物，大概是50年前、100年前，很久以前。我甚至不知道是谁定的这个时间表。因为谁规定了一定要在某个年龄结婚？如果我想到75岁或80岁再结婚，那就让我这么做吧。',
    full: 'society gives us, especially for women in our fairies. We have so much pressure to fit into this perfect role or to adapt to this timeline that society gives us. Let me tell you, it\'s not possible for all of us because we all are so individual. We all are so different. And also this timeline is from years ago. It\'s from like 50 or 100, or I don\'t know. It\'s from ages ago, and I don\'t even know who made this timeline. I really don\'t know. Because who said that we have to be married by a certain age? If I want to get married by the age of like 75 or 80, then please let me do it. ／ 社会给我们的时间表，尤其是对女性。我们压力很大，要符合这个完美的角色，适应社会给我们的时间表。让我告诉你，这对所有人来说都不可能，因为我们都是独立的个体，我们都各不相同。而且这个时间表是很多年前的产物，大概是50年前、100年前，很久以前。我甚至不知道是谁定的这个时间表。因为谁规定了一定要在某个年龄结婚？如果我想到75岁或80岁再结婚，那就让我这么做吧。',
    video: 'videos/v2_c.mp4'
  },
  {
    id: 'v2_d', title: '先爱自己', stars: 2, topic: 'life',
    en: 'And I think it\'s super cool if you don\'t have this time limit for anything in life. The only thing, yes, with kids, that is something we as women, we can\'t ignore. There will be one point in our lives when we can\'t get kids anymore, and then it might be too late, and then maybe one day we regret it. But also, I\'m not 30, and I really don\'t at this point, right now, in this moment, I don\'t want to think about it. I don\'t have to write partner for it. I\'m not even ready for it. Not even if I would have the right partner if I would be in a relationship, I wouldn\'t be ready for kids right now. My lifestyle, all of it, it doesn\'t make sense. I really feel like I can kick myself. I have to take care of myself first right now, and I want to fill up my cup and love myself so much that I can give so much love to someone else. So yeah, I\'m not ready.',
    zh: '我觉得如果你对人生任何事都没有时间限制，那真的很酷。唯一一件事，关于孩子，是我们女性无法忽视的。我们的人生中会有那么一个时间点，之后就不能再要孩子了，到那时可能就太晚了，也许有一天我们会后悔。但是，我还没到30岁，我真的不想现在想这件事。我还没准备好。即使我有合适的伴侣，即使我在恋爱中，我现在也不会准备好要孩子。我的生活方式，一切都还不太对。我真的觉得得先照顾好自己，我要填满自己的杯子，先好好爱自己，这样我才能把很多爱给别人。所以，是的，我还没准备好。',
    full: 'And I think it\'s super cool if you don\'t have this time limit for anything in life. The only thing, yes, with kids, that is something we as women, we can\'t ignore. There will be one point in our lives when we can\'t get kids anymore, and then it might be too late, and then maybe one day we regret it. But also, I\'m not 30, and I really don\'t at this point, right now, in this moment, I don\'t want to think about it. I don\'t have to write partner for it. I\'m not even ready for it. Not even if I would have the right partner if I would be in a relationship, I wouldn\'t be ready for kids right now. My lifestyle, all of it, it doesn\'t make sense. I really feel like I can kick myself. I have to take care of myself first right now, and I want to fill up my cup and love myself so much that I can give so much love to someone else. So yeah, I\'m not ready. ／ 我觉得如果你对人生任何事都没有时间限制，那真的很酷。唯一一件事，关于孩子，是我们女性无法忽视的。我们的人生中会有那么一个时间点，之后就不能再要孩子了，到那时可能就太晚了，也许有一天我们会后悔。但是，我还没到30岁，我真的不想现在想这件事。我还没准备好。即使我有合适的伴侣，即使我在恋爱中，我现在也不会准备好要孩子。我的生活方式，一切都还不太对。我真的觉得得先照顾好自己，我要填满自己的杯子，先好好爱自己，这样我才能把很多爱给别人。所以，是的，我还没准备好。',
    video: 'videos/v2_d.mp4'
  },
  {
    id: 'v3_a', title: '石头村庄巴拉祖克', stars: 3, topic: 'travel',
    en: 'Here in Balazook, all of the houses are made of stone. All of the houses are made of stone. And the streets in Balazook that you walk on are paved with stones. Many different stones that you walk on together outside of this house in Balazook.',
    zh: '在巴拉祖克，所有的房子都是用石头建的。这里的房子都是用石头建的。巴拉祖克的街道也是用石头铺的。很多不同的石头，你走在上面。',
    full: 'Here in Balazook, all of the houses are made of stone. All of the houses are made of stone. And the streets in Balazook that you walk on are paved with stones. Many different stones that you walk on together outside of this house in Balazook. ／ 在巴拉祖克，所有的房子都是用石头建的。这里的房子都是用石头建的。巴拉祖克的街道也是用石头铺的。很多不同的石头，你走在上面。',
    video: 'videos/v3_a.mp4'
  },
  {
    id: 'v3_b', title: '栏杆和大门', stars: 3, topic: 'travel',
    en: 'You can see a railing, this is a railing, and this is a gate. This is a gate. The gate has a door handle that you can use to turn and open the gate. And the gate and the railing is made of rot iron, rot iron. Rot iron is a strong bendable iron that\'s used for decorative metal work.',
    zh: '你可以看到栏杆，这是栏杆，这是大门。大门上有个门把手，你可以转动它把门打开。大门和栏杆是熟铁做的。熟铁是一种坚固可弯曲的铁，常用于装饰性的金属工艺。',
    full: 'You can see a railing, this is a railing, and this is a gate. This is a gate. The gate has a door handle that you can use to turn and open the gate. And the gate and the railing is made of rot iron, rot iron. Rot iron is a strong bendable iron that\'s used for decorative metal work. ／ 你可以看到栏杆，这是栏杆，这是大门。大门上有个门把手，你可以转动它把门打开。大门和栏杆是熟铁做的。熟铁是一种坚固可弯曲的铁，常用于装饰性的金属工艺。',
    video: 'videos/v3_b.mp4'
  },
  {
    id: 'v3_c', title: '古罗马教堂', stars: 3, topic: 'travel',
    en: 'Behind me here, this is one of the most famous sites that you can see in all of Balazook. It\'s an ancient Roman church that was built in the 13th century. Let\'s go take a look. The area that I\'m standing in front of right now, you can see on the ground, there\'s a circle. A circle. And this spot right here marks the center of the circle. So right now I\'m standing in the center, the center of the circle. These are the stairs that we\'re going to take to climb up to the top of the bell tower. We have to be really careful walking up these steps because the steps are really steep. So I\'m going to hold on to this hand rail to make sure that I don\'t lose my balance.',
    zh: '在我身后，是巴拉祖克最有名的景点之一。这是一座古罗马教堂，建于13世纪。我们进去看看吧。我现在站的地方，你可以看到地面上有一个圆圈。这个位置标记着圆圈的中心。所以现在我正站在圆圈的中心。这些是我们要爬的楼梯，通往钟楼的顶部。爬这些台阶要非常小心，因为台阶非常陡。所以我会扶着这个扶手，确保不会失去平衡。',
    full: 'Behind me here, this is one of the most famous sites that you can see in all of Balazook. It\'s an ancient Roman church that was built in the 13th century. Let\'s go take a look. The area that I\'m standing in front of right now, you can see on the ground, there\'s a circle. A circle. And this spot right here marks the center of the circle. So right now I\'m standing in the center, the center of the circle. These are the stairs that we\'re going to take to climb up to the top of the bell tower. We have to be really careful walking up these steps because the steps are really steep. So I\'m going to hold on to this hand rail to make sure that I don\'t lose my balance. ／ 在我身后，是巴拉祖克最有名的景点之一。这是一座古罗马教堂，建于13世纪。我们进去看看吧。我现在站的地方，你可以看到地面上有一个圆圈。这个位置标记着圆圈的中心。所以现在我正站在圆圈的中心。这些是我们要爬的楼梯，通往钟楼的顶部。爬这些台阶要非常小心，因为台阶非常陡。所以我会扶着这个扶手，确保不会失去平衡。',
    video: 'videos/v3_c.mp4'
  },
  {
    id: 'v4_a', title: '湖边漫步', stars: 4, topic: 'nature',
    en: 'Ooh, it\'s brisk out here. Let\'s go to the lake. Let\'s go. There is a lot of wind today. I only see one person out on the lake kayaking. This reminds me of the homes along the BC coast, like especially in all those like small islands and stuff, all those houses. Yes. And this beach is very rocky. This is a very rocky beach.',
    zh: '哦，外面真冷。我们去湖边吧。走！今天风很大。我看到湖上只有一个人在划皮划艇。这让我想起BC省海岸边的房子，尤其是那些小岛上的房子。是的。这个海滩很岩石。这是个很岩石的海滩。',
    full: 'Ooh, it\'s brisk out here. Let\'s go to the lake. Let\'s go. There is a lot of wind today. I only see one person out on the lake kayaking. This reminds me of the homes along the BC coast, like especially in all those like small islands and stuff, all those houses. Yes. And this beach is very rocky. This is a very rocky beach. ／ 哦，外面真冷。我们去湖边吧。走！今天风很大。我看到湖上只有一个人在划皮划艇。这让我想起BC省海岸边的房子，尤其是那些小岛上的房子。是的。这个海滩很岩石。这是个很岩石的海滩。',
    video: 'videos/v4_a.mp4'
  },
  {
    id: 'v4_b', title: '鹅卵石与涟漪', stars: 4, topic: 'nature',
    en: 'This is called a pebble. A small rock like this is called a pebble. But yeah, this water is pretty choppy. The water is pretty choppy. If the water was smoother and calmer, I would be able to skip this, but it\'s pretty choppy right now. So I don\'t think I could skip it. No. Let\'s all rocks in there too.',
    zh: '这叫鹅卵石。像这样的小石头叫鹅卵石。不过，这水面还挺波涛汹涌的。水面很汹涌。如果水面更平滑平静，我就能打水漂了，但现在水很汹涌。所以我觉得我没法打水漂了。不行。里面也有很多石头。',
    full: 'This is called a pebble. A small rock like this is called a pebble. But yeah, this water is pretty choppy. The water is pretty choppy. If the water was smoother and calmer, I would be able to skip this, but it\'s pretty choppy right now. So I don\'t think I could skip it. No. Let\'s all rocks in there too. ／ 这叫鹅卵石。像这样的小石头叫鹅卵石。不过，这水面还挺波涛汹涌的。水面很汹涌。如果水面更平滑平静，我就能打水漂了，但现在水很汹涌。所以我觉得我没法打水漂了。不行。里面也有很多石头。',
    video: 'videos/v4_b.mp4'
  },
  {
    id: 'v4_c', title: '湖边的泡沫是什么', stars: 4, topic: 'nature',
    en: 'All this foam along the shoreline. What is this foam? I just asked Chachy Beauty. So we\'ll see what this foam is along the shoreline. And it\'s natural lake. So the foam you see along the shoreline is natural lake foam. Forms when organic material in the water, like decomposed plants, algae, and other natural matter breaks down or releases compounds called surfactants. These surfactants lower the surface tension of the water. So when the waves and winds start the lake, bubbles form a gather into foam. So it\'s harmless. It\'s caused by the wind and the waves making it build up and it sticks to where the water meets the land. So it\'s just formed by the lake. It\'s nothing, nothing but you can probably eat it. But I would not recommend that.',
    zh: '岸边全是这种泡沫。这是什么泡沫？我刚问了ChatGPT。所以我们来看看岸边的泡沫是什么。这是天然的湖水泡沫。当水中的有机物——比如分解的植物、藻类和其他天然物质——分解或释放出叫表面活性剂的化合物时，就会形成。这些表面活性剂降低了水的表面张力。所以当波浪和风搅动湖水时，气泡形成并聚集成泡沫。所以它无害。它是风和波浪让泡沫堆积，附着在水和陆地交汇的地方。所以它就是湖水自然形成的。没什么特别的，不过也许你能吃它，但我不建议。',
    full: 'All this foam along the shoreline. What is this foam? I just asked Chachy Beauty. So we\'ll see what this foam is along the shoreline. And it\'s natural lake. So the foam you see along the shoreline is natural lake foam. Forms when organic material in the water, like decomposed plants, algae, and other natural matter breaks down or releases compounds called surfactants. These surfactants lower the surface tension of the water. So when the waves and winds start the lake, bubbles form a gather into foam. So it\'s harmless. It\'s caused by the wind and the waves making it build up and it sticks to where the water meets the land. So it\'s just formed by the lake. It\'s nothing, nothing but you can probably eat it. But I would not recommend that. ／ 岸边全是这种泡沫。这是什么泡沫？我刚问了ChatGPT。所以我们来看看岸边的泡沫是什么。这是天然的湖水泡沫。当水中的有机物——比如分解的植物、藻类和其他天然物质——分解或释放出叫表面活性剂的化合物时，就会形成。这些表面活性剂降低了水的表面张力。所以当波浪和风搅动湖水时，气泡形成并聚集成泡沫。所以它无害。它是风和波浪让泡沫堆积，附着在水和陆地交汇的地方。所以它就是湖水自然形成的。没什么特别的，不过也许你能吃它，但我不建议。',
    video: 'videos/v4_c.mp4'
  },
  {
    id: 'v4_d', title: '返程', stars: 4, topic: 'nature',
    en: 'It\'s pretty cold. Let\'s head back. Oh, I don\'t know what happened to it. All the nice weather. Yes, today was beautiful. Today? Is it always like this here? No, last time we were here in the summer, was the lake was calm. We had ice cream here. It was beautiful. Let\'s go.',
    zh: '挺冷的。我们回去吧。哦，我不知道天气怎么了。之前天气多好。是的，今天很漂亮。今天？这里一直这样吗？不，上次我们来是夏天，湖水很平静。我们在这里吃了冰淇淋。很漂亮。走吧。',
    full: 'It\'s pretty cold. Let\'s head back. Oh, I don\'t know what happened to it. All the nice weather. Yes, today was beautiful. Today? Is it always like this here? No, last time we were here in the summer, was the lake was calm. We had ice cream here. It was beautiful. Let\'s go. ／ 挺冷的。我们回去吧。哦，我不知道天气怎么了。之前天气多好。是的，今天很漂亮。今天？这里一直这样吗？不，上次我们来是夏天，湖水很平静。我们在这里吃了冰淇淋。很漂亮。走吧。',
    video: 'videos/v4_d.mp4'
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

/* 三段递进字幕 */
function buildPhases(clip) {
  return [
    { key: 'listen', label: '第一遍 · 听', subtitle: '' },
    { key: 'en', label: '第二遍 · 英文字幕', subtitle: clip.en },
    { key: 'bilingual', label: '第三遍 · 中英对照', subtitle: clip.full }
  ];
}