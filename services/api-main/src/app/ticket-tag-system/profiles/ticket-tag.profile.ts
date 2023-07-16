import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TicketTag } from '../schema/ticket-tag.schema';
import {
  TicketTagDTO,
  TicketTagTicketTagGroupDTO,
} from '../dto/ticket-tag.dto';
import { Types } from 'mongoose';
import { TicketTagGroup } from '../schema/ticket-tag-group.schema';
import { TicketTagGroupDTO } from '../dto/ticket-tag-group.dto';

@Injectable()
export class TicketTagProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TicketTag,
        TicketTagDTO,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id),
        ),
        forMember(
          (destination) => destination.name,
          mapWithArguments(
            (source, extraArgs) =>
              source.nameIntl[extraArgs['languageCode'] as string],
          ),
        ),
        forMember(
          (destination) => destination.description,
          mapWithArguments(
            (source, extraArgs) =>
              source.descriptionIntl[extraArgs['languageCode'] as string],
          ),
        ),
        forMember(
          (destination) => destination.nameIntl,
          mapFrom((source) => source.nameIntl),
        ),
        forMember(
          (destination) => destination.descriptionIntl,
          mapFrom((source) => source.descriptionIntl),
        ),
        forMember(
          (destination) => destination.group,
          mapWithArguments((source, extra) => {
            if (source.group instanceof Types.ObjectId) {
              return new TicketTagTicketTagGroupDTO(
                source.group.toString(),
                '',
                '',
              );
            }

            return mapper.map(source.group, TicketTagGroup, TicketTagGroupDTO, {
              extraArgs: () => ({ languageCode: extra['languageCode'] }),
            });
          }),
        ),
      );
    };
  }
}
