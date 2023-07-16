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
import { useSelector } from 'react-redux';
import { selectGetRolesQueryResponse } from '@/api/roles';
import RolePicker from '@/components/RolePicker/RolePicker';
import IntlTable from '@/components/IntlTable/IntlTable';
import { LanguageContext } from '@/context/LanguageContext';
import {
  useCreateTicketTagGroupMutation,
  useUpdateTicketTagGroupMutation,
} from '@/api/ticket-tag-system';
import ServerActionDialog from '@/components/ServerActionDialog/ServerActionDialog';
import { constructTagUpdateDTO } from '../utils/params';

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

  const constructInitialPermissionsStateValue = useCallback(
    () => ({
      ...originalPermissions,
      canAddRoles: originalPermissions.canAddRoles ?? [],
      canRemoveRoles: originalPermissions.canRemoveRoles ?? [],
      canSeeRoles: originalPermissions.canSeeRoles ?? [],
    }),
    [originalPermissions],
  );

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

  const roles = useSelector(selectGetRolesQueryResponse);

  const whoCanAddAvailableRoles =
    roles.filter(
      (role) =>
        !permissions.canAddRoles?.map(({ id }) => id).includes(role.id) ?? [],
    ) ?? [];

  const whoCanRemoveAvailableRoles =
    roles.filter(
      (role) =>
        !permissions.canRemoveRoles?.map(({ id }) => id).includes(role.id) ??
        [],
    ) ?? [];

  const whoCanSeeAvailableRoles =
    roles.filter(
      (role) =>
        !permissions.canSeeRoles?.map(({ id }) => id).includes(role.id) ?? [],
    ) ?? [];

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
  }, [isUpdateLoading, isUpdateSuccess, isUpdateError, intl]);

  const handleCreate = () => {
    const dto = {
      nameIntl,
      descriptionIntl,
    };

    create(dto);
  };

  const handleUpdate = () => {
    const tagChangesDTO = constructTagUpdateDTO(originalTags, tags);

    console.log(permissions);

    const patchObject = {
      permissions: {
        canAddRoles: permissions.canAddRoles.map(({ id }) => id),
        canRemoveRoles: permissions.canRemoveRoles.map(({ id }) => id),
        canSeeRoles: permissions.canSeeRoles.map(({ id }) => id),
      },
      nameIntl,
      descriptionIntl,
    };

    if (Object.keys(tagChangesDTO).length > 0) {
      patchObject.tags = tagChangesDTO;
    }

    console.log('patching with', patchObject);

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
        <Box marginBottom="12px">
          <Typography variant="body1">
            {intl.formatMessage(manageTagsMessages.whoCanSeeText)}
          </Typography>
          <Box display="flex">
            <ChipList
              items={permissions.canSeeRoles}
              onClose={(closedId) => {
                setPermissions((currentPermission) => ({
                  ...currentPermission,
                  canSeeRoles: currentPermission.canSeeRoles.filter(
                    ({ id }) => id !== closedId,
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
                  canSeeRoles: [...currentPermissions.canSeeRoles, newRole],
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
