# Rust版 POT provider（单二进制，无编译依赖）+ Python API
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates wget \
    && rm -rf /var/lib/apt/lists/*

# POT provider 单二进制
RUN wget -q -O /usr/local/bin/bgutil-pot \
    https://github.com/jim60105/bgutil-ytdlp-pot-provider-rs/releases/latest/download/bgutil-pot-linux-x86_64 \
    && chmod +x /usr/local/bin/bgutil-pot

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 10000
CMD ["bash", "start.sh"]
