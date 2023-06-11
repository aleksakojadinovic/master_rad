export const createTicketTagGroupNameIntlKey = (name: string) => {
  return `tagGroup_${name}_Name`;
};

export const createTicketTagGroupDescriptionIntlKey = (name: string) => {
  return `tagGroup_${name}_Description`;
};

export const getStrippedGroupName = (intlKey: string) => {
  return intlKey
    .replace('tagGroup_', '')
    .replace('_Description', '')
    .replace('_Name', '');
};

export const createTicketTagNameIntlKey = (
  groupIntlKey: string,
  name: string,
) => {
  const groupName = getStrippedGroupName(groupIntlKey);
  return `tag_${groupName}_${name}_Name`;
};

export const createTicketTagDescriptionIntlKey = (
  groupIntlKey: string,
  name: string,
) => {
  const groupName = getStrippedGroupName(groupIntlKey);
  return `tag_${groupName}_${name}_Description`;
};
