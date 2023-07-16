import React, { useMemo } from 'react';
import TagPicker from '../TagPicker/TagPicker';
import {
  useGetTicketTagGroupsQuery,
  useGetTicketTagsQuery,
} from '@/api/ticket-tag-system';
import { Box, Typography } from '@mui/material';
import TagChip from '../TagChip/TagChip';
import { useSelector } from 'react-redux';
import { selectGetMeQueryResponse } from '@/api/auth';
import _ from 'lodash';

// TODO: Too much coupling, this should be two components - one for tag list one for picker
function TagForm({ ticketTags, onSelect, onDelete }) {
  // We fetch them here and not SSR because they're not SSR-relevant
  const user = useSelector(selectGetMeQueryResponse);
  const roleIds = user.roles.map(({ Id }) => Id);

  const { data: tags } = useGetTicketTagsQuery();
  const { data: tagGroups } = useGetTicketTagGroupsQuery();

  const groupedTicketTags = useMemo(() => {
    if (!tags || !tagGroups) {
      return [];
    }

    return ticketTags.reduce((acc, curr) => {
      const canDelete =
        _.intersection(
          tagGroups.find((g) => g.id === curr.group.id).permissions
            .canRemoveRoles,
          roleIds,
        ).length > 0;

      if (!acc[curr.group.id]) {
        acc[curr.group.id] = {
          groupId: curr.group.id,
          groupName: tagGroups.find((g) => g.id === curr.group.id).name,
          groupDescription: curr.group.description,
          tags: [{ ...curr, canDelete }],
        };
        return acc;
      }
      acc[curr.group.id].tags.push({ ...curr, canDelete });
      return acc;
    }, {});
  }, [tags, ticketTags, tagGroups, roleIds]);

  const groupIds = Array.from(Object.keys(groupedTicketTags));

  const resolvedTags = useMemo(() => {
    if (!tags || !tagGroups) {
      return [];
    }

    return tags
      .filter((tag) => {
        return (
          _.intersection(roleIds, tag.group.permissions.canAddRoles).length > 0
        );
      })
      .map((tag) => {
        return {
          ...tag,
          groupName: tagGroups.find((g) => g.id === tag.group.id).name,
        };
      });
  }, [tags, tagGroups, roleIds]);

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
