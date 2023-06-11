import CreateOrEditTagGroups from '@/features/manage-tags/components/CreateOrEditTag';
import React from 'react';

function CreateTagRoute() {
  return (
    <div>
      <CreateOrEditTagGroups isCreate />
    </div>
  );
}

export default CreateTagRoute;
