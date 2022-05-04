import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { FusePageCarded } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import InquiringHeader from './Header';
import InquiringTable from './Table';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';

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

function InquiringApp(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', true)));
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(
      AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_INQUIRING }))
    );

    return () => {
      dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', false)));
      dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', false)));
    };
  }, []);

  return (
    <FusePageCarded
      classes={{
        header: 'min-h-160 h-160',
        toolbar: 'min-h-48 h-48',
        rightSidebar: 'w-288',
        content: classes.content
      }}
      header={<InquiringHeader className="mr-8" />}
      // contentToolbar={
      //     <MonitorToolbar />
      // }
      content={<InquiringTable />}
    />
  );
}

export default InquiringApp;

// <Box>
//     {/* Search Bar */}
//     <Box sx={{ mt: "120px" }}>
//         <Box display="flex">
//             <Box sx={{ ml: "290px" }}>
//                 <TextField fullWidth />
//             </Box>
//             <Button color>
//                 create workspace
//             </Button>
//         </Box>
//     </Box>
//     {/*  */}
// </Box>
