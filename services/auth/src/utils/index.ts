import * as bcrypt from 'bcrypt';

export async function getPasswordHash(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function validatePasswordHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
