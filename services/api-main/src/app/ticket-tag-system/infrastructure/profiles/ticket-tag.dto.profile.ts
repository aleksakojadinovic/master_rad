import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  Mapper,
  createMap,
  forMember,
  mapFrom,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TicketTagDTO } from '../../api/dto/ticket-tag.dto';
import { TicketTagGroupDTO } from '../../api/dto/ticket-tag-group.dto';
import { TicketTag } from '../../domain/entities/ticket-tag.entity';
import { TicketTagGroup } from '../../domain/entities/ticket-tag-group.entity';

@Injectable()
export class TicketTagDTOProfile extends AutomapperProfile {
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
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.name,
          mapWithArguments((source, extra) => {
            return source.nameIntl[extra['languageCode'] as string];
          }),
        ),
        forMember(
          (destination) => destination.description,
          mapWithArguments(
            (source, extra) =>
              source.descriptionIntl[extra['languageCode'] as string],
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
            const includeArray = extra.include
              ? (extra.include as string[])
              : [];

            if (includeArray.includes('group')) {
              return mapper.map(
                source.group,
                TicketTagGroup,
                TicketTagGroupDTO,
                {
                  extraArgs: () => ({
                    ...extra,
                    include: includeArray.filter((key) => key !== 'tags'),
                  }),
                },
              );
            }
            return source.group.id;
          }),
        ),
      );
    };
  }
}
