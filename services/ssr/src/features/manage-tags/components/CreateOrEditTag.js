import React, { useState } from 'react';
import TicketTagGroupAdmin from './TicketTagGroupAdmin';

function CreateOrEditTagGroups({ tag, isCreate }) {
  const [tagGroupInput] = useState(() =>
    isCreate
      ? {
          nameIntl: { en: '', sr: '' },
          descriptionIntl: { en: '', sr: '' },
          tags: [],
          permissions: {
            canAddRoles: [],
            canRemoveRoles: [],
          },
        }
      : { ...tag },
  );
  return <TicketTagGroupAdmin group={tagGroupInput} isCreate />;
}

export default CreateOrEditTagGroups;
