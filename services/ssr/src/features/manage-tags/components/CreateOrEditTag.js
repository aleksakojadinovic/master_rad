import React, { useState } from 'react';
import TicketTagGroupAdmin from './TicketTagGroupAdmin';

function CreateOrEditTagGroups({ tag, isCreate }) {
  const [tagGroupInput] = useState(() =>
    isCreate
      ? {
          name: '',
          description: '',
          tags: [],
          permissions: {
            canAddRoles: [],
            canRemoveRoles: [],
            canCreatorAdd: false,
            canCreatorRemove: false,
          },
        }
      : { ...tag },
  );
  return <TicketTagGroupAdmin group={tagGroupInput} />;
}

export default CreateOrEditTagGroups;
