# 多阶段：从官方镜像拷贝预构建的 PO token provider（含编译好的canvas）
FROM brainicism/bgutil-ytdlp-pot-provider:latest AS pot

FROM node:20-slim

COPY --from=pot /app /opt/provider

# Python 运行时
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY app.py .
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 10000
CMD ["bash", "start.sh"]
