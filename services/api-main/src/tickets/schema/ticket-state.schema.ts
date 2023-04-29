import { User } from 'src/users/schema/user.schema';
import { TicketStatus } from '../types';

export class TicketState {
  constructor(
    public id: string,
    public createdBy: User,
    public createdAt: Date,
    public title: string,
    public body: string,
    public status: TicketStatus,
  ) {}
}
