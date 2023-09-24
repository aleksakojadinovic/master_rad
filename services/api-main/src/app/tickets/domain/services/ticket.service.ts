import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from '../../api/dto/create-ticket.dto';
import { UpdateTicketDto } from '../../api/dto/update-ticket.dto';
import { UsersService } from 'src/app/users/domain/users.service';
import * as moment from 'moment';
import { TicketQueryDTO } from '../../api/dto/ticket-query.dto';
import { BaseService } from 'src/codebase/BaseService';
import { TicketNotFoundError } from '../errors/TicketNotFound';
import { CannotAssignCustomerError } from '../errors/CannotAssignCustomer';
import { TicketTagService } from '../../../ticket-tag-system/domain/services/ticket-tag.service';
import { AssigneeNotFoundError } from '../errors/AssigneeNotFound';
import { DuplicateAssigneeError } from '../errors/DuplicateAssignee';
import { TooSoonToCreateAnotherTicketError } from '../errors/TooSoonToCreateAnotherTicket';
import { NotificationFactory } from '../../../notifications/domain/factory/notification.factory';
import { NotificationsService } from '../../../notifications/domain/notifications.service';
import { TICKET_STATUS_GRAPH } from '../value-objects/ticket-status.map';
import { NotAllowedToChangeToThisStatusError } from '../errors/NotAllowedToChangeToThisStatus';
import { TicketsRepository } from '../../infrastructure/tickets.repository';
import { BadTicketFiltersError } from '../errors/BadTicketFilters';
import { User } from '../../../users/domain/entities/user.entity';
import { Ticket } from '../entities/ticket.entity';
import { TicketStatus } from '../value-objects/ticket-status';
import { Notification } from 'src/app/notifications/domain/entities/notification.entity';
import { TicketRedactionService } from './ticket-redacation.service';

@Injectable()
export class TicketService extends BaseService {
  constructor(
    private ticketRedactionService: TicketRedactionService,
    private ticketTagService: TicketTagService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private ticketsRepository: TicketsRepository,
  ) {
    super();
  }

  async create(user: User, dto: CreateTicketDto) {
    const mostRecentTicket =
      await this.ticketsRepository.findMostRecentTicketByUserId(
        user.id.toString(),
      );
    if (mostRecentTicket) {
      const createdAt = moment(mostRecentTicket.createdAt);
      const now = moment();

      const diffMinutes = now.diff(createdAt, 'minutes');

      if (diffMinutes <= 10) {
        throw new TooSoonToCreateAnotherTicketError(
          diffMinutes,
          10 - diffMinutes,
        );
      }
    }

    const ticket = new Ticket();
    ticket.title = dto.title;
    ticket.body = dto.body;
    ticket.status = TicketStatus.NEW;
    ticket.createdBy = user;
    ticket.createdAt = new Date();

    const savedTicket = await this.ticketsRepository.create(ticket);

    return savedTicket;
  }

  async findAll(user: User, queryDTO: TicketQueryDTO) {
    if (queryDTO.assignee !== null && queryDTO.unassigned !== null) {
      throw new BadTicketFiltersError(
        'Cannot query both unassigned and assigned tickets.',
      );
    }

    const {
      page,
      perPage,
      statuses,
      notStatuses,
      assignee,
      createdBy,
      unassigned,
      sortOrder,
      sortField,
    } = queryDTO;

    const tickets = await this.ticketsRepository.findAll({
      page,
      perPage,
      statuses,
      notStatuses,
      assignee,
      createdBy,
      unassigned,
      sortOrder,
      sortField,
    });
    tickets.forEach((ticket) =>
      this.ticketRedactionService.prepareTicketResponse(ticket, user),
    );
    return tickets;
  }

  async findOne(id: string, user: User) {
    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    if (user.isCustomer() && !ticket.isOwner(user)) {
      throw new TicketNotFoundError(id);
    }

    this.ticketRedactionService.prepareTicketResponse(ticket, user);

    return ticket;
  }

  async update(id: string, user: User, dto: UpdateTicketDto) {
    const isCustomer = user.isCustomer();

    const ticket = await this.ticketsRepository.findById(id);

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    if (isCustomer && !ticket.isOwner(user)) {
      throw new TicketNotFoundError(id);
    }

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const notifications: Notification[] = [];

    this.updateTicketStatus(ticket, user, dto);
    this.updateTicketBody(ticket, dto);
    this.updateTicketTitle(ticket, dto);

    const addAssigneeNotifications = await this.updateTicketAddAssignees(
      ticket,
      user,
      dto,
    );

    this.updateTicketRemoveAssignees(ticket, dto);

    if (addAssigneeNotifications) {
      notifications.push(...addAssigneeNotifications);
    }

    const updatedTicket = await this.ticketsRepository.update(ticket, user);
    await this.notificationsService.emitNotifications(...notifications);

    this.ticketRedactionService.prepareTicketResponse(updatedTicket, user);
    return updatedTicket;
  }

  private updateTicketStatus(ticket: Ticket, user: User, dto: UpdateTicketDto) {
    if (!dto.status) {
      return;
    }

    const currentStatus = ticket.status;
    const targetStatus = dto.status;

    const canChange = TICKET_STATUS_GRAPH[currentStatus].find(
      (entry) =>
        entry.status === targetStatus && entry.roles.includes(user.role),
    );

    if (!canChange) {
      throw new NotAllowedToChangeToThisStatusError(
        currentStatus.toString(),
        targetStatus.toString(),
      );
    }

    ticket.status = targetStatus;
  }

  private updateTicketBody(ticket: Ticket, dto: UpdateTicketDto) {
    if (dto.body != null) {
      ticket.body = dto.body;
    }
  }

  private updateTicketTitle(ticket: Ticket, dto: UpdateTicketDto) {
    if (dto.title != null) {
      ticket.title = dto.title;
    }
  }

  private async updateTicketAddAssignees(
    ticket: Ticket,
    user: User,
    dto: UpdateTicketDto,
  ): Promise<Notification[] | null> {
    if (dto.addAssignees == null || dto.addAssignees.length == 0) {
      return null;
    }
    const assignees: User[] = [];
    for (const assigneeId of dto.addAssignees) {
      const assigneeUser = await this.usersService.findOne(assigneeId);
      if (!assigneeUser) {
        throw new AssigneeNotFoundError();
      }
      if (assigneeUser.isCustomer()) {
        throw new CannotAssignCustomerError(assigneeId);
      }
      if (ticket.assignees.map((user) => user.id).includes(assigneeId)) {
        throw new DuplicateAssigneeError(assigneeId);
      }
      assignees.push(assigneeUser);
    }

    for (const a of assignees) {
      ticket.assignees.push(a);
    }

    const usersToNotify = assignees.filter(
      (assignee) => assignee.id !== user.id,
    );

    if (usersToNotify.length == 0) {
      return null;
    }

    const notifications = usersToNotify.map((userToNotify) =>
      NotificationFactory.create((builder) =>
        builder
          .forUser(userToNotify)
          .hasPayload('assigned', (assignBuilder) =>
            assignBuilder.atTicket(ticket).byUser(user),
          ),
      ),
    );

    return notifications;
  }

  private async updateTicketRemoveAssignees(
    ticket: Ticket,
    dto: UpdateTicketDto,
  ) {
    if (dto.removeAssignees && dto.removeAssignees.length > 0) {
      ticket.assignees = ticket.assignees.filter(
        (user) => !dto.removeAssignees.includes(user.id),
      );
    }
  }
}
