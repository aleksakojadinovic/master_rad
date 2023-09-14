const ROLE_ADMINISTRATOR = 'administrator';
const ROLE_AGENT = 'agent';
const ROLE_CUSTOMER = 'customer';

export enum Role {
  ADMINISTRATOR = 'administrator',
  AGENT = 'agent',
  CUSTOMER = 'customer',
}

export const ROLES = [Role.ADMINISTRATOR, Role.AGENT, Role.CUSTOMER];

export const ROLE_VALUES = {
  [ROLE_ADMINISTRATOR]: Role.ADMINISTRATOR,
  [ROLE_AGENT]: Role.AGENT,
  [ROLE_CUSTOMER]: Role.CUSTOMER,
};
