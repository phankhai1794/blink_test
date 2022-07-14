import { FusePageSimple } from '@fuse';
import React, { useRef } from 'react';

import DraftBL from './DraftBL';
import EditDraftBL from './EditDraftBL';

const DraftApp = (props) => {
  const { history } = props;
  const pageLayout = useRef(null);
  const isEdit = window.location.pathname.includes('/edit');

  return (
    <div className="flex flex-col flex-1 w-full">
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0'
        }}
        content={isEdit ? <EditDraftBL /> : <DraftBL />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </div>
  );
};

export default DraftApp;
