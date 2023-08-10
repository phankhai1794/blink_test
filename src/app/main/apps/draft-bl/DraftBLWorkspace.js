import React, { useEffect, useRef } from 'react';
import history from '@history';
import { FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import OtpCheck from '../OTPCheck';
import PreProcess from '../PreProcess';
import BLWorkspace from '../workspace/components/BLWorkspace';

import DraftBL from './DraftBL';

const DraftBLPreview = ({ bl }) => {
  useEffect(() => {
    sessionStorage.clear(); // delete session storage when redirecting from workspace
  }, []);

  return (
    <DraftBL bl={bl} />
  );
}

function Coordinator({ bl }) {
  const isPreviewingDraftPage = useSelector(({ draftBL }) => draftBL.isPreviewingDraftPage);
  return (
    <>
      {isPreviewingDraftPage ? <DraftBL bl={bl} /> : <BLWorkspace user="guest" />}
    </>
  );
}

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
      {isPreviewing ?
        <DraftBLPreview bl={bl} /> :
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
                  <Coordinator bl={bl} />
                </PreProcess>
              }
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
