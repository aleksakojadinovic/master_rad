FROM python:3.11.5-alpine3.17

COPY cron/root /var/spool/cron/crontabs/root
COPY requirements.txt /app/requirements.txt

RUN chmod 0644 /var/spool/cron/crontabs/root

RUN touch /var/log/cron.log

RUN pip install -r /app/requirements.txt

CMD ["sh", "-c", "crond -l 2 -f && tail -f /var/log/cron.log"]


