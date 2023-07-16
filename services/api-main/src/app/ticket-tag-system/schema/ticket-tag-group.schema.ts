import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/app/users/schema/role.schema';
import { TicketTag } from './ticket-tag.schema';
import { IntlValue } from 'src/codebase/types/IntlValue';

// TODO: Should this be on the tag level?
export class TicketTagGroupPermissions {
  constructor(
    public canAddRoles: Role[],
    public canRemoveRoles: Role[],
    public canSeeRoles: Role[],
  ) {}
}

@Schema()
export class TicketTagGroup {
  _id: string;

  // Whether or not adding multiple tags is allowed in this group
  // I do not plan on supporting more granular permissions, as in some combinations
  // being possible and some not, as it seems like overkill
  @Prop()
  exclusive: boolean;

  @Prop({
    type: {
      canAddRoles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
      },
      canRemoveRoles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
      },
      canSeeRoles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
      },
    },
  })
  permissions: TicketTagGroupPermissions;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTag' }] })
  tags: TicketTag[];

  @Prop({ type: Object })
  nameIntl: IntlValue;

  @Prop({ type: Object })
  descriptionIntl: IntlValue;
}

export const TicketTagGroupSchema =
  SchemaFactory.createForClass(TicketTagGroup);
