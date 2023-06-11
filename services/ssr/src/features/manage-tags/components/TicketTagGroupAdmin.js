import ChipList from '@/components/ChipList/ChipList';
import {
  resolveTagDescription,
  resolveTagName,
  useTagDescription,
  useTagName,
} from '@/features/tags/utils';
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
  const resolvedDescription = useTagDescription(group);

  const intl = useIntl();

  return (
    <Box border="1px solid gray" paddingLeft="12px">
      <Box display="flex" alignItems="center">
        {/* TODO: Figure out how to do translations here */}
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagNameText)}:
        </Typography>
        &nbsp;
        <Typography variant="h5">{resolvedName}</Typography>
      </Box>
      <Divider />
      <Box>
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagDescriptionText)}:
        </Typography>
        <Typography variant="body1">{resolvedDescription}</Typography>
      </Box>
      <Divider />
      <Box marginBottom="12px">
        <Typography variant="h6" color="gray">
          {intl.formatMessage(manageTagsMessages.tagsText)}:
        </Typography>
        {tags.map((tag) => (
          <TagAdmin key={tag.id} tag={tag} />
        ))}
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
