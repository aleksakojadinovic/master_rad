import { manageTagsMessages } from '@/translations/tags';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { useIntl } from 'react-intl';

function ManageTagsLayout({
  children,
  isHomePage,
  isCreatePage,
  isEditPage,
  tagGroup,
  id: editId,
}) {
  const intl = useIntl();
  const getHomeBreadcrumb = () => {
    return {
      id: 'home',
      title: intl.formatMessage(manageTagsMessages.homeBreadcrumbText),
      link: '/manage/tags',
      disabled: isHomePage,
    };
  };

  const getCreateBreadcrumb = () => {
    return {
      id: 'create',
      title: intl.formatMessage(manageTagsMessages.createTagBreadcrumbText),
      link: '/manage/tags/create',
      disabled: isCreatePage,
    };
  };

  const getEditBreadcrumb = () => {
    return {
      id: 'edit',
      title: intl.formatMessage(manageTagsMessages.editTagBreadcrumbText, {
        tagName: tagGroup.name,
      }),
      link: `/manage/tags/edit/${editId}`,
      disabled: isEditPage,
    };
  };

  const getBreadcrumbs = () => {
    if (isHomePage) {
      return [];
    }
    if (isCreatePage) {
      return [getHomeBreadcrumb(), getCreateBreadcrumb()];
    }
    if (isEditPage) {
      return [getHomeBreadcrumb(), getEditBreadcrumb()];
    }
    return [];
  };

  const breadcrumbs = getBreadcrumbs();

  const renderBreadcrumbs = () => {
    return (
      <Box display="flex" flexWrap="wrap">
        {breadcrumbs.map((b, index) => (
          <Box key={b.id}>
            <Link href={b.link}>
              <Typography variant="caption">{b.title}</Typography>
            </Link>
            {index !== breadcrumbs.length - 1 && (
              <Box display="inline-block" marginLeft="8px" marginRight="8px">
                {'>'}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Box marginBottom={breadcrumbs.length > 0 ? '24px' : '0px'}>
        {renderBreadcrumbs()}
      </Box>

      {children}
    </Box>
  );
}

export default ManageTagsLayout;
