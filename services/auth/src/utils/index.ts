import * as bcrypt from 'bcrypt';

export function getPasswordHash(password: string) {
  return bcrypt.hashSync(password, 10);
}
