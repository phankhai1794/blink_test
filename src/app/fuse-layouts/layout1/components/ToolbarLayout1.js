import React, { useEffect } from 'react';
import history from '@history';
import axios from 'axios';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Avatar, Badge, Button, Hidden } from '@material-ui/core';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import History from 'app/fuse-layouts/shared-components/History';
import UserProfile from 'app/fuse-layouts/shared-components/userProfile';
import SendInquiryForm from 'app/main/apps/workspace/admin/SendInquiryForm';
import * as userActions from 'app/auth/store/actions';

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
    borderRadius: 0,
    width: '5em'
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
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const user = useSelector(({ auth }) => auth.user);
  const [hideAll, displayDraftBLBtn, displayEditBtn] = useSelector((state) => [
    state.header.hideAll,
    state.header.displayDraftBLBtn,
    state.header.displayEditBtn
  ]);

  const handleRedirect = (url) => {
    history.push(url);
  };

  useEffect(() => {
    if (!localStorage.getItem('AUTH_TOKEN')) {
      handleRedirect('/login');
    }
    axios
      .post(
        'http://si-automation.cyberlogitec.com.vn:9001/auth/status',
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`,
            country: 'TH'
          }
        }
      )
      .then((res) => {
        let payload = {
          data: {
            ...user.data,
            displayName: res.data.data.full_name,
            settings: {}
          }
        };
        dispatch(userActions.setUserData(payload));
      });
  }, []);

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

          <div className="flex flex-1 px-16">
            <div
              style={{
                paddingLeft: 50,
                paddingRight: 15
              }}
              className={classes.iconWrapper}>
              <Avatar
                src="assets/images/logos/one_ocean_network-logo.png"
                className={clsx(classes.logo, classes.fitAvatar)}
                alt="one-logo"
                component={Link}
                to="/"
              />
            </div>

            {!hideAll ? <UserProfile classes={classes} user={user} history={history} /> : <></>}

            {hideAll ? (
              <></>
            ) : (
              <Button variant="text" size="medium" className={clsx('h-64', classes.button)}>
                <Badge color="primary" badgeContent={0} showZero>
                  <NotificationsIcon />
                </Badge>
                <span className="pl-12">Inquiry</span>
              </Button>
            )}

            {hideAll || !displayDraftBLBtn ? (
              <></>
            ) : (
              <Button
                variant="text"
                size="medium"
                className={classes.button}
                onClick={() => handleRedirect('/apps/workplace/draft-bl')}>
                <VisibilityIcon />
                <span className="px-2">Draft BL</span>
              </Button>
            )}

            {hideAll || !displayEditBtn ? (
              <></>
            ) : (
              <Button
                variant="text"
                size="medium"
                className={classes.button}
                onClick={() =>
                  handleRedirect(
                    '/apps/workplace/customer/TYOBH3669500/gciUIQActrGonB3VEirVTGHe7qhY12rk'
                  )
                }>
                <EditIcon />
                <span className="px-2">Edit</span>
              </Button>
            )}
          </div>

          <div className="flex mr-24">
            {hideAll ? (
              <UserProfile classes={classes} user={user} history={history} />
            ) : (
              <>
                <SendInquiryForm />
                <History />
              </>
            )}
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
