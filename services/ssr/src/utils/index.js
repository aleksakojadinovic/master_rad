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
  const { id, email, firstName, lastName, roles } = user ?? {
    id: null,
    username: '',
    firstName: '',
    lastName: '',
    roles: [],
  };

  const roleNames = roles.map(({ name }) => name);
  const roleIds = roles.map(({ id }) => id);

  const isLoggedIn = !!user;

  const hasRole = (conditionRoles) => {
    // debugger;
    let conditionRoleIdentifiers = [];
    if (typeof conditionRoles[0] === 'object') {
      conditionRoleIdentifiers = conditionRoles.map(({ id }) => id);
    } else {
      conditionRoleIdentifiers = conditionRoles;
    }

    return conditionRoleIdentifiers.some(
      (roleIdentifier) =>
        roleIds.includes(roleIdentifier) || roleNames.includes(roleIdentifier),
    );
  };

  const isAgent = hasRole(['agent']);
  const isCustomer = hasRole(['customer']);
  const isAdministator = hasRole(['administrator']);
  const isSuperAdministrator = hasRole(['superadministrator']);

  return {
    id,
    email,
    firstName,
    lastName,
    roles,
    roleNames,
    roleIds,
    isLoggedIn,
    isAdministator,
    isSuperAdministrator,
    isAgent,
    isCustomer,
    hasRole,
  };
};
