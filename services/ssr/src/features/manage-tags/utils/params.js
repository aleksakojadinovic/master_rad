import _ from 'lodash';

export const getManageTagsParams = () => ({});

export const constructTagUpdateDTO = (originalTags, newTags) => {
  //We diff them because I'm very lazy
  //   debugger;
  const dto = {};

  const added = newTags.filter(({ isNew }) => !!isNew);
  const removed = originalTags.filter(
    ({ id }) => !newTags.map(({ id }) => id).includes(id),
  );

  const updated = newTags.filter((newTag) => {
    const original = originalTags.find(({ id }) => id === newTag.id);
    if (!original) {
      return false;
    }
    return !_.isEqual(newTag, original);
    // return (
    //   originalTags.map((originalTag) => originalTag.id).includes(newTag.id) &&
    //   !_.isEqual(newTag, originalTags)
    // );
  });

  const addedOrUpdated = [
    ...added.map(({ nameIntl, descriptionIntl }) => ({
      nameIntl,
      descriptionIntl,
    })),
    ...updated.map(({ id, nameIntl, descriptionIntl }) => ({
      id,
      nameIntl,
      descriptionIntl,
    })),
  ];

  if (addedOrUpdated.length > 0) {
    dto.addOrUpdateTags = addedOrUpdated;
  }

  if (removed.length > 0) {
    dto.removeIds = removed.map(({ id }) => id);
  }

  return dto;
};
