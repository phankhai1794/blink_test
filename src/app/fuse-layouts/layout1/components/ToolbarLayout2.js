import User from 'app/fuse-layouts/shared-components/User';
import React, { useEffect, useState } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Avatar,
  Select,
  MenuItem,
  Checkbox,
} from '@material-ui/core';
import clsx from 'clsx';
import { COUNTRIES } from '@shared/keyword';
import * as Actions from 'app/main/apps/dashboards/admin/store/actions';

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
    textOverflow: 'ellipsis',
    overflow: 'hidden'
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
  const { pathname } = window.location;
  const classes = useStyles(props);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const dispatch = useDispatch();

  const user = useSelector(({ user }) => user);
  const countries = COUNTRIES.filter((country) => user.countries.includes(country.value));
  const countryOption = countries.map((c) => c.value);
  const [selectedStatus, setSelectedStatus] = useState([...countryOption, 'All']);

  useEffect(() => {
    dispatch(Actions.filterCountry(countries.map((c) => c.value)));
  }, []);

  const handleSelectStatus = (event) => {
    let values = event.target.value;
    if (values.includes('plus')) values.shift()
    const arrStatus = [];
    if (values.indexOf('All') !== -1 && selectedStatus.indexOf('All') === -1) {
      setSelectedStatus([...countryOption, 'All']);
      dispatch(Actions.filterCountry(countryOption));
    } else if (values.indexOf('All') === -1 && selectedStatus.indexOf('All') !== -1) {
      setSelectedStatus([]);
      dispatch(Actions.filterCountry([]));
    } else {
      const arrSelected = [];
      values.forEach((item) => {
        if (item !== 'All') {
          arrStatus.push(COUNTRIES.find((key) => key.value === item).value);
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
                    {selected.map(
                      (value) =>
                        value !== 'All' && (
                          <span className="flag-country">
                            <img
                              className={selectedStatus.length ? "circle-flag" : "circle-flag-default"}
                              width="25"
                              height="25"
                              src={flagUrl(value)}
                            />
                          </span>
                        )
                    )}
                  </div>
                )}
                disableUnderline>
                <MenuItem
                  key={'All'}
                  value={'All'}
                  classes={{ selected: classes.menuItemSelected }}>
                  <Checkbox checked={selectedStatus.indexOf('All') > -1} color="primary" />
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
                    <span style={{ fontFamily: 'Montserrat', fontSize: '14px', marginLeft: 5 }}>{label}</span>
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