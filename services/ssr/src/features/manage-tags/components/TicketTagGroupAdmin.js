import ChipList from '@/components/ChipList/ChipList';
import { useTagName } from '@/features/tags/utils';
import { globalMessages } from '@/translations/global';
import { manageTagsMessages } from '@/translations/tags';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';
import TagAdmin from './TagAdmin';

function TicketTagGroupAdmin({ group }) {
  const { tags, permissions } = group;
  const resolvedName = useTagName(group);

  const intl = useIntl();

  return (
    <Box border="1px solid gray" padding="12px">
      <Box display="flex" alignItems="center" marginBottom="12px">
        {/* TODO: Figure out how to do translations here */}

        <Typography variant="body1" color="gray">
          {group.nameIntlKey}, {group.descriptionIntlKey}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5" color="blue">
          {resolvedName}
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
              <TagAdmin tag={tag} />
            </Box>
          ))}
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
              aria-labelledby="demo-radio-buttons-group-label"
              value={permissions.canCreatorAdd ? 'yes' : 'no'}
              name="radio-buttons-group"
              onChange={() => {}}
              row
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={intl.formatMessage(globalMessages.yes)}
              />
              <FormControlLabel
                value={permissions.canCreatorRemove ? 'yes' : 'no'}
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
              aria-labelledby="demo-radio-buttons-group-label"
              value={permissions.canCreatorAdd ? 'yes' : 'no'}
              name="radio-buttons-group"
              onChange={() => {}}
              row
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={intl.formatMessage(globalMessages.yes)}
              />
              <FormControlLabel
                value={permissions.canCreatorRemove ? 'yes' : 'no'}
                control={<Radio />}
                label={intl.formatMessage(globalMessages.no)}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}

export default TicketTagGroupAdmin;
