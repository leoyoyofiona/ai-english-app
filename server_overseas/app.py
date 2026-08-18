#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
影跟子读音抖版 · 海外 API 服务（部署到 Render 等海外托管）
提供 YouTube 英语学习视频的搜索列表与视频直链。
仅返回元数据与直链 URL，视频流量由用户浏览器直连 googlevideo.com（无防盗链）。
"""
import time
import threading
import json as json_mod
import urllib.request
import yt_dlp
from flask import Flask, jsonify, request

app = Flask(__name__)

# 搜索：只取元数据（快）
SEARCH_OPTS = {
    'quiet': True,
    'extract_flat': True,
    'extractor_args': {'youtube': {'player_client': ['android']}},
}
# ===== PO Token（解决数据中心IP被YouTube反爬拦截） =====
# provider：bgutil-ytdlp-pot-provider 本地HTTP服务（端口4416）
pot_cache = {'token': None, 'ts': 0}


def get_po_token():
    try:
        req = urllib.request.Request(
            'http://127.0.0.1:4416/get_pot',
            data=json_mod.dumps({'client': 'android.gvs'}).encode(),
            headers={'Content-Type': 'application/json'},
            method='POST')
        d = json_mod.loads(urllib.request.urlopen(req, timeout=30).read().decode())
        return d.get('poToken')
    except Exception:
        return None


def cached_po_token():
    now = time.time()
    if pot_cache['token'] and now - pot_cache['ts'] < 30 * 60:
        return pot_cache['token']
    t = get_po_token()
    if t:
        pot_cache['token'] = t
        pot_cache['ts'] = now
    return t

# 直链缓存：videoId -> {url, ts}（YouTube 直链约6小时有效，缓存30分钟）
stream_cache = {}
CACHE_TTL = 30 * 60
lock = threading.Lock()

# 英文学习关键词池（前端可指定任意关键词）
DEFAULT_KEYWORDS = [
    'learn english vlog', 'english vlog', 'learn english',
    'english speaking practice', 'english conversation',
    'english listening practice', 'english podcast',
    'english daily conversation', 'shadowing english', 'english story listening',
]


@app.route('/api/health')
def health():
    return jsonify({'ok': True, 'pot_provider': bool(cached_po_token())})


@app.route('/api/yt/search')
def yt_search():
    """搜索 YouTube：?q=关键词&page=页码（每页约20条）→ {videos:[{videoId,title,thumb}]}"""
    q = request.args.get('q', 'learn english vlog')
    page = max(1, int(request.args.get('page', 1)))
    try:
        query = f'ytsearch{page * 20}:{q}'
        with yt_dlp.YoutubeDL(SEARCH_OPTS) as ydl:
            info = ydl.extract_info(query, download=False)
        videos = []
        entries = info.get('entries') or []
        # 取当前页的20条（ytsearchN 返回前N条，按页偏移）
        for e in entries[(page - 1) * 20: page * 20]:
            if not e or not e.get('id'):
                continue
            thumbs = e.get('thumbnails') or []
            videos.append({
                'videoId': e.get('id'),
                'title': (e.get('title') or 'YouTube English').strip()[:80],
                'thumb': thumbs[-1].get('url', '') if thumbs else '',
            })
        return jsonify({'videos': videos})
    except Exception as ex:
        return jsonify({'error': str(ex), 'videos': []}), 500


@app.route('/api/yt/stream')
def yt_stream():
    """获取视频直链：?videoId=xxx → {url}"""
    vid = request.args.get('videoId', '')
    if not vid:
        return jsonify({'error': 'videoId required'}), 400
    now = time.time()
    with lock:
        cached = stream_cache.get(vid)
        if cached and now - cached['ts'] < CACHE_TTL:
            return jsonify({'url': cached['url']})
    pot = cached_po_token()
    yt_args = {'player_client': ['android']}
    if pot:
        yt_args['po_token'] = [f'android.gvs+{pot}']
    try:
        opts = {'quiet': True, 'format': '18', 'extractor_args': {'youtube': yt_args}}
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(f'https://www.youtube.com/watch?v={vid}', download=False)
        url = info.get('url')
    except Exception as ex:
        import yt_dlp as _yd
        return jsonify({'error': f'failed(ytdlp={_yd.version.__version__},pot={bool(pot)}): {str(ex)[:120]}'}), 502
    if not url:
        return jsonify({'error': f'no direct url(ytdlp={yt_dlp.version.__version__},pot={bool(pot)})'}), 502
    with lock:
        stream_cache[vid] = {'url': url, 'ts': now}
        # 简单防膨胀
        if len(stream_cache) > 500:
            stream_cache.clear()
    return jsonify({'url': url})


if __name__ == '__main__':
    # Render 用 gunicorn 启动：gunicorn app:app
    app.run(host='0.0.0.0', port=8080)
