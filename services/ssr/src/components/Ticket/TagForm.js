import React, { useMemo } from 'react';
import TagPicker from '../TagPicker/TagPicker';
import {
  useGetTicketTagGroupsQuery,
  useGetTicketTagsQuery,
} from '@/api/ticket-tag-system';
import { Box } from '@mui/material';
import TagChip from '../TagChip/TagChip';

function TagForm({ ticketTags, onSelect }) {
  // We fetch them here and not SSR because they're not SSR-relevant

  const { data: tags } = useGetTicketTagsQuery();
  const { data: tagGroups } = useGetTicketTagGroupsQuery();

  const groupedTicketTags = useMemo(() => {
    return ticketTags;
  }, [ticketTags]);

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
      {groupedTicketTags.map((tag) => (
        <Box key={tag.id} marginRight="8px">
          <TagChip tag={tag} />
        </Box>
      ))}
      <TagPicker tags={resolvedTags} onSelect={onSelect} />
    </Box>
  );
}

export default TagForm;
