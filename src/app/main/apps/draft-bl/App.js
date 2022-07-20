import { FusePageSimple } from '@fuse';
import React, { useRef } from 'react';

import EditDraftBL from './EditDraftBL';

const DraftApp = (props) => {
  const pageLayout = useRef(null);

  return (
    <div className="flex flex-col flex-1 w-full">
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0'
        }}
        content={<EditDraftBL />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </div>
  );
};

export default DraftApp;
