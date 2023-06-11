import { dynamicTagValuees } from '@/translations/tags';
import { useIntl } from 'react-intl';

export const resolveTagName = (tag, intl) => {
  if (!tag.nameIntlKey || !dynamicTagValuees[tag.nameIntlKey]) {
    return tag.name;
  }
  return intl.formatMessage(dynamicTagValuees[tag.nameIntlKey]);
};

export const resolveTagDescription = (tag, intl) => {
  if (!tag.descriptionIntlKey || !dynamicTagValuees[tag.descriptionIntlKey]) {
    return tag.name;
  }
  return intl.formatMessage(dynamicTagValuees[tag.descriptionIntlKey]);
};

export const useTagName = (tag) => {
  const intl = useIntl();
  return resolveTagName(tag, intl);
};

export const useTagDescription = (tag) => {
  const intl = useIntl();
  return resolveTagDescription(tag, intl);
};
