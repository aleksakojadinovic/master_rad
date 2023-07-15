import React, { useMemo } from 'react';
import TagPicker from '../TagPicker/TagPicker';
import {
  useGetTicketTagGroupsQuery,
  useGetTicketTagsQuery,
} from '@/api/ticket-tag-system';
import { Box, Typography } from '@mui/material';
import TagChip from '../TagChip/TagChip';

function TagForm({ ticketTags, onSelect }) {
  // We fetch them here and not SSR because they're not SSR-relevant
  const { data: tags } = useGetTicketTagsQuery();
  const { data: tagGroups } = useGetTicketTagGroupsQuery();

  const groupedTicketTags = useMemo(() => {
    if (!tags || !tagGroups) {
      return [];
    }

    return ticketTags.reduce((acc, curr) => {
      if (!acc[curr.group.id]) {
        acc[curr.group.id] = {
          groupId: curr.group.id,
          groupName: tagGroups.find((g) => g.id === curr.group.id).name,
          groupDescription: curr.group.description,
          tags: [curr],
        };
        return acc;
      }
      acc[curr.group.id].tags.push(curr);
      return acc;
    }, {});
  }, [tags, ticketTags, tagGroups]);

  const groupIds = Array.from(Object.keys(groupedTicketTags));

  const resolvedTags = useMemo(() => {
    if (!tags || !tagGroups) {
      return [];
    }

    return tags.map((tag) => {
      return {
        ...tag,
        groupName: tagGroups.find((g) => g.id === tag.group.id).name,
      };
    });
  }, [tags, tagGroups]);

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center">
      {groupIds.map((groupId) => (
        <Box
          key={groupId}
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          border="1px solid black"
          padding="12px"
          marginRight="12px"
        >
          <Box>
            <Box display="flex" width="100%" justifyContent="center">
              <Typography>
                <small>{groupedTicketTags[groupId].groupName}</small>
              </Typography>
            </Box>

            <Box display="flex" flexWrap="wrap">
              {groupedTicketTags[groupId].tags.map((tag) => (
                <Box key={tag.id} marginRight="6px">
                  <TagChip tag={tag} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
      {/* {groupedTicketTags.map((tag) => (
        <Box key={tag.id} marginRight="8px">
          <TagChip tag={tag} />
        </Box>
      ))} */}
      <TagPicker tags={resolvedTags} onSelect={onSelect} />
    </Box>
  );
}

export default TagForm;
