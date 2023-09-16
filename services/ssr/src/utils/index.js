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

export const getStringPreview = (str, maxLen = 20) => {
  return str.length <= maxLen ? str : str.substring(0, maxLen) + '...';
};

export const wrapUser = (user) => {
  const {
    id,
    email,
    username,
    firstName,
    lastName,
    fullName,
    initials,
    role,
    status,
  } = user ?? {
    id: null,
    username: '',
    firstName: '',
    lastName: '',
    fullName: '',
    initials: '//',
    role: '',
    status: '',
  };

  const isLoggedIn = !!user;

  const hasRole = (queryRole) => {
    return role === queryRole;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(role);
  };

  const isAgent = role === 'agent';
  const isCustomer = role === 'customer';
  const isAdministrator = role === 'administrator';

  const isActive = status === 'ACTIVE';
  const isRegistered = status === 'REGISTERED';
  const isBanned = status === 'BANNED';

  return {
    id,
    email,
    username,
    firstName,
    lastName,
    fullName,
    initials,
    role,
    isLoggedIn,
    isAdministrator,
    isAgent,
    isCustomer,
    hasRole,
    hasAnyRole,
    isActive,
    isRegistered,
    isBanned,
    status,
  };
};
