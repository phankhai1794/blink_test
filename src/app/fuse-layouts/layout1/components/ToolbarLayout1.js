import React from 'react';
import history from '@history';
import clsx from 'clsx';
import { AppBar, Hidden, Toolbar, Avatar, Typography, Badge } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { FuseSearch, FuseShortcuts } from '@fuse';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
import ChatPanelToggleButton from 'app/fuse-layouts/shared-components/chatPanel/ChatPanelToggleButton';
import History from 'app/fuse-layouts/shared-components/History';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SendInquiryForm from 'app/main/apps/workspace/admin/SendInquiryForm';

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider
  },
  fitAvatar: {
    // zoom out to show full logo in avatar
    '& > img': {
      objectFit: 'contain',
    },
  },
  logo: {
    borderRadius: 0,
    width: "5em",
    paddingLeft: "50px",
    paddingRight: "30px",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    paddingRight: "22px",
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  button: {
    textTransform: "none",
    fontWeight: "bold",
  },
}));

function ToolbarLayout1(props) {
  const classes = useStyles(props);
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const user = useSelector(({ auth }) => auth.user);
  const [showBtnDraftBL, showBtnEdit] = useSelector((state) => [state.header.showBtnDraftBL, state.header.showBtnEdit]);

  const handleRedirect = (url) => {
    history.push(url);
  }

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
            {/* <Hidden mdDown>
              <FuseShortcuts className="px-16" />
            </Hidden> */}
            <Avatar
              src="assets/images/logos/one_ocean_network-logo.png"
              className={clsx(classes.logo, classes.fitAvatar)}
              alt="one-logo"
            />

            <div className={classes.iconWrapper}>
              <Avatar
                src={user.data.photoURL}
                className={classes.fitAvatar}
                alt="user photo"
              />
              <Typography component="span" className="normal-case font-600 ml-8 flex">
                {/* custom header for customer workplace only */}
                {window.location.pathname.includes('apps/workplace/customer')
                  ? 'Customer'
                  : user.data.displayName}
              </Typography>
            </div>

            <div className={classes.iconWrapper}>
              <Button
                variant="text"
                size="medium"
                className={classes.button}
              >
                <Badge color="primary" badgeContent={0} showZero>
                  <NotificationsIcon />
                </Badge>
                <span className='pl-12'>Inquiry</span>
              </Button>
            </div>

            {
              showBtnDraftBL ?
              <Button
                variant="text"
                size="medium"
                className={classes.button}
                onClick={() => handleRedirect('/apps/workplace/draft-bl')}
              >
                <VisibilityIcon />
                <span className='px-2'>Draft BL</span>
              </Button> :
              showBtnEdit ?
              <Button
                variant="text"
                size="medium"
                className={classes.button}
                onClick={() => handleRedirect('/apps/workplace/customer/TYOBH3669500/gciUIQActrGonB3VEirVTGHe7qhY12rk')}
              >
                <EditIcon />
                <span className='px-2'>Edit</span>
              </Button> :
              <></>
            }
          </div>

          <div className="flex mr-24">
            <SendInquiryForm/>
            <History />
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
