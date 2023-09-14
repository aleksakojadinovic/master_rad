import Comment from '@/components/Comment/Comment';
import StatusChange from '@/features/ticket-view/components/StatusChange';
import { TicketHistoryEntryType } from '@/enums/tickets';
import { Box, Card, CardContent } from '@mui/material';
import React from 'react';

const resolveTicketTimeline = (ticket) => {
  console.log({ ticket });
};

function TicketTimelineSection({ ticket }) {
  return null;
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
