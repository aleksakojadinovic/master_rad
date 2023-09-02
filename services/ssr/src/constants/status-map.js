import { ROLE } from '@/enums/roles';
import { TicketStatus } from '@/enums/tickets';

export const TICKET_STATUS_GRAPH = {
  [TicketStatus.NEW]: [
    {
      target: TicketStatus.OPEN,
      roles: [ROLE.SUPERADMINISTRATOR, ROLE.ADMINISTRATOR, ROLE.AGENT],
    },
    {
      target: TicketStatus.CLOSED,
      roles: [
        ROLE.SUPERADMINISTRATOR,
        ROLE.ADMINISTRATOR,
        ROLE.AGENT,
        ROLE.CUSTOMER,
      ],
    },
  ],
  [TicketStatus.OPEN]: [
    {
      target: TicketStatus.IN_PROGRESS,
      roles: [ROLE.SUPERADMINISTRATOR, ROLE.ADMINISTRATOR, ROLE.AGENT],
    },
    {
      target: TicketStatus.CLOSED,
      roles: [
        ROLE.SUPERADMINISTRATOR,
        ROLE.ADMINISTRATOR,
        ROLE.AGENT,
        ROLE.CUSTOMER,
      ],
    },
  ],
  [TicketStatus.IN_PROGRESS]: [
    {
      target: TicketStatus.RESOLVED,
      roles: [ROLE.SUPERADMINISTRATOR, ROLE.ADMINISTRATOR, ROLE.AGENT],
    },
    {
      target: TicketStatus.CLOSED,
      roles: [
        ROLE.SUPERADMINISTRATOR,
        ROLE.ADMINISTRATOR,
        ROLE.AGENT,
        ROLE.CUSTOMER,
      ],
    },
  ],
  [TicketStatus.RESOLVED]: [
    {
      target: TicketStatus.IN_PROGRESS,
      roles: [ROLE.SUPERADMINISTRATOR, ROLE.ADMINISTRATOR, ROLE.AGENT],
    },
  ],
  [TicketStatus.CLOSED]: [
    {
      target: TicketStatus.OPEN,
      roles: [ROLE.SUPERADMINISTRATOR, ROLE.ADMINISTRATOR, ROLE.AGENT],
    },
  ],
};
