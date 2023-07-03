import { FuseScrollbars, FuseMessage, FuseDialog, FuseSuspense } from '@fuse';
import AppContext from 'app/AppContext';
import React, { useEffect, useContext } from 'react';
import clsx from 'clsx';
import { renderRoutes } from 'react-router-config';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import * as AppAction from 'app/store/actions';
import * as FormActions from 'app/main/apps/workspace/store/actions/form';
import { checkBroadCastAccessing } from '@shared';
import { BROADCAST } from '@shared/keyword';

import Loading from "../shared-components/Loading";
import PDFViewer from "../../main/apps/workspace/components/PDFViewer";

import ToolbarLayout1 from './components/ToolbarLayout1';
import ToolbarLayout2 from './components/ToolbarLayout2';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    '&.boxed': {
      maxWidth: 1280,
      margin: '0 auto',
      boxShadow: theme.shadows[3]
    },
    '&.scroll-body': {
      '& $wrapper': {
        height: 'auto',
        flex: '0 0 auto',
        overflow: 'auto'
      },
      '& $contentWrapper': {},
      '& $content': {}
    },
    '&.scroll-content': {
      '& $wrapper': {},
      '& $contentWrapper': {},
      '& $content': {}
    },
    '& .navigation': {
      '& .list-subheader-text, & .list-item-text, & .item-badge, & .arrow-icon': {
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut
        })
      }
    }
  },
  wrapper: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: '100%',
    flex: '1 1 auto'
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    // zIndex: 3,
    overflow: 'hidden',
    flex: '1 1 auto'
  },
  content: {
    position: 'relative',
    display: 'flex',
    overflow: 'auto',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    '-webkit-overflow-scrolling': 'touch',
    zIndex: 2
  }
}));

function Layout1(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const { routes } = appContext;

  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const currentInqPreview = useSelector(({ workspace }) => workspace.formReducer.currentInqPreview);
  const openPreviewFiles = useSelector(({ workspace }) => workspace.formReducer.openPreviewFiles);
  const isLoadingProcess = useSelector(({ workspace }) => workspace.formReducer.isLoadingProcess);

  const userRole = useSelector(({ user }) => user.role);
  const dirtyReload = useSelector(({ workspace }) => workspace.formReducer.dirtyReload);
  const bcRole = useSelector(({ broadcast }) => broadcast.role);

  const channel = new BroadcastChannel(BROADCAST.ACCESS);

  useEffect(() => {
    if (userRole) {
      // post a signal
      channel.postMessage(userRole);

      // receive signal
      channel.onmessage = (e) => {
        dispatch(FormActions.setDirtyReload({ forceReload: true }));
        dispatch(AppAction.setBroadcast({ role: e.data }));
      };
    }
  }, [userRole]);

  useEffect(() => {
    // detect action close browser
    window.onbeforeunload =
      dirtyReload && !dirtyReload.forceReload && Object.values(dirtyReload).some((r) => r) && (() => 'Are you sure want to discard changes?');

    return () => {
      window.onbeforeunload = null;
    };
  }, [dirtyReload]);

  useEffect(() => {
    if (bcRole && dirtyReload.forceReload) checkBroadCastAccessing(bcRole);
  }, [bcRole, dirtyReload.forceReload]);

  useEffect(() => {
    return () => channel.close();
  }, []);

  return (
    <div id="fuse-layout" className={clsx(classes.root, config.mode, 'scroll-' + config.scroll)}>
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className={classes.wrapper}>
          {/* {config.navbar.display && <NavbarWrapperLayout1 />} */}

          <div className={classes.contentWrapper} id={'content-wrapper'}>
            {openPreviewFiles && <PDFViewer inquiry={currentInqPreview} />}
            {isLoadingProcess && <Loading />}
            {config.toolbar.display && (config.toolbar.layout === 'layout2' ? <ToolbarLayout2 /> : <ToolbarLayout1 />)}

            <FuseScrollbars className={classes.content} scrollToTopOnChildChange>
              <FuseDialog />
              <FuseSuspense>{renderRoutes(routes)}</FuseSuspense>
              {props.children}
            </FuseScrollbars>
          </div>
        </div>
        {/* <SettingsPanel /> */}
      </div>
      <FuseMessage />
    </div>
  );
}

export default Layout1;
