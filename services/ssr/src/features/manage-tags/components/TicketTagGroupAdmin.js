import ChipList from '@/components/ChipList/ChipList';
import { globalMessages } from '@/translations/global';
import { manageTagsMessages } from '@/translations/tags';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import TagAdmin from './TagAdmin';

import _ from 'lodash';
import { useSelector } from 'react-redux';
import { selectGetRolesQueryResponse } from '@/api/roles';
import RolePicker from '@/components/RolePicker/RolePicker';
import IntlTable from '@/components/IntlTable/IntlTable';
import { LanguageContext } from '@/context/LanguageContext';
import { useUpdateTicketTagGroupMutation } from '@/api/ticket-tag-groups';
import FullPageSpinner from '@/components/FullPageSpinner/FullPageSpinner';

function TicketTagGroupAdmin({ group }) {
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const languageCode = useContext(LanguageContext);

  const [update, { isLoading, isError, isSuccess }] =
    useUpdateTicketTagGroupMutation();

  const {
    nameIntl: originalNameIntl,
    descriptionIntl: originalDescriptionIntl,
    tags: originalTags,
    permissions: originalPermissions,
  } = group;

  const [nameIntl, setNameIntl] = useState(originalNameIntl);
  const [descriptionIntl, setDescriptionIntl] = useState(
    originalDescriptionIntl,
  );
  const [tags, setTags] = useState(originalTags);
  const [permissions, setPermissions] = useState(originalPermissions);
  const intl = useIntl();

  const resolvedGroupName =
    nameIntl[languageCode] ||
    intl.formatMessage(manageTagsMessages.newTagGroupPlaceholder);

  const hasChanges = useMemo(
    () =>
      !(
        _.isEqual(tags, originalTags) &&
        _.isEqual(permissions, originalPermissions) &&
        _.isEqual(nameIntl, originalNameIntl) &&
        _.isEqual(descriptionIntl, originalDescriptionIntl)
      ),
    [
      tags,
      permissions,
      originalTags,
      originalPermissions,
      nameIntl,
      descriptionIntl,
      originalNameIntl,
      originalDescriptionIntl,
    ],
  );

  const roles = useSelector(selectGetRolesQueryResponse);
  const whoCanAddAvailableRoles = roles.filter(
    (role) => !permissions.canAddRoles.map(({ id }) => id).includes(role.id),
  );
  const whoCanRemoveAvailableRoles = roles.filter(
    (role) => !permissions.canRemoveRoles.map(({ id }) => id).includes(role.id),
  );

  const [whoCanAddKey, setWhoCanAddKey] = useState(0);
  const [whoCanRemoveKey, setWhoCanRemoveKey] = useState(0);

  const handleSubmit = () => {
    // TODO: Validation D:
    const patchObject = {
      permissions: {
        canAddRoles: permissions.canAddRoles.map(({ id }) => id),
        canRemoveRoles: permissions.canRemoveRoles.map(({ id }) => id),
      },
      nameIntl,
      descriptionIntl,
    };

    update({ id: group.id, ...patchObject });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setIsFeedbackModalVisible(true);
    }
  }, [isSuccess, isError]);

  return (
    <Fragment>
      <FullPageSpinner open={isLoading} />
      <Dialog
        open={isFeedbackModalVisible}
        onClose={() => setIsFeedbackModalVisible(false)}
      >
        <DialogTitle>test</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isSuccess
              ? 'Ticket tag group successfully updated'
              : 'An error has occurred'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFeedbackModalVisible(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Box border="1px solid gray" padding="12px">
        <Box>
          <Typography variant="h5" color="blue">
            {resolvedGroupName}
          </Typography>
          <Typography variant="h6" color="gray">
            {group.description}
          </Typography>
          <Typography variant="body2">
            {intl.formatMessage(globalMessages.name)}
          </Typography>
          <IntlTable
            value={nameIntl}
            onChange={(newIntl) => {
              setNameIntl(newIntl);
            }}
          />
          <Typography variant="body2">
            {intl.formatMessage(globalMessages.description)}
          </Typography>
          <IntlTable
            value={descriptionIntl}
            onChange={(newIntl) => {
              setDescriptionIntl(newIntl);
            }}
          />
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
                  onClose={() =>
                    setTags((currentTags) =>
                      currentTags.filter(
                        (currentTag) => currentTag.id !== tag.id,
                      ),
                    )
                  }
                />
              </Box>
            ))}
            <Box marginTop="8px">
              <Button
                onClick={() =>
                  setTags((currentTags) => [
                    ...currentTags,
                    {
                      id: `new-tag-${currentTags.length}`,
                      name: '',
                      description: '',
                      nameIntl: { en: '', sr: '' },
                      descriptionIntl: { en: '', sr: '' },
                      isNew: true,
                    },
                  ])
                }
              >
                {intl.formatMessage(manageTagsMessages.addNewTag)}
              </Button>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant="h6" color="gray">
            {intl.formatMessage(manageTagsMessages.tagPermissionsText)}:
          </Typography>
          <Box marginBottom="12px" width="100%">
            <Typography variant="body1">
              {intl.formatMessage(manageTagsMessages.whoCanAddText)}
            </Typography>
            <Box display="flex" width="100%">
              <ChipList
                items={permissions.canAddRoles}
                onClose={(closedId) => {
                  setPermissions((currentPermission) => ({
                    ...currentPermission,
                    canAddRoles: currentPermission.canAddRoles.filter(
                      ({ id }) => id !== closedId,
                    ),
                  }));
                }}
              />
              <RolePicker
                key={whoCanAddKey}
                roles={whoCanAddAvailableRoles}
                onSelect={(newRole) => {
                  setPermissions((currentPermissions) => ({
                    ...currentPermissions,
                    canAddRoles: [...currentPermissions.canAddRoles, newRole],
                  }));
                  setWhoCanAddKey((prev) => (prev + 1) % 10000);
                }}
              />
            </Box>
          </Box>
          <Box marginBottom="12px">
            <Typography variant="body1">
              {intl.formatMessage(manageTagsMessages.whoCanRemoveText)}
            </Typography>
            <Box display="flex">
              <ChipList
                items={permissions.canRemoveRoles}
                onClose={(closedId) => {
                  setPermissions((currentPermission) => ({
                    ...currentPermission,
                    canRemoveRoles: currentPermission.canRemoveRoles.filter(
                      ({ id }) => id !== closedId,
                    ),
                  }));
                }}
              />
              <RolePicker
                key={whoCanRemoveKey}
                roles={whoCanRemoveAvailableRoles}
                onSelect={(newRole) => {
                  setPermissions((currentPermissions) => ({
                    ...currentPermissions,
                    canRemoveRoles: [
                      ...currentPermissions.canRemoveRoles,
                      newRole,
                    ],
                  }));
                  setWhoCanRemoveKey((prev) => (prev + 1) % 10000);
                }}
              />
            </Box>
          </Box>
        </Box>
        <Divider />
        <Button disabled={!hasChanges} onClick={handleSubmit}>
          {intl.formatMessage(globalMessages.save)}
        </Button>
      </Box>
    </Fragment>
  );
}

export default TicketTagGroupAdmin;
