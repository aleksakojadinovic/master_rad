import { RolesService } from '../users/roles.service';
import { CreateTicketTagGroupDTO } from './dto/create-ticket-tag-group.dto';
import { Injectable } from '@nestjs/common';
import {
  TicketTagGroup,
  TicketTagGroupPermissions,
} from './schema/ticket-tag-group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

@Injectable()
export class TicketTagGroupService extends BaseService {
  constructor(
    @InjectModel(TicketTagGroup.name)
    private ticketTagGroupModel: Model<TicketTagGroup>,
    @InjectMapper() private readonly mapper: Mapper,
    private rolesService: RolesService,
    private ticketTagService: TicketTagService,
  ) {
    super();
  }

  override constructPopulate(queryDTO: EntityQueryDTO): any[] {
    const populations = [];
    queryDTO.includes.forEach((includeField) => {
      if (includeField === 'role') {
        populations.push({
          path: 'permissions.canAddRoles',
          model: 'Role',
        });
        populations.push({
          path: 'permissions.canRemoveRoles',
          model: 'Role',
        });
      }
      if (includeField === 'tags') {
        populations.push({
          path: 'tags',
          model: 'TicketTag',
        });
      }
    });
    return populations;
  }

  async create(dto: CreateTicketTagGroupDTO) {
    const intlKeys = Object.keys(dto.nameIntl);
    const nameClashCondition = intlKeys.map((key) => ({
      [`nameIntl.${key}`]: dto.nameIntl[key],
    }));

    const duplicate = await this.ticketTagGroupModel.findOne({
      $or: nameClashCondition,
    });

    if (duplicate) {
      throw new TicketTagGroupDuplicateNameError();
    }

    const ticketTagGroupObject = new TicketTagGroup();

    // TODO prevent name duplicates (should also be done on update, but too lazy now)
    ticketTagGroupObject.nameIntl = dto.nameIntl;
    ticketTagGroupObject.descriptionIntl = dto.descriptionIntl;
    ticketTagGroupObject.permissions = new TicketTagGroupPermissions([], []);
    ticketTagGroupObject.tags = [];

    const model = new this.ticketTagGroupModel(ticketTagGroupObject);
    await model.save();

    return model;
  }

  // async addTagsToGroup(id: string, tags: CreateTicketTagDto[]) {
  //   const group = await this.ticketTagGroupModel
  //     .findById(id)
  //     .populate({ path: 'tags', model: 'TicketTag' });

  //   if (!group) {
  //     throw new TicketTagGroupNotFoundError();
  //   }

  //   // TODO: Prevent duplicates

  //   // const currentTagIntlKeys = group.tags.map(({ nameIntlKey }) => nameIntlKey);
  //   // const requestedTagIntlKeys = tags.map(({ name }) => name);
  //   // if (
  //   //   currentTagIntlKeys.some((name) => requestedTagIntlKeys.includes(name))
  //   // ) {
  //   //   throw new TicketTagNameAlreadyExistsError();
  //   // }

  //   const tagModels = await Promise.all(
  //     tags.map(async (tag) => {
  //       const model = this.ticketTagService.create(
  //         new CreateTicketTagDto(tag.nameIntl, tag.descriptionIntl, id),
  //       );
  //       return model;
  //     }),
  //   );

  //   tagModels.forEach((model) => group.tags.push(model));

  //   await group.save();
  //   return group;
  // }

  async findAll(queryDTO: EntityQueryDTO) {
    const query = this.ticketTagGroupModel.find({});
    const populations = this.constructPopulate(queryDTO);
    populations.forEach((p) => query.populate(p));
    const groups = await query.exec();
    return groups;
  }

  public async findOne(id: string, queryDTO: EntityQueryDTO) {
    const query = this.ticketTagGroupModel.findOne({ _id: id });
    const populations = this.constructPopulate(queryDTO);

    populations.forEach((p) => query.populate(p));
    const group = await query.exec();
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
      // TODO handle roles not exists
      const newCanAddRoles = await Promise.all(
        newPermissionsValue.canAddRoles.map((roleId) =>
          this.rolesService.findById(roleId),
        ),
      );
      document.permissions.canAddRoles = newCanAddRoles;
    }

    if (newPermissionsValue.canRemoveRoles !== null) {
      const newCanRemoveRoles = await Promise.all(
        newPermissionsValue.canRemoveRoles.map((roleId) =>
          this.rolesService.findById(roleId),
        ),
      );
      document.permissions.canRemoveRoles = newCanRemoveRoles;
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
    const group = await this.findOne(
      id,
      new EntityQueryDTO('', ['tags', 'role'], '', 0, null),
    );

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
