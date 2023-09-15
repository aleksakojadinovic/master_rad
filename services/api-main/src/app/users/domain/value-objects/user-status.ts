export enum UserStatus {
  REGISTERED = 'REGISTERED',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export const USER_STATUS_MAP = {
  [UserStatus.REGISTERED.toString()]: UserStatus.REGISTERED,
  [UserStatus.ACTIVE.toString()]: UserStatus.ACTIVE,
  [UserStatus.BANNED.toString()]: UserStatus.BANNED,
};
