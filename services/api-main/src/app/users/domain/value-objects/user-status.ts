export enum UserStatus {
  REGISTERED = 'REGISTERED',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export const USER_STATUSES = [
  UserStatus.ACTIVE,
  UserStatus.REGISTERED,
  UserStatus.BANNED,
];

export const USER_STATUS_VALUES = {
  [UserStatus.REGISTERED.toString()]: UserStatus.REGISTERED,
  [UserStatus.ACTIVE.toString()]: UserStatus.ACTIVE,
  [UserStatus.BANNED.toString()]: UserStatus.BANNED,
};
