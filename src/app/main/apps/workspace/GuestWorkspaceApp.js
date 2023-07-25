import React, { useRef } from 'react';
import { FusePageSimple } from '@fuse';

import OtpCheck from '../OTPCheck';
import PreProcess from '../PreProcess';

import BLWorkspace from './components/BLWorkspace';

function GuestWorkspaceApp() {
  const bl = new URLSearchParams(window.location.search).get('bl');
  const pageLayout = useRef(null);

  return (
    <OtpCheck>
      <div className="flex flex-col flex-1 w-full">
        <FusePageSimple
          classes={{
            contentWrapper: 'p-0 h-full',
            content: 'flex flex-col h-full',
            leftSidebar: 'w-256 border-0'
          }}
          content={
            <PreProcess bl={bl}>
              <BLWorkspace user="guest" />
            </PreProcess>
          }
          sidebarInner
          ref={pageLayout}
          innerScroll
        />
      </div>
    </OtpCheck>
  );
}

export default GuestWorkspaceApp;
