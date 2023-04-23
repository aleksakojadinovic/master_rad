import camelize from 'camelize';
import urlJoin from 'url-join';

export default function iFetch(url, options = {}, accessToken = '', isServer) {
  const resolvedUrl = isServer
    ? urlJoin('http://host.docker.internal', url)
    : url;

  const authHeader = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};

  const headers = { ...options.headers, ...authHeader };

  return new Promise((resolve, reject) => {
    fetch(resolvedUrl, { ...options, headers })
      .then(async (result) => {
        const data = camelize(await result.json());

        if (!result.ok) {
          reject(data);
        }

        resolve(data);
      })
      .catch(reject);
  });
}
