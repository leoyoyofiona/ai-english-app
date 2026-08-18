#!/bin/bash
# 启动 POT provider（Rust单二进制，端口4416）+ gunicorn
bgutil-pot server > /tmp/provider.log 2>&1 &
sleep 3
exec gunicorn app:app --bind 0.0.0.0:10000 --timeout 180 --workers 1
