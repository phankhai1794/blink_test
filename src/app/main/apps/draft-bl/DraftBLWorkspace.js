import React, { useEffect, useRef, useState } from 'react';
import history from '@history';
import { FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider, getLocalUser } from '@shared/permission';
import { BROADCAST } from '@shared/keyword';
import { getPermissionByRole } from 'app/services/authService';
import { handleError } from '@shared/handleError';

import OtpCheck from '../OTPCheck';
import PreProcess from '../PreProcess';
import BLWorkspace from '../workspace/components/BLWorkspace';

import DraftBL from './DraftBL';

const DraftBLPreview = ({ bl }) => {
  const channel = new BroadcastChannel(BROADCAST.LOGOUT);

  useEffect(() => {
    // delete session storage when redirecting from workspace
    for (const key in sessionStorage) {
      if (sessionStorage[key] && !['permissions', 'userType'].includes(key))
        sessionStorage.removeItem(key);
    }

    channel.onmessage = ({ data }) => {
      if (data.role !== 'Admin' || data.type === 'logout') history.push('/login');
    };
  }, []);

  return <DraftBL bl={bl} />;
};

function Coordinator({ bl }) {
  const isPreviewingDraftPage = useSelector(({ draftBL }) => draftBL.isPreviewingDraftPage);
  return <>{isPreviewingDraftPage ? <DraftBL bl={bl} /> : <BLWorkspace user="guest" />}</>;
}

function DraftBLWorkspace() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const { pathname, search } = window.location;
  const isPreviewing = pathname.includes('/draft-bl/preview');
  const bl = pathname.split('/')[3] || new URLSearchParams(window.location.search).get('bl');

  useEffect(() => {
    try {
      if (isPreviewing) {
        let userLocal = getLocalUser();
        userLocal = localStorage.getItem('GUEST') || localStorage.getItem('OFFSHORE');
        userLocal = JSON.parse(userLocal);
        getPermissionByRole(userLocal.role)
          .then((res) => {
            const userType = userLocal.roleName === 'Admin' ? 'ADMIN' : 'CUSTOMER';
            sessionStorage.setItem('permissions', JSON.stringify(res));
            sessionStorage.setItem('userType', userType);

            setTimeout(() => {
              const isAllow = PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL });
              if (isPreviewing) {
                if (!isAllow)
                  history.push({ pathname: '/login', cachePath: pathname, cacheSearch: search });
              } else {
                dispatch(AppActions.setUser({ ...userLocal, permissions: res, userType }));
                dispatch(AppActions.checkAllow(isAllow));
              }
            }, 500);
          })
          .catch((err) => handleError(dispatch, err));
      }
      setIsLoading(false);
    } catch (err) {
      if (isPreviewing) history.push('/login');
      else {
        console.error('error from DraftBLWorkspace', err);
        window.location.reload();
      }
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <></>
      ) : isPreviewing ? (
        <DraftBLPreview bl={bl} />
      ) : (
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
      )}
    </>
  );
}

export default DraftBLWorkspace;
