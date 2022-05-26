import history from '@history';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import History from 'app/fuse-layouts/shared-components/History';
import UserProfile from 'app/fuse-layouts/shared-components/UserProfile';
import SendInquiryForm from 'app/main/apps/workspace/components/SendInquiryForm';
import * as FormActions from 'app/main/apps/workspace/store/actions/form';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Avatar, Badge, Button, Hidden } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import RestoreVersion from 'app/main/apps/workspace/components/RestoreVersion';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider
  },
  fitAvatar: {
    // zoom out to show full logo in avatar
    '& > img': {
      objectFit: 'contain'
    }
  },
  logo: {
    width: '105.81px',
    height: '50px',
    borderRadius: 0
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  button: {
    textTransform: 'none',
    fontWeight: 'bold'
  }
}));

function ToolbarLayout1(props) {
  const { pathname, search, logout } = window.location;
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const [transId] = useSelector(({ workspace }) => [workspace.transReducer.transId]);
  const openTrans = useSelector(({ workspace }) => workspace.formReducer.openTrans);
  const user = useSelector(({ user }) => user);
  const [allowAccess, badge] = useSelector((state) => [
    state.header.allowAccess,
    state.workspace.inquiryReducer.inquiries.length
  ]);

  const openInquiry = () => {
    if (badge) {
      dispatch(FormActions.toggleInquiry(true));
      dispatch(FormActions.toggleAllInquiry());
      dispatch(FormActions.toggleSaveInquiry(true))
    }
  };

  const openAttachment = () => {
    dispatch(FormActions.toggleAttachment(true));
  };

  useEffect(() => {
    if (!user.displayName) {
      if (!allowAccess) {
        history.push({
          pathname: '/login',
          ...(!logout && { cachePath: pathname, cacheSearch: search })
        });
      }

      let userInfo = JSON.parse(localStorage.getItem('USER'));
      if (userInfo) {
        let payload = {
          ...user,
          role: userInfo.role,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          permissions: userInfo.permissions
        };
        dispatch(AppActions.setUser(payload));
      }
    }
  }, [user, allowAccess]);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="default">
        <Toolbar className="p-0">
          {config.navbar.display && config.navbar.position === 'left' && (
            <Hidden lgUp>
              <NavbarMobileToggleButton className="w-64 h-64 p-0" />
              <div className={classes.separator} />
            </Hidden>
          )}

          <div className="flex flex-1" style={{ paddingLeft: '53px' }}>
            <div style={{ paddingRight: '32px' }} className={classes.iconWrapper}>
              <Avatar
                src="assets/images/logos/one_ocean_network-logo.png"
                className={clsx(classes.logo, classes.fitAvatar)}
                alt="one-logo"
                {...(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DASHBOARD }) && {
                  component: Link,
                  to: '/'
                })}
              />
            </div>

            <PermissionProvider
              action={PERMISSION.VIEW_SHOW_ALL_INQUIRIES}
              extraCondition={['/workplace', '/guest'].some((el) => pathname.includes(el))}>
              <Button
                variant="text"
                size="medium"
                className={clsx('h-64', classes.button)}
                onClick={openInquiry}>
                <Badge color="primary" badgeContent={badge}>
                  <NotificationsIcon />
                </Badge>
                <span className="pl-12">Inquiry</span>
              </Button>
              <Button
                variant="text"
                size="medium"
                className={clsx('h-64', classes.button)}
                onClick={openAttachment}>
                <DescriptionIcon />
                <span className="pl-4">Attachment List</span>
              </Button>
            </PermissionProvider>
            {(openTrans && transId) && (
              <RestoreVersion />
            )}
            <PermissionProvider
              action={PERMISSION.VIEW_REDIRECT_DRAFT_BL}
              extraCondition={pathname.includes('/guest')}>
              <Button variant="text" size="medium" className={classes.button}>
                <VisibilityIcon />
                <span className="px-2">Draft BL</span>
              </Button>
            </PermissionProvider>

            <PermissionProvider
              action={PERMISSION.VIEW_REDIRECT_GUEST_BL}
              extraCondition={pathname.includes('/draft-bl')}>
              <Button variant="text" size="medium" className={classes.button}>
                <EditIcon />
                <span className="px-2">Edit</span>
              </Button>
            </PermissionProvider>
          </div>

          <div className="flex" style={{ marginRight: '27px' }}>
            <PermissionProvider
              action={PERMISSION.MAIL_SEND_MAIL}
              extraCondition={pathname.includes('/workplace')}>
              <SendInquiryForm />
            </PermissionProvider>
            <PermissionProvider
              action={PERMISSION.VIEW_SHOW_BL_HISTORY}
              extraCondition={pathname.includes('/workplace')}>
              <History />
            </PermissionProvider>
            <PermissionProvider action={PERMISSION.VIEW_SHOW_USER_MENU}>
              <UserProfile classes={classes} history={history} />
            </PermissionProvider>
          </div>

          {config.navbar.display && config.navbar.position === 'right' && (
            <Hidden lgUp>
              <NavbarMobileToggleButton />
            </Hidden>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout1;
