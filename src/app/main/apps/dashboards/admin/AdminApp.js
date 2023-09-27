import React, { useEffect, useState } from 'react';
// import { Hidden, Icon, IconButton, Typography } from '@material-ui/core';
// import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as AppActions from 'app/store/actions';
import _ from 'lodash';
// import { makeStyles } from '@material-ui/styles';
import { PERMISSION, PermissionProvider, getLocalUser } from '@shared/permission';
import { getPermissionByRole } from 'app/services/authService';
import { handleError } from '@shared/handleError';

import QueueList from './components/QueueList';
// const useStyles = makeStyles((theme) => ({
//   content: {
//     '& canvas': {
//       maxHeight: '100%'
//     }
//   },
//   selectedProject: {
//     background: theme.palette.primary.main,
//     color: theme.palette.primary.contrastText,
//     borderRadius: '8px 0 0 0'
//   },
//   projectMenuButton: {
//     background: theme.palette.primary.main,
//     color: theme.palette.primary.contrastText,
//     borderRadius: '0 8px 0 0',
//     marginLeft: 1
//   }
// }));

function ProjectDashboardApp(props) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // const classes = useStyles(props);
  // const pageLayout = useRef(null);

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', true)));
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));

    const userLocal = getLocalUser();
    getPermissionByRole('Admin')
      .then((res) => {
        const userType = 'ADMIN';
        sessionStorage.setItem('permissions', JSON.stringify(res));
        sessionStorage.setItem('userType', userType);

        setTimeout(() => {
          dispatch(AppActions.setUser({ ...JSON.parse(userLocal), permissions: res, userType }));
          dispatch(
            AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DASHBOARD }))
          );
        }, 500);
      })
      .catch((err) => handleError(dispatch, err));

    setIsLoading(false);
    return () => {
      dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', false)));
      dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', false)));
    };
  }, []);

  return <>{!isLoading ? <QueueList /> : <></>}</>;
}

export default ProjectDashboardApp;
