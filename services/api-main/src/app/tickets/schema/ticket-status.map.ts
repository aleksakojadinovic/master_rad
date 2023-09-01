import {
  ROLE_AGENT,
  ROLE_CUSTOMER,
  ROLE_SUPERADMINISTRATOR,
} from './../../users/schema/role.schema';
import { ROLE_ADMINISTRATOR } from 'src/app/users/schema/role.schema';
import { TicketStatus } from './../types';

export class TicketStatusGraphEntry {
  constructor(public status: TicketStatus, public roles: string[]) {}
}

export const TICKET_STATUS_GRAPH: {
  [key in TicketStatus]: TicketStatusGraphEntry[];
} = {
  [TicketStatus.NEW]: [
    new TicketStatusGraphEntry(TicketStatus.OPEN, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
    ]),
    new TicketStatusGraphEntry(TicketStatus.CLOSED, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
      ROLE_CUSTOMER,
    ]),
  ],
  [TicketStatus.OPEN]: [
    new TicketStatusGraphEntry(TicketStatus.IN_PROGRESS, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
    ]),
    new TicketStatusGraphEntry(TicketStatus.CLOSED, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
      ROLE_CUSTOMER,
    ]),
  ],
  [TicketStatus.IN_PROGRESS]: [
    new TicketStatusGraphEntry(TicketStatus.RESOLVED, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
    ]),
    new TicketStatusGraphEntry(TicketStatus.CLOSED, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
      ROLE_CUSTOMER,
    ]),
  ],
  [TicketStatus.RESOLVED]: [
    new TicketStatusGraphEntry(TicketStatus.IN_PROGRESS, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
    ]),
  ],
  [TicketStatus.CLOSED]: [
    new TicketStatusGraphEntry(TicketStatus.OPEN, [
      ROLE_SUPERADMINISTRATOR,
      ROLE_ADMINISTRATOR,
      ROLE_AGENT,
    ]),
  ],
};
