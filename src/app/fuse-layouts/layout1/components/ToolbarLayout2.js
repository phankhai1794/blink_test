import User from 'app/fuse-layouts/shared-components/User';
import { getUserCountry } from 'app/services/countryService';
import React, { useEffect, useState } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Avatar, Select, MenuItem, Checkbox } from '@material-ui/core';
import clsx from 'clsx';
import * as Actions from 'app/main/apps/dashboards/admin/store/actions';
import { handleError } from '@shared/handleError';

const useStyles = makeStyles((theme) => ({
  formControl: {
    '& fieldset': {
      border: 'none'
    },
    '& span': {
      fontFamily: 'Montserrat',
      fontSize: '13px'
    },
    '& input': {
      fontFamily: 'Montserrat',
      fontSize: '14px'
    }
  },
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
  select: {
    paddingRight: 0
  },
  chips: {
    display: 'flex'
  },
  chip: {
    backgroundColor: '#E2E6EA',
    borderRadius: '4px',
    height: '24px',
    margin: 2
  },
  menuItemSelected: {
    backgroundColor: '#FDF2F2 !important'
  }
}));

const flagUrl = (value) => `assets/images/flags/${value.toLowerCase()}.svg`;

function ToolbarLayout2(props) {
  const { pathname, search } = window.location;
  const classes = useStyles(props);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const dispatch = useDispatch();

  const user = useSelector(({ user }) => user);
  const [countries, setCountries] = useState([]);
  const countryOption = user.countries;
  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    // auto select only 1 default country when access to BLINK via OPUS
    let result = [...countryOption];
    if (search) {
      const cntr = new URLSearchParams(search).get('cntr');
      if (cntr && countryOption.includes(cntr)) result = [cntr];

      // Remove search param from url
      window.history.pushState({}, '', `/apps/admin`);
    }
    setSelectedStatus(result);
    dispatch(Actions.filterCountry(result));

    getUserCountry()
      .then(({ data }) => setCountries(data.userCountry))
      .catch((err) => handleError(dispatch, err));
  }, []);

  const handleSelectStatus = (event) => {
    const arrStatus = [];
    let values = event.target.value;
    if (values.includes('plus')) values.shift();
    if (values.includes('All') && values.indexOf('All') === values.length - 1) {
      if (values.length > countryOption.length) {
        setSelectedStatus([]);
        dispatch(Actions.filterCountry([]));
      } else {
        setSelectedStatus([...countryOption]);
        dispatch(Actions.filterCountry(countryOption));
      }
    } else {
      const arrSelected = [];
      values.forEach((item) => {
        if (item !== 'All') {
          arrStatus.push(countries.find((key) => key.value === item).value);
          arrSelected.push(item);
        }
      });
      setSelectedStatus(arrSelected);
      dispatch(Actions.filterCountry(arrStatus));
    }
  };

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="inherit">
        <Toolbar className="p-0" style={{ justifyContent: 'space-between' }}>
          <div style={{ marginLeft: '2rem' }}>
            <Avatar
              src="assets/images/logos/one_ocean_network-logo.png"
              className={clsx(classes.logo, classes.fitAvatar)}
              alt="one-logo"
            />
          </div>
          <div className="flex items-center">
            {countries.length === 1 ? (
              <img
                className="circle-flag"
                width="25"
                height="25"
                src={flagUrl(countries[0].value)}
              />
            ) : (
              <Select
                classes={{ select: classes.select }}
                multiple
                value={selectedStatus.length ? selectedStatus : ['plus']}
                onChange={handleSelectStatus}
                inputProps={{ IconComponent: () => null }}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.slice(0, 4).map((value) => (
                      <img
                        key={value}
                        className={selectedStatus.length ? 'circle-flag' : 'circle-flag-default'}
                        width="25"
                        height="25"
                        src={flagUrl(value)}
                      />
                    ))}
                    {selected.length - 4 > 0 && (
                      <div className="circle-flag-plus">+{selected.length - 4}</div>
                    )}
                  </div>
                )}
                disableUnderline>
                <MenuItem
                  key={'All'}
                  value={'All'}
                  classes={{ selected: classes.menuItemSelected }}>
                  <Checkbox
                    checked={selectedStatus.length === countryOption.length}
                    color="primary"
                  />
                  <span style={{ fontFamily: 'Montserrat', fontSize: '14px' }}>All</span>
                </MenuItem>
                {countries.map(({ label, value }) => (
                  <MenuItem
                    key={value}
                    classes={{ selected: classes.menuItemSelected }}
                    value={value}>
                    <Checkbox checked={selectedStatus.indexOf(value) > -1} color="primary" />
                    <img
                      loading="lazy"
                      style={{ borderRadius: '50%' }}
                      width="20"
                      height="20"
                      src={flagUrl(value)}
                      alt=""
                    />
                    <span style={{ fontFamily: 'Montserrat', fontSize: '14px', marginLeft: 5 }}>
                      {label}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            )}
            <User />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout2;