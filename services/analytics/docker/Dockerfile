FROM python:3.11.5-alpine3.17

COPY cron/root /var/spool/cron/crontabs/root

RUN chmod 0644 /var/spool/cron/crontabs/root

RUN touch /var/log/cron.log

CMD ["sh", "-c", "crond -l 2 -f && tail -f /var/log/cron.log"]


