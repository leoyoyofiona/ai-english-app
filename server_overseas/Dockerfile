FROM node:20-slim

# Python 运行时
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# PO token provider（bgutil，本地HTTP服务）
RUN git clone --depth 1 --branch 1.3.1 https://github.com/Brainicism/bgutil-ytdlp-pot-provider.git /opt/provider \
    && cd /opt/provider/server && npm ci --silent && npx tsc

# Python 依赖
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY app.py .
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 10000
CMD ["bash", "start.sh"]
