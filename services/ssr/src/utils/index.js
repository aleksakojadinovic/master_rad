export const isServer = () => typeof window === 'undefined';
export const isClient = () => !isServer();

export const isDevelopment = () => process.env.NODE_ENV === 'development';
export const isProduction = () => process.env.NODE_ENV === 'production';

export const getBaseUrl = () =>
  isServer() ? 'https://host.docker.internal' : '/';

export const getExternalBaseUrl = () =>
  isProduction() ? 'TODO' : 'https://dev.sts.com';
