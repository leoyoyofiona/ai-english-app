#!/bin/bash
# 启动 PO token provider（官方镜像预构建，端口4416）+ gunicorn
node /opt/provider/build/main.js > /tmp/provider.log 2>&1 &
sleep 3
exec gunicorn app:app --bind 0.0.0.0:10000 --timeout 180 --workers 1
