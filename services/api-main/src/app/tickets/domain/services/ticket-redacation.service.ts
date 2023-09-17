import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/codebase/BaseService';
import { Ticket } from '../entities/ticket.entity';
import { User } from 'src/app/users/domain/entities/user.entity';

@Injectable()
export class TicketsRedactionService extends BaseService {
  private stripTags(ticket: Ticket, user: User) {
    ticket.tags = ticket.tags.filter((tag) => tag.group.canSee(user));
    return ticket;
  }

  private stripInternalComments(ticket: Ticket, user: User) {
    if (!user.isCustomer()) {
      return;
    }
    ticket.comments = ticket.comments.filter((comment) => !comment.isInternal);
  }

  public prepareTicketResponse(ticket: Ticket, user: User) {
    this.stripTags(ticket, user);
    this.stripInternalComments(ticket, user);
  }
}
