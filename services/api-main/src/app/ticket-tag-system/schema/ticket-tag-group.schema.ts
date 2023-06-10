import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/app/users/schema/role.schema';
import { TicketTag } from './ticket-tag.schema';

// TODO: Should this be on the tag level?
export class TicketTagGroupPermissions {
  constructor(
    public canCreatorAdd: boolean,
    public canCreatorRemove: boolean,
    public canAddRoles: Role[],
    public canRemoveRoles: Role[],
  ) {}
}

@Schema()
export class TicketTagGroup {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  // Whether or not adding multiple tags is allowed in this group
  // I do not plan on supporting more granular permissions, as in some combinations
  // being possible and some not, as it seems like overkill
  @Prop()
  exclusive: boolean;

  @Prop({
    type: {
      canCreatorAdd: Boolean,
      canCreatorRemove: Boolean,
      canAddRoles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
      },
      canRemoveRoles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
      },
    },
  })
  permissions: TicketTagGroupPermissions;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTag' }] })
  tags: TicketTag[];
}

export const TicketTagGroupSchema =
  SchemaFactory.createForClass(TicketTagGroup);
