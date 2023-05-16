import history from '@history';
import UserProfile from 'app/fuse-layouts/shared-components/UserProfile';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { FuseChipSelect } from '@fuse';
import React, { useState } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar } from '@material-ui/core';

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
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="primary">
        <Toolbar className="p-0" style={{ justifyContent: 'end' }}>
          <div >
            {/* <FuseChipSelect
              customStyle={{
                control: {
                  minWidth: 250,
                  borderRadius: 9,
                  backgroundColor: 'white'
                }
              }}
              value={country}
              onChange={changeCountry}
              placeholder="Select Country"
              textFieldProps={{
                variant: 'outlined'
              }}
              options={countries}
              formatOptionLabel={(option) =>
                <>
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.value.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.value.toLowerCase()}.png 2x`}
                    alt=""
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {option.label}
                  </span>
                </>}
            /> */}
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