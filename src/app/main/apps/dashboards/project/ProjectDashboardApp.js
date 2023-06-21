import React, { useEffect, useRef } from 'react';
import { Hidden, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as AppActions from 'app/store/actions';
import _ from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import Widget4 from './widgets/Widget4';
import Widget5 from './widgets/Widget5';
import Widget6 from './widgets/Widget6';
import Widget7 from './widgets/Widget7';


const useStyles = makeStyles((theme) => ({
  content: {
    '& canvas': {
      maxHeight: '100%'
    }
  },
  selectedProject: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '8px 0 0 0'
  },
  projectMenuButton: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '0 8px 0 0',
    marginLeft: 1
  }
}));

function ProjectDashboardApp(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(({ projectDashboardApp }) => projectDashboardApp.widgets);
  const projects = useSelector(({ projectDashboardApp }) => projectDashboardApp.projects);

  const classes = useStyles(props);
  const pageLayout = useRef(null);

  useEffect(() => {
    dispatch(Actions.getWidgets());
    dispatch(Actions.getProjects());
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', true)));
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(
      AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DASHBOARD }))
    );

    console.log("Current commit: ", process.env.REACT_APP_VERSION_ID);
    console.log("demo deploy >>>>>>>>>>>>>>>>>>>>>>>>>>");

    return () => {
      dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', false)));
      dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', false)));
    };
  }, []);

  if (!widgets || !projects) {
    return null;
  }

  return (
    <FusePageSimple
      classes={{
        header: 'min-h-160 h-160',
        toolbar: 'min-h-48 h-48',
        rightSidebar: 'w-288',
        content: classes.content
      }}
      header={
        <div className="flex flex-col justify-between flex-1 px-24 pt-24">
          <div className="flex justify-between items-start">
            <Typography className="py-0 sm:py-24" variant="h4">
              Welcome back, OffShore
            </Typography>
            <Hidden lgUp>
              <IconButton
                onClick={(ev) => pageLayout.current.toggleRightSidebar()}
                aria-label="open left sidebar"
              >
                <Icon>menu</Icon>
              </IconButton>
            </Hidden>
          </div>
        </div>
      }
      content={
        <div className="p-12">
          <FuseAnimateGroup
            className="flex flex-wrap"
            enter={{
              animation: 'transition.slideUpBigIn'
            }}
          >
            <div className="widget flex w-full sm:w-1/2 md:w-1/6 lg:w-1/5 p-12">
              <Widget1 widget={widgets.widget1} />
            </div>
            <div className="widget flex w-full sm:w-1/2 md:w-1/6 lg:w-1/5 p-12">
              <Widget2 widget={widgets.widget2} />
            </div>
            <div className="widget flex w-full sm:w-1/2 md:w-1/6 lg:w-1/5 p-12">
              <Widget3 widget={widgets.widget3} />
            </div>
            <div className="widget flex w-full sm:w-1/2 md:w-1/6 lg:w-1/5 p-12">
              <Widget4 widget={widgets.widget4} />
            </div>
            <div className="widget flex w-full p-12">
              <Widget5 widget={widgets.widget5} />
            </div>
            <div className="widget flex w-full sm:w-1/2 p-12">
              <Widget6 widget={widgets.widget6} />
            </div>
            <div className="widget flex w-full sm:w-1/2 p-12">
              <Widget7 widget={widgets.widget7} />
            </div>
          </FuseAnimateGroup>
        </div>
      }
      ref={pageLayout}
    />
  );
}

export default withReducer('projectDashboardApp', reducer)(ProjectDashboardApp);
