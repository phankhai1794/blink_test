import React, { useEffect, useRef } from 'react';
import { FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import _ from '@lodash';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import BLWorkspace from './components/BLWorkspace';

function WorkspaceApp(props) {
  const pageLayout = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_WORKSPACE }))
    );
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full">
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 pb-80 sm:pb-80 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0'
        }}
        content={<BLWorkspace user="workspace" />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </div>
  );
}

export default WorkspaceApp;
