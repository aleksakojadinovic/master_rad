import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/app/users/domain/value-objects/role';
import { TicketTagDb } from './ticket-tag.schema';
import { IntlValue } from 'src/codebase/types/IntlValue';

export class TicketTagGroupPermissions {
  constructor(
    public canAddRoles: Role[],
    public canRemoveRoles: Role[],
    public canSeeRoles: Role[],
  ) {}
}

@Schema()
export class TicketTagGroupDb {
  _id: string;

  @Prop({
    type: {
      canAddRoles: {
        type: [String],
      },
      canRemoveRoles: {
        type: [String],
      },
      canSeeRoles: {
        type: [String],
      },
    },
  })
  permissions: TicketTagGroupPermissions;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketTag' }] })
  tags: TicketTagDb[];

  @Prop({ type: Object })
  nameIntl: IntlValue;

  @Prop({ type: Object })
  descriptionIntl: IntlValue;
}

export const TicketTagGroupSchema =
  SchemaFactory.createForClass(TicketTagGroupDb);

export type TicketTagGroupDocument = TicketTagGroupDb & Document;
