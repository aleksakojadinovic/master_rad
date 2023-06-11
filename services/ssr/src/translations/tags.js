import { defineMessages } from 'react-intl';

export const manageTagsMessages = defineMessages({
  title: {
    id: 'manage-tags.title',
    defaultMessage: 'Manage Tags | STS',
  },
  tagNameText: {
    id: 'tags.tag-name-text',
    defaultMessage: 'Name',
  },
  tagDescriptionText: {
    id: 'tags.tag-description-text',
    defaultMessage: 'Description',
  },
  tagPermissionsText: {
    id: 'tags.tag-permissions-text',
    defaultMessage: 'Permissions',
  },
  whoCanAddText: {
    id: 'tags.who-can-add-text',
    defaultMessage: 'Who can add these tags?',
  },
  whoCanRemoveText: {
    id: 'tags.who-can-remove-text',
    defaultMessage: 'Who can remove these tags?',
  },
  canCreatorAddText: {
    id: 'tags.can-creator-add-text',
    defaultMessage: 'Can the ticket author add these tags?',
  },
  canCreatorRemoveText: {
    id: 'tags.can-creator-remove-text',
    defaultMessage: 'Can the ticket author remove these tags?',
  },
  tagsText: {
    id: 'tags.tag-text',
    defaultMessage: 'Tags',
  },
  addNewText: {
    id: 'tags.add-new-group-text',
    defaultMessage: 'Add new tag group',
  },
});

export const dynamicTagValuees = defineMessages({
  tagGroup_Urgency_Title: {
    id: 'tagGroup_Urgency_Title',
    defaultMessage: 'Urgency',
  },
  tagGroup_Urgency_Description: {
    id: 'tagGroup_Urgency_Description',
    defaultMessage: 'How urgent is this ticket?',
  },
  tag_Urgency_Urgent_Title: {
    id: 'tag_Urgency_Urgent_Title',
    defaultMessage: 'Urgent',
  },
  tag_Urgency_Urgent_Description: {
    id: 'tag_Urgency_Urgent_Description',
    defaultMessage: 'Requires immediate attention',
  },
  tag_Urgency_Moderate_Title: {
    id: 'tag_Urgency_Moderate_Title',
    defaultMessage: 'Moderate',
  },
  tag_Urgency_Moderate_Description: {
    id: 'tag_Urgency_Moderate_Description',
    defaultMessage: 'Should be addressed soon',
  },
  tag_Urgency_Low_Title: {
    id: 'tag_Urgency_Low_Title',
    defaultMessage: 'Low',
  },
  tag_Urgency_Low_Description: {
    id: 'tag_Urgency_Low_Description',
    defaultMessage: 'Address when you have the time',
  },
});
