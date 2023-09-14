import Comment from '@/features/ticket-view/components/changes/atoms/Comment/Comment';
import StatusChange from '@/features/ticket-view/components/changes/atoms/StatusChange';
import { TicketHistoryEntryType } from '@/enums/tickets';
import { Box, Card, CardContent } from '@mui/material';
import React, { useMemo } from 'react';
import { TICKET_HISTORY_ENTRY_TYPE } from '../constants';
import TicketChange from '../components/changes/TicketChange';

function TicketTimelineSection({ ticket }) {
  const timelineItems = useMemo(() => {
    const allItems = [
      ...ticket.comments.map((item) => ({
        ...item,
        type: TICKET_HISTORY_ENTRY_TYPE.COMMENT_ADDED,
      })),
      ...ticket.statusChanges.map((item) => ({
        ...item,
        type: TICKET_HISTORY_ENTRY_TYPE.STATUS_CHANGED,
      })),
      ...ticket.assigneeChanges.map((item) => ({
        ...item,
        type: TICKET_HISTORY_ENTRY_TYPE.ASSIGNEES_CHANGED,
      })),
    ];
    allItems.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return allItems;
  }, [ticket]);

  return timelineItems.map((item, index) => (
    <Box key={index} marginTop="12px">
      <TicketChange item={item} />
    </Box>
  ));
  // const wrap = (content, index) => (
  //   <Box key={index} marginTop="12px">
  //     {content}
  //   </Box>
  // );

  // let previousStatus = null;

  // return ticket.history.map((item, index) => {
  //   switch (item.type) {
  //     case TicketHistoryEntryType.COMMENT_ADDED:
  //       return wrap(
  //         <Comment
  //           comment={{
  //             ...item.payload,
  //             user: item.user,
  //             timestamp: item.timestamp,
  //           }}
  //         />,
  //         index,
  //       );

  //     case TicketHistoryEntryType.STATUS_CHANGED: {
  //       const status = item.payload.status;
  //       const prevStatus = previousStatus;
  //       previousStatus = status;
  //       return wrap(
  //         <Box
  //           display="flex"
  //           justifyContent="center"
  //           marginTop="20px"
  //           marginBottom="20px"
  //         >
  //           <Card>
  //             <CardContent>
  //               <StatusChange
  //                 statusChange={{
  //                   user: item.user,
  //                   timestamp: item.timestamp,
  //                   statusFrom: prevStatus,
  //                   statusTo: status,
  //                 }}
  //               />
  //             </CardContent>
  //           </Card>
  //         </Box>,
  //         index,
  //       );
  //     }
  //   }
  // });
}

export default TicketTimelineSection;
