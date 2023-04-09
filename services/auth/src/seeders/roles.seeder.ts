import mongoose from 'mongoose';
import { Role } from 'src/schemas/role.schema';

const predefinedRoles = [
  new Role('admin'),
  new Role('superadmin'),
  new Role('agent'),
];

// TODO
export function seedRoles() {}
