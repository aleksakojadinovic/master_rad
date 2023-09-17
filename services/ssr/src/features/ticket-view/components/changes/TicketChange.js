import React from 'react';
import { TICKET_HISTORY_ENTRY_TYPE } from '../../constants';
import AssigneeChange from './atoms/AssigneeChange';
import StatusChange from './atoms/StatusChange';
import Comment from './atoms/Comment/Comment';

const TicketChange = ({ item, ticket }) => {
  switch (item.type) {
    case TICKET_HISTORY_ENTRY_TYPE.ASSIGNEES_CHANGED:
      return <AssigneeChange item={item} ticket={ticket} />;
    case TICKET_HISTORY_ENTRY_TYPE.STATUS_CHANGED:
      return <StatusChange item={item} ticket={ticket} />;
    case TICKET_HISTORY_ENTRY_TYPE.COMMENT_ADDED:
      return <Comment item={item} ticket={ticket} />;
    default:
      return null;
  }
};

export default TicketChange;
