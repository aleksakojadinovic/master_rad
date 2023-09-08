import { ROLE_VALUES } from '../../../users/domain/value-objects/role';
import { TicketTagGroupRepository } from '../../infrastructure/repositories/ticket-tag-group.repository';
import { CreateTicketTagGroupDTO } from '../../api/dto/create-ticket-tag-group.dto';
import { Injectable } from '@nestjs/common';
import { TicketTagGroupNotFoundError } from '../errors/TicketTagGroupNotFound';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { BaseService } from 'src/codebase/BaseService';
import { TicketTagService } from './ticket-tag.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  CreateOrUpdateTicketTagGroupDTO,
  UpdateTicketTagGroupPermissionsDTO,
  UpdateTicketTagGroupTagsDTO,
} from '../../api/dto/update-ticket-tag-group.dto';
import * as _ from 'lodash';
import { IntlValue } from 'src/codebase/types/IntlValue';
import { TicketTagDuplicateNameError } from '../errors/TicketTagDuplicateName';
import { TicketTagNotFoundError } from '../errors/TicketTagNotFound';
import { TicketTagGroupDuplicateNameError } from '../errors/TicketTagGroupDuplicateNameError';
import { Role } from '../../../users/domain/value-objects/role';
import { User } from 'src/app/users/domain/entities/user.entity';
import { TicketTagGroup } from '../entities/ticket-tag-group.entity';
import {
  CAN_ADD,
  CAN_REMOVE,
  CAN_SEE,
} from '../value-objects/ticket-tag-group-permissions';

@Injectable()
export class TicketTagGroupService extends BaseService {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    private ticketTagService: TicketTagService,
    private ticketTagGroupRepository: TicketTagGroupRepository,
  ) {
    super();
  }

  async create(dto: CreateTicketTagGroupDTO) {
    const isDuplicate = await this.ticketTagGroupRepository.doesAlreadyExist(
      dto.nameIntl,
    );

    if (isDuplicate) {
      throw new TicketTagGroupDuplicateNameError();
    }

    const defaultRoles = [Role.ADMINISTRATOR];

    const group = await this.ticketTagGroupRepository.create({
      nameIntl: dto.nameIntl,
      descriptionIntl: dto.descriptionIntl,
      roles: defaultRoles,
    });

    return group;
  }

  async findAll(queryDTO: EntityQueryDTO, user: User) {
    const groups = await this.ticketTagGroupRepository.findAllByRoles([
      user.role,
    ]);
    return groups;
  }

  public async findOne(id: string) {
    const group = await this.ticketTagGroupRepository.findOne(id);

    if (!group) {
      throw new TicketTagGroupNotFoundError();
    }
    return group;
  }

  private preventIntlNameDuplicates(
    currentIntlValues: IntlValue,
    newIntlValues: IntlValue,
  ) {
    const intlKeys = Object.keys(currentIntlValues);
    for (const intlKey of intlKeys) {
      if (currentIntlValues[intlKey] === newIntlValues[intlKey]) {
        throw new TicketTagDuplicateNameError();
      }
    }
  }

  private updateIntlValue(
    group: TicketTagGroup,
    newIntlValue: IntlValue | null,
    isName: boolean,
  ) {
    if (newIntlValue === null) {
      return;
    }

    const originalValue = isName ? group.nameIntl : group.descriptionIntl;

    if (_.isEqual(originalValue, newIntlValue)) {
      return;
    }

    if (isName) {
      group.nameIntl = newIntlValue;
    } else {
      group.descriptionIntl = newIntlValue;
    }
  }

  private async updatePermissions(
    group: TicketTagGroup,
    newPermissionsValue: UpdateTicketTagGroupPermissionsDTO | null,
  ) {
    if (newPermissionsValue === null) {
      return;
    }

    if (newPermissionsValue.canAddRoles !== null) {
      const roles = newPermissionsValue.canAddRoles
        .map((r) => ROLE_VALUES[r] ?? null)
        .filter((r) => r !== null);

      group.permissions[CAN_ADD] = roles;
    }

    if (newPermissionsValue.canRemoveRoles !== null) {
      const roles = newPermissionsValue.canRemoveRoles
        .map((r) => ROLE_VALUES[r] ?? null)
        .filter((r) => r !== null);

      group.permissions[CAN_REMOVE] = roles;
    }

    if (newPermissionsValue.canSeeRoles !== null) {
      const roles = newPermissionsValue.canSeeRoles
        .map((r) => ROLE_VALUES[r] ?? null)
        .filter((r) => r !== null);

      group.permissions[CAN_SEE] = roles;
    }
  }

  private async updateTags(
    group: TicketTagGroup,
    dto: UpdateTicketTagGroupTagsDTO | null,
  ) {
    if (dto === null) {
      return;
    }

    if (dto.removeIds !== null) {
      group.tags = group.tags.filter((tag) => !dto.removeIds.includes(tag.id));
    }

    const addDTOs = dto.addOrUpdateTags.filter((dto) => dto.id == null);
    const updateDTOs = dto.addOrUpdateTags.filter((dto) => dto.id != null);

    for (const updateDTO of updateDTOs) {
      if (!group.tags.map(({ id }) => id).includes(updateDTO.id)) {
        throw new TicketTagNotFoundError();
      }
    }

    for (const addDTO of addDTOs) {
      const tag = await this.ticketTagService.create(addDTO, group.id);
      group.tags.push(tag);
    }

    for (const updateDTO of updateDTOs) {
      const tag = await this.ticketTagService.update(updateDTO);
      const index = group.tags.findIndex(({ id }) => id === tag.id);
      group.tags[index] = tag;
    }
  }

  async update(id: string, dto: CreateOrUpdateTicketTagGroupDTO) {
    const group = await this.findOne(id);

    if (!group) {
      throw new TicketTagGroupNotFoundError();
    }

    this.updateIntlValue(group, dto.nameIntl, true);
    this.updateIntlValue(group, dto.descriptionIntl, false);
    await this.updatePermissions(group, dto.permissions);
    await this.updateTags(group, dto.tags);

    const updatedGroup = await this.ticketTagGroupRepository.update(group);

    return updatedGroup;
  }
}
