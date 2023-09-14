import ChipList from '@/components/ChipList/ChipList';
import { globalMessages } from '@/translations/global';
import { manageTagsMessages } from '@/translations/tags';
import { Box, Button, Divider, Typography } from '@mui/material';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import TagAdmin from './TagAdmin';

import _ from 'lodash';
import RolePicker from '@/components/RolePicker/RolePicker';
import IntlTable from '@/components/IntlTable/IntlTable';
import { LanguageContext } from '@/context/LanguageContext';
import {
  useCreateTicketTagGroupMutation,
  useUpdateTicketTagGroupMutation,
} from '@/api/ticket-tag-system';
import ServerActionDialog from '@/components/ServerActionDialog/ServerActionDialog';
import { constructTagUpdateDTO } from '../utils/params';
import { ROLES } from '@/constants/roles';

function TicketTagGroupAdmin({ group, isCreate }) {
  const languageCode = useContext(LanguageContext);
  const intl = useIntl();

  const [
    update,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      isSuccess: isUpdateSuccess,
      reset: resetUpdate,
    },
  ] = useUpdateTicketTagGroupMutation();

  const [
    create,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
      reset: resetCreate,
      error: createError,
    },
  ] = useCreateTicketTagGroupMutation();

  const indicators = isCreate
    ? {
        isLoading: isCreateLoading,
        isSuccess: isCreateSuccess,
        isError: isCreateError,
      }
    : {
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
      };

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

  const constructInitialPermissionsStateValue = useCallback(() => {
    return {
      ...originalPermissions,
      canAdd: originalPermissions?.canAdd ?? [],
      canRemove: originalPermissions?.canRemove ?? [],
      canSee: originalPermissions?.canSee ?? [],
    };
  }, [originalPermissions]);

  const [permissions, setPermissions] = useState(
    constructInitialPermissionsStateValue,
  );

  useEffect(() => {
    setNameIntl(originalNameIntl);
    setDescriptionIntl(originalDescriptionIntl);
    setTags(originalTags);
    setPermissions(constructInitialPermissionsStateValue);
  }, [
    group,
    originalNameIntl,
    originalDescriptionIntl,
    originalTags,
    originalPermissions,
    constructInitialPermissionsStateValue,
  ]);

  const resolvedGroupName =
    nameIntl[languageCode] ||
    intl.formatMessage(manageTagsMessages.newTagGroupPlaceholder);

  const resolvedGroupDescription = descriptionIntl[languageCode] || null;

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

  const whoCanAddAvailableRoles = ROLES.filter(
    (role) => !permissions.canAdd?.includes(role),
  );

  const whoCanRemoveAvailableRoles = ROLES.filter(
    (role) => !permissions.canRemove?.includes(role),
  );

  const whoCanSeeAvailableRoles = ROLES.filter(
    (role) => !permissions.canSee?.includes(role),
  );

  const [whoCanAddKey, setWhoCanAddKey] = useState(0);
  const [whoCanRemoveKey, setWhoCanRemoveKey] = useState(0);
  const [whoCanSeeKey, setWhoCanSeeKey] = useState(0);

  // TODO: adapt to create/update blabla
  const statusMessage = useMemo(() => {
    if (isUpdateSuccess) {
      return intl.formatMessage(
        manageTagsMessages.successUpdatingTicketTagGroup,
      );
    }
    if (isUpdateError) {
      return intl.formatMessage(manageTagsMessages.errorUpdatingTicketTagGroup);
    }
    if (isUpdateLoading) {
      return intl.formatMessage(
        manageTagsMessages.loadingUpdatingTicketTagGroup,
      );
    }
    if (isCreateSuccess) {
      return intl.formatMessage(
        manageTagsMessages.successCreatingTicketTagGroup,
      );
    }
  }, [isUpdateLoading, isUpdateSuccess, isUpdateError, isCreateSuccess, intl]);

  const handleCreate = () => {
    const dto = {
      nameIntl,
      descriptionIntl,
    };

    create(dto);
  };

  const handleUpdate = () => {
    const tagChangesDTO = constructTagUpdateDTO(originalTags, tags);

    const patchObject = {
      permissions: {
        canAdd: permissions.canAdd,
        canRemove: permissions.canRemove,
        canSee: permissions.canSee,
      },
      nameIntl,
      descriptionIntl,
    };

    if (Object.keys(tagChangesDTO).length > 0) {
      patchObject.tags = tagChangesDTO;
    }

    update({ id: group.id, ...patchObject });
  };

  const handleSubmit = () => {
    if (isCreate) {
      handleCreate();
    }
    if (!isCreate) {
      handleUpdate();
    }
  };

  const renderDialog = () => (
    <ServerActionDialog
      indicators={indicators}
      message={statusMessage}
      onClose={isCreate ? resetCreate : resetUpdate}
      error={createError}
    />
  );

  const renderGroupNameAndDescriptionForm = () => (
    <Box>
      <Typography variant="h5" color="blue">
        {resolvedGroupName}
      </Typography>
      <Typography variant="h6" color="gray">
        {resolvedGroupDescription}
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
  );

  const renderTagsForm = () => {
    if (isCreate) {
      return null;
    }
    return (
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
          {/* TODO: This is so very stupid, find a better way */}
          <Box marginTop="8px">
            <Button
              onClick={() =>
                setTags((currentTags) => [
                  ...currentTags,
                  {
                    id: `new-tag-${currentTags.length}`,
                    name: '',
                    description: '',
                    // TODO: Don't use hardcoded locales
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
    );
  };

  const renderPermissionsForm = () => {
    if (isCreate) {
      return null;
    }
    return (
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
              items={permissions.canAdd.map((name, index) => ({
                name,
                id: index,
              }))}
              onClose={({ name: closedRole }) => {
                setPermissions((currentPermission) => ({
                  ...currentPermission,
                  canAdd: currentPermission.canAdd.filter(
                    (role) => role !== closedRole,
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
                  canAdd: [...currentPermissions.canAdd, newRole],
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
              items={permissions.canRemove.map((name, index) => ({
                name,
                id: index,
              }))}
              onClose={({ name: closedRole }) => {
                setPermissions((currentPermission) => ({
                  ...currentPermission,
                  canRemove: currentPermission.canRemove.filter(
                    (role) => role !== closedRole,
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
                  canRemove: [...currentPermissions.canRemove, newRole],
                }));
                setWhoCanRemoveKey((prev) => (prev + 1) % 10000);
              }}
            />
          </Box>
        </Box>
        <Box marginBottom="12px">
          <Typography variant="body1">
            {intl.formatMessage(manageTagsMessages.whoCanSeeText)}
          </Typography>
          <Box display="flex">
            <ChipList
              items={permissions.canSee.map((name, index) => ({
                name,
                id: index,
              }))}
              onClose={({ name: closedRole }) => {
                setPermissions((currentPermission) => ({
                  ...currentPermission,
                  canSee: currentPermission.canSee.filter(
                    (role) => role !== closedRole,
                  ),
                }));
              }}
            />
            <RolePicker
              key={whoCanSeeKey}
              roles={whoCanSeeAvailableRoles}
              onSelect={(newRole) => {
                setPermissions((currentPermissions) => ({
                  ...currentPermissions,
                  canSee: [...currentPermissions.canSee, newRole],
                }));
                setWhoCanSeeKey((prev) => (prev + 1) % 10000);
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Fragment>
      {renderDialog()}
      <Box border="1px solid gray" padding="12px">
        {renderGroupNameAndDescriptionForm()}
        <Divider />
        {renderTagsForm()}
        <Divider />
        {renderPermissionsForm()}
        <Divider />
        <Button disabled={!hasChanges} onClick={handleSubmit}>
          {intl.formatMessage(globalMessages.save)}
        </Button>
      </Box>
    </Fragment>
  );
}

export default TicketTagGroupAdmin;
