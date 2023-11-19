import { useGetTicketTagsQuery } from '@/api/ticket-tag-system';
import TagPicker from '@/components/TagPicker/TagPicker';
import { ticketSearchMessages } from '@/translations/ticket-search';
import { Box, Chip } from '@mui/material';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

function TicketTagFilter({ value, onChange }) {
  console.log({ value });
  const intl = useIntl();

  const { data: tags, isSuccess } = useGetTicketTagsQuery({
    includes: 'group',
  });

  const currentTags = useMemo(() => {
    if (!tags || !value) {
      return null;
    }
    return value
      .map((selectedTagId) => tags.find(({ id }) => id === selectedTagId))
      .filter((tag) => !!tag);
  }, [value, tags]);

  const handleDeleteTag = (id) => {
    onChange(value.filter((tagId) => tagId !== id));
  };

  const handleSelectTag = (selectedId) => {
    if (value.includes(selectedId)) {
      return;
    }
    onChange([...value, selectedId]);
  };

  const boxStyles =
    value.length > 0
      ? {
          border: '1px solid black',
          borderRadius: '6px',
          alignItems: 'center',
          padding: '3px',
        }
      : {};

  if (!isSuccess) {
    return null;
  }

  return (
    <Box display="flex" gap="12px" {...boxStyles}>
      <TagPicker
        tags={tags}
        onSelect={handleSelectTag}
        title={intl.formatMessage(ticketSearchMessages.hasTag)}
      />
      {currentTags && (
        <Box display="flex" gap="6px" flexWrap="wrap">
          {currentTags.map(({ id, name }) => (
            <Chip key={id} label={name} onDelete={() => handleDeleteTag(id)} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default TicketTagFilter;
