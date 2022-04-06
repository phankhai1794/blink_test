import React, { useEffect, useRef } from 'react';
import { FusePageSimple } from '@fuse';
import _ from '@lodash';
import { useDispatch } from 'react-redux';
import * as Actions from 'app/store/actions';
import BLWorkspace from './admin/BLWorkspace';
import GuestWorkspace from './guest/GuestWorkspace';
import DraftBL from './draft-bl/DraftWorkspace';

function RoleRedirect({ history }) {
  if (history.location.pathname.includes('/guest')) {
    return <GuestWorkspace status={history.location.state} />;
  } else if (history.location.pathname.includes('/draft-bl')) {
    return <DraftBL status={history.location.state} />;
  } else {
    return <BLWorkspace status={history.location.state} />;
  }
}
function WorkspaceApp(props) {
  const { history } = props;
  const dispatch = useDispatch();

  const pageLayout = useRef(null);

  useEffect(() => {
    dispatch(Actions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', false)));
    return () => {
      dispatch(Actions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', true)));
    };
  }, [dispatch]);
  return (
    <div className="flex flex-col flex-1 w-full">
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0'
        }}
        content={<RoleRedirect history={history} />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </div>
  );
}

export default WorkspaceApp;
