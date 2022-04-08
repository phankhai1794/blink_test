import React, { useRef } from 'react';
import { FusePageSimple } from '@fuse';
import _ from '@lodash';
import BLWorkspace from './admin/BLWorkspace';

function WorkspaceApp(props) {
  const { history } = props;

  const pageLayout = useRef(null);

  return (
    <div className="flex flex-col flex-1 w-full">
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0'
        }}
        content={<BLWorkspace status={history.location.state} />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </div>
  );
}

export default WorkspaceApp;
