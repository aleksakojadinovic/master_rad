import { Role } from 'src/app/users/schema/role.schema';
import { TicketStatus } from '../../types';

export class TicketStatusGraphEntry {
  constructor(public status: TicketStatus, public roles: Role[]) {}
}

export const TICKET_STATUS_GRAPH: {
  [key in TicketStatus]: TicketStatusGraphEntry[];
} = {
  [TicketStatus.NEW]: [
    new TicketStatusGraphEntry(TicketStatus.OPEN, [
      Role.ADMINISTRATOR,
      Role.AGENT,
    ]),
    new TicketStatusGraphEntry(TicketStatus.CLOSED, [
      Role.ADMINISTRATOR,
      Role.AGENT,
      Role.CUSTOMER,
    ]),
  ],
  [TicketStatus.OPEN]: [
    new TicketStatusGraphEntry(TicketStatus.IN_PROGRESS, [
      Role.ADMINISTRATOR,
      Role.AGENT,
    ]),
    new TicketStatusGraphEntry(TicketStatus.CLOSED, [
      Role.ADMINISTRATOR,
      Role.AGENT,
      Role.CUSTOMER,
    ]),
  ],
  [TicketStatus.IN_PROGRESS]: [
    new TicketStatusGraphEntry(TicketStatus.RESOLVED, [
      Role.ADMINISTRATOR,
      Role.AGENT,
    ]),
    new TicketStatusGraphEntry(TicketStatus.CLOSED, [
      Role.ADMINISTRATOR,
      Role.AGENT,
      Role.CUSTOMER,
    ]),
  ],
  [TicketStatus.RESOLVED]: [
    new TicketStatusGraphEntry(TicketStatus.IN_PROGRESS, [
      Role.ADMINISTRATOR,
      Role.AGENT,
    ]),
  ],
  [TicketStatus.CLOSED]: [
    new TicketStatusGraphEntry(TicketStatus.OPEN, [
      Role.ADMINISTRATOR,
      Role.AGENT,
    ]),
  ],
};
