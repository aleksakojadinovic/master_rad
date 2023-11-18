import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/codebase/BaseService';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { TicketRedactionService } from './ticket-redacation.service';
import { NotificationsService } from 'src/app/notifications/domain/notifications.service';
import { User } from 'src/app/users/domain/entities/user.entity';
import { AddAssigneesDTO } from '../../api/dto/add-assignees.dto';
import { NotAllowedToAssignError } from '../errors/NotAllowedToAssign';
import { UsersService } from 'src/app/users/domain/users.service';
import { AssigneeNotFoundError } from '../errors/AssigneeNotFound';
import { CannotAssignCustomerError } from '../errors/CannotAssignCustomer';
import { DuplicateAssigneeError } from '../errors/DuplicateAssignee';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { NotificationFactory } from 'src/app/notifications/domain/factory/notification.factory';

@Injectable()
export class TicketAssigneesService extends BaseService {
  constructor(
    private ticketRedactionService: TicketRedactionService,
    private ticketsRepository: TicketsRepository,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {
    super();
  }

  async addAssignees(ticketId: string, user: User, dto: AddAssigneesDTO) {
    if (user.isCustomer()) {
      throw new NotAllowedToAssignError();
    }

    const ticket = await this.ticketsRepository.findById(ticketId);

    if (!ticket) {
      throw new TicketNotFoundError(ticket.id);
    }

    const assignees: User[] = await Promise.all(
      dto.assignees.map((id) => this.usersService.findOne(id)),
    );

    for (const assigneeUser of assignees) {
      if (!assigneeUser) {
        throw new AssigneeNotFoundError();
      }
      if (assigneeUser.isCustomer()) {
        throw new CannotAssignCustomerError(assigneeUser.id);
      }
      if (ticket.isAssigned(assigneeUser)) {
        throw new DuplicateAssigneeError(assigneeUser.id);
      }
    }

    ticket.assign(assignees);

    const usersToNotify = assignees.filter(
      (assignee) => assignee.id !== user.id,
    );

    const notifications = usersToNotify.map((userToNotify) =>
      NotificationFactory.create((builder) =>
        builder
          .forUser(userToNotify)
          .hasPayload('assigned', (assignBuilder) =>
            assignBuilder.atTicket(ticket).byUser(user),
          ),
      ),
    );

    const updatedTicketPromise = this.ticketsRepository.update(ticket, user);
    const notificationsPromise = this.notificationsService.emitNotifications(
      ...notifications,
    );

    const [updatedTicket] = await Promise.all([
      updatedTicketPromise,
      notificationsPromise,
    ]);

    this.ticketRedactionService.prepareTicketResponse(updatedTicket, user);

    return updatedTicket;
  }

  async removeAssignees(ticketId: string, user: User, dto: AddAssigneesDTO) {
    if (user.isCustomer()) {
      throw new NotAllowedToAssignError();
    }

    const ticket = await this.ticketsRepository.findById(ticketId);

    if (!ticket) {
      throw new TicketNotFoundError(ticket.id);
    }

    const assignees = await this.usersService.findByIds(dto.assignees);

    ticket.unassign(assignees);

    const updatedTicket = await this.ticketsRepository.update(ticket, user);
    this.ticketRedactionService.prepareTicketResponse(ticket, user);

    return updatedTicket;
  }
}
