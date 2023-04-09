# master_rad

## Generating a self-signed certificate for local development:

```sh
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout local.key -out local.crt -addext "subjectAltName = DNS:dev.sts.com"
```
