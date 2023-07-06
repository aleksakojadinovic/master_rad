import ChipList from '@/components/ChipList/ChipList';
import { globalMessages } from '@/translations/global';
import { manageTagsMessages } from '@/translations/tags';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import TagAdmin from './TagAdmin';

import _ from 'lodash';

function TicketTagGroupAdmin({ group }) {
  const { tags: originalTags, permissions: originalPermissions } = group;

  const [tags, setTags] = useState(originalTags);
  const [permissions, setPermissions] = useState(originalPermissions);
  console.log({ permissions });
  const intl = useIntl();

  const intlYes = intl.formatMessage(globalMessages.yes);
  const intlNo = intl.formatMessage(globalMessages.no);

  const hasChanges = useMemo(
    () =>
      !(
        _.isEqual(tags, originalTags) &&
        _.isEqual(permissions, originalPermissions)
      ),
    [tags, permissions, originalTags, originalPermissions],
  );

  return (
    <Box border="1px solid gray" padding="12px">
      <Box>
        <Typography variant="h5" color="blue">
          {group.name}
        </Typography>
      </Box>
      <Divider />
      <Box marginBottom="12px">
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagsText)}:
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {tags.map((tag) => (
            <Box key={tag.id} margin="12px" width="100%">
              <TagAdmin
                tag={tag}
                onChange={(newTag) =>
                  setTags((currentTags) =>
                    currentTags.map((currentTag) =>
                      currentTag.id === newTag.id ? newTag : currentTag,
                    ),
                  )
                }
              />
            </Box>
          ))}
          <Box marginTop="8px">
            <Button>Add</Button>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box>
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagPermissionsText)}:
        </Typography>
        <Box marginBottom="12px">
          <Typography variant="body1">
            {intl.formatMessage(manageTagsMessages.whoCanAddText)}
          </Typography>
          <ChipList items={permissions.canAddRoles} onClose={() => {}} />
        </Box>
        <Box marginBottom="12px">
          <Typography variant="body1">
            {intl.formatMessage(manageTagsMessages.whoCanRemoveText)}
          </Typography>
          <ChipList items={permissions.canRemoveRoles} onClose={() => {}} />
        </Box>
        <Box marginBottom="12px">
          <Typography variant="body1">
            {intl.formatMessage(manageTagsMessages.canCreatorAddText)}
          </Typography>
          <FormControl>
            <RadioGroup
              value={permissions.canCreatorAdd ? 'yes' : 'no'}
              onChange={(e) => {
                setPermissions((currentPermissions) => ({
                  ...currentPermissions,
                  canCreatorAdd: e.target.value === 'yes' ? true : false,
                }));
              }}
              row
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={intl.formatMessage(globalMessages.yes)}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label={intl.formatMessage(globalMessages.no)}
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box marginBottom="12px">
          <Typography variant="body1">
            {intl.formatMessage(manageTagsMessages.canCreatorRemoveText)}
          </Typography>
          <FormControl>
            <RadioGroup
              value={permissions.canCreatorRemove ? 'yes' : 'no'}
              onChange={(e) => {
                setPermissions((currentPermissions) => ({
                  ...currentPermissions,
                  canCreatorRemove: e.target.value === 'yes' ? true : false,
                }));
              }}
              row
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={intl.formatMessage(globalMessages.yes)}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label={intl.formatMessage(globalMessages.no)}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Divider />
      <Button disabled={!hasChanges}>
        {intl.formatMessage(globalMessages.save)}
      </Button>
    </Box>
  );
}

export default TicketTagGroupAdmin;
