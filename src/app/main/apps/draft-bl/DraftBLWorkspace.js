import React, { useEffect, useRef } from 'react';
import history from '@history';
import { FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import OtpCheck from '../OTPCheck';

import DraftBL from './DraftBL';

function DraftBLWorkspace() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);

  const { pathname, search } = window.location;
  const isPreviewing = pathname.includes('/draft-bl/preview');
  const bl = pathname.split('/')[3] || new URLSearchParams(window.location.search).get('bl');

  useEffect(() => {
    const isAllow = PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL });
    if (isPreviewing) {
      if (!isAllow) history.push({ pathname: '/login', cachePath: pathname, cacheSearch: search });
    } else dispatch(AppActions.checkAllow(isAllow));
  }, []);

  return (
    <>
      {
        isPreviewing ? <DraftBL myBL={{ id: bl }} user="guest" /> : <OtpCheck isDraftBL={true}>
          <div className="flex flex-col flex-1 w-full">
            <FusePageSimple
              classes={{
                contentWrapper: 'p-0 h-full',
                content: 'flex flex-col h-full',
                leftSidebar: 'w-256 border-0'
              }}
              content={<DraftBL myBL={{ id: bl }} user="guest" />}
              sidebarInner
              ref={pageLayout}
              innerScroll
            />
          </div>
        </OtpCheck>
      }
    </>
  );
}

export default DraftBLWorkspace;
