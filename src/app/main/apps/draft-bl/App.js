import { FusePageSimple } from '@fuse';
import React, { useRef } from 'react';

import DraftPage from './DraftPage';
import EditDraftPage from './EditDraftPage';

const DraftApp = (props) => {
  const { history } = props;
  const pageLayout = useRef(null);
  const isEdit = window.location.pathname.includes('/edit');

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* <ExportAppHeader className="p-0 sm:px-24" /> */}
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0'
        }}
        content={isEdit ? <EditDraftPage /> : <DraftPage status={history.location.state} />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </div>
  );
};

export default DraftApp;
