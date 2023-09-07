import { ROLE_VALUES } from '../users/domain/value-objects/role';
import { TicketTagGroupRepository } from './ticket-tag-group.repository';
import { CreateTicketTagGroupDTO } from './dto/create-ticket-tag-group.dto';
import { Injectable } from '@nestjs/common';
import { TicketTagGroup } from './schema/ticket-tag-group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { TicketTagGroupNotFoundError } from './errors/TicketTagGroupNotFound';
import { EntityQueryDTO } from 'src/codebase/dto/EntityQueryDTO';
import { BaseService } from 'src/codebase/BaseService';
import { TicketTagService } from './ticket-tag.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  CreateOrUpdateTicketTagGroupDTO,
  UpdateTicketTagGroupPermissionsDTO,
  UpdateTicketTagGroupTagsDTO,
} from './dto/update-ticket-tag-group.dto';
import * as _ from 'lodash';
import { IntlValue } from 'src/codebase/types/IntlValue';
import { CannotRemoveAndAddOrUpdateTicketTagError } from './errors/CannotRemoveAndAddOrUpdateTicketTag';
import { TicketTagDuplicateNameError } from './errors/TicketTagDuplicateName';
import { TicketTagNotFoundError } from './errors/TicketTagNotFound';
import { TicketTagGroupDuplicateNameError } from './errors/TicketTagGroupDuplicateNameError';
import { User } from '../users/infrastructure/schema/user.schema';
import { Role } from '../users/domain/value-objects/role';

@Injectable()
export class TicketTagGroupService extends BaseService {
  constructor(
    @InjectModel(TicketTagGroup.name)
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
    document: TicketTagGroup,
    newIntlValue: IntlValue | null,
    isName: boolean,
  ) {
    if (newIntlValue === null) {
      return;
    }

    const originalValue = isName ? document.nameIntl : document.descriptionIntl;

    if (_.isEqual(originalValue, newIntlValue)) {
      return;
    }

    // ? Should we allow for omitted locale values or assume they're always sent? Check for best practices

    if (isName) {
      document.nameIntl = newIntlValue;
    } else {
      document.descriptionIntl = newIntlValue;
    }
  }

  private async updatePermissions(
    document: TicketTagGroup,
    newPermissionsValue: UpdateTicketTagGroupPermissionsDTO | null,
  ) {
    if (newPermissionsValue === null) {
      return;
    }

    if (newPermissionsValue.canAddRoles !== null) {
      const roles = newPermissionsValue.canAddRoles
        .map((r) => ROLE_VALUES[r] ?? null)
        .filter((r) => r !== null);

      document.permissions.canAddRoles = roles;
    }

    if (newPermissionsValue.canRemoveRoles !== null) {
      const roles = newPermissionsValue.canRemoveRoles
        .map((r) => ROLE_VALUES[r] ?? null)
        .filter((r) => r !== null);

      document.permissions.canRemoveRoles = roles;
    }

    if (newPermissionsValue.canSeeRoles !== null) {
      const roles = newPermissionsValue.canSeeRoles
        .map((r) => ROLE_VALUES[r] ?? null)
        .filter((r) => r !== null);

      document.permissions.canSeeRoles = roles;
    }
  }

  // So this can either add or remove tags, the question is what the hell I'm sending
  private async updateTags(
    document: TicketTagGroup,
    dto: UpdateTicketTagGroupTagsDTO | null,
  ) {
    if (dto === null) {
      return;
    }

    // Whatever is in add or update cannot be in remove, because it makes no sense
    if (dto.removeIds !== null && dto.addOrUpdateTags !== null) {
      if (
        dto.removeIds.some((removeId) =>
          dto.addOrUpdateTags.some(
            (addOrUpdateDTO) =>
              addOrUpdateDTO.id && addOrUpdateDTO.id === removeId,
          ),
        )
      ) {
        throw new CannotRemoveAndAddOrUpdateTicketTagError();
      }
    }

    // Remove the ones that are requested for removal
    // Should we delete them from the database?
    // TODO: Untag all tagged tickets from ticket service, leaving for later
    // TODO: API doesn't care but frontend should warn about this
    if (dto.removeIds !== null) {
      document.tags = document.tags.filter(
        (tag) => !dto.removeIds.includes(tag._id.toString()),
      );
    }

    if (dto.addOrUpdateTags === null) {
      return;
    }

    const addDTOs = dto.addOrUpdateTags.filter((dto) => dto.id == null);
    const updateDTOs = dto.addOrUpdateTags.filter((dto) => dto.id != null);

    // const addOrUpdateNameIntls = dto.addOrUpdateTags.map(
    //   ({ nameIntl }) => nameIntl,
    // );

    // const existingNameIntls = document.tags.map(({ nameIntl }) => nameIntl);

    //   for (const addOrUpdate of dto.addOrUpdateTags) {
    //     for (const existingTag of document.tags) {

    //     }
    //   }

    // for (const addOrUpdateNameIntl of addOrUpdateNameIntls) {
    //   for (const existingNameIntl of existingNameIntls) {
    //     this.preventIntlNameDuplicates(addOrUpdateNameIntl, existingNameIntl);
    //   }
    // }

    for (const updateDTO of updateDTOs) {
      if (
        !document.tags.map(({ _id }) => _id.toString()).includes(updateDTO.id)
      ) {
        throw new TicketTagNotFoundError();
      }
    }

    for (const addDTO of addDTOs) {
      const tag = await this.ticketTagService.create(addDTO, document._id);
      document.tags.push(tag);
    }

    for (const updateDTO of updateDTOs) {
      const tag = await this.ticketTagService.update(updateDTO);
      const index = document.tags.findIndex(({ _id }) => _id === tag._id);
      document.tags[index] = tag;
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

    await group.save();

    return group;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketTag`;
  }
}
