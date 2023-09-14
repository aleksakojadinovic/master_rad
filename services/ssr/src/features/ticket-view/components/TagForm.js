import React, { useMemo } from 'react';
import TagPicker from '../../../components/TagPicker/TagPicker';
import { useGetTicketTagsQuery } from '@/api/ticket-tag-system';
import { Box, Typography } from '@mui/material';
import TagChip from '../../../components/TagChip/TagChip';
import useUser from '@/hooks/useUser';

function TagForm({ ticketTags, onSelect, onDelete }) {
  const { role } = useUser();

  const { data: tags } = useGetTicketTagsQuery({ includes: 'group' });

  const groupedTicketTags = useMemo(() => {
    if (!tags) {
      return [];
    }

    return ticketTags.reduce((acc, curr) => {
      const canDelete = curr.group.permissions.canRemove.includes(role);

      if (!acc[curr.group.id]) {
        acc[curr.group.id] = {
          groupId: curr.group.id,
          groupName: curr.group.name,
          groupDescription: curr.group.description,
          tags: [{ ...curr, canDelete }],
        };
        return acc;
      }
      acc[curr.group.id].tags.push({ ...curr, canDelete });
      return acc;
    }, {});
  }, [tags, ticketTags, role]);

  const groupIds = Array.from(Object.keys(groupedTicketTags));

  const resolvedTags = useMemo(() => {
    if (!tags || !ticketTags) {
      return [];
    }

    return tags
      .filter((tag) => {
        return tag.group.permissions.canAdd.includes(role);
      })
      .filter((tag) => !ticketTags.map(({ id }) => id).includes(tag.id))
      .map((tag) => {
        return {
          ...tag,
          groupName: tag.group.name,
        };
      });
  }, [tags, role, ticketTags]);

  const handleDelete = (id) => {
    onDelete(id);
  };

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
          marginBottom="6px"
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
                  <TagChip tag={tag} onDelete={handleDelete} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ))}

      <TagPicker tags={resolvedTags} onSelect={onSelect} />
    </Box>
  );
}

export default TagForm;
