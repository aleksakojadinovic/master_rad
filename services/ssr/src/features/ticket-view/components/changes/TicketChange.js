import React from 'react';
import { TICKET_HISTORY_ENTRY_TYPE } from '../../constants';
import AssigneeChange from './atoms/AssigneeChange';
import StatusChange from './atoms/StatusChange';

const TicketChange = ({ item }) => {
  switch (item.type) {
    case TICKET_HISTORY_ENTRY_TYPE.ASSIGNEES_CHANGED:
      return <AssigneeChange item={item} />;
    case TICKET_HISTORY_ENTRY_TYPE.STATUS_CHANGED:
      return <StatusChange item={item} />;
  }
};

export default TicketChange;
