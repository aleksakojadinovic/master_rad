import { format } from 'date-fns';

export const isServer = () => typeof window === 'undefined';
export const isClient = () => !isServer();

export const isDevelopment = () => process.env.NODE_ENV === 'development';
export const isProduction = () => process.env.NODE_ENV === 'production';

export const getBaseUrl = () =>
  isServer() ? 'https://host.docker.internal' : '/';

export const getExternalBaseUrl = () =>
  isProduction() ? 'TODO' : 'https://dev.sts.com';

export const formatDate = (date) => {
  const d = new Date(date);
  return format(
    new Date(d.toISOString().slice(0, -1)),
    "dd/MM/yyyy 'at' hh:mm a",
  );
};
