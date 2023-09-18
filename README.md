# STS

A multi-service web application for managing user complaints.

## Generating development certificates

Generating a self-signed certificate for local development (execute this in services/proxy/certificates):

```sh
# This generates a certificate for dev.sts.com
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout local.key -out local.crt -addext "subjectAltName = DNS:dev.sts.com"
# This generates a certificate for metrics.sts.com
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout metrics.key -out metrics.crt -addext "subjectAltName = DNS:metrics.sts.com"
```

### Certificate details should be like this

| Field                                 | Val                 |
| ------------------------------------- | ------------------- |
| Country/Locality/Region/Province/City | SR                  |
| Common Name                           | metrics.sts.com     |
| Organisation/Organisational Unit      | STS                 |
| Email address                         | example@example.com |

After generation make sure .key files have 644 permissions
