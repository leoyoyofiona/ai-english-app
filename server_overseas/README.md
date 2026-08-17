# 海外 API 服务（Render 部署）

为「影跟子读音抖版」国外 V2 无限推荐流提供 YouTube 数据（搜索列表 + 视频直链）。

## 部署（Render.com 免费版）
1. 注册 https://render.com （免费，无需信用卡）
2. Dashboard → New → Web Service
3. 上传本目录代码（Public Git Repository 或从 GitHub 导入）
   - 若从 GitHub：把本目录 push 到任意仓库后连接
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn app:app --bind 0.0.0.0:10000 --timeout 120 --workers 1`
6. Deploy 完成后得到 URL，形如 `https://leo-english-api.onrender.com`

## 接口
- `GET /api/health` → ok
- `GET /api/yt/search?q=learn english vlog&page=1` → {videos:[{videoId,title,thumb}]}
- `GET /api/yt/stream?videoId=xxx` → {url: mp4直链}

## 注意
- 免费版实例 15 分钟无流量会休眠，首次请求冷启动约 30-60 秒
- 直链由用户浏览器直连 googlevideo.com 播放，本服务不中转视频流量
