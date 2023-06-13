import history from '@history';
import UserProfile from 'app/fuse-layouts/shared-components/UserProfile';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useState } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Avatar } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider
  },
  fitAvatar: {
    // zoom out to show full logo
    '& > img': {
      objectFit: 'contain'
    }
  },
  logo: {
    width: 70,
    height: 50,
    borderRadius: 0
  },
}));

const countries = [
  { value: 'AD', label: 'Andorra' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'AI', label: 'Anguilla' },
  { value: 'AL', label: 'Albania' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AO', label: 'Angola' },
  { value: 'AQ', label: 'Antarctica' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'AT', label: 'Austria' },
];

function ToolbarLayout2(props) {
  const { pathname } = window.location;
  const classes = useStyles(props);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const [country, setCountry] = useState()

  const changeCountry = (e) => setCountry(e);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="inherit">
        <Toolbar className="p-0" style={{ justifyContent: 'end' }}>
          <div>
            <div style={{ paddingLeft: '50px', position: 'absolute', left: 0, top: 6 }} className={classes.iconWrapper}>
              <Avatar
                src="assets/images/logos/one_ocean_network-logo.png"
                className={clsx(classes.logo, classes.fitAvatar)}
                alt="one-logo"
              />
            </div>
            <PermissionProvider
              action={PERMISSION.VIEW_SHOW_USER_MENU}
              extraCondition={!pathname.includes('/guest')}>
              <UserProfile classes={classes} history={history} />
            </PermissionProvider>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout2;