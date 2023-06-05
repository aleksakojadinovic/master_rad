import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/app/users/schema/role.schema';

// TODO: Should this be on the tag level?
export class TicketTagGroupPermissions {
  constructor(
    public canCreatorAdd: boolean,
    public canCreatorDelete: boolean,
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
  @Prop()
  exclusive: boolean;

  @Prop({
    type: {
      canCreatorAdd: Boolean,
      canCreatorDelete: Boolean,
      canAddRoles: { type: [{ type: mongoose.Schema.Types.ObjectId }] },
      canRemoveRoles: { type: [{ type: mongoose.Schema.Types.ObjectId }] },
    },
  })
  permissions: TicketTagGroupPermissions;
}

export const TicketTagGroupSchema =
  SchemaFactory.createForClass(TicketTagGroup);
