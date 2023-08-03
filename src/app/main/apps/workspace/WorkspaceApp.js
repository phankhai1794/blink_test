import React, { useEffect, useState, useRef } from 'react';
import history from '@history';
import { FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { validateBkgNo } from 'app/services/opusService';

import PreProcess from '../PreProcess';

import BLWorkspace from './components/BLWorkspace';

const MainWorkSpace = () => {
  const pageLayout = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    sessionStorage.setItem(
      'prevUrl',
      JSON.stringify({
        cachePath: window.location.pathname,
        cacheSearch: window.location.search
      })
    );
    dispatch(
      AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_WORKSPACE }))
    );
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full">
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0'
        }}
        content={
          <PreProcess>
            <BLWorkspace user="workspace" />
          </PreProcess>
        }
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </div>
  );
};

function WorkspaceApp() {
  const [validUrl, setValidUrl] = useState(false);
  const validToken = useSelector(({ header }) => header.validToken);

  const OPUSValidation = async () => {
    let redirectTo = '';
    const { pathname, search } = window.location;
    const bkgNo = pathname.split('/')[3];
    const urlSearchParams = new URLSearchParams(search);
    const usrId = urlSearchParams.get('usrId');
    const cntr = urlSearchParams.get('cntr');
    const user = JSON.parse(localStorage.getItem('USER'));
    if (bkgNo && usrId && cntr) {
      try {
        const result = await validateBkgNo(bkgNo, cntr, {
          countries: user?.countries,
          office: user?.office
        });
        if (result) {
          redirect404 = false;
          setValidUrl(true);
        }
      } catch (error) {
        console.error(error);
        if (error.message === 'Network Error')
          redirectTo = '/deploying';
        else if (error.response?.status === 404)
          redirectTo = '/pages/errors/error-404';
      }
    }

    if (redirectTo) history.push(redirectTo);
  };

  useEffect(() => {
    OPUSValidation();
  }, []);

  return <>{validUrl && validToken && <MainWorkSpace />}</>;
}

export default WorkspaceApp;
