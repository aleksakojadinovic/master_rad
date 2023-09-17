FROM python:3.9-slim


COPY entrypoint.sh /entrypoint.sh
COPY requirements.txt /app/requirements.txt


RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install -r /app/requirements.txt


RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]


